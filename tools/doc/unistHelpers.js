module.exports = {
    makeText: function (textVal) {
        return {
            type: 'text',
            value: textVal
        };
    },
    makeEmphasis: function (content) {
        return {
            type: 'emphasis',
            children: content
        };
    },
    makeHeading: function (caption, depth) {
        return {
            type: 'heading',
            depth: depth,
            children: [caption]
        };
    },
    makeLink: function (caption, url, title = null) {
        return {
            type: 'link',
            title: title,
            url: url,
            children: [caption]
        };
    },
    makeListItem: function (itemValue) {
        return {
            type: 'listItem',
            loose: false,
            children: [itemValue]
        };
    },
    makeListUnordered: function (itemsArray) {
        return {
            type: 'list',
            ordered: false,
            children: itemsArray,
            loose: false
        };
    },
    makeTable: function (colAlignArray, rowArray) {
        return {
            type: 'table',
            align: colAlignArray,
            children: rowArray
        };
    },
    makeTableRow: function (cellArray) {
        return {
            type: 'tableRow',
            children: cellArray
        };
    },
    makeTableCell: function (content) {
        return {
            type: 'tableCell',
            children: content
        };
    },
    makeInlineCode: function (codeText) {
        return {
            "type": "inlineCode",
            "value": codeText
        }
    },
    makeImage: function (url, alt) {
        return {
            type: 'image',
            url: url,
            alt: alt
        };
    },
    isHeading: function (node) {
        return node.type === 'heading';
    },
    isListUnordered: function (node) {
        return node.type === 'list' && !node.ordered;
    },
    isParagraph: function (node) {
        return node.type === 'paragraph';
    },
    isLink: function (node) {
        return node.type === 'inlineCode';
    }
};
