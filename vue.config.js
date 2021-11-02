module.exports = {
  devServer: {
    proxy:{
      '/v1':{
         target:'https://ayueec3is3.execute-api.ap-northeast-1.amazonaws.com'
      },
      '/v2':{
         target:'https://alojamhogk.execute-api.ap-northeast-1.amazonaws.com'
     },
     '/v3':{
         target:'https://1mbd6zxh6g.execute-api.ap-northeast-1.amazonaws.com'
     }
    }
  }
};
