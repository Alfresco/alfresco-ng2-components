var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");

var remark = require("remark");
var stringify = require("remark-stringify");
var zone = require("mdast-zone");
var frontMatter = require("remark-frontmatter");

var ejs = require("ejs");

var unist = require("../unistHelpers");
var ngHelpers = require("../ngHelpers");


module.exports = {
    "processDocs": processDocs
};


var docsFolderPath = path.resolve("docs");
var histFilePath = path.resolve(docsFolderPath, "versionIndex.md");

var initialVersion = "v2.0.0";

var templateFolder = path.resolve("tools", "doc", "templates");


function processDocs(mdCache, aggData) {
    initPhase(aggData);
    readPhase(mdCache, aggData);
    aggPhase(aggData);
}


function initPhase(aggData) {
    aggData.versions = { "v2.0.0":[] };
}


function readPhase(mdCache, aggData) {
    var pathnames = Object.keys(mdCache);

    pathnames.forEach(pathname => {
        getFileData(mdCache[pathname].mdInTree, pathname, aggData);
    });
}


function getFileData(tree, pathname, aggData) {
    var compName = pathname;
    var angNameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(model)|(pipe)|(service)|(widget)|(dialog))/;

    if (!compName.match(angNameRegex))
        return;

    if (compName.match(/boilerplate/))
        return;

    if (tree && tree.children[0] && tree.children[0].type == "yaml") {
        var metadata = yaml.load(tree.children[0].value);
        var version = metadata["Added"];

        if (version) {
            if (aggData.versions[version]) {
                aggData.versions[version].push(compName);
            } else {
                aggData.versions[version] = [compName];
            }
        } else {
            aggData.versions[initialVersion].push(compName);
        }
    } else {
        aggData.versions[initialVersion].push(compName);
    }
}

function aggPhase(aggData) {
    var histFileText = fs.readFileSync(histFilePath, "utf8");
    var histFileTree = remark().use(frontMatter, ["yaml"]).data("settings", {paddedTable: false, gfm: false}).parse(histFileText);

    var keys = Object.keys(aggData.versions);
    keys.sort((a, b) => {
        if (a > b)
            return -1;
        else if (b > a)
            return 1;
        else
            return 0;
    });

    var templateName = path.resolve(templateFolder, "versIndex.ejs");
    var templateSource = fs.readFileSync(templateName, "utf8");
    var template = ejs.compile(templateSource);

    for (var i = 0; i < keys.length; i++) {
        var version = keys[i];
        var versionItems = aggData.versions[version];
        versionItems.sort((a, b) => {
            var aa = path.basename(a, ".md");
            var bb = path.basename(b, ".md");

            return aa.localeCompare(bb);
        });

        var versionTemplateData = {items: []};

        for (var v = 0; v < versionItems.length; v++) {
            var displayName = ngHelpers.ngNameToDisplayName(path.basename(versionItems[v], ".md"));
            var pageLink = versionItems[v];// + ".md";
            pageLink = pageLink.replace(/\\/g, '/');
            pageLink = pageLink.substr(pageLink.indexOf("docs") + 5);

            versionTemplateData.items.push({
                title: displayName,
                link: pageLink
            });
        }

        var mdText = template(versionTemplateData);
        mdText = mdText.replace(/^ +-/mg, "-");

        var newSection = remark().use(frontMatter, ["yaml"]).data("settings", {paddedTable: false, gfm: false}).parse(mdText.trim()).children;

        var versSectionName = version.replace(/\./g, "");;

        zone(histFileTree, versSectionName, (startComment, oldSection, endComment) => {
            newSection.unshift(startComment);
            newSection.push(endComment);
            return newSection;
        });
    }

    fs.writeFileSync(histFilePath, remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false, gfm: false}).stringify(histFileTree));
}
