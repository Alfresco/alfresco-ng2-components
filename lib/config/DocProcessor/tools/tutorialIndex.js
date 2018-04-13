"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var replaceSection = require("mdast-util-heading-range");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var yaml = require("js-yaml");
var combyne = require("combyne");
var unist = require("../unistHelpers");
var tutFolder = path.resolve("..", "docs", "tutorials");
var templateFolder = path.resolve(".", "config", "DocProcessor", "templates");
var userGuideFolder = path.resolve("..", "docs", "user-guide");
function initPhase(aggData) { }
exports.initPhase = initPhase;
function readPhase(tree, pathname, aggData) { }
exports.readPhase = readPhase;
function aggPhase(aggData) {
    var indexDocData = getIndexDocData();
    var templateName = path.resolve(templateFolder, "tutIndex.combyne");
    var templateSource = fs.readFileSync(templateName, "utf8");
    var template = combyne(templateSource);
    var mdText = template.render(indexDocData);
    mdText = mdText.replace(/^ +\|/mg, "|");
    var newSection = remark().data("settings", { paddedTable: false, gfm: false }).parse(mdText.trim()).children;
    var tutIndexFile = path.resolve(tutFolder, "README.md");
    var tutIndexText = fs.readFileSync(tutIndexFile, "utf8");
    var tutIndexMD = remark().data("settings", { paddedTable: false, gfm: false }).parse(tutIndexText);
    replaceSection(tutIndexMD, "Tutorials", function (before, section, after) {
        newSection.unshift(before);
        newSection.push(after);
        return newSection;
    });
    fs.writeFileSync(tutIndexFile, remark().use(frontMatter, { type: 'yaml', fence: '---' }).data("settings", { paddedTable: false, gfm: false }).stringify(tutIndexMD));
}
exports.aggPhase = aggPhase;
function updatePhase(tree, pathname, aggData) {
    return false;
}
exports.updatePhase = updatePhase;
function getIndexDocData() {
    var indexFile = path.resolve(userGuideFolder, "summary.json");
    var summaryArray = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    var indexArray = [];
    summaryArray.forEach(function (element) {
        if (element["title"] === "Tutorials") {
            indexArray = element["children"];
        }
    });
    var result = {
        tuts: []
    };
    indexArray.forEach(function (element) {
        var tutData = { link: element["file"] };
        var tutFile = path.resolve(tutFolder, element["file"]);
        var tutFileText = fs.readFileSync(tutFile, "utf8");
        var tutMD = remark().use(frontMatter, ["yaml"]).parse(tutFileText);
        var metadata = getDocMetadata(tutMD);
        if (metadata["Level"]) {
            tutData["level"] = metadata["Level"];
        }
        else {
            tutData["level"] = "";
        }
        var briefDesc = getFirstParagraph(tutMD);
        var briefDescText = remark()
            .use(frontMatter, { type: 'yaml', fence: '---' })
            .data("settings", { paddedTable: false, gfm: false })
            .stringify(briefDesc);
        tutData["briefDesc"] = briefDescText;
        var title = getFirstHeading(tutMD);
        var titleText = remark()
            .use(frontMatter, { type: 'yaml', fence: '---' })
            .data("settings", { paddedTable: false, gfm: false })
            .stringify(title.children[0]);
        tutData["title"] = titleText;
        result.tuts.push(tutData);
    });
    return result;
}
function getDocMetadata(tree) {
    if (tree.children[0].type == "yaml") {
        return yaml.load(tree.children[0].value);
    }
    else {
        return {};
    }
}
function getFirstParagraph(tree) {
    var s = 0;
    for (; (s < tree.children.length) && !unist.isParagraph(tree.children[s]); s++) { }
    if (s < tree.children.length) {
        return tree.children[s];
    }
    else {
        return null;
    }
}
function getFirstHeading(tree) {
    var s = 0;
    for (; (s < tree.children.length) && !unist.isHeading(tree.children[s]); s++) { }
    if (s < tree.children.length) {
        return tree.children[s];
    }
    else {
        return null;
    }
}
