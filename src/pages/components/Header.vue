<template>

<div id="app">
    <div class=title>
     <b>画像登録検証システム</b>
    
    <!--ハンバーガーメニューのボタン-->
    <div class="hamburger_btn" v-on:click='ActiveBtn=!ActiveBtn'>
      <span class="line line_01" v-bind:class="{'btn_line01':ActiveBtn}"></span>
      <span class="line line_02" v-bind:class="{'btn_line02':ActiveBtn}"></span>
      <span class="line line_03" v-bind:class="{'btn_line03':ActiveBtn}"></span>
    </div>
    <!--サイドバー-->
    <transition name="menu">
      <div class="menu" v-show="ActiveBtn">
          <ul>
              <li><a href="http://54.250.168.147:8080/map">地図表示</a></li>
              <li><a href="http://54.250.168.147:8080/upload">画像アップロード</a></li>
              <li><a href="#" @click="logout">ログアウト</a></li>
          </ul>
      </div>
  </transition>
  </div>
  </div>
</template>
<script>
  import {
    CognitoUserPool
  } from 'amazon-cognito-identity-js'
  export default {
    name: "app",
    data() {
      return {
        ActiveBtn: false
      }
    },
    methods:{
      logout(){
       var poolData = {
         UserPoolId: process.env.VUE_APP_POOL_ID,
         ClientId: process.env.VUE_APP_CLIENT_ID,
       };
       const userPool = new CognitoUserPool(poolData);
       const cognitoUser = userPool.getCurrentUser();

       cognitoUser.signOut()
       location.assign('http://54.250.168.147:8080/login?id=map');
     }
    }
  }
</script>
<style>
@import "./Header.css" 
</style>
