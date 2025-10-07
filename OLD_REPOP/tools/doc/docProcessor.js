const fs = require('fs');
const path = require('path');
const program = require('commander');
const lodash = require('lodash');
const jsyaml = require('js-yaml');
const remark = require('remark');
const frontMatter = require('remark-frontmatter');
const mdCompact = require('mdast-util-compact');
const minimatch = require('minimatch');

const si = require('./sourceInfoClasses');

// "Aggregate" data collected over the whole file set.
const aggData = {};

const toolsFolderName = 'tools';
const configFileName = 'doctool.config.json';
const defaultFolder = path.resolve('docs');
const sourceInfoFolder = path.resolve('docs', 'sourceinfo');

function filterFiles(filePath) {
    let isAllowed = true;

    this.excludedFileList = aggData['config'].exclude;

    if (this.excludedFileList) {
        isAllowed =
            this.excludedFileList.filter((pattern) => {
                return minimatch(filePath, pattern.toString(), {
                    nocase: true
                });
            }).length === 0;
    }

    return isAllowed;
}

const toolModules = loadToolModules();

let toolList;

function updatePhase(mdCache, aggData) {
    toolList.forEach((toolName) => {
        console.log(`Tool: ${toolName}`);
        toolModules[toolName].processDocs(mdCache, aggData);
    });

    const filenames = Object.keys(mdCache);

    for (let i = 0; i < filenames.length; i++) {
        const pathname = filenames[i];
        const tree = mdCache[pathname].mdOutTree;
        const original = mdCache[pathname].mdInTree;

        if (program.json) {
            let filename = path.basename(pathname);

            console.log(`\nFile "${filename}" before processing:`);
            console.log(JSON.stringify(original));
            console.log(`\nFile "${filename}" after processing:`);
            console.log(JSON.stringify(tree));
        }

        if (!lodash.isEqual(tree, original)) {
            if (program.verbose) {
                console.log(`Modified: ${pathname}`);
            }

            fs.writeFileSync(
                filenames[i],
                remark()
                    .use(frontMatter, {
                        type: 'yaml',
                        fence: '---'
                    })
                    .data('settings', { paddedTable: false, gfm: false })
                    .stringify(tree)
            );
        }
    }
}

function minimiseTree(tree) {
    let minPropsTree = JSON.parse(JSON.stringify(tree, (key, value) => (key === 'position' ? undefined : value)));
    mdCompact(minPropsTree);
    return minPropsTree;
}

function loadToolModules() {
    const mods = {};
    const toolsFolderPath = path.resolve(__dirname, toolsFolderName);
    const modFiles = fs.readdirSync(toolsFolderPath);

    for (let i = 0; i < modFiles.length; i++) {
        const modPath = path.resolve(toolsFolderPath, modFiles[i]);

        if (path.extname(modPath) === '.js') {
            const toolName = path.basename(modPath, '.js');
            mods[toolName] = require(modPath);
        }
    }

    return mods;
}

function loadConfig() {
    const configFilePath = path.resolve(__dirname, configFileName);
    return JSON.parse(fs.readFileSync(configFilePath));
}

function getAllDocFilePaths(docFolder, files) {
    const items = fs.readdirSync(docFolder);

    for (let i = 0; i < items.length; i++) {
        const itemPath = path.resolve(docFolder, items[i]);
        const itemInfo = fs.statSync(itemPath);

        if (itemInfo.isFile()) {
            files.push(itemPath);
        } else if (itemInfo.isDirectory()) {
            getAllDocFilePaths(itemPath, files);
        }
    }
}

function initMdCache(filenames) {
    const mdCache = {};

    for (let i = 0; i < filenames.length; i++) {
        const pathname = filenames[i];
        mdCache[pathname] = {};

        const src = fs.readFileSync(pathname);
        const tree = remark().use(frontMatter, ['yaml']).parse(src);
        mdCache[pathname].mdInTree = minimiseTree(tree);
        mdCache[pathname].mdOutTree = minimiseTree(tree);
    }

    return mdCache;
}

function initClassInfo(aggData) {
    const yamlFilenames = fs.readdirSync(path.resolve(sourceInfoFolder));

    aggData.classInfo = {};

    yamlFilenames.forEach((yamlFilename) => {
        const classYamlText = fs.readFileSync(path.resolve(sourceInfoFolder, yamlFilename), 'utf8');
        const classYaml = jsyaml.safeLoad(classYamlText);

        if (program.verbose) {
            console.log(classYaml.items[0].name);
        }

        aggData.classInfo[classYaml.items[0].name] = new si.ComponentInfo(classYaml);
    });
}

program
    .usage('[options] <source>')
    .option('-p, --profile [profileName]', 'Select named config profile', 'default')
    .option('-j, --json', 'Output JSON data for Markdown syntax tree')
    .option('-v, --verbose', 'Log doc files as they are processed')
    .option('-t, --timing', 'Output time taken for run')
    .parse(process.argv);

let startTime;

if (program.timing) {
    startTime = process.hrtime();
}

let sourcePath;

if (program.args.length === 0) {
    sourcePath = defaultFolder;
} else {
    sourcePath = path.resolve(program.args[0]);
}

const sourceInfo = fs.statSync(sourcePath);
const config = loadConfig();
aggData['config'] = config;

if (config.profiles[program.profile]) {
    toolList = config.profiles[program.profile];
    var toolListText = toolList.join(', ');
    console.log(`Using '${program.profile}' profile: ${toolListText}`);
} else {
    console.log(`Aborting: unknown profile '${program.profile}`);
    return 0;
}

let files = [];

if (sourceInfo.isDirectory()) {
    getAllDocFilePaths(sourcePath, files);
    aggData['rootFolder'] = path.dirname(sourcePath);
} else if (sourceInfo.isFile()) {
    files = [sourcePath];
}

files = files.filter((filename) => filename !== undefined && path.extname(filename) === '.md' && filename !== 'README.md' && filterFiles(filename));

const mdCache = initMdCache(files);

console.log('Loading source data...');

initClassInfo(aggData);

console.log('Updating Markdown files...');
updatePhase(mdCache, aggData);

if (program.timing) {
    const endTime = process.hrtime(startTime);
    console.log(`Run complete in ${endTime[0]} sec`);
}
