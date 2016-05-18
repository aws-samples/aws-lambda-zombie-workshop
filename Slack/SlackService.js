var AWS = require('aws-sdk');
var qs = require('querystring');
var https = require('https');
var token = "INSERT YOUR TOKEN FROM SLACK HERE";

exports.handler = function (event, context) {
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

    if (requestToken != token) {
        console.error("Request token (" + requestToken + ") does not match exptected token for Slack");
        context.fail("Invalid request token");
    }

    else {
        var from = params.user_name;
        var command = params.command;
        var slackChannel = params.channel_name;
        var message = params.text;
        var timestamp = "" + new Date().getTime();

        // Now that we have the Slack message formatted correctly, we make a request to our Chat Service
        var post_data = JSON.stringify({
            "message": "Incoming message from Slack user: " + message,
            "name": from,
            "channel": "default",
            "timestamp": timestamp

        });

        // Object of options to designate where to send our request
        var post_options = {
            host: 'INSERT YOUR API GATEWAY FQDN HERE EXCLUDING THE HTTPS://',
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
                context.succeed("Your slack message was sent to survivors. Message sent was: " + message);
            });

        });

        req.on('error', context.fail);
        req.write(post_data);
        req.end();
    }
};
