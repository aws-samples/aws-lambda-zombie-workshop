# Zombie Microservices Workshop: Lab Guide

## Overview of Workshop Labs
The [Zombie Microservices Workshop](http://aws.amazon.com/events/zombie-microservices-roadshow/) introduces the basics of building serverless applications using [AWS Lambda](https://aws.amazon.com/lambda/), [Amazon API Gateway](https://aws.amazon.com/api-gateway/), [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), [Amazon Cognito](https://aws.amazon.com/cognito/), [Amazon SNS](https://aws.amazon.com/sns/), and other AWS services. In this workshop, as a new member of the AWS Lambda Signal Corps, you are tasked with completing the development of a serverless survivor communications system during the Zombie Apocalypse.

This workshop has a baseline survivor chat app that is launched via [CloudFormation](https://aws.amazon.com/cloudformation/). Complete the lab exercises to extend the functionality of the communications system or add your own custom functionality!

Prior to beginning the labs, you will need to finalize the setup of User authentication for the application with [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html). This is a necessary step to finalize the readiness of the application.

### Labs
Each of the labs in this workshop is an independent section and you may choose to do some or all of them, or in any order that you prefer.

* **Lab 1: Typing Indicator**  

  This exercise already has the UI and backend implemented, and focuses on how to setup the API Gateway to provide a RESTful endpoint. You will configure the survivor chat application to display which survivors are currently typing in the chat room.

* **Lab 2: SMS Integration with Twilio**  

    This exercise uses [Twilio](http://twilio.com) to integrate SMS text functionality with the survivor chat application. You will configure a free-trial Twilio phone number so that users can send text messages to the survivor chat application. You'll learn to leverage mapping templates in API Gateway to perform data transformations in an API.

* **Lab 3: Search Integration with Elasticsearch**  

    This exercise adds an Elasticsearch cluster to the application which is used to index chat messages streamed from the DynamoDB table containing chat messages.

* **Lab 4: Slack Integration**  

    This exercise integrates the popular messaging app, [Slack](http://slack.com), into the chat application so that survivors can send messages to the survivor chat from within the Slack app.

* **Lab 5: Intel Edison Zombie Motion Sensor** (IoT device required)

    This exercise integrates motion sensor detection of zombies to the chat system using an Intel Edison board and a Grove PIR Motion Sensor. You will configure a Lambda function to consume motion detection events and push them into the survivor chat!

### Workshop Cleanup

This section provides instructions to tear down your environment when you're done working on the labs.

* * *

### Let's Begin! Launch the CloudFormation Stack
*Prior to launching a stack, be aware that a few of the resources launched need to be manually deleted when the workshop is over. When finished working, please review the "Workshop Cleanup" section to learn what manual teardown is required by you.*

1\. To begin this workshop, **click one of the 'Deploy to AWS' buttons below for the region you'd like to use**. This is the AWS region where you will launch resources for the duration of this workshop. This will open the CloudFormation template in the AWS Management Console for the region you select.

Region | Launch Template
------------ | -------------
**N. Virginia** (us-east-1) | [![Launch Zombie Workshop Stack into Virginia with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=zombiestack&templateURL=https://s3.amazonaws.com/aws-zombie-workshop-us-east-1/CreateZombieWorkshop.json)
**Ohio** (us-east-2) | [![Launch Zombie Workshop Stack into Ohio with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=zombiestack&templateURL=https://s3-us-east-2.amazonaws.com/aws-zombie-workshop-us-east-2/CreateZombieWorkshop.json)
**Oregon** (us-west-2) | [![Launch Zombie Workshop Stack into Oregon with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=zombiestack&templateURL=https://s3-us-west-2.amazonaws.com/aws-zombie-workshop-us-west-2/CreateZombieWorkshop.json)
**Ireland** (eu-west-1) | [![Launch Zombie Workshop Stack into Ireland with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-eu-west-1.amazonaws.com/aws-zombie-workshop-eu-west-1/CreateZombieWorkshop.json)
**Frankfurt** (eu-central-1) | [![Launch Zombie Workshop Stack into Frankfurt with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-eu-central-1.amazonaws.com/aws-zombie-workshop-eu-central-1/CreateZombieWorkshop.json)
**Tokyo** (ap-northeast-1) | [![Launch Zombie Workshop Stack into Tokyo with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-northeast-1.amazonaws.com/aws-zombie-workshop-ap-northeast-1/CreateZombieWorkshop.json)
**Seoul** (ap-northeast-2) | [![Launch Zombie Workshop Stack into Seoul with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-northeast-2.amazonaws.com/aws-zombie-workshop-ap-northeast-2/CreateZombieWorkshop.json)
**Singapore** (ap-southeast-1) | [![Launch Zombie Workshop Stack into Singapore with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-southeast-1.amazonaws.com/aws-zombie-workshop-ap-southeast-1/CreateZombieWorkshop.json)
**Sydney** (ap-southeast-2) | [![Launch Zombie Workshop Stack into Sydney with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-southeast-2.amazonaws.com/aws-zombie-workshop-ap-southeast-2/CreateZombieWorkshop.json)

*If you have CloudFormation launch FAILED issues, please try launching in us-east-1 (Virginia)*

2\. Once you have chosen a region and are inside the AWS CloudFormation Console, you should be on a screen titled "Select Template". We are providing CloudFormation with a template on your behalf, so click the blue **Next** button to proceed.

3\. On the following screen, "Specify Details", your Stack is pre-populated with the name "zombiestack". You can customize that to a name of your choice **less than 15 characters in length** or leave as is. For the parameters section, if you want to develop with a team and would like to create IAM Users in your account to grant your teammates access, then specify how many teammates/users you want to be created in the **NumberOfTeammates** text box. Otherwise, leave it defaulted to 0 and no additional users will be created. The user launching the stack (you) already have the necessary permissions. Click **Next**.

*If you create IAM users, an IAM group will also be created and those users will be added to that group. On deletion of the stack, those resources will be deleted for you.*

4\. On the "Options" page, leave the defaults and click **Next**.

5\. On the "Review" page, verify your selections, then scroll to the bottom and select the checkbox **I acknowledge that AWS CloudFormation might create IAM resources**. Then click **Create** to launch your stack.

6\. Your stack will take about 3 minutes to launch and you can track its progress in the "Events" tab. When it is done creating, the status will change to "CREATE_COMPLETE".

7\. Click the "Outputs" tab in CloudFormation and click the link for "MyChatRoomURL". This should open your chat application in a new tab. Leave this tab open as you'll come back to it later.

Please continue to the next section to finish the required Cognito User Pools authentication setup.

## Finish setup Authentication with Cognito User Pools (Required)

The survivor chat uses [Amazon Cognito](https://aws.amazon.com/cognito/) for authentication. Cognito Federated Identity enables you to authenticate users through an external identity provider and provides temporary security credentials to access your app’s backend resources in AWS or any service behind Amazon API Gateway. Amazon Cognito works with external identity providers that support SAML or OpenID Connect, social identity providers (such as Facebook, Twitter, Amazon) and you can also integrate your own identity provider.

In addition to federating 3rd party providers such as Facebook, Google, and other providers, Cognito also offers a new built-in Identity Provider called [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html).

A Cognito User pool and Federated Identity pool has already been created for you when you launched CloudFormation.

You will now link both together. Cognito User Pool will be the user directory of your chat app survivors and you have to configure it as a valid Authentication Provider with the Cognito Federated Identity Pool. API Gateway has been configured with IAM Authorization to only allow requests that are signed with valid AWS permissions. When a user signs into the Survivor Chat App (User Pool) successfully, a web call is made to the Cognito Federated Identity Pool to assume temporary AWS credentials for your authenticated user. These credentials are used to make signed [AWS SigV4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) HTTPS requests to your message API.

![Overview of Cognito Authentication](/Images/CognitoOverview.png)

**Let's get started...**

1\. Navigate back to CloudFormation and find the Cognito user pool Id (CognitoUserPoolId) and the App Id (AppId) in the Outputs tab of your CloudFormation stack. Open a text editor on your computer and copy both into it for later use.

2\. Navigate to the Cognito service console.

![Navigate to the Cognito service](/Images/Cognito-Step1.png)

Cognito User Pools is not available in all AWS regions. Please review the list [here](https://docs.aws.amazon.com/general/latest/gr/rande.html#cognito_identity_region) for the regions that Cognito is available in. Therefore if you launched your CloudFormation stack in any region other than one of those listed on the above website, then please use the top navigation bar in the management console to switch AWS regions and navigate to **us-east-1 (Virginia)** to configure Cognito. Your application will stay hosted in the region you launched the CloudFormation template, but the authentication with Cognito will reside in us-east-1 (Virginia). If you launched the Cloudformation stack in one of those regions where Cognito exists, then please simply navigate to the Cognito service in the AWS Management Console as the service is available in that region already and you will configure it within that region.

3\. When inside the Cognito service console, click the blue button **Manage Federate Identities **.

* An [Amazon Cognito Identity Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) has been configured for you. Identity Pools allow external federated users to assume temporary credentials from AWS to make service API calls from within your apps.

* We've just created the User Pool for authentication into your app. Now your users still need access to make IAM Authorized AWS API calls.

* You'll setup federation inside of Cognito Identity and allow your User Pool as an **Authentication Provider**.

4\. Click into the Identity Pool that has already been created for you. It should be named "[Your CloudFormation stack name]_identitypool". On the Idenity pool dashboard, in the upper right, select **Edit identity pool**.

5\. Cognito Identity allows you to give access to both authenticated users and unauthenticated (guest) users. The permissions associated with these groups of users is dictated by the IAM role that you attach to these Cognito roles. Your Authenticated and Unauthenticated Cognito roles have already been configured for you in CloudFormation. The Authenticated role has been configured to give permissions to the principal (your Cognito authenticated application user) to make "execute-api:invoke" calls to the API Gateway endpoint ARNs associated with the survivor serverless app.

* When users authenticate into the application, they become an authenticated user, and the application allows them to send chat messages to the survivor chat.

6\. Click the black dropdown arrow in the section titled "Authentication providers". You will configure your Identity pool to allow federated access from your Identity Provider, your Cognito User Pool. In the "Cognito" identity provider tab, insert your **User Pool ID** and **App Client ID** into their respective text boxes from your text editor file. Do not delete them from the text file, you'll need these items again in a later step.

You should have copied these from your User Pool earlier when you set it up. If you do not have these copied, please navigate back to your Cognito User Pool you created earlier and locate your User Pool Id and App Client ID.

Scroll to the bottom of the page and click **Save Changes** to save the User Pool configuration settings. Your Cognito Federated Identiy Pool has been configured with Congito User Pool as an IdP. When users authenticate to the User Pool, they will assume temporary credentials with the permissions allowed via the Authenticated Role.

7\. You will now make an update to an application config file so that the serverless Javascript application can communicate with your User Pool to log users in.

Navigate to the Amazon S3 console **in the region where you launched your CloudFormation stack.**

* If you changed regions to configure Cognito, please return back to the region where you launched the stack and navigate to the S3 service.

![Navigate to the S3 service](/Images/Cognito-Step7.png)

8\. On the Amazon S3 buckets listing page, find and click into the bucket that was created for you by CloudFormation. It should be named with your stack name prepended to the beginning. Something like [CloudFormation Stack Name]-s3bucketforwebsitecontent"....

* In the S3 Console search bar you can type **s3bucketforwebsitecontent** and your S3 bucket will display.

9\. This bucket contains all the contents for hosting your serverless JS app as well as the source code for the workshop's Lambda functions and CloudFormation resources. Please do not delete these contents. Click into the folder (prefix) named **S3** and navigate through to the file **S3/assets/js/constants.js**

Download the **S3/assets/js.constants.js** file to your local machine and open it with a text editor.

![Download the constants.js file](/Images/Cognito-Step9.png)

10\. Open up the constants.js file and copy over the User Pool ID into the "USER_POOL_ID" variable. Then copy the App Client ID into the "CLIENT_ID" variable. These should be copied from the open text file you had open from earlier.

* Your serverless javascript zombie application requires this constants values in file communicate with the different services of the workshop.

* The Identity Pool Id was automatically filled in with several other variables when the CloudFormation template was launched.

11\. Save the constants.js file and upload it back to S3. While in the S3 console window, make sure you are in the **js** directory. Click the blue **Upload** button and upload the constants.js file from your local machine. Within the upload dialog, select the "Manage public permissions" dropdown and set the permissions on the file to read-only for the public by selecting the **Read** checkbox next to Everyone under the Objects category. You can also drag your file from your local machine into the S3 browser console to initiate an upload and then when the object is uploaded, make sure to select **Make Public**.

* Your application now has the configuration it needs to interact with Cognito.

12\. Navigate back to CloudFormation and find the Chat Room URL (MyChatRoomURL) in the Outputs tab of your CloudFormation stack. Click it to open the chat application in a new browser window.

* If you already had the application opened in your browser, please refresh the page so that the new constants.js loads with the app.

13\. You should see a sign in page for the Zombie survivor web app. You need to create an account so click **Sign Up**.

14\. Fill out the form to sign up as a survivor.

* **Select your Camp**: Specify the geography where you live! Currently this attribute is not used in the application and is available for those that want to tackle an extra credit opportunity!. When you're done with the workshop, try and tackle the Channel Challenge in the Appendix.

* **Slack Username**: Type the Slack Username you will use during the Slack lab of this workshop. This associates your Slack username with your Survivor app user account and is required if you want to do the Slack lab.

* **Slack Team Domain Name**: Slack users can be members of many teams. Type the Slack team domain name that you want to integrate with this survivor chat app. The combination of a Slack team domain and Slack Username will unique identity a user to associate with your new Survivor chat app account.

When done, click **Sign Up**.

15\. A form should appear asking you to type in your confirmation code. Please check your inbox for the email address you signed up with. You should received an email with the subject "Signal Corps Survivor Confirmation" (May be in your Spam folder!). Copy over the verification code and enter into the confirmation window.

**Troubleshooting tips:**

* If you are getting errors during the signup, please revisit the settings for your Cognito User Pool. You need to make sure that you've done the following -  

    * Configured your Cognito Lambda triggers for both the **Pre-Authentication** and **Post-Confirmation** steps as described in Step 10.

    * Properly modified the constants.js config file and re-uploaded it to the JS directory for your application in S3. After you uploaded this constants.js file, you should have refreshed your zombie chat browser application page so that it could pull down the latest JS files. The application is client-side and needs this file's properties in order to bootstrap itself.

* Users created in the application are also stored in a DynamoDB table named "Users". If you did not have your Cognito triggers set up correctly, you will need to navigate to the DynamoDB Users table and delete the entry for your user. You can then re-register in the application again.


![Confirm your signup](/Images/Cognito-Step15.png)

After confirming your account, sign in with your credentials and begin chatting! You should see a red button called **Start Chatting** - click that button to toggle your session on. You may then begin typing messages followed by the "Enter" key to submit them.

16\. Your messages should begin showing up in the central chat pane window. Feel free to share the URL with your teammates, have them signup for accounts and begin chatting as a group! If you are building this solution solo, you can create multiple user accounts with different email addresses. Then login to both user accounts in different browsers to simulate multiple users.

**The baseline chat application is now configured and working! There is still important functionality missing and the Lambda Signal Corps needs you to build it out...so get started below!**

*This workshop does not utilize API Gateway Cache. Please KEEP THIS FEATURE TURNED OFF as it is not covered under the AWS Free Tier and will incur additional charges. It is not a requirement for the workshop.*

## Lab 1 - Typing Indicator

**What you'll do in this lab...**

In this section you will create functionality in your chat application that allows survivors to see which survivors in the chat room are currently typing. To configure this functionality, you will modify your API to integrate with backend Lambda functions that are responsible for querying and returning the users currently typing in the system, as well as updating metadata in the "talkers" DynamoDB table that contains details about which survivors are typing at which times. The survivor chat app continuously polls this API endpoint with GET requests to determine who is typing. As survivors are typing, POST requests are made to this same endpoint to update the talkers DynamoDB table.

The typing indicator shows up in the web chat client in a section below the chat message panel. The UI and backend Lambda functions have already been implemented, and this lab focuses on how to configure your new integration in API Gateway.

The application uses [CORS](http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html). This lab will both wire up the backend Lambda function as well as perform the necessary steps to enable CORS.

**Typing Indicator Architecture**
![Overview of Typing Indicator Architecture](/Images/TypingIndicatorOverview.png)

1\. Navigate to the API Gateway service. You can search for it on the main console homepage or type in the service name to quickly access the service (as shown below)
![API Gateway in Management Console](/Images/Typing-Step1.png)

2\. On the APIs listing screen in API Gateway, click into your Zombie chat API. It should be prefixed with the name of your CloudFormation stack that launched it. By default this should be "zombiestack-". Select the Zombie Workshop API Gateway.

3\. Click the **GET** method of your /zombie/talkers resource located at **/zombie/talkers/GET**. You can do this by clicking the "GET" method under the /zombie/talkers resource. The GET method is highlighted in blue in the image below. Click there.
![GET Method](/Images/Typing-Step3.png)

*This GET HTTP method is used by the survivor chat app to perform continuous queries on the DynamoDB talkers table to determine which users are typing.*

4\. Click the **Integration Request** box.

5\. Under "Integration Type", Select **Lambda Function.**

* Currently, this API method is configured to a "MOCK" integration. MOCK integrations are dummy backends that are useful when you are testing and don't yet have the backend built out but need the API to return sample dummy data. You will remove the MOCK integration and configure this GET method to connect to a Lambda function that queries DynamoDB.

6\. For the **Lambda Region** field, select the region in which you launched the CloudFormation stack. (HINT: Select the region code that corresponds with the yellow CloudFormation button you clicked to launch the CloudFormation template. You can also look in the upper right corner of the Management Console to see which region you are in). For example if you launched your stack in Virginia (us-east-1), then you will select us-east-1 as your Lambda Region.

* When you launched the CloudFormation template, the launch also created several Lambda functions for you locally in the region where you launched your CFN stack - this includes functions for retrieving data from and putting data into a DynamoDB "Talkers" table with details about which survivors are currently typing in the chat room.

7\. For the Lambda Function field, begin typing "gettalkers" in the text box. In the auto-fill dropdown, select the function that contains "GetTalkersFromDynamoDB" in the name. It should look something like this.... **[CloudformationTemplateName]-[XXXXXXX]-GetTalkersFromDynamoDB-[Your Region]**.

* This Lambda function is written in NodeJs. It performs GetItem DynamoDB requests on a Table called Talkers. This talkers table contains records that are continuously updated whenever users type in the chat room. By hooking up this Lambda function to your GET method, it will get invoked by API Gateway when the chat app polls the API with GET requests.

8\. Select the blue **Save** button and click **OK** if a pop up asks you to confirm that you want to switch to Lambda integration. Then grant access for API Gateway to invoke the Lambda function by clicking "OK" again. This 2nd popup asks you to confirm that you want to allow API Gateway to be able to invoke your Lambda function.

9\. Click the **Method Execution** back button to return to the method execution overview page. You'll now tell API Gateway what types of HTTP response types you want your API to expose. Click the **Method Response** section of the Method Execution Flow.

10\. Add a 200 HTTP Status response. Click "Add Response", type "200" in the status code text box and then click the little checkmark to save the method response, as shown below.
![Method Response](/Images/Typing-Step10.png)

* You've configured the GET method of the /zombie/talkers resource to allow responses with HTTP status of 200. We could add more response types but we'll skip that for simplicity in this workshop.

11\. Go to the /zombie/talkers/POST method by clicking the "POST" option in the resource tree on the left navigation pane.
![POST Method](/Images/Typing-Step11.png)

12\. We're now going to configure to the /zombie/talkers resource to properly integrate with AWS Lambda on POST requests.

**Perform Steps 4-10 again** just as you did for the GET method. However, this time when you are selecting the Lambda Function for the Integration Request, you'll type "writetalkers" in the auto-fill and select the function that looks something like this... **[CloudformationTemplateName]-[XXXXXXX]-WriteTalkersToDynamoDB-[Your Region]**. This way on POST requests, API Gateway will invoke your **writetalkers** Lambda function. Don't forget to return to the Method Response section for this POST method and add a "200" HTTP response status as you did for the GET method earlier, if it doesn't exist already.

* In these steps you are configuring the POST method that is used by the chat app to insert data into DynamoDB Talkers table with details about which users are typing. You're performing the same exact method configuration for the POST method as you did for your GET method. However, since this POST method is used for sending data to the database, it triggers a different backend Lambda function. This function writes data to DynamoDB while the "GetTalkersToDynamoDB" function was used to retrieve data from DynamoDB.

	* You could optionally include the logic for both the POST and GET operations inside of a single Lambda function with your own built-in logic that properly checks for and handles POSTs and GETs (or other actions).

13\. Go to the /zombie/talkers/OPTIONS method

14\. Select the Method Response.

15\. Add a 200 method response. Click "Add Response", type "200" in the status code text box and then click the little checkmark to save the method response.

16\. Go back to the OPTIONS method flow and select the Integration Response. (To go back, there should be a blue hyperlink titled "Method Execution" which will bring you back to the method execution overview screen).

17\. Select the Integration Response.

18\. Add a new Integration response with a method response status of 200. Click the "Method response status" dropdown and select "200". Leave the "Content Handling" option set to **Passthrough**. When done, click the blue **Save** button.

* In this section you configured the OPTIONS method simply to respond with HTTP 200 status code. The OPTIONS method type is simply used so that clients can retrieve details about the API resources that are available as well as the methods associated with them.

19\. Select the /zombie/talkers resource on the left navigation tree.
![talker resource](/Images/Typing-Step19.png)

20\. Click the "Actions" box and select "Enable CORS" in the dropdown.

21\. Select Enable and Yes to replace the existing values. You should see all green checkmarks for the CORS options that were enabled, as shown below.
![talker resource](/Images/Typing-Step21.png)

* If you don't see all green checkmarks, this is probably because you forgot to add the HTTP Status 200 code for the Method Response Section. Go back to the method overview section for your POST, GET, and OPTIONS method and make sure that it shows "HTTP Status: 200" in the Method Response box.

22\. Click the "Actions" box and select Deploy API  
![talker resource](/Images/Typing-Step22.png)

23\. Select the ZombieWorkshopStage deployment and hit the Deploy button.

* In this workshop we deploy the API to a stage called "ZombieWorkshopStage". In your real world scenario, you'll likely create different stages of the API to reflect different versions that you'd like to maintain.

**LAB 1 COMPLETE**

Head back to the survivor chat app and **Refresh the page** type messages. POST requests are being made to the Talkers API resource which is updating a DynamoDB table continuously with timestamps along with who is typing. Simultaneously, the application is performing a continuous polling (GET Requests) against /zombie/talkers to show which survivors are typing. This displays

![talker resource](/Images/Typing-Done.png)

* * *

## Lab 2 - SMS Integration with Twilio

**What you'll do in this lab...**

In this section, you’ll create a free-trial Twilio SMS phone number. You will configure this Twilio phone number with a webhook to forward all incoming text messages sent to your Twilio number to the /zombie/twilio API resource in API Gateway. This will allow you to communicate with survivors in the chat room via text message.

**SMS Twilio Integration Architecture**
![Overview of Twilio Integration](/Images/TwilioOverview.png)

1\. Sign up for a free trial Twilio account at https://www.twilio.com/try-twilio. Or if you have an existing Twilio account, login.

2\. Once you have created your account, login to the Twilio console and navigate to the Home icon on the left navigation pane. On the Home screen/console dashboard, scroll down to the **Phone Numbers** section and click "Phone Numbers".
![Manage Twilio Phone Number](/Images/Twilio-Step2.png)

3\. On the Phone Numbers screen, click **Get Started** to assign a phone number to your account. Then click the red **Get your first Twilio phone number** button. We’re going to generate a 10-digit phone number in this lab, but a short-code would also work if preferred. This number should be enabled for voice and messaging by default. A popup will appear with your new phone number, click **Choose this number**. If the proposed phone number does not support messaging, click "Search for a different number", select your country and select the checkbox "SMS", then click "Search". Twilio propose a list of phone number, select "Choose number" for one of them. Then, type your address, click "Save and continue" and "Done".

* **International Users** - These are US phone numbers that you are provisioning in Twilio. You can also choose to configure an internationl number in Twilio, however there may be charges that apply. Currently this workshop only supports US phone numbers in the front end JS application due to the necessary formatting logic that has yet to be introduced into the code!

If you have an international mobile device, you can still do this lab. When registering for a user account in the zombie chat, just use a dummy placeholder 10 digit phone number for now. Later steps in this lab will illustrate a workaround that allows you to send SMS using your international phne number*

4\. Once you’ve received a phone number, click the **Manage Numbers** button on the left navigation pane. Click on your phone number, which will take you to the properties page for that number.

5\. Scroll to the bottom of the properties page, to the **Messaging** section. In the **Configure With** dropdown, select the **Webhooks/TwiML** option. Leave this page open for now and proceed to the next step.

* The Twilio webhooks section allows you to integrate your phone number with third party services. In this case, you're going to configure your Twilio phone number to forward any messages it receives over to your API Gateway /zombie/twilio resource with POST requests.

6\. Now you’ll retrieve your **/zombie/twilio** API endpoint from API Gateway and provide it to Twilio to hook up to AWS. Open the AWS Management console in a new tab, and navigate to API Gateway, as illustrated below. Be sure to leave the Twilio tab open as you’ll need it again to finish setup.
![API Gateway in Management Console](/Images/Twilio-Step6.png)

7\. In the API Gateway console, select your API.  Then on the left navigation tree, under your API, click **Stages**.
![API Gateway Resources Page](/Images/Twilio-Step7.png)

8\. With "Stages" selected, expand the "ZombieWorkshopStage" by clicking the blue arrow. Once expanded, select the **POST** method for the **/zombie/twilio** resource. The **/zombie/twilio** resource is the endpoint that we automatically created for you in CloudFormation for SMS integration with twilio.com. You should see an **Invoke URL** displayed for your **/zombie/twilio** resource, as shown below.
![API Gateway Invoke URL](/Images/Twilio-Step8.png)

9\. Copy the **Invoke URL** and return to the Twilio website. On the Twilio page that you left open, paste the Invoke URL from API Gateway into the text box next to the label **A message comes in**. Ensure that the request type is set to **HTTP POST**. This is illustrated below.
![Twilio Request URL](/Images/Twilio-Step9.png)

10\. Click **Save** to finalize the setup connecting Twilio to your API.

11\. You will now create the Lambda Function that processes your incoming Twilio messages, parses the message, and proxies it along to your /zombie/message Chat Service. To begin, navigate to the Lambda console.

* As you'll see throughout this workshop, we will leverage separate Lambda functions to pre-process data before sending standardized/formatted requests to the /zombie/message resource. This allows us to-reuse the existing DynamoDB logic sitting behind the /zombie/message resource rather than writing multiple separate functions that all interact with DynamoDB individually. As messages come in to your Twilio number, the Twilio webhook forwards them with HTTP POST requests to your /zombie/twilio resource, which will be integrated with a backend pre-processing Lambda function. This pre-processing function will strip apart the Twilio payload and format it before making a signed SigV4 HTTPS POST to your /zombie/message service which requires IAM authorization in order to be invoked.

12\. Click **Create a Lambda function** and select the box titled **Author from scratch** as we will be creating a brand new function. Create a name for the function, such as **"[Your CloudFormation stack name]-TwilioProcessing"**. Set the "Runtime" as **Node.js 4.3**. As **Role**, **Choose an existing role** should be selected from the dropdown. Then for the **Existing role**, select the role that looks like **[Your stack name]-ZombieLabLambdaRole...**. For simplicity we are reusing the same Lambda role for our functions. Click **Create function**.

13\. In the following screen, scroll down to the **Function code** section. Take the source code from our Github repository, by open the **TwilioProcessing.js** file found inside the **/Twilio** folder. Delete the sample code in the Lambda console editor and replace it with the entire contents from your TwilioProcessing.js file. Once you have copied the code into Lambda, scroll down to [line 8](/Twilio/TwilioProcessing.js#L8) in the code where the **API** variable is declared. **API.endpoint** should show a value of "INSERT YOUR API GATEWAY URL HERE INCLUDING THE HTTPS://". Please replace this string with the fully qualified domain name (FQDN) of the URL for your **/zombie/message** POST method found in API Gateway. For example, it should look something like "https://xxxxxxxx.execute-api.us-west-2.amazonaws.com".

You should also fill in the region code in the variable **API.region**. This should be the region where you launched CloudFormation.

Next, you will also copy in the name of your DynamoDB **Users** table that was created for you. This should be named as **[Your CloudFormation Stack Name]-users"**. You should copy this table name into the **table** variable in your Lambda code. You will also need to copy in the name of your "phoneindex" (this is an index that was created on the DynamoDB table to assist with querying). These attributes can be found in the Outputs section in CloudFormation. You should be copying the values for **DynamoDBUsersTableName** and **DynamoDBUsersPhoneIndex** from CloudFormation.

* Some of the functions in this workshop were originally authored for Nodejs 0.10 but are still capable of running in the Node4.3 runtimes +. The workshop will soon be upgraded to use the latest Nodejs runtime that is supported by Lambda.

14\. Under "Basic settings", set the **Timeout** field to 30 seconds and keep all the rest of the defaults set. Then click **Save** on the top right corner to save the changes.

* You have just created a Lambda function that is integrated as the backend for your /zombie/twilio resource POST method. The function converts the parameters to the correct format for our Chat Service including a conversion to JSON format, and makes an HTTPS POST request to the /zombie/message Chat Service resource. That endpoint will take care of inserting the data into the DynamoDB messages table.

15\. Now that you have created the TwilioProcessing function, you need to connect it to the **POST** method for your /zombie/twilio endpoint. Navigate back to the API Gateway console and select the **POST** method for your **/zombie/twilio** resource.

16\. On the **Method Execution** screen for the "POST" method, the "Integration Request" box should show a type of **MOCK** for your /twilio resource.

17\. You will now change the **Integration Request** so that instead of integrating with a Mock integration, it will integrate with your TwilioProcessing Lambda function. Click **Integration Request**. On the Integration Request screen, change the "Integration type" radio button to **Lambda Function**. In the "Lambda Region" dropdown, select the region in which you created your TwilioProcessing Lambda function, and where you launched your CloudFormation Stack. For the **Lambda Function**, begin typing "TwilioProcessing" and the autofill should display your function. Select your **TwilioProcessing** function from the autofill. Click **Save**. In the popup window, confirm that you want to switch to Lambda Integration by clicking **OK**. Then confirm that you want to give API Gateway permission to invoke your function by clicking **OK**. Wait a few seconds for the changes to save.

18\. You will be brought back to the Integration Request page for your "POST" method.

19\. Twilio sends data from their API with a content-type of "application/x-www-form-urlencoded", but Lambda requires the content-type to be "application/json" for any payload parameters sent to it. You will configure a Mapping Template so that API Gateway converts the content type of incoming messages into JSON before executing your backend Lambda TwilioProcessing function with the parameters.

20\. On the Integration Request screen for your /zombie/twilio POST method, expand the **Body Mapping Templates** section and click **Add mapping template**. In the textbox for "Content-Type", input **application/x-www-form-urlencoded** and click the little checkmark button to continue. Once you have clicked the little checkbox, a popup window will appear asking if you want to only allow requests that match the Content-Type you specified. Click **Yes, secure this integration**. A new section will appear below with a dropdown for **Generate Template**. Click that dropdown and select **Method Request Passthrough**.

21\. A "Template" text editor window will appear. In this section you will input a piece of VTL transformation logic to convert the incoming Twilio data to JSON format. In this text editor, **delete all of the pre-filled content** and copy the following code into the editor.

```{"postBody" : "$input.path('$')"}```

After copying the code into the editor, click the **Save** button. You have now setup the POST method to convert the incoming data to JSON anytime a POST request is made to your /zombie/twilio resource with a Content-Type of "application/x-www-form-urlencoded". This should look like the screenshot below:
![Twilio Integration Request Mapping Template](/Images/Twilio-Step22.png)

22\. Now that you have configured the Integration Request to transform incoming messages into JSON, we need to configure the Integration Response to transform outgoing responses back to Twilio into XML format since the Twilio API requires XML as a response Content-Type. This step is required so that when you send SMS messages to the survivor Chat Service, it can respond back to your Twilio Phone Number with a confirmation message that your message was received successfully.

23\. Head back to the Method Execution screen for the twilio POST method. On the "Method Execution" screen for your /zombie/twilio POST method, click **Integration Response**. On the "Integration Response" screen, click the black arrow to expand the method response section. Expand the **Body Mapping Templates** section. You should see a Content-Type of "application/json". We need a Content-Type of XML, not JSON, so **delete this Content-Type by clicking the little black minus icon** and click **Delete** on the pop-up window.

24\. Click **Add mapping template** similar to the way you did this in the earlier steps for the Integration Request section.

25\. In the "Content-Type" text box, insert **application/xml** and click the little black checkmark to continue. Similar to the steps done earlier, we are going to copy VTL mapping logic to convert the response data to XML from JSON. This will result in your /zombie/twilio POST method responding to requests with XML format. After you have created the new content-type, a new section will appear below with a dropdown for **Generate Template**. Click that dropdown and select **Method Request Passthrough**.
In the text editor, delete all the code already in there and copy the following into the editor:

```
#set($inputRoot = $input.path('$'))
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>
        <Body>
            $inputRoot
        </Body>
    </Message>
</Response>
```

Click the grey "Save" button to continue.

The result should look like the screenshot below:

![Twilio Integration Response Mapping Template](/Images/Twilio-Step26.png)

26\. Scroll up and click the blue **Save** button on the screen. Finally click the **Actions** button on the left side of the API Gateway console and choose **Deploy API** to deploy your API. In the Deploy API window, select **ZombieWorkshopStage** from the dropdown and click **Deploy**.

27\. You are now ready to test out Twilio integration with your API. Send a text message to your Twilio phone number from your mobile device.

**LAB 2 COMPLETE**

If the integration was successful, you should receive a confirmation response text message and your text message you sent should display in the web app chat room as coming from your Twilio Phone Number. You have successfully integrated Twilio text message functionality with API Gateway.

* **Troubleshooting tip**: If you are unable to send text messages, please ensure you are sending from the same phone number that you registered when you signed up for a survivor account in the Zombie Chat. If you review the TwilioProcessing Lambda function you will see that the code is checking the DynamoDB users table to confirm if the incoming message forward to us from Twilio was sent from an authorized phone number. Twilio provides that to us when it sends the message to our API.

* **For international users**: If you have an international phone number and want to send text messages -
  1. Modify your user record in the DynamoDB Users table with your correct International Phone Number. You need to do this in DynamoDB directly, because the JS chat application performs validation that requires a 10 digit US phone number on the client. After modifying this in DynamoDB, you should be able to send text messages to your Twilio phone number from your international phone number because the the Lambda phone number validation in the code will recognize your phone number.

* * *

## Lab 3 - Search over the chat messages with Elasticsearch Service

**What you'll do in this lab...**

In this lab you'll launch an Elasticsearch Service cluster and setup DynamoDB Streams to automatically index chat messages in Elasticsearch for future ad hoc analysis of messages.

**Elasticsearch Service Architecture**
![Overview of Elasticsearch Service Integration](/Images/ElasticsearchServiceOverview.png)

1\. Select the Amazon Elasticsearch icon from the main console page.

2\. Create a new Amazon Elasticsearch domain. Provide it a name such as "[Your CloudFormation stack name]-zombiemessages". Click **Next**.

3\. On the **Configure Cluster** page, leave the default cluster settings and click **Next**.

4\. For the access set up, select **Public access** in the network configuration section for easy cluster access from outside your VPC (not recommended in general). Select the **Allow or deny access to one or more AWS accounts or IAM users** option in the dropdown **Set the domain access policy to** and fill in your account ID. Your AWS Account ID is actually provided to you in the examples section so just copy and paste it into the text box. Make sure **Allow** is selected for the "Effect" dropdown option. Click **OK**.

5\. Select **Next** to go to the domain review page.

6\. On the Review page, select **Confirm and create** to create your Elasticsearch cluster.

7\. The creation of the Elasticsearch cluster takes approximately 10 minutes.

* Since it takes roughly 10 minutes to launch an Elasticsearch cluster, you can either wait for this launch before proceeding, or you can move on to Lab 4 and come back to finish this lab when the cluster is ready.

8\. Take note of the Endpoint once the cluster starts, we'll need that for the Lambda function.
![API Gateway Invoke URL](/Images/Search-Step8.png)

9\. Go into the Lambda service page by clicking on Lambda in the Management Console.

10\. Select **Create a Lambda Function**.

11\. In the Create function screen select **Author from scratch** to create a Lambda function from scratch. Give your function a name, such as **"[Your CloudFormation stack name]-ESsearch"**. Set the "Runtime" as **Node.js 4.3**. As **Role**, **Choose an existing role** should be selected from the dropdown. Then for the **Existing role**, select the role that looks like **[Your stack name]-ZombieLabLambdaRole...**. Click **Create function**.

12\. In Add Triggers section, select the DynamoDB event source type. Scroll a bit down to the Configure triggers section and then select the **[Your stack name]-messages** DynamoDB table. Then set the **Batch size** to **5**, the **Starting position** to **Latest** and select the checkbox **Enable trigger**. Then click the **Add** button..

13\. Scroll a bit up and select the blue box in the middle of you page, representing you Lambda function. Scroll down again to the **Function code** section. Take the source code from our Github repository, by open the **ZombieWorkshopSearchIndexing.js** file found inside the **/ElasticsearchLambda** folder. Delete the sample code in the Lambda console editor and replace it with the entire contents from your TwilioProcessing.js file. .

14\. Once you have copied the code into Lambda, scroll down to [line 6](/ElasticSearchLambda/ZombieWorkshopSearchIndexing.js#L6) in the code provided, replace the **region** variable with the code for the region you are working in (the region you launched your stack, created your Lambda function etc). If you're working in Oregon region, then leave the code us-west-2 as is..

Then on line 7, replace the **endpoint** variable that has a value of **ENDPOINT_HERE** with the Elasticsearch endpoint created in step 8\. **Make sure the endpoint you paste starts with https://**.

* This step requires that your cluster is finished creating and in "Active" state before you'll have access to see the endpoint of your cluster.
15\. Under "Basic settings", set the **Timeout** field to **1** minute. This ensures Lambda can process the batch of messages before Lambda times out. Keep all the other defaults on the page set as is. Then click **Save** on the top right corner to save the changes.


16\. In the above step, we configured [DynamoDB Streams](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) to capture incoming messages on the table and trigger a Lambda function to push them to our Elasticsearch cluster. Your messages posted in the chat from this point forward will be indexed to Elasticsearch. Post a few messages in the chat, at least 5 as configured in the DynamoDB Streams event source (batch size). You should be able to see that messages are being indexed in the "Indices" section for your cluster in the Elasticsearch Service console.
![API Gateway Invoke URL](/Images/Search-Done.png)

**LAB 3 COMPLETE**

If you would like to explore and search over the messages in the Kibana web UI that is provided with your cluster, you will need to navigate to the Elasticsearch domain you created and change the permissions. Currently you've configured the permissions so that only your AWS account has access. This allows your Lambda function to index messages into the cluster.

To use the web UI to build charts and search over the index, you will need to implement an IP based policy to whitelist your computer/laptop/network or for simplicity, choose to allow everyone access. For instructions on how to modify the access policy of an ES cluster, visit [this documentation](http://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-gsg-configure-access.html). If you choose to open access to anyone be aware that anyone can see your messages, so please be sure to restrict access back to your AWS account when you're done exploring Kibana, or simply delete your ES cluster.  

* * *

## Lab 4 - Slack Integration

**What you'll do in this lab...**

In this lab, you'll integrate a Slack channel with your survivor chat. There may be survivors who use different chat systems and you'll want to communicate with them! After completing this lab, survivors communicating on Slack can send messages to survivors in the Zombie Chat App by configuring a slash command prefix to be used on any messages in their Slack channel that they want to send to the survivors. When Slack users type messages with this Slash command, it will pass the message to your survivor chat API, similiar to the webhook functionality enabled in the Twilio lab!

If you aren't familiar with Slack, they offer a free chat communications service that is popular, especially among the developer community. Slack uses a concept called "Channels" to distinguish different chat rooms. Visit their website to learn more!

**Slack Integration Architecture**
![Overview of Slack Integration](/Images/SlackOverview.png)

1\. Go to [http://www.slack.com](http://www.slack.com) and create a username, as well as a team. If you want to use your existing Slack username and existing team, then proceed with that profile instead of creating a new one.

2\. Once logged into your Slack team, navigate to [https://slack.com/apps](https://slack.com/apps) which should direct you to the app directory for your team. In the search bar in the middle of the App Directory page, type **slash commands** and select it from the options. This will take you to the Slash Commands portal. 

3\. On the Slash Commands page, click **Add configuration**. 

Slash commands allow you to define a command that you can use within Slack to trigger  Slack to perform actions in an event driven manner. In this case we are going to configure a slash command to forward messages to an external source with a webhook. You'll configure your Slash Command to make a POST request to a /zombie/slack API resource you will soon be creating in API Gateway. 

4\. On the Slash Commands configuration page, define a command in the **Commands** text box. Insert **/survivors** as your Slash Command. Then select "Add Slash Command Integration" to save it.

5\. On the Integration Settings page, scroll down to the **Method** configuration andmake sure the **Method** section has "POST" selected from the dropdown options. Then scroll to the **Token** section and copy the Token (or generate a new one) to a text file as you'll need it in the following steps.

6\. Keep the Slack browser tab open and in another tab navigate to the AWS Lambda management console in the AWS Management Console.

7\. Click **Create a Lambda function**. You'll create a Lambda function to parse incoming Slack messages and send them to the Chat Service.

8\. On the Create function page select the box titled **Author from scratch** to create a function from scratch. Give your function a name such as **"[Your CloudFormation Stack name]-SlackService"**. Set the "Runtime" as **Node.js 4.3**. As **Role**, **Choose an existing role** should be selected from the dropdown. Then for the **Existing role**, select the role that looks like **[Your stack name]-ZombieLabLambdaRole...**. For simplicity we are reusing the same Lambda role for our functions. Click **Create function**..
9\. In the following screen, scroll down to the **Function code** section. Take the source code from our Github repository, by open the **SlackService.js** file found inside the **/Slack** folder. Delete the sample code in the Lambda console editor and replace it with the entire contents from your TwilioProcessing.js file. Once you have copied the code into Lambda, 

* This SlackService function will serve as the backend for a new /zombie/slack API resource you will create later. This function accepts incoming messages forwarded from Slack when you use the slash command, it then reformats the parameters and proxies the Slack messages to the zombie survivor chat service (/zombi/message) . This Lambda function verifies that the incoming message has the predefined Slack Token, and it also does a DynamoDB query against the Users table to validate that the user who submitted the message in Slack is a preconfigured survivor in our backend (Remember when you signed up for the chat, you provided your Slack username and team domain as part of the sign-up process). In this workshop, we're using this is as the way to authorize requests against the /zombie/slack resource

10\. You should have saved the Slack Token string from earlier. Copy the Token string from Slack into the "token" variable on [line 15](/Slack/SlackService.js#L15) in the Lambda function, replacing the string **INSERT YOUR TOKEN FROM SLACK HERE** with your own token

* Slack provides a unique token associated with your integration. You are copying this token into your Lambda function as a form of validation. When incoming requests from Slack are sent to your API endpoint, and your Lambda function is invoked with the Slack payload, your Lambda function will check to verify that the incoming Token in the request matches the Token you provided in the code. If the token does not match, Lambda returns an error and doesn't process the request

11\. There are 4 variables you need to insert in the code to communicate with the backend

a) In the "API" variable, you will insert the fully qualified domain name (FQDN) for your API. The **API.endpoint** variable should show a value of "INSERT YOUR API GATEWAY FQDN HERE INCLUDING THE HTTPS://" on [line 9](/Slack/SlackService.js#L9). Your final FQDN inserted into the code should look something like "https://xxxxxxxx.execute-api.us-west-2.amazonaws.com". This allows the SlackService function to communicate with your API

b) You should also fill in the region code in the variable **API.region**. This should be the region where you launched CloudFormation

c) Finally you will also copy in the name of your DynamoDB Users table that was created for you. This should be placed in the **table** variable. You will also need to copy in the name of your "slackindex" (this is an index that was created on the DynamoDB table to assist with querying). These attributes can be found in the Outputs section in CloudFormation. You should be copying the values for **DynamoDBUsersTableName** and **DynamoDBUsersSlackIndex** from CloudFormation.

12\. Under "Basic settings", set the **Timeout** field to 30 seconds and keep all the rest of the defaults set. Then click **Save** on the top right corner to save the changes..

13\. When the function is created, navigate to the API Gateway service in the AWS Management Console. Click into your "Zombie Workshop API Gateway" API. On the left Resources pane, click/highlight the "/zombie" resource so that it is selected. Then select the **Actions** button and choose "Create Resource". For Resource Name, insert **slack** and for Resource Path, insert **slack**. Click "Create Resource" to create your slack API resource. The final resource for your Slack API should be as shown below.
![Create Slack API Resource](/Images/Slack-Step17.png)

*  In this step, you are creating a new API resource that the Slack slash command webhook can forward requests to. In the next steps, you'll create a POST method associated with this resource that triggers your Lambda function. When you type messages in Slack with the correct slash command, Slack will send requests to this resource, which will invoke your SlackService Lambda function to pre-process the payload and make a call to your /zombie/message endpoint to insert the data into DynamoDB.

14\. For your newly created "/slack" resource, highlight it, then click **Actions** and select **Create Method** to create the **POST** method for the /zombie/slack resource. In the dropdown, select **POST**. Click the checkmark to create the POST method. On the Setup page, choose an Integration Type of **Lambda Function**, and select the region that you are working in for the region dropdown. For the Lambda Function field, type "SlackService" for the name of the Lambda Function. It should autofill your function name. Click **Save** and then **OK** to confirm.

15\. Click **Integration Request** for the /slack POST method. We'll create a Mapping Template to convert the incoming query string parameters from Slack into JSON which is the format Lambda requires for parameters. This mapping template is required so that the incoming Slack message can be converted to the right format.

16\. Expand the **Body Mapping Templates** arrow and click **Add mapping template**. In the Content-Type box, enter **application/x-www-form-urlencoded** and click the little checkmark to continue. If a popup appears asking if you would like to secure the integration, click **Yes, secure this integration**. This ensures that only requests with the defined content-types will be allowed.

As you did in the Twilio lab, we're going to copy VTL mapping logic to convert the request to JSON. A new section will appear on the right side of the screen with a dropdown for **Generate Template**. Click that dropdown and select **Method Request Passthrough**.

In the text editor, delete all of the exiting VTL code and copy the following into the editor:

```
{"body": $input.json("$")}
```

Click the grey **Save** button to continue. The result should look like the screenshot below:

![Slack Integration Response Mapping Template](/Images/Slack-Step20.png)

17\. Click the **Actions** button on the left side of the API Gateway console and select **Deploy API** to deploy your API. In the Deploy API window, select **ZombieWorkshopStage** from the dropdown and click **Deploy**.

18\. On the left pane navigation tree, expand the ZombieWorkshopStage tree. Click the **POST** method for the **/zombie/slack** resource. You should see an Invoke URL appear for that resource as shown below.
![Slack Resource Invoke URL](/Images/Slack-Step22.png)

19\. Copy the entire Invoke URL. Navigate back to the Slack.com website to the Slash Command setup page and insert the Slack API Gateway Invoke URL you just copied into the "URL" textbox. Make sure to copy the entire url including "HTTPS://". Scroll to the bottom of the Slash Command screen and click **Save Integration**.

20\. You're ready to test out the Slash Command integration. In the team chat channel for your Slack account, type the Slash Command "/survivors" followed by a message. For example, type "/survivors Please help me I am stuck and zombies are trying to get me!". After sending it, you should get a confirmation response message from Slack Bot like the one below:
![Slack Command Success](/Images/Slack-Step24.png)

**LAB 4 COMPLETE**

Navigate to your zombie survivor chat app and you should see the message from Slack appear. You have configured Slack to send messages to your chat app!
![Slack Command in Chat App](/Images/Slack-Step25.png)

**Bonus Step:**

You've configured Slack to forward messages to your zombie survivor chat app. But can you get messages sent in the chat app to appear in your Slack chat (i.e.: the reverse)? Give it a try or come back and attempt it later when you've finished the rest of the labs! HINT: You'll want to configure Slack's "Incoming Webhooks" integration feature along with a Lambda code configuration change to make POST requests to the Slack Webhook whenever users send messages in the chat app!

* * *

## Lab 5 - Motion Sensor Integration with Intel Edison and Grove

In this section, you'll help protect suvivors from zombies. Zombie motion sensor devices allow communities to determine if zombies (or intruders) are nearby. You'll setup a Lambda function to consume motion sensor events from an IoT device and push the messages into your chat application.

**IoT Integration Architecture**
![Zombie Sensor IoT Integration](/Images/EdisonOverview.png)

If you wish to utilize the Zombie Sensor as a part of the workshop, this guide will walk you through the following:

* Items required to create the physical Zombie sensor (Ignore this step if a zombie sensor is provided as a part of an AWS workshop)
* How to create the AWS backend (Simple Notification Service Topic) for the Zombie Sensor  
* How to install the Node.js device code provided in this workshop onto the device

**Please note that this section requires an IoT device that can emit messages to SNS. If you are setting this up on your own device outside of the workshop, please proceed through the sections below to do that, otherwise skip the device setup instructions as the device has been setup by AWS for you by the workshop instructor.**

**Items Required**

1\. One Intel® Edison and Grove IoT Starter Kit Powered by AWS. This can be purchased [here](http://www.amazon.com/gp/product/B0168KU5FK?*Version*=1&*entries*=0).  
2\. Within this starter kit you will be using the following components for this exercise:  

* Intel® Edison for Arduino  
* Base Shield  
* USB Cable; 480mm-Black x1  
* USB Wall Power Supply x1  
* Grove - PIR Motion Sensor: The application code is a very simple app that publishes a message to an Amazon Simple Notification Service (SNS) topic when motion is detected on the Grove PIR Motion Sensor. For the purpose of a workshop, this should be done only once in a central account by the workshop organizer - the SNS topic will be made public so that participants can subscribe to this topic and make use of it during the workshop.

An example output message from the Intel Edison:

``` {"message":"A Zombie has been detected in London!", "value":"1", "city":"London", "longtitude":"-0.127758", "lattitude":"51.507351"} ```

A simple workflow of this architecture is:

Intel Edison -> SNS topic -> Your AWS Lambda functions subscribed to the topic.

####Creating the AWS Backend

**If you are following this guide during a workshop presented by AWS, please ignore the steps below, 1-3\. An SNS topic should already be configured for the workshop participants to consume messages from. That SNS topic ARN will be provided to you.**

1\. Create the SNS Topic. Navigate to the SNS product page within the AWS Management Console and click **Topics** in the left hand menu. Then click on 'Create New Topic'. You will be presented with the following window. Fill in the fields with your desired values and click create topic.
![Create Topic Screenshot](/Images/MotionSensor-createTopic.png)

2\. You will now need to edit the topic policy to permit any AWS account to subscribe lambda functions to your SNS topic. Select the check box next to your new topic, and then click **Actions -> Edit topic policy**. You need to configure these settings presented as shown the below screenshot. Then click **Update Policy**. This part is what allows others (perhaps teammates working on this lab with you, to consume notifications from your SNS topic.
![Edit Topic Policy Screenshot](/Images/MotionSensor-createTopicPolicy.png)

3\. You now have your central SNS topic configured and ready to use. Ensure that you make a note of the Topic ARN and region where you have created the topic, you will need it in some of the following steps.

####Installing the application on the Intel Edison
**If you are following this guide during a workshop presented by AWS, please ignore this section. An Intel Edison board should already be configured for the workshop particants to consume messages from.**

1\. First, you will need to get your Edison board set up. You can find a getting started guide for this on the Intel site [here](https://software.intel.com/en-us/articles/assemble-intel-edison-on-the-arduino-board). Note that for the purpose of this tutorial, we will be writing our client code for the Edison in Node.js and will therefore be using the Intel® XDK for IoT (referred to as 'XDK' from here on, and which you will need to install) as our IDE.

2\. You will need to physically connect the Grove PIR Motion Sensor to pin D6 on the breakout board.

3\. Download all of the code from the 'zombieIntelEdisonCode' folder in the GitHub repository and store it in a folder locally on your machine. This simply consists of a main.js file (our application) and our package.json (our app dependencies).

4\. Navigate to the homepage in the XDK and start a new project.

5\. Choose to import an existing Node.js project and select the folder where you stored the code from this repository in the previous step.

6\. Give your project a name. We called ours **zombieSensor**.

7\. You now need to edit the code in main.js to include your AWS credentials and the SNS topic that you have created. Firstly, we'll need some AWS credentials.

8\. You will need to create an IAM User with Access and Secret Access Keys for your Edison to publish messages to your SNS topic. There is a guide on how to create IAM Users [here](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html). Your IAM policy for the user should look like the following:

```
{
    "Version": "2012-10-17",
    "Statement": [{
        "Action": [ "sns:Publish" ],
        "Effect": "Allow",
        "Resource": "ENTER YOUR SNS TOPIC ARN HERE"
    }]
}
```

9\. Now let's add your credentials to the client side code. Edit the following line in main.js to include your user access keys and the region where you have set up your SNS topic.

``` AWS.config.update({accessKeyId: 'ENTER ACCESSKEY HERE', secretAccessKey: 'ENTER SECRET ACCESS KEY HERE', region: 'ENTER REGION HERE'}); ```

10\. Edit the following line in main.js to reflect the region in which you created the SNS topic.

``` var sns = new AWS.SNS({region: 'ENTER REGION HERE'}); ```

11\. Edit the following line in main.js to reflect the Amazon Resource Name (ARN) of the SNS topic that you created earlier.

``` TopicArn: "ENTER YOUR SNS TOPIC ARN HERE" ```

12\. You now need to connect the XDK to your Intel Edison device. There is a guide on the Intel site on how to do this [here](https://software.intel.com/en-us/getting-started-with-the-intel-xdk-iot-edition) under the 'Connect to your Intel® IoT Platform' section.

13\. You now need to build the app and push it to your device. First, hit the build/install icon, this looks like a hammer in the XDK. It may take a couple of minutes to install the required packages etc.

14\. Once the app has been built succesfully, you can run the app by pressing the run icon, this looks like a circuit board with a green 'play' sign.

15\. Your app should now be running on the Edison device and your messages being published to the SNS topic. You can consume these messages using AWS Lambda. There is some documentation to get you started [here](http://docs.aws.amazon.com/sns/latest/dg/sns-lambda.html). Continue below to learn how to integrate the SNS notifications into the chat application.

####Consuming the SNS Topic Messages with AWS Lambda

Using the things learned in this workshop, can you develop a Lambda function that alerts survivors in the chat application when zombies are detected from the zombie sensor? In this section you will configure a Lambda function that triggers when messages are sent from the Edison device to the zombie sensor SNS topic. This function will push the messages to the chat application to notify survivors of zombies!

1\. Open up the Lambda console and click **Create a Lambda function**.

2\. On the blueprints screen, click **Skip** as we won't use one.

3\. On the next page (**Configure Triggers**), click the empty field next to the AWS Lambda logo and select SNS as an event source.

![Setup SNS as an Event Trigger for Lambda](/Images/Sensor-Step3.png)

* For the SNS topic selection, either select the SNS topic from the dropdown you created earlier (if you're working on this outside of an AWS workshop) or if you are working in an AWS workshop, insert the shared SNS topic ARN provided to you by the organizer. Make sure the trigger checkbox option is set to enabled so that your Lambda function will immediately begin processing messages. Click **Next**.

* The SNS Topic ARN provided by AWS (if in a workshop) is not in your AWS account and will not display in your dropdown of choices. It is an ARN provided by AWS in a separate account and needs to be typed in.

4\. On the "Configure Function" screen, name your function "[Your CloudFormation Stack Name]-sensor". Now open the **exampleSNSFunction.js** file from the workshop GitHub repository. It is located [here](/zombieSensor/lambda/exampleSNSFunction.js). Copy the entire contents of this JS file into the empty Lambda code editor.

When you've copied the code into the Lambda browser editor, locate the variable **API**. Replace the variable **API.endpoint** with your /zombie/message/post endpoint. It should look like **https://xxxxxxxx.execute-api.us-west-2.amazonaws.com**. This is the "Invoke URL" which you can grab from the Stages page in the API Gateway console. Remember, don't insert anything after the ".com" portion, the function fills in the rest of the resource path for you. You also should insert the region for your API in the **API.region** variable.

5\. For the **Role**, leave the option as **Choose an existing role**. Then in the "Existing Role" dropdown, select the ZombieLabLambdaRole that was created for you by CloudFormation. It should look like "[Your CloudFormation stack name]-ZombieLabLambdaRole".

6\. Set the **Timeout** to **30** seconds. Leave all other options as default on the Lambda creation page and click **Next**.

7\. On the Review page, click **Create function**.

8\. That's it! When your function is created, head on over to your survivor chat application. If your session has expired you may need to login again.

* Almost immediately you should begin seeing zombie sensor messages showing up in the chat application which means your messages are successfully sending from the Intel Edison device to the Zombie Sensor SNS Topic. Any survivors with Lambda functions subscribed to this topic will get notifications in their team's survivor chat service.  

* This Lambda Function takes the zombie sensor message from SNS, parses it, and makes an AWS SigV4 signed HTTPS POST request to your API Gateway message endpoint. That endpoint inserts the record into DynamoDB as a message making it available to the application on subsequent poll requests.

## Workshop Cleanup

1\. To cleanup your environment, it is recommended to first delete these manual resources you created in the labs before deleting your CloudFormation stack, as there may be resource dependencies that stop the Stack from deleting. Follow steps 2-6 before deleting your Stack.

2\. Be sure to delete the TwilioProcessing Lambda Function. Also if you no longer plan to use Twilio, please delete your Twilio free trial account and/or phone numbers that you provisioned.

3\. Be sure to delete the Elasticsearch cluster and the associated Lambda function that you created for the Elasticsearch lab. Also delete the IAM role you created for the Elasicsearch Lambda function, "ZombieLabLambdaDynamoESRole".

4\. Be sure to delete the Lambda function created as a part of the Slack lab and the Slack API resource you created. Also delete Slack if you no longer want an account with them.

5\. Be sure to delete the SNS topic (if you created one) and the Lambda function that you created in the Zombie Sensor lab.

6\. Delete the Cognito User Pool and Identity Pool associated with your application, that you created during lab setup.

* User Pool: Click into your User Pool and click the "Delete pool" button to delete your user pool.

* Identity Pool: Click into the Federated Identities page of Cognito and find your identity pool ([stackname]-identitypool). Then click **Edit identity pool**. Scroll to the bottom and delete the identity pool.

7\. Navigate to CloudWatch Logs and make sure to delete unnecessary Log Groups if they exist.   

8\. Once those resources have been deleted, go to the CloudFormation console and find the Stack that you launched in the beginning of the workshop, select it, and click **Delete Stack**.

* When the stack has been successfully deleted, it should no longer display in the list of Active stacks. If you run into any issues deleting stacks, please notify a workshop instructor or contact [AWS Support](https://console.aws.amazon.com/support/home) for additional assistance.

* * *

## Appendix

* Channel Challenge: Currently all messages sent in the survivor app are saved in the database with a channel of 'default' - all survivors can see these messages. Your challenge is to modify the application so that users have the option to scope their messages to only display to survivors in the same "Camp" (Camp is an attribute that is collected from users when they sign up for a user account). You will need to modify the JS application as well as the backend messages database and Lambda functions to work with this "Camp" attribute instead of the existing 'channel' attribute.
