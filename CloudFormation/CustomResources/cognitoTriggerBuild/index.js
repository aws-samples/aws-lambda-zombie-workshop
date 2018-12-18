var AWS = require('aws-sdk');

// This custom resource Lambda function builds the Cognito Lambda Trigger in the AWS region where CloudFormation created the Cognito Identity Pool for the workshop.
// Cognito is not available in all regions. If the stack is launched in an unsupported Cognito region, CloudFormation defaults back to us-east-1 to launch Cognito resources.
// CloudFormation cannot natively launch Lambda functions in remote regions so we are doing this inside a custom resource.
// If the user launched the stack in a region that supports Cognito then this function will launch Cognito will launch in that region, otherwise it defaults to us-east-1.
exports.handler = function(event, context, callback) {
  console.log('REQUEST RECEIVED:\n', JSON.stringify(event));
  var responseData = {};
  var responseStatus = "FAILED";  // Start out with response of FAILED until we confirm SUCCESS explicitly.

  var lambdaBucket = event.ResourceProperties.LambdaFunctionBucket; // the workshop bucket where the Cogntio Trigger function zip is located.
  var stackName = event.ResourceProperties.StackName;
  var region = event.ResourceProperties.region; // Region where the stack was launched. 
  var lambda = new AWS.Lambda({region: event.ResourceProperties.CognitoRegion}); // Set Lambda region to the local location where Cognito was built. CFN passes this as a parameter.
  var iamRole = event.ResourceProperties.IamRole; // the iam role to associate with the function we're creating.

  // If DELETE request type is sent, return success to cloudformation. User will manually tear down Cognito resources
  if (event.RequestType == "Delete") {
    responseStatus = "SUCCESS";
    console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
    sendResponse(event, context, responseStatus, responseData, callback);
  }

  // if request type is CREATE or UPDATE, create the resources
  else {

    var params = {
      Code: {
        S3Bucket: lambdaBucket,
        S3Key: 'cognitoLambdaTrigger.zip'
      },
      FunctionName: stackName + '-CognitoLambdaTrigger' + '-' + region,
      Handler: 'index.handler',
      Role: iamRole,
      Runtime: 'nodejs8.10',
      Timeout: '120'
    };
    lambda.createFunction(params, function(err, data) {
      if (err) {
        console.log('Error creating cognitoLambdaTrigger function. Error is: ' + err);
        responseStatus = "FAILED";
        console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
        sendResponse(event, context, responseStatus, responseData, callback);
      }
      else {
        console.log('Created cognitoLambdaTrigger. Function ARN is: ' + data.FunctionArn);
        responseData = {FunctionARN: data.functionArn};
        responseStatus = "SUCCESS";
        console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
        sendResponse(event, context, responseStatus, responseData, callback);
      }
    });
  } // End CREATE/UPDATE section
}

function sendResponse(event, context, responseStatus, responseData, callback) {

  var responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: 'See the details in CloudWatch Log Stream: ' + context.logStreamName,
      PhysicalResourceId: context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
  });

  console.log('RESPONSE BODY:\n', responseBody);

  var https = require('https');
  var url = require('url');

  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        "content-type": "",
        "content-length": responseBody.length
      }
  };

  console.log('SENDING RESPONSE...\n');

  var request = https.request(options, function(response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      callback(null);
  });

  request.on('error', function(error) {
    console.log('sendResponse Error:' + error);
    callback(null);
  });

  request.write(responseBody);
  request.end();
}
