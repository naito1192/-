<template>
<div id = "maps">
  <Header/>
  <div id="googlemap">
    <!---import時に付けた名前を入力ただし初めの文字以外の大文字の前はｰを入れる--->
   
    <google-map/>
    <div v-if = "!!this.google && !!this.map">
    
      <search-bar
        :map = "map"
        :google = "google"
        @inputKeyword = "returnkeyword"
      
      />
   
    </div>
  </div>
  <div id="load" v-if="this.load==1">
   <p> Loading now</p>
  </div>
</div>
</template>
<style>
  @import "./map.css"
</style>
<script>
  /*global google:true*/
  import $Scriptjs from "scriptjs";
  import MarkerClusterer from '@google/markerclusterer';
  import GoogleMap from "./components/Map.vue";
  import SearchBar from "./components/SearchBar.vue";
  import { getdata } from "./script/getdata";
  import { getimg } from "./script/getimg";
  import Header from "./components/Header.vue";
  import { login } from "./script/login"
  const API_KEY = process.env.VUE_APP_MAP_API_KEY;
  
  const API_URL =
  "https://maps.googleapis.com/maps/api/js?key=" +
  API_KEY +
  "&libraries=places";
  //変数指定あとから編集可能
  export default {
    name: "maps",
    data() {
      return {
        initialPlace: {
        lat: 35.681236,
        lng: 139.767125
        },
        zoom: 17,
        map: null,
        google: null,
        result: ""  ,
        keyword: "",
        exifdata:[],
        contentlist:[],
        load:0,
        clusterer:[],
        marker:""
      };
    },
    //APIアクセス
    created() {
      login(0,"map");
      //非同期でURLを読み込み関数実行
      $Scriptjs(API_URL, () => this.initMap());
    },
    //メソッドを作成（キャッシュを作成しないので呼び出されるたびに処理する）
    methods: {

      //マップ設置関数//

      initMap() {
        const mapElement = document.getElementById("map");
        this.google = google;
        this.map = new google.maps.Map(mapElement, {
          center: this.initialPlace,
          zoom: this.zoom,
          disableDefaultUI: true
        });
        
        
        //マップが移動したら関数起動 
        this.google.maps.event.addListener(this.map,"idle", this.putMarker);

        }, 
     
        //マーカー設置関数//

        putMarker:async function(){
           
          
          if(this.load==1){
            return;
          }
          this.load=1;
          
          //初めにマーカー削除
          
          this.clusterer.forEach(function (marker) { marker.setMap(null); });
          this.clusterer=[];
            
          
          //地図範囲取得
          var latlngBounds = this.map.getBounds();
          var swLatlng = latlngBounds.getSouthWest();
          var swlat = String(swLatlng.lat());
          var swlng = String(swLatlng.lng());
          
          var neLatlng = latlngBounds.getNorthEast();
          var nelat = String(neLatlng.lat());
          var nelng = String(neLatlng.lng());
          
          //EXIFdata取得
          var exifdata=[];
          var url='/v2/?minlat='+swlat+'&minlng='+swlng+'&maxlat='+nelat+'&maxlng='+nelng;
          await getdata(url,exifdata);
          console.log(exifdata);
          //データの数だけループ
          var imgurl={};
          var promise_ary=[];
          for(var s = 0; s<exifdata[0].length; s++){
            for(var t=0; t<exifdata[0][s]["filename"].length;t++){
              var promise = getimg(exifdata[0][s]["filename"][t],imgurl);
              promise_ary.push(promise);
            }
          }
         
          Promise.all(promise_ary).then((result) =>{
          
          for(var i = 0; i<exifdata[0].length; i++){
            //var imgurl=[];
            var contents="";
            //ファイル名リストの分だけループ
            for(var j=0; j<exifdata[0][i]["filename"].length;j++){
              //画像取得
              //await getimg(exifdata[0][i]["filename"][j],imgurl);
              //情報ウインドに出すコンテンツ作成
              if(exifdata[0][i]["status"][j]==0){
                contents = contents + "<a target='_blank' href='url/v3/?name=" + exifdata[0][i]["filename"][j] + "'><img style='vertical-align:top;' width=" + exifdata[0][i]["w"][j]/4 + " height=" + exifdata[0][i]["h"][j]/4 + " src=" + imgurl[exifdata[0][i]["filename"][j]] + "></a>　<div style='display:inline-block'><p>状態：作業中</p><p>日付："+exifdata[0][i]["time"][j]+"</p><p>緯度："+exifdata[0][i]["lat"][j]+"</p><p>経度："+exifdata[0][i]["lng"][j]+"</p></div><br><br>";
               
              }
              if(exifdata[0][i]["status"][j]==1){
                contents = contents + "<a target='_blank' href='url/v3/?name=" + exifdata[0][i]["filename"][j] + "'><img style='vertical-align:top;' width=" + exifdata[0][i]["w"][j]/4 + " height=" + exifdata[0][i]["h"][j]/4 + " src=" + imgurl[exifdata[0][i]["filename"][j]] + "></a>　<div style='display:inline-block'><p>状態：作業完了</p><p>日付："+exifdata[0][i]["time"][j]+"</p><p>緯度："+exifdata[0][i]["lat"][j]+"</p><p>経度："+exifdata[0][i]["lng"][j]+"</p></div><br><br>";                
                
             }
             
            }
            
                
            var marker ="";
            
            //マーカー設置
            if(exifdata[0][i]["status"][j-1]==0){
              marker=new google.maps.Marker({
                position:{lat: parseFloat(exifdata[0][i]["lat"][j-1]), lng:parseFloat(exifdata[0][i]["lng"][j-1])} ,
                map: this.map,
                icon: {
                  url: require('./icon/pin_p.png'),
                  scaledSize: new google.maps.Size(45, 45),
                  labelOrigin: new this.google.maps.Point(15,30)
                },
                label: {
                  text: exifdata[0][i]["time"][j-1],         //ラベル文字
                  color: '#ff0000',          //ラベル文字の色
                  fontFamily: 'sans-serif',  //フォント
                  fontWeight: 'bold',        //フォントの太さ
                  fontSize: '14px'           //フォントのサイズ
               }
              });
            }

            if(exifdata[0][i]["status"][j-1]==1){
              marker=new google.maps.Marker({
                position:{lat: parseFloat(exifdata[0][i]["lat"][j-1]), lng:parseFloat(exifdata[0][i]["lng"][j-1])} ,
                map: this.map,
                icon: {
                  url: require('./icon/pin_b.png'),
                  scaledSize: new google.maps.Size(45, 45),
                  labelOrigin: new this.google.maps.Point(15,30)
                },
                label: {
                  text: exifdata[0][i]["time"][j-1],         //ラベル文字
                  color: '#ff0000',          //ラベル文字の色
                  fontFamily: 'sans-serif',  //フォント 
                  fontWeight: 'bold',        //フォントの太さ 
                  fontSize: '14px'           //フォントのサイズ 
               } 
                
              });
            }
            
            //コンテンツ設置関数起動
            this.attachMessage(marker,contents);
            //マーカーリストにマーカを追加
         
            this.clusterer.push(marker);
          
          }
          
          this.makeClusterer();
          this.load=0;
          console.log(result);
          
          });
         
      }, 

      //情報ウィンド設置関数//

      attachMessage:function(marker, msg) {
        google.maps.event.addListener(marker, 'click', function() {
          new google.maps.InfoWindow({
            content: msg  
          }).open(marker.getMap(), marker);
                   
        });
        
      },
      
      
      
      //クラスター設置関数//

      makeClusterer:function(){
        if(this.clusterer.length != 0){
          
          this.marker=new MarkerClusterer(this.map,this.clusterer, {
            imagePath:'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
          });
        }
      },

      //検索バーの値をグローバル変数に代入//
  
      returnkeyword(keyword){
        this.keyword=keyword;
      }
      

    },
    components: {
      GoogleMap,
      SearchBar,
      Header
                  
    }
  };
</script>
