"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var graphql_1 = require("graphql");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var removePosInfo = require("unist-util-remove-position");
var mqDefs_1 = require("./mqDefs");
var docFilePath = path.resolve('..', '..', 'docs', 'core', 'testMd.md');
var docSrc = fs.readFileSync(docFilePath, 'utf8');
var tree = remark()
    .use(frontMatter, ["yaml"])
    .parse(docSrc);
tree = removePosInfo(tree);
//console.log(JSON.stringify(tree));
var schema = graphql_1.buildSchema("\n  type Query {\n    document: Root\n  }\n\n  interface Node {\n    type: String\n  }\n\n  interface Parent {\n    type: String\n    children: [Node]\n  }\n\n  type Root implements Parent {\n    type: String\n    children: [Node]\n  }\n");
var root = {
    document: function () { return new mqDefs_1.MQNode(tree); }
};
var node = {
    type: function () { return 'heading'; }
};
var query = "\n    {\n        document {\n            type\n            children {\n              type\n            }\n        }\n    }\n";
graphql_1.graphql(schema, query, root).then(function (response) {
    console.log(response);
});
