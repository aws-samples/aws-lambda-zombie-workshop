angular.module('chatApp.signup', ['chatApp.utils'])
.controller('SignupCtrl', function($scope, $state) {

    $scope.errormessage = "";

    $scope.user = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        camp: "",
        slackuser: "",
        slackteamdomain: ""
    };

    $scope.register = function(isValid) {
        console.log($scope.user);
        var _username = $scope.user.email;
        console.log(_username);
        if (isValid) {
            console.log("Submitted " + $scope.user.name);

            var poolData = {
                UserPoolId : USER_POOL_ID,
                ClientId : CLIENT_ID
            };


            var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

            var attributeList = [];

            var dataEmail = {
                Name : 'email',
                Value : $scope.user.email
            };
            var dataPhoneNumber = {
                Name : 'phone_number',
                Value : $scope.user.phone
            };
            var dataName = {
                Name : 'name',
                Value : $scope.user.name
            };

            var dataCamp = {
                Name : 'custom:camp',
                Value : $scope.user.camp ? $scope.user.camp : "null"
            };

            var dataSlackuser = {
                Name : 'custom:slackuser',
                Value : $scope.user.slackuser ? $scope.user.slackuser : "null"
            };

            var dataSlackteamdomain = {
                Name : 'custom:slackteamdomain',
                Value : $scope.user.slackteamdomain ? $scope.user.slackteamdomain : "null"
            };

            var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
            var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);
            var attributeName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName);
            var attributeCamp = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataCamp);
            var attributeSlackuser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataSlackuser);
            var attributeSlackteamdomain = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataSlackteamdomain);

            attributeList.push(attributeEmail);
            attributeList.push(attributePhoneNumber);
            attributeList.push(attributeName);
            attributeList.push(attributeCamp);
            attributeList.push(attributeSlackuser);
            attributeList.push(attributeSlackteamdomain);

            userPool.signUp(_username, $scope.user.password, attributeList, null, function(err, result){
                if (err) {
                    console.log(err);
                    $scope.errormessage = "An unexpected error has occurred. Please try again. Error: " + err;
                    $scope.$apply();
                    return;
                    
                } else {
                    cognitoUser = result.user;
                    console.log('user name is ' + cognitoUser.getUsername());
                    $state.go('confirm', { });
                }
            });

        } else {
            $scope.errormessage = "There are still invalid fields.";
            console.log("There are still invalid fields");
        }
    };

});
