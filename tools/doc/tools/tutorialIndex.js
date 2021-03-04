"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocs = void 0;
var fs = require("fs");
var path = require("path");
var replaceSection = require("mdast-util-heading-range");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var yaml = require("js-yaml");
var ejs = require("ejs");
var unist = require("../unistHelpers");
var tutFolder = path.resolve('docs', 'tutorials');
var templateFolder = path.resolve('tools', 'doc', 'templates');
var userGuideFolder = path.resolve('docs', 'user-guide');
function processDocs() {
    aggPhase();
}
exports.processDocs = processDocs;
function aggPhase() {
    var indexDocData = getIndexDocData();
    var templateName = path.resolve(templateFolder, 'tutIndex.ejs');
    var templateSource = fs.readFileSync(templateName, 'utf8');
    var template = ejs.compile(templateSource);
    var mdText = template(indexDocData);
    mdText = mdText.replace(/^ +\|/mg, '|');
    var newSection = remark().use(frontMatter, ['yaml']).data('settings', { paddedTable: false, gfm: false }).parse(mdText.trim()).children;
    var tutIndexFile = path.resolve(tutFolder, 'README.md');
    var tutIndexText = fs.readFileSync(tutIndexFile, 'utf8');
    var tutIndexMD = remark().use(frontMatter, ['yaml']).data('settings', { paddedTable: false, gfm: false }).parse(tutIndexText);
    replaceSection(tutIndexMD, 'Tutorials', function (before, section, after) {
        newSection.unshift(before);
        newSection.push(after);
        return newSection;
    });
    fs.writeFileSync(tutIndexFile, remark().use(frontMatter, { type: 'yaml', fence: '---' }).data('settings', { paddedTable: false, gfm: false }).stringify(tutIndexMD));
}
function getIndexDocData() {
    var indexFile = path.resolve(userGuideFolder, 'summary.json');
    var summaryArray = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    var indexArray = [];
    summaryArray.forEach(function (element) {
        if (element['title'] === 'Tutorials') {
            indexArray = element['children'];
        }
    });
    var result = {
        tuts: []
    };
    indexArray.forEach(function (element) {
        var tutData = { link: element['file'] };
        var tutFile = path.resolve(tutFolder, element['file']);
        var tutFileText = fs.readFileSync(tutFile, 'utf8');
        var tutMD = remark().use(frontMatter, ['yaml']).parse(tutFileText);
        var metadata = getDocMetadata(tutMD);
        if (metadata['Level']) {
            tutData['level'] = metadata['Level'];
        }
        else {
            tutData['level'] = '';
        }
        var briefDesc = getFirstParagraph(tutMD);
        var briefDescText = remark()
            .use(frontMatter, { type: 'yaml', fence: '---' })
            .data('settings', { paddedTable: false, gfm: false })
            .stringify(briefDesc);
        tutData['briefDesc'] = briefDescText;
        var title = getFirstHeading(tutMD);
        var titleText = remark()
            .use(frontMatter, { type: 'yaml', fence: '---' })
            .data('settings', { paddedTable: false, gfm: false })
            .stringify(title.children[0]);
        tutData['title'] = titleText;
        result.tuts.push(tutData);
    });
    return result;
}
function getDocMetadata(tree) {
    if (tree.children[0].type === 'yaml') {
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
