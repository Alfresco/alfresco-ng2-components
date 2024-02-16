const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');
// skip the execution of this script if the CI process env variable is true

if(process.env.CI) {

    // create a list of inner packages that need to be updated
    fileProcessCloud = './lib/process-services-cloud/package.json'

    const processCloudContents = readFileSync(fileProcessCloud).toString();

    // read the package json fileProcessCloud using the require function most probably we need to join the path with __dirname
    const processCloud = require(join(__dirname, '../lib/process-services-cloud/package.json'));
    const packageJsonOrigin = require(join(__dirname, '../package.json'));

    // iterate over the dependencies
    // for each dependency check pick the value from packageJsonOrigin and override the value in processCloud
    let fileChanged = false;
    Array.from(Object.keys(processCloud.dependencies)).forEach((key) => {
        // if the key exist and the value is different override it
        if (packageJsonOrigin.devDependencies[key] && packageJsonOrigin.devDependencies[key] !== processCloud.dependencies[key]) {
            fileChanged = true;
            processCloud.dependencies[key] = packageJsonOrigin.devDependencies[key]
        }
    })

    if (fileChanged) {
        writeFileSync(fileProcessCloud, JSON.stringify(processCloud, null, 2));
        console.log('Package changed need to regenerate lock file');
        execSync('npm i --package-lock-only --legacy-peer-deps ', { cwd: './lib/process-services-cloud' });
        console.log('Lock file regenerated');
    }
} else {
    console.log('Running in CI, skipping package sync process');
}


