const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

fileProcessCloud = './lib/process-services-cloud/package.json'

const processCloudContents = readFileSync(fileProcessCloud).toString();


const packageJson = require(join(__dirname, '../package.json'));

// pick @editorjs/code
// pick @editorjs/editorjs
// pick @editorjs/inline-code
// @editorjs/header
// @editorjs/list
// @editorjs/marker
// @editorjs/underline
// editorjs-text-color-plugin
// editorjs-html
// editorjs-paragraph-with-alignment
// @quanzo/change-font-size
const editorJsVersionRoot = packageJson.devDependencies['@editorjs/editorjs']
const editorJsCodeVersionRoot = packageJson.devDependencies['@editorjs/code']
const editorJsHeaderVersionRoot = packageJson.devDependencies['@editorjs/header']
const editorJsInlineCodeVersionRoot = packageJson.devDependencies['@editorjs/inline-code']
const editorJsListVersionRoot = packageJson.devDependencies['@editorjs/list']
const editorJsMarkerVersionRoot = packageJson.devDependencies['@editorjs/marker']
const editorJsUnderlineVersionRoot = packageJson.devDependencies['@editorjs/underline']
const editorJsTextColorPluginVersionRoot = packageJson.devDependencies['editorjs-text-color-plugin']
const editorJsHtmlVersionRoot = packageJson.devDependencies['editorjs-html']
const editorJsParagraphWithAlignmentVersionRoot = packageJson.devDependencies['editorjs-paragraph-with-alignment']
const quanzoChangeFontSizeVersionRoot = packageJson.devDependencies['@quanzo/change-font-size']

// replace the dependencies with the root version
// replace @editorjs/code with the root version
// replace "@editorjs/editorjs": "^2.26.5",
// @editorjs/header
const newProcessCloudContents = processCloudContents
    .replace(/"@editorjs\/editorjs": ".*"/, `"@editorjs/editorjs": "${editorJsVersionRoot}"`)
    .replace(/"@editorjs\/code": ".*"/, `"@editorjs/code": "${editorJsCodeVersionRoot}"`)
    .replace(/"@editorjs\/header": ".*"/, `"@editorjs/header": "${editorJsHeaderVersionRoot}"`)
    .replace(/"@editorjs\/inline-code": ".*"/, `"@editorjs/inline-code": "${editorJsInlineCodeVersionRoot}"`)
    .replace(/"@editorjs\/list": ".*"/, `"@editorjs/list": "${editorJsListVersionRoot}"`)
    .replace(/"@editorjs\/marker": ".*"/, `"@editorjs/marker": "${editorJsMarkerVersionRoot}"`)
    .replace(/"@editorjs\/underline": ".*"/, `"@editorjs/underline": "${editorJsUnderlineVersionRoot}"`)
    .replace(/"editorjs-text-color-plugin": ".*"/, `"editorjs-text-color-plugin": "${editorJsTextColorPluginVersionRoot}"`)
    .replace(/"editorjs-html": ".*"/, `"editorjs-html": "${editorJsHtmlVersionRoot}"`)
    .replace(/"editorjs-paragraph-with-alignment": ".*"/, `"editorjs-paragraph-with-alignment": "${editorJsParagraphWithAlignmentVersionRoot}"`)
    .replace(/"@quanzo\/change-font-size": ".*"/, `"@quanzo/change-font-size": "${quanzoChangeFontSizeVersionRoot}"`)



// write the new content to the file
writeFileSync(fileProcessCloud, newProcessCloudContents);

// regenerate the lock by calling npm i --package-lock-only the lock is under libs/process-services-cloud/package-lock.json
// regenerate it only if there was a change in the package.json
if (JSON.stringify(processCloudContents) !== JSON.stringify(newProcessCloudContents)) {
    console.log('Package changed need to regenerate lock file');
    execSync('npm i --package-lock-only --legacy-peer-deps ', { cwd: './lib/process-services-cloud' });
    console.log('Lock file regenerated');
}

