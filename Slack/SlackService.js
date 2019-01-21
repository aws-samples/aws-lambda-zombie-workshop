/* == Imports == */
var AWS = require('aws-sdk');
var qs = require('querystring');
var https = require('https');

/* == Globals == */
var API = {
    region: 'us-east-1', // the region code where you launched the stack
    endpoint: 'INSERT YOUR API GATEWAY FQDN HERE INCLUDING THE HTTPS://' //i.e.: Something like ... https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
};

var table = 'YOUR DYNAMODB USERS TABLE'; // Find this in the outputs of CFN
var index = 'YOUR slackindex DYNAMODB INDEX NAME'; // slackindex for Users table. Find this in outputs of CFN 

var token = "INSERT YOUR TOKEN FROM SLACK HERE"; // INSERT YOUR TOKEN FROM SLACK HERE.  This is the token from your slack team channel when you created the Slack app integration.


var endpoint = new AWS.Endpoint(API.endpoint);
var creds = new AWS.EnvironmentCredentials('AWS');
var docClient = new AWS.DynamoDB.DocumentClient({
    region: API.region
});

exports.handler = function (event, context) {
    console.log('REQUEST RECEIVED:\n', JSON.stringify(event));
    if (token) {
        processEvent(event, context);
    } else {
        context.fail("Token has not been set.");
    }
};

var processEvent = function(event, context) {
    var body = event.body;
    var params = qs.parse(body);
    var requestToken = params.token;
    var slackUserAuthorized = false; // We need to explicitly authorize the username in the payload from Slack.
    
    if (requestToken != token) {
        console.error("Request token (" + requestToken + ") does not match exptected token for Slack");
        context.fail("Invalid request token");
    }
    
    else {
        var from = params.user_name;
        var command = params.command;
        var slackTeamDomain = params.team_domain;
        var message = params.text;
        var timestamp = "" + new Date().getTime();
        
        // Now that we have the Slack message formatted correctly, we make a request to our Chat Service
        var post_data = JSON.stringify({
            "message": message + " (Via Slack Slash Command)", 
            "name": from, 
            "channel": "default",
            "timestamp": timestamp
        });
        
        /* == DynamoDB Users Index Params == */
        var ddbParams = {
            TableName: table, 
            IndexName: index,
            KeyConditionExpression: "slackuser = :slackuser and slackteamdomain = :slackteamdomain",
            ProjectionExpression: "slackuser, slackteamdomain",
            ExpressionAttributeValues: {
                ":slackuser": from,
                ":slackteamdomain": slackTeamDomain
            }
        };
    
        /* == Query Users table to confirm that incoming Slack username exists and is tied to an authorized survivor == */
        docClient.query(ddbParams, function(err, data) {
            if (err) {
                console.log('Error. Unable to send message from Slack. DynamoDB querying failed. RESULT: ' + JSON.stringify(err));
                context.fail(new Error('DynamoDB Error: ' + err));    
            }
            else {
                
                /* == FOR TESTING == */
                /*
                console.log('Query response is: ' + JSON.stringify(data));
                console.log('count is: ' + data.Count);
                console.log('slack username incoming is: ' + from);
                console.log('slack team domain incoming is: ' + slackTeamDomain);
                */
    
                // If no records returned then fail the message with not authorized message.
                if (data.Count < 1) {
                    console.log('Unauthorized user. Invalid Slack username and team domain. No matching users found.');
                    context.done('The incoming Slack username and team do not match any existing registered survivors. Please sign up to the suvivor chat first, and make sure to register your Slack User name and team domain (name) at sign up.');
                } else {
                    // Parse result and get Slack username.
                    data.Items.forEach(function(item) {
                        console.log('Incoming message from: ' + item.slackuser + ' with team domain: ' + item.slackteamdomain);
                    });
                    // If Slack user is authorized then call /message API endpoint with Slash command payload
                    postToChatService(post_data, context);    
                }
            }
        });
    }
}

function postToChatService(post_data, context) {
    // Create signed AWS request to API endpoint
    var req = new AWS.HttpRequest(endpoint);
    req.method = 'POST';
    req.port = '443';
    req.path = '/ZombieWorkshopStage/zombie/message';
    req.region = API.region;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.body = post_data;
    
    console.log('host is ' + endpoint.host);
    var signer = new AWS.Signers.V4(req,'execute-api');
    signer.addAuthorization(creds, new Date());

    var send = new AWS.NodeHttpClient();
    
    send.handleRequest(req, null, function(httpResp) {
        var respBody = '';
        httpResp.on('data', function (chunk) {
            respBody += chunk;
        });
        httpResp.on('end', function (chunk) {
            console.log('Response: ' + respBody);
            context.succeed("Your slack message was sent to survivors. Message sent was: " + JSON.parse(post_data).message);
        });
    }, function(err) {
        console.log('Error: ' + err);
        context.fail('Lambda failed with error ' + err);
    });
}
    
