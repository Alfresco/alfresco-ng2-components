import * as fs from "fs";
import * as path from "path";

import * as replaceSection from "mdast-util-heading-range";
import * as remark from "remark";
import * as stringify from "remark-stringify";
import * as frontMatter from "remark-frontmatter";
import * as yaml from "js-yaml";
import * as ejs from "ejs";

import * as unist from "../unistHelpers";

const tutFolder = path.resolve("docs", "tutorials");
const templateFolder = path.resolve("tools", "doc", "templates");
const userGuideFolder = path.resolve("docs", "user-guide");


export function processDocs(tree, pathname, aggData, errorMessages) {
    aggPhase(aggData);
}


function aggPhase(aggData) {
    let indexDocData = getIndexDocData();

    let templateName = path.resolve(templateFolder, "tutIndex.ejs");
    let templateSource = fs.readFileSync(templateName, "utf8");
    let template = ejs.compile(templateSource);

    let mdText = template(indexDocData);
    mdText = mdText.replace(/^ +\|/mg, "|");

    let newSection = remark().data("settings", {paddedTable: false, gfm: false}).parse(mdText.trim()).children;

    let tutIndexFile = path.resolve(tutFolder, "README.md");
    let tutIndexText = fs.readFileSync(tutIndexFile, "utf8");
    let tutIndexMD = remark().data("settings", {paddedTable: false, gfm: false}).parse(tutIndexText);

    replaceSection(tutIndexMD, "Tutorials", (before, section, after) => {
        newSection.unshift(before);
        newSection.push(after);
        return newSection;
    });

    fs.writeFileSync(tutIndexFile, remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false, gfm: false}).stringify(tutIndexMD));
}



function getIndexDocData() {
    let indexFile = path.resolve(userGuideFolder, "summary.json");
    let summaryArray = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    let indexArray = [];

    summaryArray.forEach(element => {
        if (element["title"] === "Tutorials") {
            indexArray = element["children"];
        }
    });

    let result = {
        tuts: []
    };

    indexArray.forEach(element => {
        let tutData = { link: element["file"] };

        let tutFile = path.resolve(tutFolder, element["file"]);
        let tutFileText = fs.readFileSync(tutFile, "utf8");
        let tutMD = remark().use(frontMatter, ["yaml"]).parse(tutFileText);

        let metadata = getDocMetadata(tutMD);

        if (metadata["Level"]){
            tutData["level"] = metadata["Level"];
        } else {
            tutData["level"] = "";
        }

        let briefDesc = getFirstParagraph(tutMD);

        let briefDescText = remark()
        .use(frontMatter, {type: 'yaml', fence: '---'})
        .data("settings", {paddedTable: false, gfm: false})
        .stringify(briefDesc);

        tutData["briefDesc"] = briefDescText;

        let title = getFirstHeading(tutMD);

        let titleText = remark()
        .use(frontMatter, {type: 'yaml', fence: '---'})
        .data("settings", {paddedTable: false, gfm: false})
        .stringify(title.children[0]);

        tutData["title"] = titleText;

        result.tuts.push(tutData);
    });

    return result;
}


function getDocMetadata(tree) {
    if (tree.children[0].type == "yaml") {
        return yaml.load(tree.children[0].value);
    } else {
        return {};
    }
}


function getFirstParagraph(tree) {
    let s = 0;

    for (;(s < tree.children.length) && !unist.isParagraph(tree.children[s]); s++) {}

    if (s < tree.children.length) {
        return tree.children[s];
        
    } else {
        return null;
    }
}

function getFirstHeading(tree) {
    let s = 0;

    for (;(s < tree.children.length) && !unist.isHeading(tree.children[s]); s++) {}

    if (s < tree.children.length) {
        return tree.children[s];
        
    } else {
        return null;
    }
}