# Zombie Microservices Workshop: Lab Guide

## All Labs must be performed in us-west-2 (Oregon)

## Overview
The [Zombie Microservices Workshop](http://aws.amazon.com/events/zombie-microservices-roadshow/) introduces the basics of building serverless microservices using [AWS Lambda](http://aws.amazon.com/lambda/), Amazon API Gateway, Amazon DynamoDB, and other AWS services. This workshop has several lab exercises that you can complete to extend the functionality of the base chat app that is provided when you launch the CloudFormation template provided. Each of these labs is an independent section and you may choose to do some or all of them.
*   **Typing Indicator**  
    This exercise already has the UI and backend implemented, and focuses on how to setup the API Gateway to provide a RESTful endpoint.
*   **SMS Integration with Twilio**  
    This exercise wires together Twilio to an existing API Gateway stack. It shows how you can leverage templates in API Gateway to transform form posted data into JSON format for the backend lambda function.
*   **Search over the chat messages**  
    This exercise adds an Elasticsearch cluster, which is used to index chat messages streamed from a DynamoDB table.
*   **Slack Integration**  
    This exercise integrates Slack into the chat application to send messages from Slack.
*   **Intel Edison Zombie Motion Sensor**  
    This exercise integrates motion sensor detection of zombies to the chat system using an Intel Edison board and a Grove PIR Motion Sensor.
*   **Workshop Cleanup**  
    This section points out some instructions to tear down your environment when you're done working on the labs.

* * *

### Let's Begin! Launch the CloudFormation Stack
1\. To begin this workshop, click the 'Deploy to AWS' button below.

[![Launch Zombie Workshop Stack into Oregon with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=ZombieWorkshopStack&templateURL=https://s3-us-west-2.amazonaws.com/reinvent-wrk305-2015/CreateZombieWorkshop.json)

2\. On the "Specify Details" page, your Stack is prepopulated with the name "ZombieWorkshopStack".

3\. For the parameter section, if you want to develop with a team and would like to create IAM Users in your account to grant them access, then specify how many teammates/users you want to be created in the **NumberOfTeammates** box. Otherwise, leave it defaulted to 0 and no additional users will be created. Click **Next**.

*If you create IAM users, an IAM group will also be created and those users will be added to that group. On deletion of the stack, those resources will be deleted for you.*

4\. On the "Options" page, leave the defaults and click **Next**.

5\. On the "Review" page, verify your selections, then scroll to the bottom and acknowledge that your Stack will launch IAM resources for you. Then click **Create** to launch your stack.

6\. Your stack will take about 3 minutes to launch and you can track its progress in the "Events" tab. When it is done creating, the status will change to "CREATE_COMPLETE".

7\. Click the "Outputs" tab and click the link for "MyChatRoomURL". This should open your chat application in a new tab.

8\. In your chat application, type your name (or a fun username!) in the "User Name" field, then begin typing messages in the textbox at the bottom of the screen where it displays "Enter a message and save humanity".

9\. Your messages should begin showing up in the central chat pane window. Feel free to share the URL with your teammates, have them login and begin chatting as a group! If building this solution solo, you can logout and log back in with a different User Name to simulate multiple users.

**The baseline chat application is now configured and working! There is still important functionality missing and the Lambda Signal Corps needs you to build it out...so get started below!**

## Lab 1 - Typing Indicator

The typing indicator shows up in the web chat client. It's a section above the post message input that shows when other survivors are typing. The UI and backend Lambda functions have been implemented, and this lab focuses on how to enable the feature in API Gateway.

The application uses [CORS](http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html). This lab will both wire up the backend Lambda function as well as perform the necessary steps to enable CORS.

**Typing Indicator Architecture**
![Overview of Typing Indicator Architecture](/Images/TypingIndicatorOverview.png)

1\. Select the API Gateway Service from the main console page
![API Gateway in Management Console](/Images/Typing-Step1.png)

2\. Select the Zombie Workshop API Gateway

3\. Go into the /zombie/talkers/GET method flow
![GET Method](/Images/Typing-Step3.png)

4\. Select the Integration Request component in the flow

5\. Under Integration Type, Select Lambda Function

6\. Select the us-west-2 region

7\. Select the **_[CloudformationTemplateName]_**-GetTalkersFromDynamoDB-**_[XXXXXXXXXX]_** Function

8\. Select Save and Grant access for API Gateway to invoke the Lambda function.

9\. Click the Method Response section of the Method Execution Flow

10\. Add a 200 HTTP Status response. Click "Add Response", type "200" in the status code text box and then click the little checkmark to save the method response, as shown below.
![Method Response](/Images/Typing-Step10.png)

11\. Go to the /zombie/talkers/POST method by clicking the "POST" option in the resource tree on the left navigation pane.
![POST Method](/Images/Typing-Step11.png)

12\. Perform Steps 4-10 again as you did for the GET method , but instead, select the **_[CloudformationTemplateName]_**-WriteTalkersToDynamoDB-**_[XXXXXXXXXX]_** Lambda Function for the Integration Request Lambda function.

13\. Go to the /zombie/talkers/OPTIONS method

14\. Select the Method Response

15\. Add a 200 method response. Click "Add Response", type "200" in the status code text box and then click the little checkmark to save the method response.

16\. Go back to the OPTIONS method flow and select the Integration Response

17\. Select the Integration Response

18\. Add a new Integration response with a method response status of 200. Click the "Method response status" dropdown and select "200". (leaving the regex box blank). Click "Save".

19\. Select the /zombie/talkers resource on the left navigation tree.
![talker resource](/Images/Typing-Step19.png)

20\. Click the "Actions" box and select "Enable CORS" in the dropdown.

21\. Select Enable and Yes to replace the existing values. You should see all green checkmarks for the CORS options that were enabled, as shown below.
![talker resource](/Images/Typing-Step21.png)

22\. Click the "Actions" box and select Deploy API  
![talker resource](/Images/Typing-Step22.png)

23\. Select the ZombieWorkshopStage deployment and hit the Deploy button. The typing indicator should now show when survivors are typing.  
![talker resource](/Images/Typing-Done.png)

As you type, POST requests are being made to the Talkers DynamoDB table to continuously update the table with timestamps for who is typing. Continuous polling (GET Requests) on that table also occurs to check which survivors are typing, which updates the "Users Typing" field in the web app.

* * *

## Lab 2 - SMS Integration with Twilio

In this section, you’ll wire together Twilio with an existing API Gateway endpoint created in the CloudFormation stack to bring SMS texting functionality into the Zombie Chat application.

**SMS Twilio Integration Architecture**
![Overview of Twilio Integration](/Images/TwilioOverview.png)

1\. Sign up for a free trial Twilio account at https://www.twilio.com/try-twilio.

2\. Once you have created your account, login to the Twilio console and navigate to the Home icon on the left navigation pane. On the Home screen/console dashboard, scroll down to the **Phone Numbers** section and click "Phone Numbers".
![Manage Twilio Phone Number](/Images/Twilio-Step2.png)

3\. On the Phone Numbers screen, click "Get Started" to assign a phone number to your account. Then click the red "Get your first Twilio phone number" button. We’re going to generate a 10-digit phone number in this lab, but a short-code would also work if preferred. This number should be enabled for voice and messaging by default. A popup will appear with your new phone number, click "Choose this number". **These are US phone numbers. You can provision an international phone number if doing this workshop outside the U.S. Twilio terms and conditions and pricing applies. Please see their website for those details.

4\. Once you’ve received a phone number, click the **Manage Numbers** button on the left navigation pane. Click on your phone number, which will take you to the properties page for that number.

5\. Scroll to the bottom of the properties page, to the messaging section. In the **Configure With** dropdown, select the **Webhooks/TwiML** option.

6\. Now you’ll retrieve your **/twilio** API endpoint from API Gateway and provide it to Twilio to hook up to AWS. Open the AWS Management console in a new tab, and navigate to API Gateway, as illustrated below. Be sure to leave the Twilio tab open as you’ll need it again to finish setup.
![API Gateway in Management Console](/Images/Twilio-Step6.png)

7\. In the API Gateway console, select your API, **Zombie Workshop API Gateway**. On the left navigation tree, click "Stages".
![API Gateway Resources Page](/Images/Twilio-Step7.png)

8\. With "Stages" selected, expand the "Zombie Workshop Stage" by clicking the blue arrow, and select the **POST** method for the **/zombie/twilio** resource. The twilio resource is the endpoint that CloudFormation created for SMS messages from your Twilio phone number. You should see an **Invoke URL** displayed for your **/zombie/twilio** resource, as shown below.
![API Gateway Invoke URL](/Images/Twilio-Step8.png)

9\. Copy the Invoke URL and return to the Twilio website. On the Twilio page you left open, paste the Invoke URL you copied from API Gateway into the textbox next to label **A message comes in**. Ensure that the request type is set to **HTTP POST**. This is illustrated below.
![Twilio Request URL](/Images/Twilio-Step9.png)

10\. Click **Save** to finalize the setup connecting Twilio to your /twilio URL.

11\. You will now create the Lambda Function that processes your incoming Twilio messages, parses them, and pushes them to the "/messages" Chat Service. To begin, navigate to the Lambda console.

12\. Click **Create a Lambda function** and select **Skip** on the blueprint screen as we will be creating a brand new function.

13\. Create a name for the function, such as "TwilioProcessing". Leave the "Runtime" as **Node.js**. From the GitHub repo, open the **TwilioProcessing.js** file. Copy the entire contents from this file into the Lambda code entry section. Once you have copied the code into Lambda, scroll down to the section in the code where the "host" variable is declared. It should show a value of "INSERT YOUR API GATEWAY URL HERE EXCLUDING THE HTTPS://". Please replace this string with the URL of your **/message** POST method. Please be sure to remove the "https://" portion of the URL and the end of the URL "/ZombieWorkshopStage/zombie/message". Your final URL inputted into the code should look something like "xxxxxxxx.execute-api.us-west-2.amazonaws.com".

14\. After you have copied the code into the Lambda inline code console and modifed the POST URL, scroll down to the **Lambda function handler and role** section. For the role, select **Basic execution role** from the dropdown and click "Allow" on the popup window to confirm the creation of the role. For this Lambda function we do not need any IAM permissions to other AWS services.

15\. Keep all the rest of the defaults set and click **Next** and then **Create function** on the Review page to create your Lambda function. You have just created a Lambda function that accepts the querystring params from the incoming API Gateway /twilio endpoint, converts the parameters to the correct format for our Chat Service including a conversion to JSON format, and finally makes an HTTPS POST request to the /messages Chat Service endpoint.

16\. Now that you have created the TwilioProcessing function, you need to connect it to the **POST** method for your /twilio endpoint. Navigate back to the API Gateway console and select **POST** under the **/twilio** endpoint.

17\. On the **Method Execution** screen for the "POST" method, the "Integration Request" box should show a type of **MOCK** for your /twilio resource.

18\. You will now change the **Integration Request** so that instead of integrating with a Mock integration, it will integrate with your TwilioProcessing function. Click **Integration Request**. On the Integration Request screen, change the "Integration type" radio button to **Lambda Function**. In the "Lambda Region" dropdown, select **us-west-2** which is the Region where your Lambda function resides. For the **Lambda Function**, begin typing "TwilioProcessing" and the autofill should display your function. Select **TwilioProcessing** from the autofill. Click **Save**.

19\. After clicking **Save**, you will be brought back to the Method Execution page for your "POST" method. Return back to the **Integration Request** screen so that you can configure a Mapping Template. To do this, click **Integration Request** in the Method Execution screen.

20\. Twilio sends data from their API with a content-type of "application/x-www-form-urlencoded", but Lambda requires the content-type to be "application/json". You will configure a Mapping Template so that API Gateway converts the content type of incoming messages into JSON before executing your backend Lambda TwilioProcessing function.

21\. On the Integration Request screen for your /twilio POST method, expand the **Body Mapping Templates** section and click **Add mapping template**. In the textbox for "Content-Type", input **application/x-www-form-urlencoded** and click the little checkmark button to continue. Once you have clicked the little checkbox, a new section will appear on the right side of the screen with a dropdown for **Generate Template**. Click that dropdown and select **Method Request Passthrough**.

22\. A "Template" text editor window will appear. In this section you will input a piece of VTL transformation logic to convert the incoming Twilio data to a JSON object. In this text editor, **delete all of the pre-filled content** and copy the following code into the editor.

```{"postBody" : "$input.path('$')"}```

After copying the code into the editor, click the "Save" button. You have now setup the POST method to convert the incoming data to JSON anytime a POST request is made to your /twilio endpoint with a Content-Type of "application/x-www-form-urlencoded". This should look like the screenshot below:
![Twilio Integration Request Mapping Template](/Images/Twilio-Step22.png)

23\. Now that you have configured the Integration Request to transform incoming messages into JSON, we need to configure the Integration Response to transform outgoing responses into XML since the Twilio API requires XML as a response Content-Type. This step is required so that when you send SMS messages to the Chat Service, it can respond back to your Twilio Phone Number with a confirmation message that you successfully sent SMS to the Survivor Chat Service.

24\. Head back to the Method Execution screen for the twilio POST method. On the "Method Execution" screen for your /twilio POST method, click **Integration Response**. On the "Integration Response" screen, click the black arrow. Expand the **Body Mapping Templates** section. You should see a Content-Type of "application/json". We need a Content-Type of XML, not JSON, so **delete this Content-Type by clicking the little black minus icon** and click **Delete** on the pop-up window.

25\. Click **Add mapping template** similar to the way you did this in the earlier steps for the Integration Request section.

26\. In the "Content-Type" text box, insert **application/xml** and click the little black checkmark to continue. Similar to the steps done earlier, we are going to copy VTL mapping logic to convert the response data to XML from JSON. This will result in your /twilio POST method responding to requests with XML format. After you have created the new content-type, a new section will appear on the right side of the screen with a dropdown for **Generate Template**. Click that dropdown and select **Method Request Passthrough**.
In the text editor, delete all the code already in there and copy the following into the editor:

``` #set($inputRoot = $input.path('$'))<?xml version="1.0" encoding="UTF-8"?><Response><Message><Body>$inputRoot</Body></Message></Response> ```

Click the grey "Save" button to continue.

The result should look like the screenshot below:
![Twilio Integration Response Mapping Template](/Images/Twilio-Step26.png)

27\. Then scroll up and click the blue **Save** button on the screen. Finally click the **Actions** button on the left side of the API Gateway console and choose **Deploy API** to deploy your API. In the Deploy API window, select **ZombieWorkshopStage** from the dropdown and click **Deploy**.

28\. You are now ready to test out Twilio integration with your API. Send a text message to your Twilio phone number, you should receive a confirmation response text message and the message you sent should display in the web app chat room as coming from your Twilio Phone Number. You have successfully integrated Twilio text message functionality with API Gateway.

* * *

## Lab 3 - Search over the chat messages with Elasticsearch Service

In this section you'll configure an Elasticsearch Service domain to index chat messages in real-time from DynamoDB.

**Elasticsearch Service Architecture**
![Overview of Elasticsearch Service Integration](/Images/ElasticsearchServiceOverview.png)

1\. Select the Amazon Elasticsearch icon from the main console page.

2\. Create a new Amazon Elasticsearch domain. Provide it a name such as "zombiemessages". Click **Next**.

3\. On the **Configure Cluster** page, leave the default cluster settings and click **Next**.

4\. For the access policy, select the **Allow or deny access to one or more AWS accounts or IAM users** option in the dropdown and fill in your account ID. Make sure **Allow** is selected for the "Effect" dropdown option. Click **OK**.

5\. Select **Next** to go to the domain review page.

6\. On the Review page, select **Confirm and create** to create your Elasticsearch cluster.

7\. The creation of the Elasticsearch cluster takes approximately 10 minutes.

8\. Take note of the Endpoint once the cluster starts, we'll need that for the Lambda function.
![API Gateway Invoke URL](/Images/Search-Step8.png)

9\. Go into the Lambda service page by clicking on Lambda in the Management Console.

10\. Select **Create a Lambda Function**.

11\. Skip the Blueprint section by selecting the Skip button in the bottom right.

12\. Fill in "ZombieWorkshopSearchIndexing" as the Name of the function. Keep the runtime as Node.js. You can set a description for the function if you'd like.

13\. Paste in the code from the ZombieWorkshopSearchIndexing.js file provided to you.

14\. On [line 7](https://github.com/awslabs/aws-lambda-zombie-workshop/blob/master/ElasticSearchLambda/ZombieWorkshopSearchIndexing.js#L7) in the code provided, replace ENDPOINT_HERE with the Elasticsearch endpoint created in step 8\. Make sure it starts with https:// 

15\. Under the Role, create a new DynamoDB event stream role. When a new page opens confirming that you want to create a role, just click **Allow** to proceed.

16\. In the "Timeout" field, change the function timeout to **1** minute. This ensure Lambda can process the batch of messages before Lambda times out. Keep all the other defaults on the page set as is. Select **Next** and then on the Review page, select **Create function** to create your Lambda function.

17\. Select the "Event Sources" tab for the new ZombieWorkshopSearchIndexing function.

18\. Select **Add event source**

19\. Select the DynamoDB Event source type and the **messages** DynamoDB table. You can leave the rest as the defaults.

20\. After creation, you should see an event source that is similar to the screenshot below:  
![API Gateway Invoke URL](/Images/Search-Step20.png)

21\. In the above step, we configured [DynamoDB Streams](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) to capture incoming messages on the table and trigger a Lambda function to push them to our Elasticsearch cluster.

22\. The "lambda_dynamo_streams" role that you selected for your Lambda function earlier does not currently have permissions to write to your Elasticsearch cluster. We will configure that now.

23\. Navigate to **Identity and Access Management (IAM)** in the AWS Management Console. The icon for this service is green and is listed under the "Security & Identity" section.

24\. In the Identity and Access Management console, select the link for **Roles**. [IAM Roles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), similar to users, have permissions that you associate with them, which allows you to define what access can be granted to various entities. Roles can be assumed by EC2 Instances, Lambda Functions, and other applications and services.

25\. In the "Filter" textbox on the Roles screen, type in **lambda_dynamo_streams** and click on the role. This is the role you assigned to your ZombieWorkshopSearchIndexing function earlier.

26\. Scroll to the "Inline Policies" section where you will find a policy similar to "oneClick_lambda_dynamo_streams_xxxxxxxxxx". Click **Edit Policy** to edit the policy. Delete all the contents of the Inline Policy, and replace it with the policy block below:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:DescribeStream",
                "dynamodb:ListStreams",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "es:*"
            ],
            "Resource": "*"
        }
    ]
}
```
27\. This new policy you have copied over includes a new Allow action, ```es:*``` which allows the role all actions on the Amazon Elasticsearch Service. Click the **Validate Policy** button and ensure that AWS returns a successful message "The Policy is valid". Then select **Apply Policy** to save it.

28\. Now with the IAM permissions in place, your messages posted in the chat from this point forward will be indexed to Elasticsearch. Post a few messages in the chat. You should be able to see that messages are being indexed in the "Indices" section for your cluster in the Elasticsearch Service console.
![API Gateway Invoke URL](/Images/Search-Done.png)

* * *

## Lab 4 - Slack Integration

In this section, you'll create a slack group and wire it up to the Chat Service. Survivors comminicating on Slack can send messages to survivors in the Zombie Chat App.

**Slack Integration Architecture**
![Overview of Slack Integration](/Images/SlackOverview.png)

1\. Go to [http://www.slack.com](http://www.slack.com) and create a username, as well as a team.

2\. Once logged into Slack, navigate to [https://slack.com/apps](https://slack.com/apps) and click **Build your own** near the top of the page. Then on the next screen, select **Make a Custom Integration**.

3\. On the "Custom Integration" page, select **Slash Commands** to create a Slack Command. Slash commands allow you to define a command that will inform Slack to forward your message to an external source with a webhook. In this case you'll configure your Slash Command to make a POST request to an external URL (the URL for your API Gateway endpoint).

4\. On the Slash Commands page, define a command in the **Commands** text box. Insert **/survivors** as your Slash Command. Then select "Add Slash Command Integration" to save it.

5\. On the Integration Settings page, make sure the **Method** section has "POST" selected from the dropdown options. Then scroll to the **Token** section and copy the Token (or generate a new one) to a text file as you'll need it in the following steps.

6\. Keep the Slack browser tab open and in another tab navigate to the Lambda service in the AWS Management Console.

7\. Click **Create a Lambda function**. You'll create a Lambda function to parse incoming Slack messages and send them to the Chat Service.

8\. Skip past the blueprints page as we will not be using one.

9\. Name the function **SlackService**. Now navigate to the GitHub repo for this workshop, or the location where you downloaded the GitHub files to your local machine.

10\. Open the **SlackService.js** file from the GitHub repo, found in the slack folder. Copy the entire contents of this js file into the Lambda inline edit window.

11\. Input the Slack Token string that you copied earlier into the function. You should copy the Token string from Slack into the "token" variable in the Lambda function, replacing the string **INSERT YOUR TOKEN FROM SLACK HERE** with your own token.

12\. In the "post_options" host variable, you will insert the URL to your Chat Service (/zombie/message) API Gateway resource so that the HTTPS requests can be sent with the messages from Slack. It should show a value of "INSERT YOUR API GATEWAY URL HERE EXCLUDING THE HTTPS://" for the **host** variable. Replace this string with the URL of your **/message POST method**. Please be sure to remove the "https://" portion of the URL and the end of the URL "/ZombieWorkshopStage/zombie/message". Your final URL inputted into the code should look something like "xxxxxxxx.execute-api.us-west-2.amazonaws.com". Your code is now configured to check if the token sent with the request matches the token for your Slack integration. If so, it parses the data and makes an HTTPS request to your **/message** endpoint with the message from Slack.

13\. Scroll down to the Role dropdown and select **Basic execution role**. On the verification window that appears to confirm the role, click **Allow**. This Lambda function will not interact with any AWS services. It does emit event data to CloudWatch Logs but that permission is provided by default with the basic execution role.

14\. Click **Next**.

15\. On the review page, make sure that everything looks correct.

16\. Click **Create function**. Your Lambda function will be created.

17\. When the function is created, navigate to the API Gateway service in the AWS Management Console. Click into your "Zombie Workshop API Gateway" API. On the left Resources pane, click/highlight the "/zombie" resource so that it is selected. Then select the **Actions** button and choose "Create Resource". For Resource Name, insert **slack** and for Resource Path, insert **slack**. The final resource for your Slack API should be as shown below.
![Create Slack API Resource](/Images/Slack-Step17.png)

18\. Click "Create Resource" to create your slack API resource. For your newly created "/slack" resource, highlight it, then click **Actions** and select **Create Method** to create the POST method for the slack resource. In the dropdown, select POST. Click the checkmark to create the POST method. On the Setup page, choose an Integration Type of **Lambda Function**, select "us-west-2" for the region dropdown, and type "SlackService" for the name of the Lambda Function. It should autofill your function name. Click **Save** and then **OK** to confirm.

19\. Click **Integration Request** for the /slack POST method. We'll create a Mapping Template to convert the incoming query string parameters from Slack into JSON which is the format Lambda requires for parameters. This mapping template is required so that the incoming Slack message can be converted to the right format.

20\. Expand the **Body Mapping Templates** arrow and click **Add mapping template**. In the Content-Type box, enter **application/x-www-form-urlencoded** and click the little checkmark to continue. As you did in the Twilio lab, we're going to copy VTL mapping logic to convert the request to JSON. A new section will appear on the right side of the screen with a dropdown for **Generate Template**. Click that dropdown and select **Method Request Passthrough**.

In the text editor, delete all of the exiting VTL code and copy the following into the editor:

```
{"body": $input.json("$")}
```

Click the grey **Save** button to continue. The result should look like the screenshot below:
![Slack Integration Response Mapping Template](/Images/Slack-Step20.png)

21\. Click the **Actions** button on the left side of the API Gateway console and select **Deploy API** to deploy your API. In the Deploy API window, select **ZombieWorkshopStage** from the dropdown and click **Deploy**.

22\. On the left pane navigation tree, expand the ZombieWorkshopStage tree. Click the **POST** method for the **/zombie/slack** resource. You should see an Invoke URL appear for that resource as shown below.
![Slack Resource Invoke URL](/Images/Slack-Step22.png)

23\. Copy the entire Invoke URL. Navigate back to the Slack.com website to the Slash Command setup page and insert the Slack API Gateway Invoke URL you just copied into the "URL" textbox. Make sure to copy the entire url including "HTTPS://". Scroll to the bottom of the Slash Command screen and click **Save Integration**.

24\. You're ready to test out the Slash Command integration. In the team chat for your Slack account, type the Slash Command "/survivors" followed by a message. For example, type "/survivors Please help me I am stuck and zombies are trying to get me!". After sending it, you should get a confirmation response message from Slack Bot like the one below:
![Slack Command Success](/Images/Slack-Step24.png)

Navigate to your zombie survivor chat app and you should see the message from Slack appear. You have configured Slack to send messages to your chat app!
![Slack Command in Chat App](/Images/Slack-Step25.png)

**Bonus:** You've configured Slack to forward messages to your zombie survivor chat app. But can you get messages sent in the chat app to appear in your Slack chat (i.e.: the reverse)? Give it a try or come back and attempt it later when you've finished the rest of the labs! HINT: You'll want to configure Slack's "Incoming Webhooks" integration feature along with a Lambda code configuration change to make POST requests to the Slack Webhook whenever users send messages in the chat app!
* * *

## Lab 5 - Motion Sensor Integration with Intel Edison and Grove

In this section, you'll consume motion sensor events from an IoT device and push them into your chat application.

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

1\. Open up the Lambda console and create a new Lambda function.

2\. On the blueprints screen, search for "sns" in the blueprints search box. Select the blueprint titled **sns-message**, which is a Nodejs function.

3\. On the next page, leave the event source type as "SNS". For the SNS topic selection, either select the SNS topic you created earlier (if you're working on this outside of a workshop) or if you are working in an AWS workshop, insert the shared SNS topic ARN provided to you by the AWS organizer. Click **Next**.

4\. On the "Configure Function" screen, name your function "ZombieSensorData".

5\. For the **Role**, select the "basic execution role" option. On the pop-up page asking you to confirm the creation of that role, click **Allow** through that. This role simply allows you to push events to CloudWatch Logs from Lambda.

6\. Leave all other options as default on the Lambda creation page and click **Next**.

7\. On the Review page, select the "Enable Now" radio button under **Enable event source**. This will enable your Lambda function to immediately begin consuming messages. Finally, click **Create function**.

8\. Once the function is created, on the overview page for your Lambda function, select the **Monitoring** tab and then on the right side select **View logs in CloudWatch**.

9\. You should now be on the CloudWatch Logs console page looking at the log streams for your Lambda function.

10\. As data is sent to the SNS topic, it will trigger your function to consume the messages. The blueprint you used simply logs the message data to CloudWatch Logs. Verify that events are showing up in your CloudWatch Logs stream with Zombie Sensor messages from the Intel Edison. On the **Monitoring** tab for the function (as you did in Step 8), click the link **View logs in CloudWatch**. When you have confirmed that messages from Intel are showing up, now you need to get those alerts into the Chat application for survivors to see!

**HINT:** You'll want to edit your Lambda function to communicate with the **/messages** endpoint in API Gateway, which sends the messages to the **Messages** DynamoDB table so that the chat room can see the alerts when Zombies are detected. Modify your Lambda function to finish this section using the skills you've learned so far with Lambda!

**If you are unable to complete this section and would like the solution with the complete Lambda function to finish this section, please continue reading**.

**Solution with Code**

11\. To finish this section with our pre-built solution, open the **exampleSNSFunction.js** file from the workshop GitHub repository. Copy the entire contents of this JS file and overwrite your existing Lambda Function with this code.

12\. In the code, modify the "host" variable under "post_options". Replace the string "INSERT YOUR API GATEWAY URL HERE" with your own URL for the **/messages** endpoint for the **POST** method. This is the "Invoke URL" which you can grab from the Stages page in the API Gateway console. It should look like **xxxxxxxx.execute-api.us-west-2.amazonaws.com**. Remember, don't input the "https://" portion of the URL, or anything after the ".com" portion.

13\. Once you have overwritten your old code with the code provided by AWS, click the **Save** button to save your modified Lambda function. Almost immediately you should begin seeing zombie sensor messages showing up in the chat application which means your messages are successfully sending from the Intel Edison device to AWS, and into your chat application. This Lambda Function takes the zombie sensor message, parses it, and sends it to your chat application with an HTTPS POST request to your **/messages** endpoint. Congrats!

## Workshop Cleanup

1\. To cleanup your environment, you can click "Delete Stack" to delete all the components that were launched as a part of the lab. However, the components that you manually launched in the above labs after the stack was created need to be deleted manually.

2\. Be sure to delete the TwilioProcessing Lambda Function. Also if you no longer plan to use Twilio, please delete your Twilio free trial account and/or phone numbers that you provisioned.

3\. Be sure to delete the Elasticsearch cluster and the associated Lambda function that you created for the Elasticsearch lab.

4\. Be sure to delete the Lambda function created as a part of the Slack lab and the Slack API resource you created. Also delete Slack if you no longer want an account.

5\. Be sure to delete the SNS topic (if you created one) and the Lambda function that you created in the Zombie Sensor lab.

6\. Navigate to CloudWatch Logs and make sure to delete unnecessary Log Groups if they exist.   

7\. Once those resources have been deleted, go to the CloudFormation console and find the Stack that you launched in the beginning of the workshop, select it, and click **Delete Stack**. When the stack has been successfully deleted, it should no longer display in the list of Active stacks. If you run into any issues deleting stacks, please notify a workshop instructor or contact [AWS Support](https://console.aws.amazon.com/support/home) for additional assistance.

* * *
