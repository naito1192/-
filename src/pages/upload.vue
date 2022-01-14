<template>
  <div class="upload">
    
      <Header/>
      <form class="form">
      <div>
       <p>アップロード画像:</p>
        <input  type="file" ref="input" placeholder="ファイルを選択" @change="FILE" accept="image/jpeg" required multiple>
        <br><div class="warm">※複数画像選択の場合はCtrlを押しながら選択してください</div>
      </div>
      <p>状態:</p>
      <select class="col-md-3" v-model="select" >
	<option>修理中</option>
	<option>修理完了</option>
      </select>
      
      </form>
      <button class="upload-button" @click="upload">アップロード</button>
      <div class="explanation">アップロードできる画像は拡張子が【.jpg】,【.jpeg】,【.JPG】,【.JPEG】の画像のみです。<br>またアップロードした画像にEXIF座標データがないと地図上に表示されませんので注意してください。</div>
  </div>

</template>

<style>
  @import "./upload.css"
</style>

<script>

  //ライブラリのインポート
 
  import axios from 'axios'
  import { login } from './script/login'
  import Header from "./components/Header.vue"

  export default {
   name:"upload",
   //グローバル変数設定
   data(){
     return{
       upload_img: [],
       img_name: [],
       api_url: [],
       img_url: '',
       select: '',
       num:0,
     };
   },
   created(){
      login(0,"upload");
    },
    methods:{

      //ファイル取得関数//

      FILE:function(e) {
        
        var files = e.target.files || e.dataTransfer;
	this.upload_img=[];
        this.img_name=[];
        // ファイルが選択されたらリストに入れる
        for (var i = 0; i < files.length; i++) {
          this.upload_img.push(files[i]);        
          this.img_name.push(files[i].name);
        
        }
      },

     //画像送信関数//

      putimage:async function(url,img){
       //送信処理
       await axios.put(
          //送信URL
          url,
          //送信画像
          img,
          //送信画像の情報
          {
            headers:{
              'content-type':'image/jpeg'
            }
          
          //送信成功時処理
          }).then(response =>{
             return response;

          //送信失敗時処理  
          }).catch(e=>{
             alert(e);
        });
      },

     //複数画像送信関数//

      upload:async function(){
           
        if(this.select==""){
          
          
          alert("選択肢を入れてください");
          
        }else if(this.select=="修理中"){


          //inputされた画像分処理を繰り返す
          
          while(this.num==0){
            
            if(!this.img_name.length){
              break;
            }else{
              this.api_url.push("/v1/S3URL/"+"0_"+this.img_name[0]);
              this.img_name.splice(0,1);
            }
         
          }
     
          //inputされた画像分処理を繰り返す
          
          while(this.num==0){
            if(!this.api_url.length){
              alert("ok");
              break;
            }else{
              await this.putimage(this.api_url[0],this.upload_img[0]);
              this.api_url.splice(0,1);
              this.upload_img.splice(0,1);
            }

          }
          this.$router.go({path: this.$router.currentRoute.path, force: true})
          

        }else if(this.select=="修理完了"){

         //inputされた画像分処理を繰り返す

         while(this.num==0){
            if(!this.img_name.length){
              break;
            }else{
              this.api_url.push("/v1/S3URL/"+"1_"+this.img_name[0]);
              this.img_name.splice(0,1);
            }

          }

          //inputされた画像分処理を繰り返す

          while(this.num==0){
            if(!this.api_url.length){
              alert("ok");
              break;
            }else{
              await this.putimage(this.api_url[0],this.upload_img[0]);
              this.api_url.splice(0,1);
              this.upload_img.splice(0,1);
           }

          }
          this.$router.go({path: this.$router.currentRoute.path, force: true})
        }
      }
    },
    components: {
      Header

    }
  }
</script>
