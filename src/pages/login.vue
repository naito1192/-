<template>
  <div class="login">
    <div class=title><b>画像登録検証システム</b></div>
    <form class="form" @submit.prevent="login">
      <div class="col-md-12 center-block">
        <div  class="user">
        ユーザーネーム:
        </div>
        <input class="user-box col-md-3" type="text" placeholder="username" v-model="username" required>
      </div>
      <div >
        <div class="pass">
        パスワード:
        </div>
        <input class="pass-box col-md-3" type="password" placeholder="password" v-model="password" required>
      </div>
      <button class="login-button ">ログイン</button>
    </form>
    
    
  </div>
</template>
<style>
  
  @import "./login.css"
  
</style>

<script>

  //ライブラリのインポート
  import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
  
  } from 'amazon-cognito-identity-js'

 
  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: ''
      }
    },

    methods: {
      login() {
       
        //cognito設定
        var poolData = {
          UserPoolId: process.env.VUE_APP_POOL_ID,
          ClientId: process.env.VUE_APP_CLIENT_ID,
        };
        var userPool = new CognitoUserPool(poolData);

        //cognitoパラメータ設定
        var username = this.username;
        var password = this.password;

        var authenticationData = {
          Username: username,
          Password: password,
        };
        
        var authenticationDetails = new AuthenticationDetails(
          authenticationData
        );

        var userData = {
          Username: username,
          Pool: userPool,
        };

        var cognitoUser = new CognitoUser(userData);
    
        //ログイン処理
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function() {  
            var url = new URL(window.location.href);
            var params = url.searchParams;
            var id = params.get('id');
            var result="http://URL:8080/"+id;
            location.assign(result);
            

          },
          onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
          }
        });   
      }
    }
  }
</script>
