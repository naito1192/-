module.exports = {
  devServer: {
    proxy:{
      '/v1':{
         target:'APIURL'
      },
      '/v2':{
         target:'APIURL'
     },
     '/v3':{
         target:'APIURL'
     }
    }
  }
};
