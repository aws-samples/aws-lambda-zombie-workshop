var AWS = require('aws-sdk');
var async = require('async');

exports.handler = function(event, context, callback) {
  console.log('REQUEST RECEIVED:\n', JSON.stringify(event));
  var responseData = {};
  var responseStatus = "FAILED";  // Start out with response of FAILED until we confirm SUCCESS explicitly.

  var bucket = event.ResourceProperties.bucket; // the bucket created for the app by CloudFormation
  var constantsFileKey = event.ResourceProperties.constantsFile;
  var stackName = event.ResourceProperties.StackName.replace(/-/g, ""); // remove hyphen from name so we can use it for Cognito which doesn't allow slashes.
  var cognitoRegion = event.ResourceProperties.CognitoRegion; // the region where Cognito exists. Cognito not in all regions so this is passed in from CFN.
  var stackRegion = event.ResourceProperties.region; // the region where the stack was launched. Might be diff than Cognito Region.
  var cognitoidentity = new AWS.CognitoIdentity({region: event.ResourceProperties.CognitoRegion});
  var s3bucket = new AWS.S3();
  var cognitoRoleARN = event.ResourceProperties.cognitoRoleARN;
  var clientId = event.ResourceProperties.ClientAppId;
  var userPoolId = event.ResourceProperties.CognitoUserPoolId;
  var userPool = 'cognito-idp.' + cognitoRegion + '.amazonaws.com/' + event.ResourceProperties.CognitoUserPoolId;
  var identityPoolid = '';

  // If DELETE request type is sent, return success to cloudformation. User will manually tear down Cognito resources
  if (event.RequestType == "Delete") {
    responseStatus = "SUCCESS";
    console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
    sendResponse(event, context, responseStatus, responseData, callback);
  }

  // if request type is CREATE or UPDATE, create the resources
  else {
    function initiateCognitoBuild() {
      async.waterfall([
        createIdentityPool,
        setRoles,
        getConstantsFile,
        replaceConstantsFile
      ], function(err, result) {
        if (err) {
          console.log('Error: ' + err);
          responseStatus = "FAILED";
          console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
          sendResponse(event, context, responseStatus, responseData, callback);
        }
        else {
          console.log('Done processing');
          responseStatus = "SUCCESS";
          console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
          sendResponse(event, context, responseStatus, responseData, callback);
        }
      });
    }

    function createIdentityPool(callback) {
      var params = {
        AllowUnauthenticatedIdentities: true,
        IdentityPoolName: stackName + '_identitypool',
        CognitoIdentityProviders: [
          {
            ClientId: clientId,
            ProviderName: userPool,
            ServerSideTokenCheck: false
          }
        ],
      };
      cognitoidentity.createIdentityPool(params, function(err, data) {
        if (err) {
          console.log('Error creating identity pool. Error is: ' + err);
          return callback(err);
        }
        else {
          console.log('Created identity pool. Pool Id is: ' + data.IdentityPoolId);
          identityPoolid = data.IdentityPoolId;
          callback(null, data.IdentityPoolId);
        }
      });
    }

    function setRoles(identityPoolid, callback){
      var params = {
        IdentityPoolId: identityPoolid,
        Roles: {
          authenticated: cognitoRoleARN,
          unauthenticated: cognitoRoleARN
        }
      };
      cognitoidentity.setIdentityPoolRoles(params, function(err, data) {
        if (err) {
          console.log('Unable to add roles to identity pool. Error: ' + err);
          return callback(err);
        }
        else {
          console.log('Added roles to identity pool.');
          callback(null);
        }
      });
    }

    function getConstantsFile(callback) {
      var params = {
        Bucket: bucket,
        Key: constantsFileKey
      };
      s3bucket.getObject(params, function(err, data) {
        if (err) {
          console.log('Unable to retrieve constants file from S3 bucket.');
          return callback(err);
        }
        else {
          console.log('Retrieved constants.js file from S3 bucket.');
          console.log('url from file is: ' + data.Body);
          apigwURL = data.Body;
          callback(null, data.Body);
        }
      });
    }

    function replaceConstantsFile(url, callback) {
      var params = {
        Bucket: bucket,
        Key: constantsFileKey,
        Body: url + '\nvar COGNITO_REGION = "' + cognitoRegion + '";\nvar AWS_REGION = "' + stackRegion + '";\nvar IDENTITY_POOL_ID = "' + identityPoolid + '";\nvar USER_POOL_ID = "' + userPoolId + '";\nvar CLIENT_ID = "' + clientId + '";'
      };
      s3bucket.upload(params, function(err, data) {
        if (err) {
          console.log('Unable to put constants file into S3 bucket.');
          return callback(err);
        }
        else {
          console.log('Uploaded constants.js file to S3 bucket.');
          console.log('Constants file contents: ' + data.Body);
          callback(null);
        }
      });
    }
    initiateCognitoBuild();
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
