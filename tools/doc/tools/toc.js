var path = require("path");
var fs = require("fs");

var remark = require("remark");
//var tocGenerator = require("mdast-util-toc");
var replaceSection = require("mdast-util-heading-range");
var tostring = require("mdast-util-to-string");

var ejs = require("ejs");

var unist = require("../unistHelpers");
var mdNav = require("../mdNav");

const contentsHeading = "Contents";
const minHeadingsForToc = 8;
const maxTocHeadingDepth = 3;

var templateFolder = path.resolve("tools", "doc", "templates");

module.exports = {
    "processDocs": processDocs
}


function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);

    pathnames.forEach(pathname => {
        updateFile(mdCache[pathname].mdOutTree, pathname, aggData, errorMessages);
    });
}



// Find an existing Contents section or add a new empty one if needed.
// Returns true if section is present/needed, false if not needed.
function establishContentsSection(mdTree) {
    var firstL2HeadingPos = -1;
    var numTocHeadings = 0;
    var foundContentsHeading = false;

    for (var i = 0; i < mdTree.children.length; i++) {
        var child = mdTree.children[i];
        
        // Look through all headings.
        if (child.type === "heading") {

            if ((child.depth > 1) && (child.depth <= maxTocHeadingDepth)) {
                numTocHeadings++;
            }

            if (child.depth === 2) {
                // Note where the first L2 heading is.
                if (firstL2HeadingPos === -1) {
                    firstL2HeadingPos = i;
                }

                // If it is also a Contents heading then we're done. We don't include the
                // Contents heading itself within the ToC, so decrement the count for that.
                if ((child.children[0].value === contentsHeading) && !foundContentsHeading) {
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
        var newContsHeading = unist.makeHeading(unist.makeText(contentsHeading), 2);

        // If we found another L2 heading then add the Contents in just before it.
        if (firstL2HeadingPos != -1) {
            mdTree.children.splice(firstL2HeadingPos, 0, newContsHeading);
        } else {
            // Otherwise, the unlikely situation where a ToC is required but there
            // are no L2 headings! Add it as the second element in the document.
            mdTree.children.splice(1, 0, newContsHeading);
        }
    }

    return numTocHeadings;
}





function updateFile(tree, pathname, _aggData, _errorMessages) {
    if (path.basename(pathname, ".md").match(/README|versionIndex/)) {
        return false;
    }

// If we need a contents section then add one or update the existing one.
    var numTocHeadings = establishContentsSection(tree);

    if (numTocHeadings >= minHeadingsForToc) {
        var newToc = makeToc(tree); //tocGenerator(tree, {heading: contentsHeading, maxDepth: 3});

        replaceSection(tree, contentsHeading, function(before, oldSection, after) {
            return [before, newToc, after];
        });
    } else {
        // Otherwise, we don't need one, so remove any existing one.
        replaceSection(tree, contentsHeading, function(before, oldSection, after) {
            return [after];
        });
    }

    return true;
}


function makeToc(tree) {
    var nav = new mdNav.MDNav(tree);

    var headings = nav.headings(h => 
        (h.depth > 1) &&
        (h.depth <= maxTocHeadingDepth) //&&
        //!((h.children[0].type === "text") && (h.children[0].value === "Contents"))
    );

    var context = {headings: []};

    headings.forEach(heading => {
        var linkTitle = "";

        if (!((heading.item.children.length > 0) && (heading.item.children[0].type === "text") && (heading.item.children[0].value === "Contents"))) {
            linkTitle = tostring(heading.item).trim();
        }

        if (linkTitle !== "") {
            context.headings.push({
                "level": heading.item.depth - 2,
                "title": linkTitle,
                //"anchor": "#" + linkTitle.toLowerCase().replace(/ /g, "-").replace(/[:;@\.,'"`$\(\)\/]/g ,"")
                "anchor": "#" + linkTitle.toLowerCase()
                                .replace(/[^a-z0-9\s\-_]/g, '')
                                .replace(/\s/g ,"-")
                                .replace(/\-+$/, '')
            })
        };
    });

    var templateName = path.resolve(templateFolder, "toc.ejs");
    var templateSource = fs.readFileSync(templateName, "utf8");
    var template = ejs.compile(templateSource);

    var mdText = template(context);
    var newMD = remark().parse(mdText);

    return newMD.children[0];
}