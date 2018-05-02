#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ts = require("typescript");
var main_1 = require("../main");
var bundle_index_host_1 = require("./bundle_index_host");
var ng = require("../transformers/entry_points");
function main(args, consoleError) {
    if (consoleError === void 0) { consoleError = console.error; }
    var _a = main_1.readCommandLineAndConfiguration(args), options = _a.options, rootNames = _a.rootNames;
    var host = ng.createCompilerHost({ options: options });
    var _b = bundle_index_host_1.createBundleIndexHost(options, rootNames, host), bundleHost = _b.host, indexName = _b.indexName, errors = _b.errors;
    if (!indexName) {
        console.error('Did not find an index.ts in the top-level of the package.');
        return 1;
    }
    // The index file is synthetic, so we have to add it to the program after parsing the tsconfig
    rootNames.push(indexName);
    var program = ts.createProgram(rootNames, options, bundleHost);
    var indexSourceFile = program.getSourceFile(indexName);
    if (!indexSourceFile) {
        console.error(indexSourceFile + " is not in the program. Please file a bug.");
        return 1;
    }
    program.emit(indexSourceFile);
    return 0;
}
exports.main = main;
// CLI entry point
if (require.main === module) {
    var args = process.argv.slice(2);
    process.exitCode = main(args);
}
//# sourceMappingURL=bundle_index_main.js.map