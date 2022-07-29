module.exports = {
    getDeployedAppsProxy: function(processHost, deployedApps) {
        let deployedAppProxy = {};

        if (deployedApps) {
            try {
                const deployedAppsArray = JSON.parse(deployedApps);
                for (const app of deployedAppsArray) {
                    const appName = app.name;
                    const appPath = `/${appName}`;
                    const appPathRewrite = `^/${appName}`;

                    deployedAppProxy = {
                        ...deployedAppProxy,
                        [appPath]: {
                            target: `${processHost}`,
                            secure: false,
                            pathRewrite: {
                                [appPathRewrite]: appName,
                            },
                            changeOrigin: true,
                        },
                    };
                }
            } catch (e) {
                console.log(e);
            }
        }

        return deployedAppProxy;
    },
    getShareProxy: function(host) {
        console.log('Target for /alfresco', host);
        return {
            '/alfresco': {
                target: host,
                secure: false,
                logLevel: 'debug',
                changeOrigin: true,
                onProxyReq: function(request) {
                    if(request["method"] !== "GET")
                        request.setHeader("origin", host);
                },
                // workaround for REPO-2260
                onProxyRes: function (proxyRes, req, res) {
                    const header = proxyRes.headers['www-authenticate'];
                    if (header && header.startsWith('Basic')) {
                        proxyRes.headers['www-authenticate'] = 'x' + header;
                    }
                },
            },
        }
    },
    getApsProxy: function(host) {
        console.log('Target for /activiti-app', host);
        return {
            '/activiti-app': {
                target: host,
                secure: false,
                logLevel: 'debug',
                changeOrigin: true,
            },
        }
    },
    getIdentityAdapterServiceProxy: function(host) {
        console.log('Target for /identity-adapter-service', host);
        return {
            '/identity-adapter-service': {
                target: host,
                secure: false,
                logLevel: 'debug',
                changeOrigin: true,
            },
        }
    }
};
