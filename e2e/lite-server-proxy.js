var PROXY_HOST_ADF = process.env.PROXY_HOST_ADF;
var HOST = process.env.URL_HOST_ADF;

let proxy = require('http-proxy-middleware');

let targetProxy = 'http://' + (PROXY_HOST_ADF || HOST);
let fallback = require('connect-history-api-fallback');

module.exports = {
    'port': 4200,
    open: false,
    server: {
        middleware: {
            1: proxy('/alfresco', {
                target: targetProxy,
                changeOrigin: true,
                pathRewrite: {
                    "^/alfresco/alfresco": ""
                }
            }),
            2: proxy('/activiti-app', {
                target: targetProxy,
                changeOrigin: true,
                "pathRewrite": {
                    "^/activiti-app/activiti-app": ""
                }
            }),
            3: fallback({index: '/index.html', verbose: true})
        }
    }
};
