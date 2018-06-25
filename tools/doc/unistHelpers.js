module.exports = {

    makeRoot: function (children) {
        return {
            "type": "root",
            "children": children
        };
    },

    makeText: function (textVal) {
        return {
            "type": "text",
            "value": textVal
        };
    },

    makeEmphasis: function (content) {
        return {
            "type": "emphasis",
            "children": content
        };
    },

    makeStrong: function (content) {
        return {
            "type": "strong",
            "children": content
        };
    },

    makeHeading: function (caption, depth) {
        return {
            "type": "heading",
            "depth": depth,
            "children": [caption]
        };
    },

    makeLink: function (caption, url, title = null) {
        return {
            "type": "link",
            "title": title,
            "url": url,
            "children": [ caption ]
        };
    },

    makeListItem: function (itemValue) {
        return {
            "type": "listItem",
            "loose": false,
            "children": [ itemValue ]
        };
    },

    makeListUnordered: function (itemsArray) {
        return {
            "type": "list",
            "ordered": false,
            "children": itemsArray,
            "loose": false
        };
    },

    makeParagraph: function (itemsArray) {
        return {
            "type": "paragraph",
            "children": itemsArray
        }
    },

    makeTable: function (colAlignArray, rowArray) {
        return {
            "type": "table",
            "align": colAlignArray,
            "children": rowArray
        };
    },

    makeTableRow: function (cellArray) {
        return {
            "type": "tableRow",
            "children": cellArray
        };
    },

    makeTableCell: function (content) {
        return {
            "type": "tableCell",
            "children": content
        };
    },

    makeInlineCode: function (codeText) {
        return {
            "type": "inlineCode",
            "value": codeText
        }
    },

    makeHTML: function (htmlText) {
        return {
            "type": "html",
            "value": htmlText
        };
    },

    makeBreak: function () {
        return {
            "type": "break"
        }
    },

    makeImage: function (url, alt) {
        return {
            "type": "image",
            "url": url,
            "alt": alt
        }
    },

    isHeading: function (node) {
        return node.type === "heading";
    },

    isListUnordered: function (node) {
        return (node.type === "list") && !node.ordered;
    },

    isParagraph: function (node) {
        return node.type === "paragraph";
    },

    isText: function (node) {
        return node.type === "text";
    },

    isLink: function (node) {
        return node.type === "inlineCode";
    }
}