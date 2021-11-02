<template>
<div>
    <input
        id="search-bar"
        class="controls"
        type="text"
        placeholder="　住所または場所に関するキーワードを入力してください"
        v-model="keyword"
        @change="movemap"
    >
    
</div>
</template>
<script>
    import axios from 'axios'

    export default {
        props: ["map", "google"],
        data() {
            return {
                keyword: ""
            };
        },
        mounted() {
            // 検索窓の設置
            let searchBox = this.$el.querySelector("#search-bar");
            
            this.map.controls[this.google.maps.ControlPosition.TOP_CENTER].push(
                searchBox
            );
        },
        methods: {
            
            movemap(){
              //住所を座標に変換
              axios
              .get("https://maps.googleapis.com/maps/api/geocode/json", {
                params: { language: "ja", address: this.keyword, key: process.env.VUE_APP_MAP_API_KEY }
              })
              //情報取得成功
              .then(response =>{
                //緯度経度取得
                var latiube = response.data.results[0].geometry.location.lat;
                var longitube = response.data.results[0].geometry.location.lng;

                this.map.panTo(new this.google.maps.LatLng(latiube,longitube));
             })
             //情報取得失敗
            .catch(error => {
              alert("Error: " + error);
            });
            this.$emit("inputKeyword", this.keyword);
          },
        }
    };
</script>
<style>
#search-bar {
width: 80%;
height: 40px;
font-size: 16px;
margin-top: 20px;
border: 1px solid #ddd;
border-radius: 3px;
}
</style>

