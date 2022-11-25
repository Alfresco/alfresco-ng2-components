"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocs = void 0;
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var replaceZone = require("mdast-zone");
var graphql_1 = require("graphql");
var MQ = require("../mqDefs");
var libNamesList = [
    'content-services', 'core', 'extensions',
    'insights', 'process-services', 'process-services-cloud'
];
var query = "\n    query libIndex($libName: String) {\n        documents(idFilter: $libName) {\n            title: metadata(key: \"Title\")\n            status: metadata(key: \"Status\")\n            id\n            classType: folder(depth: 2)\n            heading {\n                link {\n                    url\n                }\n            }\n            paragraph {\n                plaintext\n            }\n        }\n    }\n";
function processDocs(mdCache, aggData) {
    var docset = new MQ.Docset(mdCache);
    var templateFilePath = path.resolve(__dirname, '..', 'templates', 'gqIndex.ejs');
    var templateSource = fs.readFileSync(templateFilePath, 'utf8');
    var template = ejs.compile(templateSource);
    var indexFilePath = path.resolve(aggData['rootFolder'], 'docs', 'README.md');
    var indexFileText = fs.readFileSync(indexFilePath, 'utf8');
    var indexMD = remark()
        .use(frontMatter, ['yaml'])
        .parse(indexFileText);
    var schema = (0, graphql_1.buildSchema)(MQ.schema);
    libNamesList.forEach(function (libName) {
        (0, graphql_1.graphql)(schema, query, docset, null, { 'libName': libName })
            .then(function (response) {
            if (!response['data']) {
                console.log(JSON.stringify(response));
            }
            else {
                // console.log(template(response['data']));
                var newSection_1 = remark().parse(template(response['data'])).children;
                replaceZone(indexMD, libName, function (start, _oldZone, end) {
                    newSection_1.unshift(start);
                    newSection_1.push(end);
                    return newSection_1;
                });
                var outText = remark()
                    .use(frontMatter, { type: 'yaml', fence: '---' })
                    .data('settings', { paddedTable: false, gfm: false })
                    .stringify(indexMD);
                fs.writeFileSync(indexFilePath, outText);
            }
        });
    });
}
exports.processDocs = processDocs;
