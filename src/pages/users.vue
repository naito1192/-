<template>
  <div class="signup">
    <Header/>          
      <div class="mail">
        <p>
        メールアドレス:
        </p>
        <input class="col-md-3" type="text" placeholder="メール" v-model="username" required>
      </div>
      <div class="mail">
        <p>
        パスワード:
        </p>
        <input class="col-md-3" type="password" placeholder="パスワード" v-model="password" required>
      </div>
      <div class="mail">
        <p>
        パスワード(確認):
        </p>
        <input class="col-md-3" type="password" placeholder="パスワード(確認)" v-model="passwordConfirm" required>
      </div>
      <button class="user-button" @click="signup(1)">ユーザー作成</button>
      <button class="admin-button" @click="signup(0)">管理者作成</button>
  </div>
</template>

<style>
  @import "./users.css"
</style>
<script>

  //ライブラリのインポート
  import {
    CognitoUserPool,
    CognitoUserAttribute
  } from 'amazon-cognito-identity-js'
  import AWS from 'aws-sdk'
  import { login } from './script/login'  
  import Header from "./components/Header.vue";
  
  export default {
    name: 'Signup',
    //グローバル変数を指定
    data () {
      return {
        username: '',
        password: '',
        passwordConfirm: ''
      }
    },
    created(){
      login(1,"users");
    },
    methods:{
     //ユーザー作成関数//

      signup(num){
       //プール情報を設定
       var poolData = {
         UserPoolId: process.env.VUE_APP_POOL_ID, 
         ClientId: process.env.VUE_APP_CLIENT_ID, 
       };
       
       //AWSSDK設定
       var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:process.env.VUE_APP_ID_POOL_ID});

       AWS.config.update({
         credentials:myCredentials,
         region: "ap-northeast-1"
       });              
      
       const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
       
       //cognitoidプールに送信するパラメーター設定
       const u_params = {
         GroupName: 'user',        
         UserPoolId: process.env.VUE_APP_POOL_ID, 
         Username: this.username 
       };
       const a_params = {
         GroupName: 'Administrator',
         UserPoolId: process.env.VUE_APP_POOL_ID,
         Username: this.username
       };

       //cognitoユーザープールに送信する
       var userPool = new CognitoUserPool(poolData);
       var username = this.username;
       var password = this.password;
       var confirm = this.passwordConfirm;
       
 
       const dataEmail = { Name: 'email', Value: username };
       const attributeList = [];
       attributeList.push(new CognitoUserAttribute(dataEmail));
       
        
       //passwordと確認passwordが一致するかを確認       
       if(password==confirm){
       
       //ユーザーをユーザープールに追加
       userPool.signUp(username, password, attributeList, null, function(
           err,
           result
       ) {
           if (err) {
             alert('エラー:'+err.message || JSON.stringify(err));
             return;
           }

           //ユーザーをグループに追加
           cognitoidentityserviceprovider.adminAddUserToGroup(u_params, function(err, data) {
          
             if (err){
               console.log(err);
               return;
             }
             if(num==0){
               cognitoidentityserviceprovider.adminAddUserToGroup(a_params, function(err) {

                 if (err){
                   console.log(err);
                   return;
                 }
               });   
             }
             console.log(data);            
             var cognitoUser = result.user;
             console.log('user name is ' + cognitoUser.getUsername());
             alert("アカウントの作成に成功しました");
           
           });
       });
       }else{alert("異なるパスワードが入力されています");}
      }
    },
    components: {
      Header

    }
  }
    
</script>
