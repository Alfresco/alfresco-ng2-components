var fs = require("fs");
var path = require("path");
var program = require("commander");
var lodash = require("lodash");

var remark = require("remark");
var parse = require("remark-parse");
var stringify = require("remark-stringify");
var frontMatter = require("remark-frontmatter");


// "Aggregate" data collected over the whole file set.
var aggData = {};

var toolsFolderName = "tools";
var configFileName = "doctool.config.json";
var defaultFolder = path.resolve("docs");


function initPhase(aggData) {
    toolList.forEach(toolName => {
        toolModules[toolName].initPhase(aggData);
    });
}


function readPhase(filenames, aggData) {
    for (var i = 0; i < filenames.length; i++) {
        var pathname = filenames[i];//path.resolve(srcFolder, filenames[i]);
        
        var src = fs.readFileSync(pathname);
        var tree = remark().use(frontMatter, ["yaml"]).parse(src);

        toolList.forEach(toolName => {
            toolModules[toolName].readPhase(tree, pathname, aggData);
        });
    }

    //console.log(JSON.stringify(aggData.mdFileData));
}


function aggPhase(aggData) {
    toolList.forEach(toolName => {
        toolModules[toolName].aggPhase(aggData);
    });
}


function updatePhase(filenames, aggData) {
    var errorMessages;

    for (var i = 0; i < filenames.length; i++) {
        errorMessages = [];
        var pathname = filenames[i]; // path.resolve(srcFolder, filenames[i]);
        
        if (program.verbose) {
            console.log(pathname);
        }
        
        var src = fs.readFileSync(pathname);
        var tree = remark().use(frontMatter, ["yaml"]).parse(src);

        var original = removeTextPosInfo(deepCopy(tree));

        var modified = false;

        toolList.forEach(toolName => {
            modified |= toolModules[toolName].updatePhase(tree, pathname, aggData, errorMessages);
        });
        
        if (errorMessages.length > 0) {
            showErrors(pathname, errorMessages);
        }

        tree = removeTextPosInfo(tree);

        //*
        console.log("Original:");
        console.log(JSON.stringify(original));
        console.log("Updated:");
        console.log(JSON.stringify(tree));
        /* */
       
        if (program.json) {
            console.log(JSON.stringify(tree));
        }
        
        modified = !lodash.isEqual(tree, original);

        if (modified) {
            console.log(`Modified: ${pathname}`);
            fs.writeFileSync(filenames[i], remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false, gfm: false}).stringify(tree));
        }
    }
}


function deepCopy(obj) {
    // Despite how it looks, this technique is apparently quite efficient
    // because the JSON routines are implemented in C code and faster
    // than the equivalent JavaScript loops ;-)
    return JSON.parse(JSON.stringify(obj));
}


function removeTextPosInfo(tree) {
    return JSON.parse(JSON.stringify(tree, (key, value) => key === "position" ? undefined : value));
}


function showErrors(filename, errorMessages) {
    console.log(filename);

    errorMessages.forEach(message => {
        console.log("    " + message);
    });

    console.log("");
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

        if (itemInfo.isFile()){
            files.push(itemPath);
        } else if (itemInfo.isDirectory()) {
            getAllDocFilePaths(itemPath, files);
        }
    }
}


program
.usage("[options] <source>")
.option("-p, --profile [profileName]", "Select named config profile", "default")
.option("-j, --json", "Output JSON data for Markdown syntax tree")
.option("-v, --verbose", "Log doc files as they are processed")
.parse(process.argv);

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

if (config.profiles[program.profile]){
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
} else if (sourceInfo.isFile()) {
    files = [ sourcePath ];
}

files = files.filter(filename => 
    (path.extname(filename) === ".md") &&
    (filename !== "README.md")
);

//files.forEach(element => console.log(element));

console.log("Initialising...");
initPhase(aggData);

console.log("Analysing Markdown files...");
readPhase(files, aggData);

console.log("Computing aggregate data...");
aggPhase(aggData);

console.log("Updating Markdown files...");
updatePhase(files, aggData);



