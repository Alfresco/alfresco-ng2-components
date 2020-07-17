var fs = require("fs");
var path = require("path");

var program = require("commander");
var lodash = require("lodash");
var jsyaml = require("js-yaml");

var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var mdCompact = require("mdast-util-compact");
var minimatch = require("minimatch");

var si = require("./sourceInfoClasses");

// "Aggregate" data collected over the whole file set.
var aggData = {};

var toolsFolderName = "tools";
var configFileName = "doctool.config.json";
var defaultFolder = path.resolve("docs");
var sourceInfoFolder = path.resolve("docs", "sourceinfo");


function filterFiles(filePath) {
    let isAllowed = true;

    this.excludedFileList = aggData['config'].exclude;

    if (this.excludedFileList) {
        isAllowed = this.excludedFileList.filter((pattern) => {
            return minimatch(filePath, pattern.toString(), {
                nocase: true
            });
        }).length === 0;
    }

    return isAllowed;
}


function updatePhase(mdCache, aggData) {

    toolList.forEach(toolName => {
        console.log(`Tool: ${toolName}`);
        toolModules[toolName].processDocs(mdCache, aggData);
    });

    var filenames = Object.keys(mdCache);


    for (var i = 0; i < filenames.length; i++) {
        var pathname = filenames[i];
        var tree = mdCache[pathname].mdOutTree;
        var original = mdCache[pathname].mdInTree;

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

            fs.writeFileSync(filenames[i], remark().use(frontMatter, {
                type: 'yaml',
                fence: '---'
            }).data("settings", {paddedTable: false, gfm: false}).stringify(tree));
        }
    }
}

function minimiseTree(tree) {
    let minPropsTree = JSON.parse(JSON.stringify(tree, (key, value) => key === "position" ? undefined : value));
    mdCompact(minPropsTree);
    return minPropsTree;
}

function loadToolModules() {
    var mods = {};
    var toolsFolderPath = path.resolve(__dirname, toolsFolderName);
    var modFiles = fs.readdirSync(toolsFolderPath);

    for (var i = 0; i < modFiles.length; i++) {
        var modPath = path.resolve(toolsFolderPath, modFiles[i])

        if (path.extname(modPath) === ".js") {
            var toolName = path.basename(modPath, ".js");
            mods[toolName] = require(modPath);
        }
    }

    return mods;
}


function loadConfig() {
    var configFilePath = path.resolve(__dirname, configFileName)
    return JSON.parse(fs.readFileSync(configFilePath));
}


function getAllDocFilePaths(docFolder, files) {
    var items = fs.readdirSync(docFolder);

    for (var i = 0; i < items.length; i++) {
        var itemPath = path.resolve(docFolder, items[i]);
        var itemInfo = fs.statSync(itemPath);

        if (itemInfo.isFile()) {
            files.push(itemPath);
        } else if (itemInfo.isDirectory()) {
            getAllDocFilePaths(itemPath, files);
        }
    }
}


function initMdCache(filenames) {
    var mdCache = {};

    for (var i = 0; i < filenames.length; i++) {
        var pathname = filenames[i];
        mdCache[pathname] = {};

        var src = fs.readFileSync(pathname);
        var tree = remark().use(frontMatter, ["yaml"]).parse(src);
        mdCache[pathname].mdInTree = minimiseTree(tree);
        mdCache[pathname].mdOutTree = minimiseTree(tree);
    }

    return mdCache;
}

function initClassInfo(aggData) {
    var yamlFilenames = fs.readdirSync(path.resolve(sourceInfoFolder));

    aggData.classInfo = {};

    yamlFilenames.forEach(yamlFilename => {
        var classYamlText = fs.readFileSync(path.resolve(sourceInfoFolder, yamlFilename), "utf8");
        var classYaml = jsyaml.safeLoad(classYamlText);

        if (program.verbose) {
            console.log(classYaml.items[0].name);
        }

        aggData.classInfo[classYaml.items[0].name] = new si.ComponentInfo(classYaml);
    });
}

program
    .usage("[options] <source>")
    .option("-p, --profile [profileName]", "Select named config profile", "default")
    .option("-j, --json", "Output JSON data for Markdown syntax tree")
    .option("-v, --verbose", "Log doc files as they are processed")
    .option("-t, --timing", "Output time taken for run")
    .parse(process.argv);

var startTime;

if (program.timing) {
    startTime = process.hrtime();
}

var sourcePath;

if (program.args.length === 0) {
    sourcePath = defaultFolder;
} else {
    sourcePath = path.resolve(program.args[0]);
}

var sourceInfo = fs.statSync(sourcePath);

var toolModules = loadToolModules();

var config = loadConfig();
aggData['config'] = config;

var toolList;

if (config.profiles[program.profile]) {
    toolList = config.profiles[program.profile];
    var toolListText = toolList.join(", ");
    console.log(`Using '${program.profile}' profile: ${toolListText}`);
} else {
    console.log(`Aborting: unknown profile '${program.profile}`);
    return 0;
}

var files = [];

if (sourceInfo.isDirectory()) {
    getAllDocFilePaths(sourcePath, files);
    aggData['rootFolder'] = path.dirname(sourcePath);
} else if (sourceInfo.isFile()) {
    files = [sourcePath];
}

files = files.filter(filename =>
    (filename !== undefined) &&
    (path.extname(filename) === ".md") &&
    (filename !== "README.md") && filterFiles(filename)
);

var mdCache = initMdCache(files);

console.log("Loading source data...");

initClassInfo(aggData);

console.log("Updating Markdown files...");
updatePhase(mdCache, aggData);

if (program.timing) {
    var endTime = process.hrtime(startTime);
    console.log(`Run complete in ${endTime[0]} sec`);
}
