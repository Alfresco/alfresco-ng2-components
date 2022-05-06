require('dotenv').config();

const { getDeployedAppsProxy, getShareProxy, getApsProxy } = require('./proxy-helpers');

const legacyHost = process.env.PROXY_HOST_ADF;
const cloudHost = process.env.CLOUD_PROXY_HOST_ADF;
const cloudApps = process.env.APP_CONFIG_APPS_DEPLOYED;
const apsHost = process.env.PROXY_HOST_ADF;

module.exports = {
    ...getShareProxy(legacyHost),
    ...getApsProxy(apsHost),
    ...getDeployedAppsProxy(cloudHost, cloudApps)
};
