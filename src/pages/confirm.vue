<template>
  <div id="confirm">
    <Header/>
    <form class="form" @submit.prevent="confirm">
      <div class="confirm">
        <p>メール:</p>
        <input class="col-md-3" type="text" placeholder="メール" v-model="username" required>
      </div>
      <div class="confirm">
        <p>認証番号:</p>
        <input class="col-md-3" type="text" placeholder="認証コード" v-model="confirmationCode" required>
      </div>
      <button class="confirm-button">確認</button>
    </form>
  </div>
</template>
<style>
@import "./confirm.css" 
</style>

<script>

  //ライブラリのインポート
  import {
    CognitoUserPool,
    CognitoUser
  } from 'amazon-cognito-identity-js';

  import Header from "./components/Header.vue";

  export default {
    name: 'Confirm',
    data () {
      return {
        username: '',
        confirmationCode: ''
      }
    },
    methods: {
      confirm () {
        //cognito設定
        var poolData = {
         UserPoolId: process.env.VUE_APP_POOL_ID,
         ClientId: process.env.VUE_APP_CLIENT_ID,
       };
        var userPool = new CognitoUserPool(poolData);

        //cognitoに送信するパラメータ設定
        var username = this.username;
        var code = this.confirmationCode;

        var userData = {
          Username: username,
          Pool: userPool,
        };

        var cognitoUser = new CognitoUser(userData);
        //ユーザー認証
        cognitoUser.confirmRegistration(code, true, function(err, result) {
          if (err) {
            alert('エラー:'+err.message || JSON.stringify(err));
            return;
          }
          console.log('call result: ' + result);
          alert("認証完了しました");
        });
      }    
    },
    components: {
      Header

    }
  }
</script>
