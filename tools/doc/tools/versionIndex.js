const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const remark = require('remark');
const zone = require('mdast-zone');
const frontMatter = require('remark-frontmatter');
const ejs = require('ejs');
const ngHelpers = require('../ngHelpers');

module.exports = {
    processDocs: processDocs
};

const docsFolderPath = path.resolve('docs');
const histFilePath = path.resolve(docsFolderPath, 'versionIndex.md');
const initialVersion = 'v2.0.0';
const templateFolder = path.resolve('tools', 'doc', 'templates');

function processDocs(mdCache, aggData) {
    initPhase(aggData);
    readPhase(mdCache, aggData);
    aggPhase(aggData);
}

function initPhase(aggData) {
    aggData.versions = { 'v2.0.0': [] };
}

function readPhase(mdCache, aggData) {
    const pathNames = Object.keys(mdCache);

    pathNames.forEach((pathname) => {
        getFileData(mdCache[pathname].mdInTree, pathname, aggData);
    });
}

function getFileData(tree, pathname, aggData) {
    const compName = pathname;
    const angNameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(model)|(pipe)|(service)|(widget)|(dialog))/;

    if (!compName.match(angNameRegex)) return;

    if (compName.match(/boilerplate/)) return;

    if (tree && tree.children[0] && tree.children[0].type === 'yaml') {
        const metadata = yaml.load(tree.children[0].value);
        const version = metadata['Added'];

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
    const histFileText = fs.readFileSync(histFilePath, 'utf8');
    const histFileTree = remark()
        .use(frontMatter, ['yaml'])
        .data('settings', {
            paddedTable: false,
            gfm: false
        })
        .parse(histFileText);

    const keys = Object.keys(aggData.versions);
    keys.sort((a, b) => {
        if (a > b) return -1;
        else if (b > a) return 1;
        else return 0;
    });

    const templateName = path.resolve(templateFolder, 'versIndex.ejs');
    const templateSource = fs.readFileSync(templateName, 'utf8');
    const template = ejs.compile(templateSource);

    for (let i = 0; i < keys.length; i++) {
        const version = keys[i];
        const versionItems = aggData.versions[version];
        versionItems.sort((a, b) => {
            const aa = path.basename(a, '.md');
            const bb = path.basename(b, '.md');

            return aa.localeCompare(bb);
        });

        const versionTemplateData = { items: [] };

        for (let v = 0; v < versionItems.length; v++) {
            const displayName = ngHelpers.ngNameToDisplayName(path.basename(versionItems[v], '.md'));
            let pageLink = versionItems[v]; // + ".md";
            pageLink = pageLink.replace(/\\/g, '/');
            pageLink = pageLink.substr(pageLink.indexOf('docs') + 5);

            versionTemplateData.items.push({
                title: displayName,
                link: pageLink
            });
        }

        let mdText = template(versionTemplateData);
        mdText = mdText.replace(/^ +-/gm, '-');

        const newSection = remark()
            .use(frontMatter, ['yaml'])
            .data('settings', {
                paddedTable: false,
                gfm: false
            })
            .parse(mdText.trim()).children;

        const versSectionName = version.replace(/\./g, '');

        zone(histFileTree, versSectionName, (startComment, oldSection, endComment) => {
            newSection.unshift(startComment);
            newSection.push(endComment);
            return newSection;
        });
    }

    fs.writeFileSync(
        histFilePath,
        remark().use(frontMatter, { type: 'yaml', fence: '---' }).data('settings', { paddedTable: false, gfm: false }).stringify(histFileTree)
    );
}
