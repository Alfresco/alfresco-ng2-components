"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var graphql_1 = require("graphql");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var removePosInfo = require("unist-util-remove-position");
var MQ = require("./mqDefs");
var docFilePath = path.resolve('..', '..', 'docs', 'core', 'about.component.md');
var docSrc = fs.readFileSync(docFilePath, 'utf8');
var tree = remark()
    .use(frontMatter, ['yaml'])
    .parse(docSrc);
tree = removePosInfo(tree);
var schema = graphql_1.buildSchema(MQ.schema);
var root = {
    document: function () { return new MQ.Root(tree); }
};
var query = "\n    {\n        document {\n          metadata(key: \"Status\")\n          heading {\n            link {\n              text {\n                value\n              }\n            }\n          }\n          paragraph {\n            plaintext\n          }\n        }\n    }\n";
graphql_1.graphql(schema, query, root).then(function (response) {
    // tslint:disable-next-line: no-console
    console.log(JSON.stringify(response));
});
