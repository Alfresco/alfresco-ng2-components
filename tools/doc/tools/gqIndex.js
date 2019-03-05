"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var graphql_1 = require("graphql");
var MQ = require("../mqDefs");
var libNamesRegex = /content-services|core|extensions|insights|process-services|process-services-cloud/;
var libNamesList = ['process-services'];
var query = "\n    query libIndex($libName: String) {\n        documents(idFilter: $libName) {\n            title: metadata(key: \"Title\")\n            status: metadata(key: \"Status\")\n            id\n            classType: folder(depth: 2)\n            heading {\n                link {\n                    url\n                }\n            }\n            paragraph {\n                plaintext\n            }\n        }\n    }\n";
function processDocs(mdCache, aggData, _errorMessages) {
    var docset = new GQDocset(mdCache);
    var templateFilePath = path.resolve(__dirname, '..', 'templates', 'gqIndex.ejs');
    var templateSource = fs.readFileSync(templateFilePath, 'utf8');
    var template = ejs.compile(templateSource);
    var schema = graphql_1.buildSchema(MQ.schema);
    libNamesList.forEach(function (libName) {
        graphql_1.graphql(schema, query, docset, null, { 'libName': libName })
            .then(function (response) {
            console.log(template(response['data']));
        });
    });
}
exports.processDocs = processDocs;
var GQDocset = /** @class */ (function () {
    function GQDocset(mdCache) {
        var _this = this;
        this.docs = [];
        var pathnames = Object.keys(mdCache);
        pathnames.forEach(function (pathname) {
            if (!pathname.match(/README/) &&
                pathname.match(libNamesRegex)) {
                var doc = new MQ.Root(mdCache[pathname].mdInTree);
                doc.id = pathname.replace(/\\/g, '/');
                _this.docs.push(doc);
            }
        });
    }
    GQDocset.prototype.documents = function (args) {
        if (args['idFilter'] === '') {
            return this.docs;
        }
        else {
            return this.docs.filter(function (doc) { return doc.id.indexOf(args['idFilter'] + '/') !== -1; });
        }
    };
    GQDocset.prototype.size = function () {
        return this.docs.length;
    };
    return GQDocset;
}());
