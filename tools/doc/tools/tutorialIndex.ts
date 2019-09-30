import * as fs from 'fs';
import * as path from 'path';
import * as replaceSection from 'mdast-util-heading-range';
import * as remark from 'remark';
import * as frontMatter from 'remark-frontmatter';
import * as yaml from 'js-yaml';
import * as ejs from 'ejs';
import * as unist from '../unistHelpers';

const tutFolder = path.resolve('docs', 'tutorials');
const templateFolder = path.resolve('tools', 'doc', 'templates');
const userGuideFolder = path.resolve('docs', 'user-guide');

export function processDocs() {
    aggPhase();
}

function aggPhase() {
    const indexDocData = getIndexDocData();

    const templateName = path.resolve(templateFolder, 'tutIndex.ejs');
    const templateSource = fs.readFileSync(templateName, 'utf8');
    const template = ejs.compile(templateSource);

    let mdText = template(indexDocData);
    mdText = mdText.replace(/^ +\|/mg, '|');

    const newSection = remark().use(frontMatter, ['yaml']).data('settings', {paddedTable: false, gfm: false}).parse(mdText.trim()).children;

    const tutIndexFile = path.resolve(tutFolder, 'README.md');
    const tutIndexText = fs.readFileSync(tutIndexFile, 'utf8');
    const tutIndexMD = remark().use(frontMatter, ['yaml']).data('settings', {paddedTable: false, gfm: false}).parse(tutIndexText);

    replaceSection(tutIndexMD, 'Tutorials', (before, section, after) => {
        newSection.unshift(before);
        newSection.push(after);
        return newSection;
    });

    fs.writeFileSync(tutIndexFile, remark().use(frontMatter, {type: 'yaml', fence: '---'}).data('settings', {paddedTable: false, gfm: false}).stringify(tutIndexMD));
}

function getIndexDocData() {
    const indexFile = path.resolve(userGuideFolder, 'summary.json');
    const summaryArray = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    let indexArray = [];

    summaryArray.forEach(element => {
        if (element['title'] === 'Tutorials') {
            indexArray = element['children'];
        }
    });

    const result = {
        tuts: []
    };

    indexArray.forEach(element => {
        const tutData = { link: element['file'] };

        const tutFile = path.resolve(tutFolder, element['file']);
        const tutFileText = fs.readFileSync(tutFile, 'utf8');
        const tutMD = remark().use(frontMatter, ['yaml']).parse(tutFileText);

        const metadata = getDocMetadata(tutMD);

        if (metadata['Level']) {
            tutData['level'] = metadata['Level'];
        } else {
            tutData['level'] = '';
        }

        const briefDesc = getFirstParagraph(tutMD);

        const briefDescText = remark()
        .use(frontMatter, {type: 'yaml', fence: '---'})
        .data('settings', {paddedTable: false, gfm: false})
        .stringify(briefDesc);

        tutData['briefDesc'] = briefDescText;

        const title = getFirstHeading(tutMD);

        const titleText = remark()
        .use(frontMatter, {type: 'yaml', fence: '---'})
        .data('settings', {paddedTable: false, gfm: false})
        .stringify(title.children[0]);

        tutData['title'] = titleText;

        result.tuts.push(tutData);
    });

    return result;
}

function getDocMetadata(tree) {
    if (tree.children[0].type === 'yaml') {
        return yaml.load(tree.children[0].value);
    } else {
        return {};
    }
}

function getFirstParagraph(tree) {
    let s = 0;

    for (; (s < tree.children.length) && !unist.isParagraph(tree.children[s]); s++) {}

    if (s < tree.children.length) {
        return tree.children[s];

    } else {
        return null;
    }
}

function getFirstHeading(tree) {
    let s = 0;

    for (; (s < tree.children.length) && !unist.isHeading(tree.children[s]); s++) {}

    if (s < tree.children.length) {
        return tree.children[s];

    } else {
        return null;
    }
}
