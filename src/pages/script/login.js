import { CognitoUserPool }from 'amazon-cognito-identity-js'

import AWS from 'aws-sdk'


//ログイン処理用関数


   function login(num,id){

      //AWSSDK設定
       var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:process.env.VUE_APP_ID_POOL_ID});

       AWS.config.update({
         credentials:myCredentials,
         region: "ap-northeast-1"
       });

      //ユーザープール設定
      var poolData = {
         UserPoolId: process.env.VUE_APP_POOL_ID,
         ClientId: process.env.VUE_APP_CLIENT_ID,
       };
       const userPool = new CognitoUserPool(poolData);
       //ログインユーザー取得
       const cognitoUser = userPool.getCurrentUser();

       //変数指定
       var currentUserData = {};
       var i=0;

       //cognito使用関数の設定
       var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
      //ログインユーザーが無ければログインページに遷移
       if (cognitoUser != null) {
         cognitoUser.getSession(function(err) {
            if (err) {
                console.log(err);
                location.assign('http://54.250.168.147:8080/login?id='+id);
            } else {
                // ユーザの属性を取得しエラーなら遷移
                cognitoUser.getUserAttributes(function(err, result) {
                    if (err) {
                        location.assign('http://54.250.168.147:8080/login?id='+id);
                    }

                    // 取得した属性情報を連想配列に格納
                    for (i = 0; i < result.length; i++) {
                        currentUserData[result[i].getName()] = result[i].getValue();
                    }
                    //group取得しエラーなら遷移
                    var params={
                      UserPoolId: process.env.VUE_APP_POOL_ID,
                      Username: currentUserData["email"]
                    }
                    cognitoidentityserviceprovider.adminListGroupsForUser(params, function(err, data) {
                     if (err){
                         location.assign('http://54.250.168.147:8080/login?id='+id);
                     }
                     //グループに所属していなければ遷移
                     if(data.Groups[num]==null){
                         location.assign('http://54.250.168.147:8080/login?id='+id);
                     }
                   });

                });
            }
         });
       } else {
        location.assign('http://54.250.168.147:8080/login?id='+id);
      }
    }


  export { login }
