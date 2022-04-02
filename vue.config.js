module.exports = {
    configureWebpack: {
      devtool: "source-map"
    },
    devServer:{
      proxy: {
        "/api": {
        "target": 'http://localhost:5208',
        "pathRewrite": { '^/api': '' },
        "changeOrigin": true,
        "secure": false
        }
      }
    }
  };