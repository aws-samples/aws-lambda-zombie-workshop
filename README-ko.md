# Zombie Microservices Workshop: 실습 가이드

## 개요
[Zombie Microservices Workshop](http://aws.amazon.com/events/zombie-microservices-roadshow/)은 [AWS Lambda](http://aws.amazon.com/lambda/), Amazon Cognito, Amazon API Gateway, Amazon DynamoDB와 기타 AWS 서비스를 기반으로 서버 없는(Serverless) 애플리케이션을 구축해 보는 실습 행사입니다.

본 워크샵에서는 전 세계적인 좀비 확산 사태가 발생할 경우, AWS Lambda 생존자 구출 특공대의 일원으로서 생존자간 소통을 위한 시스템을 구축하는 업무를 완료하게 됩니다.

기본 생존자 채팅앱은 [AWS CloudFormation](https://aws.amazon.com/cloudformation/) 템플릿으로 바로 구성할 수 있으며, 각 실습 코스를 완료하게 되면 채팅 앱의 다양한 기능을 확장할 수 있습니다. 

본 실습을 진행하기 전에 [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) 설정을 진행해야 합니다. 본 가이드를 통해 진행하시면 완료하실 수 있습니다.

### 필수: Cognito User Pools 인증 설정
본 실습을 진행하려면, Amazon Cognito User Pools를 사용하여 서버리스 생존자 채팅 애플리케이션에 사용자 인증을 통합할 수 있습니다.

### 실습 소개
각 실습 코스는 독립적으로 구성되어 있기 때문에 골라서 하거나, 전부 다 하실 수도 있습니다. 

* **Lab 1: 생존자 채팅 기능**  

   실습은 이미 UI 및 백엔드가 구성되어 있고 어떻게 API Gateway를 실습하고 RESTful 엔드 포인트를 제공하는지에 초점을 맞추고 있습니다. 전 세계 글로벌 감염 상태에서 생존자 간의 채팅 기능을 기본적으로 제공합니다. 

* **Lab 2: Twilio 기반 SMS 연동**  

    본 실습은 [Twilio](http://twilio.com)를 통해 기존 API Gateway 스택과 연결합니다. 무료로 Twilio 전화 번호를 설정하고, SMS를 채팅 앱에 보낼 수 있습니다. API Gateway로 JSON 포맷으로 받은 POST 데이터를 어떻게 AWS Lambda 함수로 연결하는지 알 수 있습니다.

* **Lab 3: Elasticsearch 서비스 기반 채팅 메시지 검색**  

    본 실습은 Elasticsearch 클러스터를 이용하여 채팅 메시지를 DynamoDB 테이블에 저장하고, 스트리밍 데이터를 통해 검색 인덱싱을 합니다. 

* **Lab 4: Slack 연동**  

    본 실습은 인기가 높은 메시징 앱인 [Slack](http://slack.com)의 Webhook 기능을 통해 슬랙 대화방과 채팅 앱을 연동하여 메시지를 교환하는 기능을 구현할 수 있습니다.

* **Lab 5: Intel Edison 좀비 모션 센서 연동** (IoT device 필요)

    본 실습은 인텔 에디슨 보드와 Grove PIR 모션 센서를 통해 좀비를 감지하는 부분을 통합합니다. 좀비가 감지되면, Lambda 함수를 통해 채팅방으로 전달하는 기능입니다.

### 실습 종료

본 실습에 사용했던 환경을 한꺼번에 삭제할 수 있습니다.

* * *

### 시작하기 - CloudFromation 스택 이용하기
*스택을 구성하기 전에, 실습 후 몇 가지 리소스는 수동으로 삭제해야 함을 기억하시기 바랍니다. 워크샵이 끝나면, 실습 종료 영역을 보셔서 수동 삭제를 해야 하는 부분을 참고하시기 바랍니다.*   

1\. 워크샵을 시작하려면, **아래에서 여러분이 원하는 리전에서 'Deploy to AWS'버튼을 클릭하시면 됩니다.**. 실습을 하기 위한 다양한 서비스를 자동으로 원하는 리전에 설치하게 됩니다. CloudFormation 템플릿을 통하면, 손쉽게 클라우드 자원을 만들고 없앨 수 있습니다.

리전 | 템플릿
------------ | -------------
**N. Virginia** (us-east-1) | [![Launch Zombie Workshop Stack into Virginia with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=zombiestack&templateURL=https://s3.amazonaws.com/aws-zombie-workshop-us-east-1/CreateZombieWorkshop.json)
**Oregon** (us-west-2) | [![Launch Zombie Workshop Stack into Oregon with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=zombiestack&templateURL=https://s3-us-west-2.amazonaws.com/aws-zombie-workshop-us-west-2/CreateZombieWorkshop.json)
**Ireland** (eu-west-1) | [![Launch Zombie Workshop Stack into Ireland with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-eu-west-1.amazonaws.com/aws-zombie-workshop-eu-west-1/CreateZombieWorkshop.json)
**Frankfurt** (eu-central-1) | [![Launch Zombie Workshop Stack into Frankfurt with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-eu-central-1.amazonaws.com/aws-zombie-workshop-eu-central-1/CreateZombieWorkshop.json)
**Tokyo** (ap-northeast-1) | [![Launch Zombie Workshop Stack into Tokyo with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-northeast-1.amazonaws.com/aws-zombie-workshop-ap-northeast-1/CreateZombieWorkshop.json)
**Seoul** (ap-northeast-2) | [![Launch Zombie Workshop Stack into Seoul with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-northeast-2.amazonaws.com/aws-zombie-workshop-ap-northeast-2/CreateZombieWorkshop.json)
**Singapore** (ap-southeast-1) | [![Launch Zombie Workshop Stack into Singapore with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-southeast-1.amazonaws.com/aws-zombie-workshop-ap-southeast-1/CreateZombieWorkshop.json)
**Sydney** (ap-southeast-2) | [![Launch Zombie Workshop Stack into Sydney with CloudFormation](/Images/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=zombiestack&templateURL=https://s3-ap-southeast-2.amazonaws.com/aws-zombie-workshop-ap-southeast-2/CreateZombieWorkshop.json)

*만약 CloudFormation이 실패하면, us-east-1 (Virginia)를 통해 진행해 보시기 바랍니다.*

2\. 선택한 리전에서 AWS CloudFormation 콘솔로 들어오시면, "Select Template"이라는 화면에서 파란색 **Next** 버튼을 클릭합니다.

3\. 다음 화면에서 "Specify Details" 부분에 "zombiestack"이라는 이름이 있는데, **15자 미만으로** 원하는 대로 바꿀 수 있습니다. 파라미터 부분에서 팀으로 진행하시려면, 팀원이 접근 가능한 IAM User를 만들어서 선택하고, **NumberOfTeammates** 에 접근 하려는 팀원 숫자를 적습니다. 만약 혼자 하실려면, 기본 값인 0을 그대로 두시면 되며,  **Next** 버튼을 누르시면 됩니다.

*IAM 사용자를 만들면, IAM 그룹 역시 만들어지며, 사용자는 그룹에 추가됩니다. 나중에 전체 스택을 삭제할 때, 리소스도 함께 삭제됩니다.*

4\. "Options" 페이지에서 기본 값을 그대로 두고 **Next**를 클릭합니다.

5\. "Review" 페이지에서, 선택 사항을 확인하고 맨 아래까지 스크롤을 내린 후 **Create**를 눌러 스택 및 클라우드 실습 자원을 시작합니다.

6\. 전체 스택이 만들어지는데는 약 3분 정도의 시간이 소요되며, "Events" 탭에서 진행 사항을 보실 수 있고, 완료되면 상태 메시지가 "CREATE_COMPLETE"으로 변경됩니다.

7\. 완료 된 후, "Outputs" 탭을 눌러보면, "MyChatRoomURL"의 링크를 새 탭으로 열어보면, 채팅 앱을 실행 할 수 있습니다.

이제 아래 Congnito User Pools 설정을 진행합니다.

## Cognito User Pools 인증 설정 (필수)

생존자 채팅은 [Amazon Cognito](https://aws.amazon.com/cognito/) 인증을 사용하며, 이를 통해 사용자들이 외부 소셜 로그인 인증을 한 후, 부여 받은 임시 보안 토큰을 통해 Amazon API Gateway나 AWS 자원 안쪽의 백엔드 애플리케이션에 접근할 수 있습니다. Amazon Cognito는 SAML이나 OpenID를 통해 외부 인증 공급자와 연동도 가능하고, Facebook, Twitter, Amazon 같은 소셜 로그인 공급자와 연동할 수 있습니다.

서드 파티 인증 뿐만 아니라 [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) 이라는 새로운 사용자 디렉토리 서비스도 제공하고 있습니다.

CloudFromation 만들 때, 이미 Cognito 통합 인증 서비스를 생성하였습니다.

이제는 Cognito User Pool을 통해 생존자 채팅앱의 사용자 목록을 관리하고, 이를 사용자 인증에 사용 하려고 합니다. API Gateway는 IAM 인증으로 접근할 수 있도록 되어 있으며, 사용자가 생존자 채팅앱에 로그인을 하면 Cognito 사용자 인증 서비스를 통해 단기 AWS 보안 토큰을 받아 인증을 하게 됩니다. 이러한 보안 토큰은 [AWS SigV4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)로 서명되어 메시지 API로 HTTPS 요청에 사용합니다.

![Overview of Cognito Authentication](/Images/CognitoOverview.png)

**시작하기.**

1\. Cognito 서비스 콘솔로 들어갑니다.

![Navigate to the Cognito service](/Images/Cognito-Step1.png)

Cognito User Pools은 모든 리전에서 제공되지 않습니다. 만약  **us-east-1 (Virginia), us-west-2 (Oregon), eu-west-1 (Ireland), eu-central-1 (Frankfurt), ap-northeast-1 (Tokyo), ap-northeast-2 (Seoul), ** 이외에서 CloudFormation을 실행하셨다면, 오른쪽 상단의 리전을 **us-east-1 (Virginia)**로 변경 후, Cognito 서비스로 들어가시기 바랍니다. 애플리케이션은 여러분이 만든 리전에 존재하고 있지만, 사용자 인증은 us-east-1의 Cognito 서비스를 이용하게 됩니다. 만약 위에 목록에 해당하는 리전에서 CloudFormation 스택을 실행하셨다면, 그 리전의 Cognito 서비스에서 진행하시면 됩니다. 

콘솔에서 **Manage your User Pools**를 선택합니다. 이제 채팅 앱에서 사용할 사용자 디렉토리를 만들도록 하겠습니다. 

2\. 오른쪽 상단의 **Create a User Pool** 이라는 푸른 버튼을 클릭하여, 새 사용자 디렉토리를 만듭니다.

3\. "Pool Name" 텍스트 상자에, **[Your CloudFormation stack name]-userpool**을 입력합니다. 예를 들어, CloudFormation 스택 이름이 "sample"이라고 하셨다면, "sample-userpool"이라고 하시면 됩니다. 이름을 넣으셨으면, **Step through Settings**을 선택합니다.

4\. 속성 페이지에서  **email, name, phone number**을 필수 항목으로 체크합니다.

* Cognito User Pools에서는 여러분의 애플리케이션에서 이용할 사용자 정보 속성을 만들 수 있습니다. 이는 사용자가 가입을 할 때 입력을 해야 하는 정보이며, 사용자가 Cognito로 인증할 때, 애플리케이션이 세션 데이터에서 이를 활용 가능합니다.

5\. "Add custom attribute" 링크를 클릭합니다. 모든 기본 값은 그대로 두고, "Name"에 **slackuser** 라고 정확히 넣습니다. 추가 속성은  **slackteamdomain** 및 **camp** 입니다.

* User Pool 내에서 맞춤형 속성을 정의할 수 있습니다. 생존자 채팅앱에는 위의 세 가지 속성을 추가로 사용합니다. 

속성 설정은 아래 이미지 처럼 하시면 됩니다.

![Cognito User Pools: Attributes Configuration](/Images/Cognito-Step5.png)

**Next Step**을 선택하세요.

6\. Policies 페이지에서 암호 정책 설정은 기본 값으로 두고 그냥 **Next step**을 클릭합니다.

7\. Verifications 페이지는 기본 값으로 두고 그냥 **Next step**을 클릭합니다. Message Customizations 페이지에서 **Do you want to customize your email verification message?** 이라는 제목의 영역을 수정할 것입니다.

Email subject 항목에 "Signal Corps Survivor Confirmation"이라고 적습니다. 메일 본문 부분은 수정하지 않고 여러분이 원하는 부분이 있으면 입력합니다. 이제 Cognito가 이메일을 보내게 되며, 실제 정식 서비스 환경에서는 여러분의 이메일 서버를 통해 보낼 수도 있습니다.

 **Next step**을 클릭합니다.

* 본 애플리케이션에서 멀티 팩터 인증(MFA)은 사용하지는 않습니다. 다만, 회원 가입 시 이메일 주소를 통해 인증을 하게 됩니다. "Do you want to require verification of emails or phone numbers?"을 체크하게 되면, 사용자가 가입을 하면 확인 메일을 보내시, 링크를 클릭해야만 가입이 완료됩니다.  

8\. Devices 페이지에서는 "No" 라는 기본 값을 그대로 둡니다. 사용자 기기에 저장하도록 설정하지 않는 것입니다.  

9\. Apps 페이지에서는 **Add an app**을 선택합니다. **App Name** 텍스트 박스에서는 "Zombie Survivor Chat App"이라고 적고, **client secret 체크박스를 선택하지 않습니다.**. 그리고, **Set attribute read and write permissions**을 선택합니다. 앱에서 맞춤형 속성 값에 "writable" 접근 권한을 주어야 합니다. **Writable Attributes** 체크 박스에 **custom:slackuser, custom:slackteamdomain, custom:camp** 체크를 하고, 나머지는 그대로 둔 상태에서 **Create App**을 누르고, **Next step**을 선택합니다.

10\. (중요) 여러 박스 중에 **Pre authentication** 와 **Post confirmation** 의 드롭다운 메뉴에서 "[Your CloudFormation Stack name]-CognitoLambdaTrigger-리전코드"라는 Lambda 함수를 선택한 후, **Next step**을 누릅니다.

* Cognito User Pools을 통해 개발자들은 사용자 가입 및 로그인 과정에서 맞춤형 진행 방식을 구현할 수 있습니다. 이러한 워크플로 로직은 Lambda Trigger를 통한 AWS Lambda 함수를 사용할 수 있습니다.

* 이러한 기능을 기반으로 개발자들은 Lambda 함수로 정보들을 보내게 되고, 서버리스 및 이벤트 기반 인증을 위해 가입 및 로그인 과정에서 각각 다른 단계를 실행할 수 있게 됩니다.

* 본 애플리케이션에서는 아래 2개의 Lambda 트리거를 만듭니다.

    * 인증 완료 후: 본 트리거는 사용자가 가입 완료 인증을 끝내고 인증된 사용자로 완료되면 실행됩니다. 이 때 Lambda 함수는 사용자의 속성을 받아서 CloudFormation이 만든 DynaomoDB 사용자 테이블에 넣는 작업을 합니다. 이를 통해 애플리케이션에서 사용자 속성을 조회할 수 있습니다.

    * 로그인 인증 전: 본 트리거는 사용자가 웹 애플리케이션에 로그인을 할 때 마다 Cognito에 인증 정보를 보낼 때 실행됩니다. 이 떄 Lambda 함수는 사용자 속성을 받아서 DynaoDB 사용자 테이블에 업데이트하는 동작을 수행합니다. 이를 통해 처음 로그인 할 때, DynamoDB로 부터 사용자 데이터를 받아 User Pools의 현재 값을 설정하고 로그인 할 때 마다 확인합니다.

    * 본 워크샵에서 위의 두 가지 트리거를 위해 하나의 Lambda 함수를 사용합니다. 실행 할 때, 위의 두 가지 형태를 모드 체크해서 처리합니다. 더 자세한 것은 관련 Lambda 함수를 참고하시기 바랍니다.

11\. 설정을 모두 검토 한 후, **Create pool**를 선택합니다. 사용자 풀이 성공적으로 만들어졌다면, 세부 항목 페이지로 돌아가야 합니다.

12\. PC의 텍스트 에디터를 열고, 세부 페이지의 **Pool Id**를 복사해 둡니다. 왼쪽 메뉴의 **Apps** 탭을 열면 보실 수 있는 **App client id** 를 또한 같이 복사해 둡니다. 

이제 User Pools는 모두 설정이 되었습니다. 이제 만들어진 Codnito Identity Pool로 통합하는 설정을 해보겠습니다.

* [Amazon Cognito Identity Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html)은 이미 설정되어 있습니다. AWS로 부터 받은 임시 토큰으로 애플리케이션에서 API 호출을 할 수 있습니다.

* User Pool을 통한 인증 설정은 모두 마쳤고, 이제 IAM 인증 API 호출을 위한 접근 제어를 해야 합니다. 또한, 우리가 만든 Users Pool을 **Authentication Provider**로 설정합니다.

관리 콘솔의 상단 메뉴에서, 아래와 같이 **Federated Identities**을 선택합니다.

![Navigating to Federated Identities Console](/Images/Cognito-Step12.png)

13\. 기존에 만들어진 Identity Pool을 선택합니다. 이름은 "[Your CloudFormation stack name] _ identitypool"라고 되어 있습니다. 대시보드에서 오른쪽 상단의 **Edit identity pool**를 선택합니다.

14\. Cognito Identity에서는 등록된 사용자 및 손님 모드를 모두 지원합니다. 사용자 그룹과 연계된 접근 권한은 Cognito 역할에 연결된 IAM으로 좌우됩니다. 인증 및 비인증 Congnito 역할은 이미 CloudFormation으로 만들어져 있습니다. 인증 역할은 서버리스 앱과 연계된 API Gateway 엔드포인트 ARN으로 "execute-api:invoke" 호출을 만들 수 있는 권한을 가지고 있습니다. 

* 사용자가 애플리케이션으로 로그인 할 때, 인증된 사용자가 되고 애플리케이션은 메시지를 보낼 수 있는 권한을 얻게 됩니다.  

15\. "Authenticated providers"라는 이름의 검은색 드롭다운 메뉴를 누릅니다. 우리가 만든 Identity pool을 Congnito User Pool 및 Identity Provider로 연동합니다. "Cognito" identity provider 탭을 선택하고, 이전에 복사해 둔 **User Pool ID** 및 **App Client ID**을 붙여 넣기 합니다. (이 두 가지 정보는 아래에서 설정할 때 필요하니 텍스트 에디터를 아직 열어두시기 바랍니다.혹시 아까 복사하지 않으셨다면, Cognito User Pool에 되돌아 가셔서 User Pool Id 및 App Client ID을 복사해 오시기 바랍니다.)

페이지 밑까지 스크롤을 하여 **Save Changes**을 누릅니다. 이제 Cognito User Pool을 Identity Pool과 연결하여, 사용자를 위한 보안 토큰을 앱에서도 사용할 수 있게 되었습니다. 

16\. 자바스크립트 앱과 사용자 로그인한 User Pool과 연결하기 위해 애플리케이션 설정 파일을 업데이트 해야 합니다.  

여러분이 **CloudFormation을 실행한 리전**에 가서 Amazon S3 콘솔을 엽니다.

![Navigate to the S3 service](/Images/Cognito-Step16.png)

17\. Amazon S3 버킷 목록에서 CloudFormation에서 만든 버킷을 선택합니다. 이름은 [CloudFormation Stack Name]-s3bucketforwebsitecontent"....과 같은 형식으로 되어 있습니다.

18\. 버킷 내에는 서버리스 자바스크립트 애플리케이션과 본 워크샵의 Lambda 함수 소스 코드 및 CloudFormation 자원 등이 들어 있습니다. (이들 파일을 절대 지우시면 안됩니다.) 이제 버킷 내 **S3/assets/js/constants.js**을 선택 합니다.

Download the **S3/assets/js.constants.js** file to your local machine and open it with a text editor.

![Download the constants.js file](/Images/Cognito-Step18.png)

19\. 이제 constants.js 파일을 다운로드 한 후 텍스트 에디터로 열어서  이전에 복사해 둔 값을 "USER_POOL_ID"에 설정합니다. "CLIENT_ID" 변수에는 App Client ID를 넣습니다.

* 자바스크립트 애플리케이션은 이들 설정 값을 이용하여 본 워크샵 내 각각 다른 실습 사이의 통신에 사용하게 됩니다.

* The Identity Pool Id는 CloudFormation 템플릿을 실행했을 때, 다른 몇 가지 변수와 함께 자동으로 채워집니다.

20\. 이제 constants.js를 저장하고, S3로 다시 업로드를 합니다. 콘솔에서 푸른색 **Upload** 버튼을 눌러 로컬 PC에서 파일을 선택해서 업로드할 것입니다. Upload 창 아래의 **"Set Details->SetPermissions"을 선택하고, "Make everything public"를 체크합니다**. 그리고 난 후, **Start Upload**를 눌러 기존 파일을 덮어쓰면 됩니다. 정확한 폴더에 업로드를 했는지 한번 더 확인해 보시기 바랍니다.

* 이제 Congnito에 대한 설정은 모두 마쳤습니다.

21\. 이제 CloudFormation으로 돌아가서, 만들어진 스택의 "Output" 탭에서 Chat Room URL (MyChatRoomURL)을 복사하여 웹 브라우저 주소창에 붙여넣습니다.

* 이미 애플리케이션이 브라우저 창에 열려있다면, 새 contstant.js 파일 수정 후에 새로 고침하면 됩니다.  

22\. 이제 로그인 페이지가 보이면, **Sign Up** 버튼을 눌러 회원 가입을 해야 합니다.

23\. 주어진 가입 양식을 채워넣습니다. 단, 회원 가입 시 전화 번호에 대한 번호 인증이 진행됩니다. 따라서, 유효한 전화번호를 입력할 때는 미국 번호인 10자리 (예:  888-280-4331)를 넣으셔야 합니다.   

* **Select your Camp**: 여러분이 살고 있는 지역을 입력합니다. 본 애플리케이션에서 현재 속성은 사용되지 않지만, 향후에 추가적으로 사용할 수 있습니다. 워크샵 실습을 종료한 후 부록에 있는 별도 도전 사항을 시도해 보시기 바랍니다.

* **Slack Username**: 슬랙 실습 과정에서 사용할 슬랙 사용자명을 입력합니다. (예: channy)

* **Slack Team Domain Name**: 슬랙은 여러 사용자가 함께 사용할 수 있습니다. 슬랙 실습 과정에서 사용할 도메인 명을 입력합니다.(예: channy-zombie-team) 기존에 개인적으로 사용하는 슬랙 도메인이나 사용자명이 있으시면 그것을 사용하셔도 됩니다.

이제 **Sign Up**을 클릭합니다.

24\. 가입 양식에서 확인 코드를 입력하도록 합니다. 여러분의 이메일 주소로 전송된 메일함에서 "Signal Corps Survivor Confirmation"이라는 메일 제목을 찾아 확인 코드를 복사해서 입력하시면 됩니다. (스팸 폴더에 들어가 있을 수 있으니 꼭 확인해 보세요.)

![Confirm your signup](/Images/Cognito-Step24.png)

계정 설정이 완료된 경우, 메시지 창에 입력하면 채팅을 시작할 수 있습니다. 

25\. 메시지는 중앙 채팅 창에 보이게 됩니다. URL을 팀원에게 공유하여 함께 채팅을 할 수 있습니다. 만약 혼자시면, 다른 웹 브라우저에서 새로 창을 열어 다른 이메일 주소로 들어와서 채팅 테스트가 가능합니다. 한 PC에서 두 사람 이상 로그인해서 시뮬레이션 하실 때는 다른 웹 브라우저를 사용하시기 바랍니다.

**이제 기본 채팅앱 구성을 마쳤습니다! 아직 추가적으로 필요한 기능이 많습니다. 이제 함께 완성해 보시겠습니다!**

*(주의) 본 워크샵은 API Gateway 캐시를 활용하지 않습니다. 본 기능은 꼭 꺼두셔야 합니다. 이 부분은 AWS 무료 제공 범위에 속하지 않기 때문에, 추가 비용을 만들 수 있으며 본 워크샵에서도 필수 기능이 아닙니다.*

## Lab 1 - 생존자 채팅 기능

**실습 소개**

본 실습에서는 생존자가 현재 채팅룸에서 입력하고 있는 것을 볼 수 있는 기능을 추가합니다. 이를 위해서 간단하게 API를 만들고 Lambda 함수를 통해 타이핑하는 메타 데이터를 DynamoDB 테이블로 보내어 상세 정보를 저장합니다. 생존자 채팅 앱은 API 엔드 포인트에서 주기적으로 데이터를 가져와서 누가 타이핑하고 있는지 확인합니다. 본 기능은 웹 채팅 클라이언트의 채팅 메시지 패널 아래에 표시됩니다. 본 실습 절차는 UI 및 백엔드 Lambda 함수로 구현을 하고 이를 API Gateway로 연동하는데 초점을 맞추고 있습니다.  

애플리케이션은 [CORS](http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) 기능을 사용하며, CORS 기능을 켜서 Lambda 함수 및 백엔드 연동이 가능하도록 합니다.  

**생존자 채팅 기능 구조**
![Overview of Typing Indicator Architecture](/Images/TypingIndicatorOverview.png)

1\. AWS 관리 콘솔에서 API Gateway 서비스를 선택합니다.
![API Gateway in Management Console](/Images/Typing-Step1.png)

2\. Zombie Workshop API Gateway를 선택합니다.

3\. 왼쪽 API 목록 중 /zombie/talkers/GET 메소드를 선택합니다. /zombie/talkers 리소스를 찾은 후 "GET" 메소드를 클릭하면 됩니다. 아래와 같이 표시됩니다.
![GET Method](/Images/Typing-Step3.png)

*본 GET HTTP 메소드는 생존자 채팅앱에서 어떤 유저가 타이핑 중인지 확인하기 위해 DynamoDB talkers 테이블에 주기적으로 쿼리하기 위한 API 입니다.*

4\. **Integration Request** 박스를 클릭합니다.

5\. "Integration Type" 밑에 **Lambda Function.**를 선택합니다.

*   현재 본 API 메소드는 "MOCK" 연동으로 설정되어 있습니다. MOCK 연동은 샘플 가짜 데이터를 테스트할 수 있도록 API 백엔드를 연동해 두어 테스트를 하는데 유용합니다. 현재 MOCK 연동 설정을 삭제하고, 실제 DynamoDB 테이블에 조회를 할 Lambda 함수를 연결하면 됩니다.

6\. **Lambda Region** 항목에는 CloudFormation 스택을 실행했던 리전을 선택하면 됩니다. (주의: 여러분이 위에서 눌렀던 템플릿 버튼의 리전을 선택하면 됩니다. 예를 들어 Virginia (us-east-1)을 누르셨다면, 리전 선택에서 us-east-1를 선택 하면 됩니다.

*    CloudFormation 템플릿을 선택했을때, 선택한 리전에 몇 개의 Lambda 함수도 같이 만들어집니다. 이 함수에는 DynamoDB "Talkers" 테이블에서 데이터를 조회 혹은 입력하는 것입니다.

7\. **Lambda Function** 항목에서 "gettalkers"라고 입력합니다. 자동 완성 항목을 선택하면,  "GetTalkersFromDynamoDB"라는 이름이 포함된 항목을 선택합니다. 예를 들어, **_[CloudformationTemplateName]_**-GetTalkersFromDynamoDB-**_[XXXXXXXXXX]_** 식으로 표시되어 있습니다.

*   본 Lambda 함수는 Node.JS로 만들어져 있으며, Talkers라는 테이블에서 데이터를 읽어오는 기능만 수행합니다. 이 테이블에는 사용자가 채팅창에 입력할 때 마다 내용을 기록합니다. GET 메소드에 Lambda 함수를 연결함으로서 채팅앱이 API Gateway에 연결하여 GET 요청을 하면 본 기능을 수행하게 됩니다.  

8\. **Save** 버튼을 누르고, Lambda 함수 통합을 하고자 팝업이 뜨면 **OK**를 클릭합니다. API Gateway를 위한 접근을 허가하고 Lambda 함수를 실행하도록 "OK"를 다시 한번 누릅니다. 두번째 팝업은 API Gateway가 Lambda 함수를 실행할 수 있도록 허가해 줍니다.

9\. 오른쪽 메소드 실행 플로우의 Method Response 영역을 선택합니다. API Gateway에서 어떤 HTTP 응답을 보낼 수 있는지 설정할 수 있습니다. 

10\. 200 HTTP Status response을 만들겠습니다. "Add Response"를 눌러, status code 텍스트 입력에 "200"이라고 적고 아래 그림과 같이 메소드 저장을 위한 작은 체크박스를 클릭합니다.

![Method Response](/Images/Typing-Step10.png)

* /talkers 리소스의 GET 메소드에 대해 HTTP 응답 "200"에 대한 설정을 마쳤습니다. 더 많은 응답 형식을 추가할 수 있지만, 본 워크샵에서는 필요하지 않으니 건너뛰도록 하겠습니다.  

11\. 왼쪽 메뉴에서 트리의 "POST" 옵션을 클릭하여,/zombie/talkers/POST 메소드 설정을 선택합니다.  

![POST Method](/Images/Typing-Step11.png)

12\. 이전 단계 4-10까지를 GET 메소드에서 했던 것을 다시 한번 진행합니다. 하지만, 이번에는 통합 요청에 대해 Lambda 함수를 선택 할 때, 자동 완성에서 "writetalkers"라고 타이핑 하신 후 **_[CloudformationTemplateName]_**-WriteTalkersToDynamoDB-**_[XXXXXXXXXX]_** 같은 이름의 함수를 선택합니다.

* 이 단계에서 채팅앱에서 DynamoDB Talkers 테이블에 사용자가 입력하는 내용을 추가하는 POST 메소드를 설정하고 있습니다. GET 메소드에서 한 것 처럼 POST에 대해서도 똑 같이 설정하면 됩니다. 그런데, POST 메소드에서는 데이터베이스에 전송하기 때문에 다른 Lambda 함수를 사용하는 것입니다. 대신 데이터를 가져오는 것은 "GetTalkersToDynamoDB" 함수를 사용하고 있습니다.

13\. 이제 /zombie/talkers/OPTIONS 메소드로 갑니다.

14\. Method Response를 선택합니다.

15\. 200 응답을 추가합니다. "Add Response"를 클릭하고, "200"을 상태 코드 입력창에 넣은 후 메소드 응답 저장을 위해 체크 박스를 클릭합니다.

16\. OPTIONS 메소드 플로 차트로 되돌아가서, Integration Response를 선택합니다. (되돌아가려면, "Method Execution"라는 푸른색 링크를 클릭하세요. 다시 메소드 실행 보기 화면을 보여주게 됩니다.)

17\. Integration Response를 선택합니다.

18\. 응답 상태 코드 "200"으로 새로운 Integration response를 추가합니다. "Method response status" 드롭다운을 클릭하고, "200"을 선택합니다. (regex 박스는 공란으로 둡니다.) 완료 되면 푸른색 **Save** 버튼을 누립니다.

* 이 부분에서는 OPTIONS 메소드에 대해 200 응답을 받을 수 있도록 간간히 설정했습니다. OPTIONS 메소드는 클라이언트가 API 리소스 및 각 메소드에 대한 상세 데이터를 가져가는데 사용됩니다. 클라이언트가 API에 대해 어떤 것을 사용 가능한지 얻어갈 수 있는 정보를 주는 메카니즘이라고 생각하시면 됩니다.

19\. 이제 왼쪽 메뉴의 /zombie/talkers 리소스를 선택합니다.
![talker resource](/Images/Typing-Step19.png)

20\. "Actions" 박스를 클릭하고, 드롭다운에서 "Enable CORS"를 선택합니다.

21\. **Enable CORS and replace ...**을 누른 후, 다음 창에서 **Yes, replace existing value**를 눌러 기존의 설정을 변경합니다. 아래와 같이 CORS 옵션에 모든 체크 부분에 녹색으로 보여야 합니다.
![talker resource](/Images/Typing-Step21.png)

* 만약, 모든 체크 마크가 녹색이 아니면 위에서 진행한 HTTP 상태 코드 200을 추가하는 과정에서 뭔가 누락된 것입니다. 위의 단계를 다시 확인하셔서 POST, GET, OPTIONS 메소드의 200 상태 코드를 추가하세요.

22\. 이제 "Actions" 박스를 눌러 Deploy API를 하시기 바랍니다.  
![talker resource](/Images/Typing-Step22.png)

23\. 배포 단계를 ZombieWorkshopStage를 선택하고 Deploy 버튼을 누릅니다.

* 본 워크샵에서는  "ZombieWorkshopStage"라는 스테이지로 API를 배포합니다. 실제 정식 서비스를 할 경우,  "production"이나 "development" 같은 실제 단계로 설정하고 API 배포 과정을 진행하게 됩니다.

**LAB 1 실습 종료**

이제 사용자가 입력하는 내용은 POST 요청을 통해 지속적으로 Talkers DynamoDB 테이블에 추가됩니다. GET 요청을 계속적으로 호출(pulling)해서 테이블에서 일어나는 사용자의 타이핑 내역을 웹 애플리케이션에 표시해 줄 수 있게 되었습니다.

![talker resource](/Images/Typing-Done.png)

* * *

## Lab 2 - Twilio 기반 SMS 연동

**실습 소개**

본 실습에서는 무료 테스트 계정으로 Twilio SMS 휴대폰 번호를 설정한 후, 사용자가 보내는 문자 메시지를 /zombie/twilio로 보내서 채팅 창으로 보내게 됩니다. 이를 통해 문자메시지로 생존자와 채팅을 할 수 있습니다.

**SMS Twilio 통합 아키텍처**
![Overview of Twilio Integration](/Images/TwilioOverview.png)

1\. Twilio 회원 가입을 합니다.  https://www.twilio.com/try-twilio. (계정이 있으시면 로그인합니다.)

2\. 가입이 완료되었으면, 로그인을 한 후 오른쪽 홈 아이콘을 눌러 콘솔 대시 보드 페이지로 갑니다. 맨 밑으로 스크롤을 내려  **Phone Numbers** 항목에서 "Phone Numbers"를 선택합니다.
![Manage Twilio Phone Number](/Images/Twilio-Step2.png)

3\. 전화 번호 부분의 "Get Started"를 눌러, 계정에 전화 번호를 연결합니다.  붉은색의 "Get your first Twilio phone number" 버튼을 누르면, 우리가 실습에서 사용할 10자리의 전화 번호를 생성합니다. 기본적으로 음성 및 메시지가 가능해야 하기 때문에, 전화 번호에 대해 팝업창이 열리면 메시지 사용을 할 수 있게 설정하고 "Choose this number"를 선택하고, 다음 단계로 갑니다. 만약 전화 번호가 메시징을 지원하지 않으면, "Search for a different number"를 누르고, 국가 및 "SMS"를 선택한 후, "Search"를 합니다. Twilio는 전화 번호 목록을 제공하고, 이 중에서 번호를 선택하고 "Choose number"를 한 후, 간단하게 주소를 입력하고 "Save and continue" 및 "Done"을 설정합니다.

*대부분은 미국 번호입니다. 해외 번호를 받으실 수도 있습니다만 서비스 약관 상 비용 부가가 있을 수 있습니다. 자세한 것은 웹 사이트를 참고하시기 바랍니다.*

4\. 일단 전화 번호를 받게 되면, 왼쪽에 **Manage Numbers** 버튼을 눌러 번호의 속성 정보를 얻기 위해 전화 번호를 클릭합니다.

5\. 아래로 스크롤을 내려 보면, **Messaging** 영역의 **Configure With** 드롭다운 항목에서 **Webhooks/TwiML** 옵션을 선택합니다. 일단, 웹 페이지를 그대로 두고 다음 단계로 넘어갑니다.

* Twilio webhooks을 이용하면 여러분의 전화 번호를 서드파티 서비스와 연동할 수 있습니다. 오늘 실습에서는 전화 번호로 오는 모든 메시지를 API Gateway의 POST HTTP 호출을 통해 보내는 것을 진행합니다.   

6\. 이제 API Gateway의 API 엔드포인트 **/zombie/twilio** 에서 Twilio 데이터를 받는 설정을 진행합니다. AWS 관리 콘솔을 새로운 탭에 열어서 API Gateway에 아래 화면과 같이 엽니다. 설정을 끝낼 때 까지, 좀 전에 작업하던 Twilio 페이지는 다른 탭에 동시에 두는게 좋습니다.
![API Gateway in Management Console](/Images/Twilio-Step6.png)

7\. API Gateway 콘솔에서 **Zombie Workshop API Gateway** API를 선택한 후, 왼쪽에 **Stages**를 클릭합니다.
![API Gateway Resources Page](/Images/Twilio-Step7.png)

8\. "Stages"를 선택하여, 파란 화살표를 눌러 "Zombie Workshop Stage"를 보이게 합니다. 이제 **/zombie/twilio**의  **POST** 메소드를 선택합니다. **/zombie/twilio** 리소스는 CloudFormation이 SMS 연동을 위해 만든 리소스입니다. 아래와 같이 **/zombie/twilio** 에 대한 **Invoke URL**이 표시 됩니다.
![API Gateway Invoke URL](/Images/Twilio-Step8.png)

9\. **Invoke URL**을 복사 한 후, Twilio 웹 페이지로 되돌아 입니다. 복사한 URL 주소를 **A message comes in**라는 텍스트 박스에 붙여 넣습니다. 그런 다음, 아래와 같이 호출 타입을 **HTTP POST**로 선택합니다.
![Twilio Request URL](/Images/Twilio-Step9.png)

10\. 마지막 설정을 위해 **Save** 버튼을 누리면, Twilio API와 연결 설정이 끝납니다.

11\. 이제 Twilio로 부터 들어오는 메시지를 받아서, 파싱한 다음 "/messages" 채팅 서비스로 보내는 작업을 할 Lambda 함수를 만들어 보겠습니다. 이제 AWS Lambda 관리 콘솔로 들어갑니다.

* 워크샵을 진행하면서 느끼시다시피, /zombie/message 리소스에 표준화된 호출을 보내기 전에 데이터를 전처리하는 Lambda 함수를 항상 만들고 있습니다. 이를 통해 여러 함수를 만들어 DB 작업을 하는 대신 기존 DynamoDB 로직을 재활용할 수 있습니다. Twilio 번호로 메시지가 들어오면 Twilio Webwook이 /zombie/twilio 리소스로 POST를 보내고, 백엔드 데이터 처리 Lambda 함수와 연결됩니다. 이 함수는 Twilio 데이터를 분리해서 IAM 권한이 필요한 /zombie/message/로 SigV4 HTTPS 호출 데이터를 만듭니다.

12\. **Create a Lambda function**를 선택한 후, 왼쪽 메뉴에서 **Configure function**을 선택합니다.

13\. 이제 함수명에는 **"[Your CloudFormation stack name]-TwilioProcessing"**라고 적고, "Runtime"은 **Node.js 4.3**을 선택합니다. 이제 Github 레포지터리에서 **TwilioProcessing.js** 파일을 찾아서 전체 코드를 복사한 후, Lambda 코드 에디터에 붙여넣습니다. 코드 중에서 [line 8](/Twilio/TwilioProcessing.js#L8)에는 몇 가지 "API" 환경 변수들을 선언해야 합니다. API.endpoint는 "INSERT YOUR API GATEWAY URL HERE INCLUDING THE HTTPS://"라고 적혀 있는데, 여기에 API Gateway의 전체 도메인 명을 넣습니다. 예를 들어, "https://xxxxxxxx.execute-api.us-west-2.amazonaws.com"의 형식입니다.

**API.region**에는 리전 코드도 넣어야 합니다. CloudFormation을 실행한 리전의 코드를 넣습니다. (예: us-west-2)

마지막으로 DynamoDB 사용자 테이블의 이름을 복사합니다. 이 값은 **table** 변수에 넣습니다. 또한, "phoneindex" (쿼리와 함께 DynamoDB에 생성되는 인덱스) 이름도 복사합니다. 이들 속성은 CoudFormation "Output" 탭에서 모두 얻을 수 있습니다. CloudFormation의 **DynamoDBUsersTableName** 및 **DynamoDBUsersPhoneIndex** 에서 복사하면 됩니다.

* 본 워크샵의 대부분 함수는 Nodejs 0.10으로 작성되었으나, Node 버전과 상관없이 동작합니다. 향후에 NodeJS 4.3에 맞는 코드로 업그레이드 할 예정입니다.

14\. Lambda 함수 코드 붙여 넣기 및 속성값 설정이 끝났으면, **Lambda function handler and role** 항목에서 **Choose an existing role**를 선택하고, 드롭 다운 메뉴에서 기존의 **Role** 중에 **[Your stack name]-ZombieLabLambdaRole...**를 선택 합니다.

15\. **timeout** 에는 30초를 넣고, 나머지 값들은 그대로 둡니다. 이제 **Next**를 눌러, 리뷰 페이지에서 **Create function**을 선택하여, 함수 작성을 완료합니다.

* 이 Lambda 함수는 /twilio 엔드포인트로 들어오는 퀴리스트링을 받아서 채팅 서비스로 보낼 수 있는 형식의 JSON으로 변환하여 이를 /zombie/message 엔드포인트로 보내는 처리를 합니다. 여기서 DynamoDB에 데이터를 넣게 됩니다.

16\. 이제 /zombie/twilio 엔드포인트에 **POST** 메소드를 처리하는 설정을 합니다. API Gateway 콘솔에서 **/twilio** 엔드포인트 아래 **POST**를 선택합니다.

17\. **Method Execution** 스크린의 "POST" 메소드에서 "Integration Request" 박스가 /twilio 리소스에 대해 **MOCK**의 형식으로 보여야 합니다.

18\. Lambda 함수와 Mock integration을 하기 위해서는 **Integration Request**를 바꾸어야 합니다. **Integration Request**을 클릭 한후, 화면에서 "Integration type" 라디오 버튼을 **Lambda Function**로 선택합니다. "Lambda Region"에서 드롭다운을 해서 CloudFormation 작업 및 TwilioProcessing Lambda 함수를 만든 리전을 선택합니다. **Lambda Function** 이름에서는 "TwilioProcessing"를 치면, 우리가 만든 함수가 자동완성됩니다. **TwilioProcessing** 함수를 선택 한 후, **Save** 버튼을 누립니다. 팝업창에서 Lambda 함수 연계에 대해 **OK**를 누릅니다. 그런 다음, API Gateway 접근 권한에 대해 확인을 하고 **OK**를 누릅니다. 몇 초 정도 지나면 완료됩니다. 

19\. **Save**을 누른 후, "POST" 메소드에 대한 Method Execution 페이지로 옵니다. 맵핑 템플릿을 설정하기 위해  **Integration Request**를 합니다. Method Execution 화면에서 **Integration Request**를 누릅니다.

20\. Twilio는 API로 부터 "application/x-www-form-urlencoded"의 content-type을 보냅니다. Lambda 함수는 content-type이 "application/json"로 받게 되기 때문에, Lambda TwilioProcessing를 실행하기 전에 API로 들어오는 데이터를 JSON으로 변환해야 합니다.

21\. /twilio POST 메소드의 Integration Request화면에서 **Body Mapping Templates**을 열어 **Add mapping template**을 누릅니다. "Content-Type" 텍스트 박스에는 **application/x-www-form-urlencoded**를 누르고, 작은 체크박스를 눌러 계속합니다. 체크 박스를 누르면, 팝업 창이 떠서 정확한 Content-Type을 입력했는지 확인 창이 나오는데, 이 때  **Yes, secure this integration**를 누릅니다. **Generate Template** 드롭다운과 함께 오른쪽에 새로운 영역이 보입니다. 드롭다운 메뉴를 눌러 **Method Request Passthrough**를 선택합니다.

22\. "Template" 텍스트 편집기가 나오게 되는데, 여기에는 들어오는 Twilio 데이터를 JSON 객체로 바꾸는 VTL 변환 로직의 일부분을 입력하게 됩니다. 편집기에서 **기존에 적혀 있는 코드를 삭제**하고 아래 코드를 입력합니다.

```
{"postBody" : "$input.path('$')"}
```

편집기로 복사를 하고 난 후, **Save** 버튼을 누릅니다. 이제 "application/x-www-form-urlencoded" Content-Type으로 /twilio 엔드포인트에 들어오는 모든 POST 데이터는 JSON으로 변환이 됩니다. 아래 스크린샷을 참고하세요.
![Twilio Integration Request Mapping Template](/Images/Twilio-Step22.png)

23\. Twilio API는 응답 받는 Content-Type을 XML로 받아야 하기 때문에 응답 데이터 변환을 위해 Integration Response 설정을 해야 합니다. SMS 메시지를 받아 채팅 서비스로 보내고 나서, 메시지를 잘 받았다고 Twilio에 응답 결과를 보내야 하기 때문에 필요합니다.

24\. twilio POST 메소드의 Method Execution 화면으로 갑니다. 여기서 **Integration Response**를 누릅니다.  "Integration Response"에서 메소드 응답 영역을 보이게 하기 위해 검은 화살표를 누릅니다.  **Body Mapping Templates** 영역을 확장하면, Content-Type이 "application/json"라고 보입니다. Content-Type을 XML로 바꾸기 위해 먼저 **까만 마이너스(-) 아이콘**을 눌러 Content-Type을 지우고, 팝업창에서 **Delete**를 선택합니다.

25\. **Add mapping template**을 눌러 이전에 했던 Integration Request에서 했던 방식과 유사하게 진행합니다.

26\. 즉, "Content-Type"에는 **application/xml**라고 입력하고, 작은 체크 박스를 눌러 계속 진행합니다. 앞에서와 같이 JSON 데이터를 XML로 변환하는 VTL 매핑 로직을 복사합니다. 이를 통해 /twilio POST 메소드에 대해 응답은 XML 포맷으로 하게 됩니다.  새 content-type을 만들고 나면, 오른쪽에 **Generate Template**을 위한 드롭다운 영역이 나오면, 드롭다운을 눌러 **Method Request Passthrough**를 선택합니다.
텍스트 에디터에서는 기존 코드를 지우고 아래 코드를 복사해서 붙여넣습니다.

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

회색 "Save" 버튼을 누릅니다. 결과는 아래와 같이 화면에 보이게 됩니다.
![Twilio Integration Response Mapping Template](/Images/Twilio-Step26.png)

27\. 이제 스크롤을 위래 올려서 푸른색 **Save** 버튼을 누립니다. 마지막으로 API Gateway 콘솔의 왼쪽의 **Actions** 버튼을 누르고, API 배포를 위해 **Deploy API**를 선택합니다. API 배포 창에서는 드롭다운에서 **ZombieWorkshopStage**를 선택한후, **Deploy**를 누릅니다.

28\. 이제 여러분은 Twilio와 여러분의 API로 통합을 완료했습니다. Twilio 전화 번호로 이제 문자 메시지를 보내시면, 채팅창에 전달이됩니다. (주의: 미국 번호인 경우, SMS 전송 비용이 발생할 수 있습니다. 메시지를 보낼 때는, 국제 문자 보내는 것과 같이 +를 누르고 보내시면 됩니다. 또한, 채팅 애플리케이션은 여러분의 진짜 전화 번호인지를 필터링 합니다. 따라서, DynamoDB의 사용자 테이블의 전화 번호를 바꾸실 필요가 있습니다. DynamoDB 콘솔 화면에서, 왼쪽 메뉴의 Table을 선택 하신 후, **[Your-stack-name]-users** 테이블을 선택하고, **Items** 탭을 선택 합니다. 등록한 아이디의 전화번호(미국 번호)를 여러분의 휴대폰 번호로 수정하려면, phone 필드를 선택해 연필 아이콘을 눌러 수정하실 수 있습니다. 문자 메시지 내용이 도착하지 않는 경우, 로그아웃 후 다시 로그인 해보시기 바랍니다.) 

**LAB 2 실습 종료**

본 실습을 완료하면, 문자 전송과 동시에 채팅 앱 창에 문자 메시지가 표시되게 됩니다. 이제 Twilio 문자 메시지를 통해 생존자와 서로 통신할 수 있게 되었습니다. 

* * *

## Lab 3 - Elasticsearch 서비스 기반 채팅 메시지 검색

**실습 소개**

본 실습에서는 Amazon Elasticsearch Service 클러스터를 설치하여, DynamoDB Streams으로 오는 채팅 메시지를 자동으로 색인하여 메시지 분석에 활용해 보는 시간입니다.

**Elasticsearch Service 아키텍처**
![Overview of Elasticsearch Service Integration](/Images/ElasticsearchServiceOverview.png)

1\. 관리 콘솔에서 Amazon Elasticsearch 아이콘을 선택합니다.

2\. 새 Amazon Elasticsearch Domain을 선택 한후, "[Your CloudFormation stack name]-zombiemessages"와 유사하게 이름을 입력하고 **Next**를 선택합니다.

3\. **Configure Cluster** 페이지에서는 기본 설정 값을 그대로 두고 **Next**를 누릅니다. (서울 리전에서는 EBS를 선택)

4\. 접근 정책 페이지에서는 드롭 다운의 **Allow or deny access to one or more AWS accounts or IAM users** 옵션을 선택하고 여러분의 계정 ID를 입력합니다. 위의 AWS Account ID를 복사해서 입력하면 됩니다. Effect를 **Allow**로 선택한 상태에서 **OK**를 누릅니다.

5\. **Next**를 눌러 Review 페이지로 갑니다.

6\. Review 페이지에서 **Confirm and create**를 눌러 클러스터를 생성합니다.

7\. Elasticsearch 클러스터 생성에는 약 10분 정도가 소요됩니다.

* 기다리는 동안 잠시 휴식을 취하시거나 아니면 Lab 4로 가셔서 진행을 하시다 돌아오셔도 됩니다.

8\. 클러스터 생성이 완료 되면 엔드 포인트를  복사합니다. 뒤에 Lambda 함수에서 필요한 정보입니다.
![API Gateway Invoke URL](/Images/Search-Step8.png)

9\. 관리 콘솔에서 Lambda 아이콘을 눌러 Lambda 서비스로 들어갑니다.

10\. **Create a Lambda Function**를 선택합니다.

11\. **Blank Function 박스**를 선택합니다..

12\. **Configure Triggers** 설정 부분에서는 DynamoDB를 선택하고, **messages**라는 DynamoDB table을 선택합니다. 아마 **"[Your CloudFormation stack name]-messages"**로 보일 것입니다. **Batch size**를 **5**로 설정하고, **Starting position**을 **Lastest**로 선택하고, **Enable trigger** 체크박스를 선택합니다.이제 "Next" 버튼을 누릅니다.  

13\. 함수명은 **"[Your CloudFormation stack name]-ESsearch"**와 같이 넣으시고, Runtime은 Node.js 4.3를 선택합니다. 설명은 간단히 원하는대로 입력하셔도 됩니다. 

14\. 이제 Github의 "ElasticsearchLambda" 폴더에 있는 ZombieWorkshopSearchIndexing.js 파일을 복사하여 Lambda 함수를 만듭니다.

15\. 코드 내 [line 6](/ElasticSearchLambda/ZombieWorkshopSearchIndexing.js#L6)에 **region** 코드를 정확하게 입력합니다. (CloudFormation Stack 및 Lambda 함수를 만든 리전)

7번째 행에는 **endpoint**를 **ENDPOINT_HERE**에 대체합니다. 8번 단계에서 기록해 둔 Elasticsearch 엔드포인트로서 **https://로 시작**하는 것을 정확히 붙여넣습니다. 

* 클러스터 설정이 완료되고 "Active" 상태에서 본 과정을 진행해야 합니다.

16\. 이제 Lambda 함수에 IAM 역할을 지정할 차례입니다. **Create new Role from template(s)**을 선택한 후, **"[Your CloudFormation stack name]-ZombieLabLambdaDynamoESRole"** 처럼 이름을 넣고 **Elasticsearch permissions** Role Template를 선택합니다.

17\. "Timeout"항목에서는 값을 **1** 분으로 바꿉니다. Lambda 함수가 타임아웃 전에 메시지 처리를 완료하도록 하게끔 하기 위해 약간 길게 설정합니다. 나머지 값들은 그대로 두고 **Next**를 눌러 Review 페이지에서 **Create function**을 눌러 함수를 만듭니다.

18\. 위의 과정에서 우리는 테이블에 들어오는 메시지를 실시간으로 캡쳐해서 Lambda 함수로 보내기 위해 [DynamoDB Streams](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html)을 사용합니다. Lambda 함수는 이를 바로 Elasticsearch 클러스터로 보내게 됩니다. 이제 채팅 창에서 적는 모든 메시지는 Elasticsearch 서비스로 보내져서 검색 색인이 만들어집니다. 5개 이상의 채팅 창 메시지(DynamoDB Stream의 이벤트 소스 배치 사이즈)를 적고 난 후, ES 서비스의 "Indices" 부분을 보시면 여러분이 보낸 메시지가 색인되어 있는 것을 보실 수 있습니다.
![API Gateway Invoke URL](/Images/Search-Done.png)

**LAB 3 실습 종료**

본 실습을 마치고 나서, 메시지 내용을 좀 더 검색하고자 하시면 ES 서비스가 제공하는 Kibana 웹 인터페이스를 사용해 보실 수 있습니다. 이를 위해서는 접근 권한을 변경할 필요가 있는데, 현재는 여러분의 AWS 계정에서만 접근 가능하도록 설정되어 Lambda 함수만이 메시지를 색인할 수 있습니다.

웹 UI를 사용하고 차트를 만드려면, IP 기반의 접근 제어 정책을 사용하거나, 모든 사람에게 접근하게 할 수도 있습니다. ES 클러스터의 접근 정책에 대한 좀 더 자세한 사항은 [기술 문서](http://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-gsg-configure-access.html)를 참고하시면 됩니다. 외부에 접근 권한을 열어 두었다면, 보안을 위해 나중에 꼭 원상 복귀 하거나 ES 클러스터를 삭제하시기 바랍니다.

* * *

## Lab 4 - Slack 연동

**실습 소개**

본 실습에서는 생존자 채팅을 Slack 채널과 연동하게 됩니다. 좀비 사태 생존자들은 별도의 채팅 앱을 통해 정보를 교환할 수도 있기 때문에, 멀티 소통 수단을 지원하는 것은 매우 중요합니다. 본 실습을 마치면, Slack을 사용하는 생존자들도 우리 채팅앱으로 "/" 명령어를 통해 메시지를 보낼 수 있습니다. 슬랙 명령어로 메시지를 보내면, 이는 우리 채팅 API로 전달이 되게 되는데 이는 두번째 Twilio 실습과 유사합니다.

만약 여러분이 아직 Slack 서비스에 익숙하지 않으시다면, 한번 설치해서 사용해 보시길 권장합니다. 개발자 커뮤니티에서 매우 인기 있는 커뮤니케이션 수단입니다. Slack은 "Channels"이라는 독특한 채팅 방을 사용합니다. 좀 더 자세한 사항은 웹 사이트를 참고하세요. 

**Slack 연동 아키텍처**
![Overview of Slack Integration](/Images/SlackOverview.png)

1\. 맨 먼저 [http://www.slack.com](http://www.slack.com)으로 가서 사용자명을 만들고 팀을 생성합니다. (가급적, 맨처음 가입 시 사용한 Slack 정보로 만듭니다.)

2\. Slack에 가입 후 로그인 하고 나면, [https://slack.com/apps](https://slack.com/apps)에서 상단에 **Build**를 선택합니다. 다음 화면에서 **Make a Custom Integration**를 클릭합니다.

3\. "Custom Integration"페이지에서, 새로 만들 **Slash Commands**를 선택합니다. Slack 명령어는 채팅 창에서 외부 소스로 메시지 혹은 명령을 전달할 수 있도록 하기 위한 설정입니다. Slack 명령어가 설정되면 이는 외부로 POST 호출을 하게 되고, 이는 우리의 API Gateway를 호출하도록 할 수 있습니다.  

4\. Slash Commands 페이지에서 **Commands** 텍스트 창에 명령어를 넣습니다. 예를 들어, **/survivors** 를 넣고 난 후, "Add Slash Command Integration"를 눌러 저장합니다.

5\. Integration Settings 페이지에서 **Method**는 드롭다운 메뉴에서 "POST"를 선택합니다. 그리고, 아래로 스크롤 하여 **Token** 항목에 Token 값을 복사합니다. 다음 단계에서 꼭 필요합니다.

6\. Slack 웹 사이트를 그대로 열어 둔채, 다른 탭을 열어 AWS 관리 콘솔에서 Lambda 서비스로 들어갑니다.

7\. **Create a Lambda function**를 눌러서 Slack 메시지를 받아서 채팅창으로 보낼 새로운 Lambda 함수를 만듭니다.

8\. 왼쪽 메뉴의 **Configure function**을 선택합니다.

9\. 함수 이름은 **"[Your CloudFormation Stack name]-SlackService"** 정도로 넣은 다음, Nodejs 버전은 Nodejs 4.3을 선택한 상태에서, Github 레포지터리로 이동합니다.

10\. Github 레포지터리 Slack 폴더에서 **SlackService.js** 파일을 찾아 코드 내용을 복사 한 후, 함수 에디터에 붙여 넣기 합니다.

11\. 이전에 복사 해둔 Slack Token 내용을 [line 15](/Slack/SlackService.js#L15)에 있는 "token" 변수에  **INSERT YOUR TOKEN FROM SLACK HERE** 대신 입력합니다.

* Slack에서는 연동을 위해 단일 토큰을 제공합니다. Lambda 함수에서 토큰을 확인 수단으로서 사용 가능합니다. Slack에서 API 엔드포인트로 요청이 들어오면, Lambda 함수가 호출되어 Slack 데이터를 받습니다. 이때 Lambda 함수는 코드에 있는 토큰과 들어온 토큰이 같은지 확인하여 메시지 유효성을 확인합니다. 토큰이 맞지 않으면, Lambda 함수는 오류를 반환하고 요청 처리를 하지 않습니다.

12\. "API" 변수에는 Slack에서 온 메시지를 보내기 위한 HTTPS 호출을 위해, 채팅 서비스(/zombie/message)에 API Gateway 풀 도메인 이름(FQDN)을 입력합니다. 즉, [line 9](/Slack/SlackService.js#L9)의 **API.endpoint**에는 "INSERT YOUR API GATEWAY FQDN HERE INCLUDING THE HTTPS://"를 **/message POST method**의 도메인 명 즉,  "https://xxxxxxxx.execute-api.us-west-2.amazonaws.com"와 유사한 API 엔드포인트 도메인명을 치환합니다.

마찬가지로 **API.region** 변수에는 CloudFormation을 실행했던 리전 코드를 입력합니다.

마지막으로 DynamoDB Users 테이블의 이름을 복사합니다. 이 값은 **table** 변수에 넣어야 합니다. "slackindex" 테이블 (호출 시 인덱스를 만드는 DynamoDB 테이블)도 CloudFormation "Output" 탭의 **DynamoDBUsersTableName** 및  **DynamoDBUsersSlackIndex**에서 복사하면 됩니다.

* 이제 함수 코드에서는 Slack 연동을 위해 토큰 유효성 확인을 하고, 완료되면 DynamoDB User 테이블에서 Slack Username 및 Slack Team Domain명이 사용자와 맞는지 확인합니다. 이들 값이 Users 테이블과 일치하면, 생존자로 등록된 사람이 메시지를 보낸다는 것을 확인하고 Slack 메시지를 파싱하여, 이를 **/message** 엔드포인트로 보내 채팅창에 전달합니다.

13\. 함수 코드를 복사하고, 모든 변수 설정이 완료되면, 아래로 스크롤 하여 **Lambda function handler and role**에서 **Choose an existing role**를 눌러  **[Your stack name]-ZombieLabLambdaRole...**와 유사한 역할을 선택합니다. 간단하게 진행하기 위해, 모든 Lambda 함수에서 같은 역할을 재사용합니다.

14\. Advanced 설정에서 **Timeout**을 **30**초로 설정하고 **Next**를 누릅니다.

15\. Review 페이지에서 모든 것이 맞는지 최종 확인을 합니다.

16\. **Create function**를 눌러 함수를 만듭니다.

17\. 함수가 만들어지면, AWS 관리 콘솔에서 API Gateway 서비스로 이동합니다. "Zombie Workshop API Gateway" API에서 왼쪽 메뉴의 "/zombie" 리소스를 선택합니다. 그리고, **Actions** 버튼을 누리고, "Create Resource"를 합니다. 리소스 이름은 **slack**이라고 하고 "Create Resource"를 눌러 API 서비스를 만듭니다. 설정이 끝나면 아래 화면과 같이 됩니다. 
![Create Slack API Resource](/Images/Slack-Step17.png)

* 이번 단계에서는 Slack의 "/" 명령을 수행할 경우 오는 호출을 처리하는 API 서비스를 만들었습니다. 다음 단계는 POST 메소드를 만들어서 이를 Lambda 함수와 연계시키고, API 호출로 들어온 데이터를 전처리 한후 /zombie/message 엔드포인트로 보내 DynomoDB에 입력시키게 됩니다.

18\. 위에서 만든 "/slack" 리소스를 선택한 후, **Actions**을 눌러 **Create Method**를 눌러 **POST**를 선택합니다. POST 메소드 생성 확인 체크 마크를 누른 다음, Integration Type을 **Lambda Function**로 선택합니다. 리전 항목을 선택 한 후, "SlackService"를 치면, 우리가 만든 Lambda 함수가 자동완성 됩니다. 함수 선택 후, **Save**와 **OK**를 눌러 완료합니다.

19\. 이제 /slack POST 메소드에 대해 **Integration Request**를 눌러 맵핑 템플릿을 설정합니다. Slack에서 들어오는 쿼리 스트링 파라미터를 Lambda 함수가 사용 가능한 JSON으로 바꾸는 작업입니다. Slack 메시지를 올바른 형식으로 전환하는데 필요합니다.

20\. **Body Mapping Templates** 화살표를 확장해서 **Add mapping template**를 선택합니다. Content-Type 박스에서, **application/x-www-form-urlencoded**를 입력하고 작은 체크 마크를 선택합니다. 팝업 창이 뜨면, 확인으로 **Yes, secure this integration**를 누릅니다. 이를 통해 호출용 content-types을 설정하였습니다.

Twilio lab에서 했던 대로, JSON 으로 요청을 변환하기 위해 VTL 매핑 로직을 입력합니다. **Generate Template** 드롭다운 메뉴와 함께 새로운 영역이 나오면  **Method Request Passthrough**을 선택합니다.

텍스트 편집기에서는 기존 VTL 코드를 모두 삭제하고 아래 코드를 붙여 넣습니다.

```
{"body": $input.json("$")}
```

회색 **Save** 버튼을 누르고 나면, 아래의 결과 화면 처럼 됩니다.
![Slack Integration Response Mapping Template](/Images/Slack-Step20.png)

21\. 콘솔 왼쪽에 **Actions** 버튼을 누른 후, **Deploy API**를 통해 배포를 합니다. API 배포 창 드롭다운 메뉴에서 **ZombieWorkshopStage**를 선택하고 **Deploy**를 누릅니다.

22\. 왼쪽 패널 트리에서 ZombieWorkshopStage를 선택하고 **/zombie/slack**  리소스에 대해 **POST** 메소드를 선택합니다. 아래와 같이 Invoke URL이 보이게 됩니다.
![Slack Resource Invoke URL](/Images/Slack-Step22.png)

23\. Invoke URL 전체를 복사한 후, Slack.com 웹 사이트의 Slash Command 설정 페이지 내 "URL" 텍스트 상자에 Invoke URL을 붙여 넣습니다. URL에는 "HTTPS://"까지 포함하고 있어야 합니다. 밑으로 스크롤 해서 **Save Integration**를 눌러 완료합니다.

24\. 이제 Slack 명령어를 통해 연동이 이루어졌는지 테스트를 해 보면 됩니다. Slack 계정의 팀 채널에서 "/survivors"를 누르고 메시지를 입력합니다. 예를 들어, "/survivors 도와주세요! 좀비가 오고 있ㅇ요!"라고 입력하면, 아래와 같이 메시지 창으로도 전달이 됩니다.
![Slack Command Success](/Images/Slack-Step24.png)

**LAB 4 실습 종료**

이제 Slack 메시지를 생존자 채팅앱과 연동할 수 있게 되었습니다.
![Slack Command in Chat App](/Images/Slack-Step25.png)

**보너스 단계:**

지금까지 Slack에서 채팅앱으로 메시지를 전달했습니다. 그런데 Slack 창에 생존자 채팅창의 메시지를 역으로 전달할수는 없을까요? 여러분이 이 실습이 끝나고 한번 해 보시기 바랍니다. (힌트) Slack의 "Incoming Webhooks" 연동을 설정하면, 채팅 창에서 메시지가 생성될 때 마다 Slack으로 POST를 보낼 수 있습니다. 집에 가서 한번 구성해 보시면 어떨까요?

* * *

## Lab 5 - Intel Edison 좀비 모션 센서 연동 

본 실습에서는 좀비로 부터 생존자를 보호하기 위해 좀비 모션 센서를 만들어 근처에 좀비가 출몰하고 있는지를 감지하는 하드웨어를 만들고, 좀비가 근처에 오게 되면 Lambda 함수를 통해 모션 센서 변화를 채팅 앱으로 전달하는 역할을 하는 IoT 디바이스 및 서비스를 구축하려고 합니다. 

**IoT 연동 아키텍처**
![Zombie Sensor IoT Integration](/Images/EdisonOverview.png)

본 실습에서 좀비 모션 센서 연동을 하려면, 아래와 같은 부분이 필요합니다.

* 좀비 모션 센서 (본 워크샵에서 관심있는 사용자를 위해 기기 일부를 제공하고 있습니다.)
* AWS 백엔드 생성 (좀비 센서 데이터에 대한 Simple Notification Service 토픽)  
* 인텔 디바이스에 Node.js 설치(본 워크샵에서 관심있는 사용자를 위해 기기 일부를 제공하고 있습니다.)

**본 실습은 IoT 디바이스와 SNS와 연동하는 것이 필요하며, 본 워크샵에서 일부 사용자에게 제공하고 있습니다. 만약, 개인적으로 하고 계시다면 아래 필수 도구 항목을 구비하셔야 하며, 그 외 워크샵에 참여하신 분은 진행자의 지원을 받으시기 바랍니다.**

**필수 도구**

1\. Intel® Edison and Grove IoT Starter Kit Powered by AWS. [아마존닷컴](http://www.amazon.com/gp/product/B0168KU5FK?*Version*=1&*entries*=0)에서 구매 가능합니다.  
2\. 위의 스타터킷에서는 아래의 항목을 포함하고 있습니다.  

* Intel® Edison for Arduino  
* Base Shield  
* USB Cable; 480mm-Black x1  
* USB Wall Power Supply x1  
* Grove - PIR Motion Sensor: 애플리케이션은 Amazon Simple Notification Service (SNS) 토픽으로 메시지를 보내는 간단한 앱으로서 Grove PIR Motion Sensor에서 근처 동작이 감시되면 알림을 보내게 됩니다. SNS 토픽은 워크샵 도중 사용자들이 손쉽게 가입할 수 있도록 공개로 만들어 제공합니다.

아래는 Intel Edison의 호출 예제입니다.

``` 
{"message":"A Zombie has been detected in London!", "value":"1", "city":"London", "longtitude":"-0.127758", "lattitude":"51.507351"}
```

간단한 워크 플로는 아래와 같습니다.

Intel Edison -> SNS topic -> 토픽에 트리거 된 AWS Lambda 함수

####AWS 백엔드 만들기

**만약, AWS가 제공하는 워크샵에 참여하시는 중이시라면, 아래 1-3\ 단계를 무시하셔도 됩니다. 사용자가 이용할 SNS 토픽은 이미 설정되어 있으며, SNS 토픽 ARN(Amazon Resource Name)을 알려드릴 예정입니다.**

1\. AWS 관리 콘솔에서 Simple Noticification Service 아이콘을 선택하고 서비스 페이지로 갑니다. 왼쪽 메뉴의 **Topics**을 선택한 후,'Create New Topic'를 누릅니다. 아래와 같은 창이 뜨면 필요한 값을 입력하고 토픽을 만듭니다.
![Create Topic Screenshot](/Images/MotionSensor-createTopic.png)

2\. SNS 토픽에 Lambda 함수를 구독하기 위해 모든 AWS 계정에 대해 허가하는 정책이 필요합니다. 토픽 관리 화면에서 새로 만든 토픽을 체크하고 **Actions -> Edit topic policy**를 누릅니다. 아래 화면과 같이 설정을 하고 난 후, **Update Policy**를 선택합니다. 동료나 다른 사람들이 SNS 토픽을 쓸 수 있게 하기 위한 설정입니다.
![Edit Topic Policy Screenshot](/Images/MotionSensor-createTopicPolicy.png)

3\. 이제 함께 사용할 SNS 토픽을 설정하였습니다. 토픽을 만든 리전과 함께 Topic ARN 주소를 복사를 하고 다음 단계로 넘어갑니다.

####Intel Edison에 애플리케이션 설치
**만약, AWS가 제공하는 워크샵에 참여하시는 중이시라면 아래 가이드에 따라 진행 하십시오.**

1\. 먼저 에디슨 보드를 설정해야 합니다. [인텔 에디슨 설정 가이드](https://software.intel.com/en-us/articles/assemble-intel-edison-on-the-arduino-board)를 통해 하실 수 있습니다. 단, 본 워크샵에서 제공되는 보드는 이미 설정이 완료 되어 있으므로 아래 단계를 따라 가시기 바랍니다.

* 에디슨 보드를 2개의 USB 케이블을 통해 자신의 PC에 연결합니다. [연결 가이드](https://software.intel.com/en-us/node/628233)를 참고하실 수 있습니다.
* Mac 사용자의 경우, 터미널에서 "screen /dev/tty.usbs"를 누르고, 탭을 눌러 자동 완성되는 디바이스 포트를 선택하고 ‘115200 -L’를 추가하고 접속합니다. 즉, **$ screen /dev/tty.usbs.A129828F 115200 -L** 형식입니다.
* PC 사용자의 경우, Putty를 다운로드 한 후, "serial" 연결을 선택 하고, 장치 관리자에서 자동으로 추가된 COM 포트 숫자와 접속 속도 115200을 선택하고 접속합니다. 
* 접속이 되면, ID에 root라고 치고, 암호 없이 접속이 가능합니다.
* 에디슨의 Wi-Fi 설정을 위해 **$ configure_edison --wifi**를 통해 인터넷 접속을 진행합니다.

2\. Grove PIR Motion Sensor를 보드의 D6에 연결합니다.

3\. Github 레포지터리의 'zombieIntelEdisonCode' 폴더에서 소스 코드를 모두 에디슨에 다운로드합니다. main.js 파일(애플리케이션)과 package.json (의존성 라이브러리) 파일로 구성되어 있습니다. **wget**을 이용하여 Github 레포지터리에서 raw file을 바로 다운로드 하시면 됩니다. 

3\. 이제 Node.js 앱에서 필요한 라이브러리를 설치합니다. main.js가 위치한 디렉토리에서 **$npm install**을 입력합니다. 몇 분 정도가 걸릴 수 있으며, 경고가 나오더라도 조금 기다리면 됩니다. 기다리는 동안 아래 4번을 진행하세요.

4\. IAM 사용자 Access Key와 Secret Access Keys를 만들어서 SNS 토픽 메시지를 제공해야 합니다. [IAM 사용자 생성 가이드](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)를 참고하시기 바랍니다. 

* AWS 관리 콘솔의 [IAM User](https://console.aws.amazon.com/iam/home?#users)에 가신 후, **Create New Users**를 누른 후, "zombiesns"라는 사용자를 만듭니다. **Generate an access key for each user**를 체크한 상태에서, **Create** 버튼을 누르면, 자동으로 인증키들이 만들어져 "credential.csv" 파일로 다운로드 가능합니다.

* 이제, 생성된 "zombiesns" 사용자에게 SNS 사용 권한을 설정해야 합니다. IAM 사용자 관리 화면에서 zombiesns를 선택하고, **Permissions** 탭을 누르고, Managed Policies에서 Inline Policies를 눌러 **click here**를 선택하고, **Custom Policy**에서 아래 정책 코드를 입력합니다.

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

5\. 자 이제, AWS 키 정보, 리전 정보, SNS 토픽 정보를 클라이언트 프로그램인 main.js 파일에 모두 설정합니다. 

``` 
AWS.config.update({accessKeyId: 'ENTER ACCESSKEY HERE', secretAccessKey: 'ENTER SECRET ACCESS KEY HERE', region: 'ENTER REGION HERE'}); 
```

6\. 아래는 SNS 토픽이 만든 리전을 입력합니다. (예: us-west-2)

``` 
var sns = new AWS.SNS({region: 'ENTER REGION HERE'}); 
```

7\. 아래는 SNS 토픽에서 만든 ARN 주소를 붙여 넣습니다.

``` 
TopicArn: "ENTER YOUR SNS TOPIC ARN HERE" 
```

8\. 이제 여러분의 앱이 에디슨 기기에서 실행되면 SNS 토픽을 게시합니다. AWS Lambda 함수에서 이들 메시지를 받아서 처리를 합니다. 좀 더 자세한 부분은 [기술 문서](http://docs.aws.amazon.com/sns/latest/dg/sns-lambda.html)를 참고하시고, SNS 알림과 채팅 애플리케이션을 연동해 보겠습니다. 

####SNS 토픽 메시지 채팅앱에 연동하기

본 실습에서는 좀비가 근처에 움직임이 포착됐을 때, 생존자에게 알림을 보내는 Lambda 함수를 만들게 됩니다. 여기서는 에디슨 디바이스로 부터 온 SNS 토픽을 Lambda 함수로 연결하고, 채팅 앱으로 푸시 알림을 보내는 것을 설명합니다.

1\. Lambda 콘솔에서 **Create a Lambda function**를 누릅니다.

2\. 샘플 코드 화면은 **Blank Function 박스**를 누릅니다.

3\. 트리거 설정 화면 (**Configure Triggers**)에서는 이벤트 소스로서 Simple Notification Service를 선택합니다.

![Setup SNS as an Event Trigger for Lambda](/Images/Sensor-Step3.png)

* SNS 토픽을 선택할 때, 드롭다운 메뉴에서 이미 만들 것을 선택하거나, 제공한 토픽 ARN값을 입력합니다. **Next**를 누릅니다.

* SNS 토픽 ARN이 AWS로 부터 받은 것이면, 여러분의 계정에서는 보이지 않습니다. 다른 계정의 것이라면, 직접 타이핑하셔야 합니다.  
4\. "Configure Function" 화면에서, 이름은 "[Your CloudFormation Stack Name]-sensor"와 비슷하게 적고, Github 레포지터리 lambda 폴더의 **exampleSNSFunction.js** 파일을 엽니다. [코드 경로](/zombieSensor/lambda/exampleSNSFunction.js)에서 파일을 열어, 소스 코드를 복사해서 코드 편집기에 붙여 넣기를 합니다.

Lambda 함수 편집기에 붙여 넣을 때, 소스 코드 상의 몇 가지 변수를 수정해야 합니다. **API** 항목에서 **API.endpoint**에는 /zombie/message/post API 엔드포인트인 **https://xxxxxxxx.execute-api.us-west-2.amazonaws.com**와 같은 주소를 넣습니다. 여러분이 만든 API Gateway 콘솔 상 만든 API의 "Invoke URL"입니다. ".com"이후에 다른 경로는 넣으시면 안됩니다. **API.region** 변수는 여러분이 사용 중인 리전 코드를 넣습니다.

5\. **Role**에서는 **Choose an existing role**를 선택하고 드롭 다운 메뉴에서 기존에 사용 해왔던 ZombieLabLambdaRole을 선택합니다. 이름이 "[Your CloudFormation stack name]-ZombieLabLambdaRole"와 유사합니다.

6\. **Timeout** 설정은 **30** 초로 하고, 나머지는 모드 기본값으로 둔 후 **Next**를 누릅니다.

7\. Review 페이지에서 **Create function**를 선택합니다.

8\. 이제 에디슨 보드로 돌아가서 Node.JS 앱을 실행 해 봅니다. **$ node main.js**를 실행하고, 모션 센서에 손을 가져다 되면 생존자 채팅앱에는 알림이 오게 됩니다. 만약 로그아웃 되었다면, 다시 로그인 해보시기 바랍니다.  

* 인텔 에디슨 보드와 연결된 모션 센서에서 만든 SNS 토픽이 발생 될 때 마다 생존자 채팅앱에 알림이 전달 됩니다. 같은 SNS 토픽에 가입한 모든 생존자는 같은 알림을 받을 수 있습니다.  

* Lambda 함수는 좀비 센서로 받은 SNS 메시지를 파싱하고, 이를 AWS SigV4로 서명한 HTTPS POST 호출을 API Gateway로 전달합니다. 엔드포인트에서는 DynamoDB에 메시지를 기록하고, 채팅앱에서 주기적으로 내용을 가져오게 됩니다.

## 워크샵 종료

1\. 지금까지 사용한 모든 환경을 종료하려면, CloudFormation 콘솔에서 만들어진 Stack을 삭제하면 됩니다. 단, 몇 가지 리소스 의존성이 있기 때문에 먼저 아래 2-6\ 단계의 삭제 과정을 거친 후 삭제하면 됩니다.

2\. TwilioProcessing Lambda 함수를 삭제합니다. 더이상 Twilio를 사용하지 않으면, 계정도 삭제합니다.

3\. Elasticsearch cluster와 관련 Lambda 함수도 삭제합니다.

4\. Slack 연동과 관계된 Lambda 함수를 삭제합니다. Slack을 더 이상 쓰지 않으면 계정도 삭제합니다.

5\. SNS 토픽과 연동과 관계된 Lambda 함수를 삭제합니다.  

6\. Cognito User Pool 및 Identity Pool을 삭제합니다.

* User Pool: User Pool에서 "Delete pool" 버튼을 누르면 됩니다.

* Identity Pool: Cognito의 Federated Identities 페이지에서 Identity Pool을 찾아서 ([stackname]-identitypool) **Edit identity pool**를 선택한 후, 아래로 스크롤 한 후 삭제 버튼을 누르면 됩니다.

7\. CloudWatch Logs 화면으로 가서 불필요한 로그 그룹은 삭제합니다.

8\. 위의 리소스를 모두 삭제했다면, CloudFormation 콘솔에서 워크샵 시작 때 만든 Stack을 선택 한 후, **Delete Stack**을 누릅니다.

* Stack을 성공적으로 지웠다면, 목록에 지워집니다. 모두 지우는데 몬제가 있는 경우, [AWS Support](https://console.aws.amazon.com/support/home)의 추가 기술 지원을 받으시면 됩니다.

* * *

## 부록

* 추가 도전 과제: 본 워크샵에서는 생존자의 모든 메시지는 'default' 채널의 데이터베이스에 저장됩니다. 여러분이 관심이 있으시다면, 생존자를 "Camp" 별로 분류하여 메시지를 주고 받는 시스템을 개선할 수 있습니다. 현재 'channel' 속성의 값을 변경함으로서 해보실 수 있습니다. 
