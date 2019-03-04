"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var graphql_1 = require("graphql");
var MQ = require("../mqDefs");
var query = "\n{\n    documents {\n        metadata(key: \"Title\")\n        id\n        heading {\n            link {\n                url\n            }\n        }\n        paragraph {\n            plaintext\n        }\n    }\n}\n";
function processDocs(mdCache, aggData, _errorMessages) {
    var docset = new GQDocset(mdCache);
    var schema = graphql_1.buildSchema(MQ.schema);
    graphql_1.graphql(schema, query, docset).then(function (response) {
        //console.log(JSON.stringify(response));
        var templateFilePath = path.resolve(__dirname, '..', 'templates', 'gqIndex.ejs');
        var templateSource = fs.readFileSync(templateFilePath, 'utf8');
        var template = ejs.compile(templateSource);
        console.log(template(response['data']));
    });
}
exports.processDocs = processDocs;
var GQDocset = /** @class */ (function () {
    function GQDocset(mdCache) {
        var _this = this;
        this.docs = [];
        var pathnames = Object.keys(mdCache);
        pathnames.forEach(function (pathname) {
            if (!pathname.match(/README/)) {
                var doc = new MQ.Root(mdCache[pathname].mdInTree);
                doc.id = pathname;
                _this.docs.push(doc);
            }
        });
    }
    GQDocset.prototype.documents = function () {
        return this.docs;
    };
    GQDocset.prototype.name = function () {
        return "Another doc set";
    };
    GQDocset.prototype.size = function () {
        return this.docs.length;
    };
    return GQDocset;
}());
