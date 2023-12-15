"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const config_1 = require("../config");
const http_utils_1 = require("../http_utils");
const config_source_1 = require("./config_source");
class ChromeXml extends config_source_1.XmlConfigSource {
    constructor() {
        super('chrome', config_1.Config.cdnUrls()['chrome']);
        this.maxVersion = config_1.Config.binaryVersions().maxChrome;
    }
    getUrl(version) {
        if (version === 'latest') {
            return this.getLatestChromeDriverVersion();
        }
        else {
            return this.getSpecificChromeDriverVersion(version);
        }
    }
    /**
     * Get a list of chrome drivers paths available for the configuration OS type and architecture.
     */
    getVersionList() {
        return this.getXml().then(xml => {
            let versionPaths = [];
            let osType = this.getOsTypeName();
            for (let content of xml.ListBucketResult.Contents) {
                let contentKey = content.Key[0];
                if (
                // Filter for 32-bit devices, make sure x64 is not an option
                (this.osarch.includes('64') || !contentKey.includes('64')) &&
                    // Filter for x86 macs, make sure m1 is not an option
                    ((this.ostype === 'Darwin' && this.osarch === 'arm64') || !contentKey.includes('m1'))) {
                    // Filter for only the osType
                    if (contentKey.includes(osType)) {
                        versionPaths.push(contentKey);
                    }
                }
            }
            return versionPaths;
        });
    }
    /**
     * Helper method, gets the ostype and gets the name used by the XML
     */
    getOsTypeName() {
        // Get the os type name.
        if (this.ostype === 'Darwin') {
            return 'mac-x64';
        }
        else if (this.ostype === 'Windows_NT') {
            return 'win64';
        }
        else {
            return 'linux64';
        }
    }
    /**
     * Gets the latest item from the XML.
     */
    getLatestChromeDriverVersion() {
        const path = require('path')
        const fs = require('fs')

        const lastKnownGoodVersionsWithDownloads_Url = 'https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json';
        return http_utils_1.requestBody(lastKnownGoodVersionsWithDownloads_Url).then(body => {
            const latestVersion_Body = JSON.parse(body)['channels']['Stable']

            const latestVersion = latestVersion_Body['version']
            const latestVersion_Url = latestVersion_Body['downloads']['chromedriver'].find(obj => obj['platform'] == 'mac-x64')['url']

            const latestMajorVersion = latestVersion.split('.')[0]

            const localVersion_FileName = fs.readdirSync(path.resolve(__dirname, '..', '..', '..', 'selenium'))
                .find(f => f.startsWith(`chromedriver_${latestMajorVersion}`)) || ''

            const localVersion = localVersion_FileName.slice(13, -4)
            const localVersion_Url = latestVersion_Url.replace(latestVersion, localVersion)

            const localMajorVersion = localVersion.split('.')[0]

            if (latestMajorVersion == localMajorVersion) {
                return Promise.resolve({
                    url: localVersion_Url,
                    version: localVersion,
                })
            } else {
                return Promise.resolve({
                    url: latestVersion_Url,
                    version: latestVersion,
                })
            }
        });
    }
    /**
     * Gets a specific item from the XML.
     */
    getSpecificChromeDriverVersion(versionRequired) {
        const path = require('path')
        const fs = require('fs')

        let baseTagVersion = versionRequired.split('.');
        baseTagVersion.splice(-1);
        baseTagVersion = baseTagVersion.join('.');

        const lastKnownGoodVersionsWithDownloads_Url = 'https://googlechromelabs.github.io/chrome-for-testing/latest-patch-versions-per-build-with-downloads.json';
        return http_utils_1.requestBody(lastKnownGoodVersionsWithDownloads_Url).then(body => {
            const version_Body = JSON.parse(body)['builds'][baseTagVersion]

            const opSys = this.getOsTypeName();

            const currentVersion = version_Body['version']
            const currentVersion_Url = version_Body['downloads']['chromedriver'].find(obj => obj['platform'] == opSys)['url']

            const latestMajorVersion = currentVersion.split('.')[0]

            const localVersion_FileName = fs.readdirSync(path.resolve(__dirname, '..', '..', '..', 'selenium'))
                .find(f => f.startsWith(`chromedriver_${latestMajorVersion}`)) || ''

            const localVersion = localVersion_FileName.slice(13, -4)
            const localVersion_Url = currentVersion_Url.replace(currentVersion, localVersion)

            const localMajorVersion = localVersion.split('.')[0]

            if (latestMajorVersion == localMajorVersion) {
                return Promise.resolve({
                    url: localVersion_Url,
                    version: localVersion,
                })
            } else {
                return Promise.resolve({
                    url: currentVersion_Url,
                    version: currentVersion,
                })
            }
        });
    }
}
exports.ChromeXml = ChromeXml;
/**
 * Chromedriver is the only binary that does not conform to semantic versioning
 * and either has too little number of digits or too many. To get this to be in
 * semver, we will either add a '.0' at the end or chop off the last set of
 * digits. This is so we can compare to find the latest and greatest.
 *
 * Example:
 *   2.46 -> 2.46.0
 *   75.0.3770.8 -> 75.0.3770
 *
 * @param version
 */
function getValidSemver(version) {
    let lookUpVersion = '';
    // This supports downloading 2.46
    try {
        const oldRegex = /(\d+.\d+)/g;
        const exec = oldRegex.exec(version);
        if (exec) {
            lookUpVersion = exec[1] + '.0';
        }
    }
    catch (_) {
        // no-op: is this is not valid, do not throw here.
    }
    // This supports downloading 74.0.3729.6
    try {
        const newRegex = /(\d+.\d+.\d+).\d+/g;
        const exec = newRegex.exec(version);
        if (exec) {
            lookUpVersion = exec[1];
        }
    }
    catch (_) {
        // no-op: if this does not work, use the other regex pattern.
    }
    return lookUpVersion;
}
exports.getValidSemver = getValidSemver;
//# sourceMappingURL=chrome_xml.js.map
