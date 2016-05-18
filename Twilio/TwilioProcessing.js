// This function processes incoming data from Twilio, formats it and makes an HTTPS POST request to the the Chat Service API endpoint

var querystring = require('querystring');
var https = require('https');

exports.handler = function(event, context) {

    var params = querystring.parse(event.postBody);
    var from = params.From;
    var timestamp = "" + new Date().getTime();
    var numMedia = params.NumMedia;
    var message;
    var mediaURL;

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
    else if ((params.Body === null || params.Body == 'null') && numMedia > 0) {
        mediaURL = params.MediaUrl0;
        message = "Image sent: " + mediaURL ;
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

    // Object of options to designate where to send our request
    var post_options = {
        host: 'INSERT YOUR API GATEWAY URL HERE EXCLUDING THE HTTPS:// ',
        port: '443',
        path: '/ZombieWorkshopStage/zombie/message',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var req = https.request(post_options, function(res) {
        var body = '';
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            console.log('Successfully processed HTTPS response');
            // If we know it's JSON, parse it
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
            }
            context.succeed("Text received in chat room. Survivors have been notified. Message sent was: " + message);
        });

    });
    req.on('error', context.fail);
    req.write(post_data);
    req.end();
};
