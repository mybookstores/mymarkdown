const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions:{
    electronBuilder:{
      builderOptions:{
        
          "productName":"mymarkdown",		
          "appId": "com.demp.demo",	 
          "copyright":"cjr", 
          win: {
            icon: "build/icons/icon.ico"
          }
      
      },
      externals:['electron-store']
    }
  }
})
