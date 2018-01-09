var remark = require("remark");
var tocGenerator = require("mdast-util-toc");
var replaceSection = require("mdast-util-heading-range");

var unist = require("../unistHelpers");

const contentsHeading = "Contents";
const minHeadingsForToc = 8;
const maxTocHeadingDepth = 3;

module.exports = process;

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
        var newContsHeading = unist.makeHeading(contentsHeading, 2);

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


function process(mdTree, file) {
// If we need a contents section then add one or update the existing one.
    var numTocHeadings = establishContentsSection(mdTree);

    if (numTocHeadings >= minHeadingsForToc) {
        var newToc = tocGenerator(mdTree, {heading: contentsHeading, maxDepth: 3});

        replaceSection(mdTree, contentsHeading, function(before, oldSection, after) {
            return [before, newToc.map, after];
        });
    } else {
        // Otherwise, we don't need one, so remove any existing one.
        replaceSection(mdTree, contentsHeading, function(before, oldSection, after) {
            return [after];
        });
    }
}