const SmartRunnerFactory = require('protractor-smartrunner').SmartRunnerFactory;
const resolve = require('path').resolve;

const outputDirectory = process.env.SMART_RUNNER_DIRECTORY;
const repoHash = process.env.GIT_HASH;

console.log(`SmartRunner's repoHash: "${repoHash}"`);
console.log(`SmartRunner's outputDirectory: "${outputDirectory}"`);

module.exports = new SmartRunnerFactory({
    repoHash,
    ...(outputDirectory ? { outputDirectory: resolve(__dirname, '..', outputDirectory) } : {}),
    exclusionPath: resolve(__dirname, 'protractor.excludes.json')
});
