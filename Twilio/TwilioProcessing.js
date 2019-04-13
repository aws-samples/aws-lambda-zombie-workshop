// This function processes incoming data from Twilio, formats it and makes an HTTPS POST request to the the Chat Service API endpoint

/* == Imports == */
var querystring = require('querystring');
var AWS = require('aws-sdk');
var path = require('path');

/* == Globals == */
var API = {
    region: 'us-east-1', 
    endpoint: 'INSERT YOUR API GATEWAY URL HERE INCLUDING THE HTTPS://' // ie: 'https://xxxxxxx.execute-api.us-east-1.amazonaws.com'
};

var table = "YOUR DYNAMODB USERS TABLE"; //INSERT THE NAME OF YOUR DYNAMODB USERS TABLE
var index = "YOUR phoneindex DYNAMODB INDEX NAME"; //INSERT THE NAME OF YOUR phoneindex from DynamoDB.

var endpoint = new AWS.Endpoint(API.endpoint);
var creds = new AWS.EnvironmentCredentials('AWS');
var docClient = new AWS.DynamoDB.DocumentClient({
    region: API.region
});

exports.handler = function(event, context) {
    
    var params = querystring.parse(event.postBody);
    var from = params.From;
    var timestamp = "" + new Date().getTime();
    var numMedia = params.NumMedia;
    var message;
    var mediaURL;
    
    /* == DynamoDB Params == */
    var ddbParams = {
        TableName: table,
        IndexName: index,
        KeyConditionExpression: "phone = :from",
        ProjectionExpression: "userid, phone",
        ExpressionAttributeValues: {
            ":from": from
        }
    };
    
    // If Message sent and Image sent, concat image url to message.
    if (params.Body !== null || params.Body !== 'null') {
        message = params.Body;
        // If picture was sent along, append to message string.
        if (numMedia > 0) {
            mediaURL = params.MediaUrl0;        
            message = message + " [IMAGE SENT]: " + mediaURL;  
        }
    }

    // If message was not sent but image URL was sent, then set message to image URL
    else if ((params.Body == null || params.Body == 'null') && numMedia > 0) {
        mediaURL = params.MediaUrl0;
        message = "Image sent: " + mediaURL;
    }
    
    // If no message or media sent, throw error.
    else {
        return context.fail("There was an error. Try again.");
    }
    
    // Now that we have the Twilio data formatted correctly, we make a request to our Chat Service
    var post_data = JSON.stringify({
        "message": message, 
        "name": from, 
        "channel": "default",
        "timestamp": timestamp
    });
    
    
    /* == Query Users table to confirm that incoming phone number exists and is tied to an authorized survivor == */
    docClient.query(ddbParams, function(err, data) {
        if (err) {
            console.log('Error. Unable to insert text message. DynamoDB querying failed. RESULT: ' + JSON.stringify(err));
            context.fail(new Error('DynamoDB Error: ' + err));    
        }
        else {
            
            // FOR TESTING
            //console.log('Query response is: ' + JSON.stringify(data));
            //console.log('count is: ' + data.Count);
            
            // If no records returned then fail the message with not authorized message.
            if (data.Count < 1) {
                context.done('Your phone number is not authorized to send texts to survivors. There were no phone numbers matching yours. Please sign up first.');
                console.log('Text from unauthorized number. No records matching that number');
            } else {
                // Parse result and get phone.
                data.Items.forEach(function(item) {
                    console.log('Incoming message from: ' + item.phone);
                });
                postToChatService(post_data, context);  
            }
        }
    });    
}

function postToChatService(post_data, context) {
    var req = new AWS.HttpRequest(endpoint);

    req.method = 'POST';
    req.path = '/ZombieWorkshopStage/zombie/message';
    req.port = '443';
    req.region = API.region;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.body = post_data;
    
    console.log('host is ' + endpoint.host);
    var signer = new AWS.Signers.V4(req,'execute-api');  // es: service code
    signer.addAuthorization(creds, new Date());

    var send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function(httpResp) {
        var respBody = '';
        httpResp.on('data', function (chunk) {
            respBody += chunk;
        });
        httpResp.on('end', function (chunk) {
            console.log('Response: ' + respBody);
            context.succeed('Text received in chat room. Survivors have been notified. Message sent was: ' + JSON.parse(post_data).message);
        });
    }, function(err) {
        console.log('Error: ' + err);
        context.fail('Lambda failed with error ' + err);
    });
}
