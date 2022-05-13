require('dotenv').config();

const { getDeployedAppsProxy, getShareProxy, getApsProxy } = require('./proxy-helpers');

const legacyHost = process.env.PROXY_HOST_ADF;
const cloudHost = process.env.CLOUD_PROXY_HOST_ADF || process.env.PROXY_HOST_ADF;
const cloudApps = process.env.APP_CONFIG_APPS_DEPLOYED;
const apsHost = process.env.PROXY_HOST_ADF;

module.exports = {
    "/alfresco": {
        "target": (PROXY_HOST_ADF || "http://localhost:8080"),
        "secure": false,
        "pathRewrite": {
            "^/alfresco/alfresco": ""
        },
        "changeOrigin": true,
        // workaround for REPO-2260
        onProxyRes: function (proxyRes, req, res) {
            const header = proxyRes.headers['www-authenticate'];
            if (header && header.startsWith('Basic')) {
                proxyRes.headers['www-authenticate'] = 'x' + header;
            }
        }
    },
    "/activiti-app": {
        "target": (PROXY_HOST_ADF || "http://localhost:8080"),
        "secure": false,
        "pathRewrite": {
            "^/activiti-app/activiti-app": ""
        },
        "changeOrigin": true
    }
};
