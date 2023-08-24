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
            return 'mac';
        }
        else if (this.ostype === 'Windows_NT') {
            return 'win';
        }
        else {
            return 'linux';
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
    getSpecificChromeDriverVersion(inputVersion) {
        return this.getVersionList().then(list => {
            const specificVersion = getValidSemver(inputVersion);
            if (specificVersion === '') {
                throw new Error(`version ${inputVersion} ChromeDriver does not exist`);
            }
            let itemFound = '';
            for (let item of list) {
                // Get a semantic version.
                let version = item.split('/')[0];
                if (semver.valid(version) == null) {
                    const lookUpVersion = getValidSemver(version);
                    if (semver.valid(lookUpVersion)) {
                        // Check to see if the specified version matches.
                        if (lookUpVersion === specificVersion) {
                            // When item found is null, check the os arch
                            // 64-bit version works OR not 64-bit version and the path does not have '64'
                            if (itemFound == '') {
                                if (this.osarch === 'x64' ||
                                    (this.osarch !== 'x64' && !item.includes(this.getOsTypeName() + '64'))) {
                                    itemFound = item;
                                }
                                if (this.osarch === 'arm64' && this.ostype === 'Darwin' && item.includes('m1')) {
                                    itemFound = item;
                                }
                            }
                            else if (this.osarch === 'x64') {
                                // No win64 version exists, so even on x64 we need to look for win32
                                const osTypeNameAndArch = this.getOsTypeName() + (this.getOsTypeName() === 'win' ? '32' : '64');
                                if (item.includes(osTypeNameAndArch)) {
                                    itemFound = item;
                                }
                            }
                        }
                    }
                }
            }
            if (itemFound == '') {
                return { url: '', version: inputVersion };
            }
            else {
                return { url: config_1.Config.cdnUrls().chrome + itemFound, version: inputVersion };
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
