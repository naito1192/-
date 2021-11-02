  import axios from 'axios'

  async function getdata(url,list){
       //送信処理
       await axios.get(
          url,
          {
            headers:{
              'content-type':'application/json'
            },
            responseType:'json'

          //送信成功時処理
          }).then(responce =>{
             list.push(responce["data"]);
             console.log(list)
          //送信失敗時処理
          }).catch(e=>{
             alert(e);
        });
      }

  export { getdata }
