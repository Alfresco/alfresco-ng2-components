module.exports = {
    "/alfresco": {
        "target": "http://localhost:8080",
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
        "target": "http://localhost:9999",
        "secure": false,
        "pathRewrite": {
            "^/activiti-app/activiti-app": ""
        },
        "changeOrigin": true
    }
};
