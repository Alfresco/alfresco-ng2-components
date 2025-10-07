const path = require('path');
const fs = require('fs');
const remark = require('remark');
const replaceSection = require('mdast-util-heading-range');
const toString = require('mdast-util-to-string');
const ejs = require('ejs');
const unist = require('../unistHelpers');
const mdNav = require('../mdNav');

const contentsHeading = 'Contents';
const minHeadingsForToc = 8;
const maxTocHeadingDepth = 3;

const templateFolder = path.resolve('tools', 'doc', 'templates');

module.exports = {
    processDocs: processDocs
};

function processDocs(mdCache, aggData, errorMessages) {
    const pathNames = Object.keys(mdCache);

    pathNames.forEach((pathname) => {
        updateFile(mdCache[pathname].mdOutTree, pathname, aggData, errorMessages);
    });
}

// Find an existing Contents section or add a new empty one if needed.
// Returns true if section is present/needed, false if not needed.
function establishContentsSection(mdTree) {
    let firstL2HeadingPos = -1;
    let numTocHeadings = 0;
    let foundContentsHeading = false;

    for (let i = 0; i < mdTree.children.length; i++) {
        const child = mdTree.children[i];

        // Look through all headings.
        if (child.type === 'heading') {
            if (child.depth > 1 && child.depth <= maxTocHeadingDepth) {
                numTocHeadings++;
            }

            if (child.depth === 2) {
                // Note where the first L2 heading is.
                if (firstL2HeadingPos === -1) {
                    firstL2HeadingPos = i;
                }

                // If it is also a Contents heading then we're done. We don't include the
                // Contents heading itself within the ToC, so decrement the count for that.
                if (child.children[0].value === contentsHeading && !foundContentsHeading) {
                    foundContentsHeading = true;
                    numTocHeadings--;
                }
            }
        }
    }

    // If we get here then a level 2 Contents heading was not found.
    // If there are enough headings for a ToC to be necessary then
    // add one in the right place.
    if (!foundContentsHeading) {
        const newHeading = unist.makeHeading(unist.makeText(contentsHeading), 2);

        // If we found another L2 heading then add the Contents in just before it.
        if (firstL2HeadingPos !== -1) {
            mdTree.children.splice(firstL2HeadingPos, 0, newHeading);
        } else {
            // Otherwise, the unlikely situation where a ToC is required but there
            // are no L2 headings! Add it as the second element in the document.
            mdTree.children.splice(1, 0, newHeading);
        }
    }

    return numTocHeadings;
}

function updateFile(tree, pathname, _aggData, _errorMessages) {
    if (path.basename(pathname, '.md').match(/README|versionIndex/)) {
        return false;
    }

    // If we need a contents section then add one or update the existing one.
    const numTocHeadings = establishContentsSection(tree);

    if (numTocHeadings >= minHeadingsForToc) {
        const newToc = makeToc(tree);

        replaceSection(tree, contentsHeading, function (before, oldSection, after) {
            return [before, newToc, after];
        });
    } else {
        // Otherwise, we don't need one, so remove any existing one.
        replaceSection(tree, contentsHeading, function (before, oldSection, after) {
            return [after];
        });
    }

    return true;
}

function makeToc(tree) {
    const nav = new mdNav.MDNav(tree);
    const headings = nav.headings((h) => h.depth > 1 && h.depth <= maxTocHeadingDepth);
    const context = { headings: [] };

    headings.forEach((heading) => {
        let linkTitle = '';

        if (!(heading.item.children.length > 0 && heading.item.children[0].type === 'text' && heading.item.children[0].value === 'Contents')) {
            linkTitle = toString(heading.item).trim();
        }

        if (linkTitle !== '') {
            context.headings.push({
                level: heading.item.depth - 2,
                title: linkTitle,
                anchor:
                    '#' +
                    linkTitle
                        .toLowerCase()
                        .replace(/[^a-z0-9\s\-_]/g, '')
                        .replace(/\s/g, '-')
                        .replace(/-+$/, '')
            });
        }
    });

    const templateName = path.resolve(templateFolder, 'toc.ejs');
    const templateSource = fs.readFileSync(templateName, 'utf8');
    const template = ejs.compile(templateSource);

    const mdText = template(context);
    const newMD = remark().parse(mdText);

    return newMD.children[0];
}
