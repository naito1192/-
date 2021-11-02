<template>

<div id="test" class="test">
<div>
<Header/>
</div>
<div>
hello
</div>
<button @click=logout></button>
<button @click=test>test</button>
<button @click=imgtest>imgtest</button>

<img :src="img1">
<img v-if="count == 1" :src="dataUrl[0]" width="300" height="400">

</div>
</template>
<script>
  import {
    CognitoUserPool
  } from 'amazon-cognito-identity-js'

  import { login } from './script/login'
  import { getdata } from './script/getdata'
  import { getimg } from './script/getimg'
  import Header from "./components/Header.vue";  
  export default {
   name:"test",
   data(){
     return{
       data:[],
       img1:"",
       dataUrl:[],
       count:"",
     };
   },
   created(){
      login(0)
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
       location.assign('http://54.250.168.147:8080/login?id=test');
     },
     test:function(){
       getdata("/v2/?minlat=10&minlng=10&maxlat=50&maxlng=150",this.data);
      },
      imgtest:function(){
        var url="/v3/?name=0_test.jpg";
        this.count=1;
        getimg(url,this.dataUrl);
      }
     
   
   },
   components: {
     Header

    }
  }
</script>
