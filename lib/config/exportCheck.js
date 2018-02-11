"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var chalk_1 = require("chalk");
;
var error_array = [];
var warning_array = [];
var exportedAllPath = [];
var classList = [];
var add_error = function (error, nameClass) {
    var findErrorClass = false;
    error_array.forEach(function (currentError) {
        if (currentError.nameClass === nameClass) {
            findErrorClass = true;
            return;
        }
    });
    if (!findErrorClass) {
        error_array.push({
            error: error,
            nameClass: nameClass
        });
    }
};
var count_error = 0;
var count_warning = 0;
var print_errors = function () {
    error_array.forEach(function (current_error) {
        console.log(chalk_1["default"].red("[" + ++count_error + "] " + current_error.error + "\n"));
    });
};
var add_warning = function (warning, nameClass, arrayCall) {
    var findWarningClass = false;
    warning_array.forEach(function (currentWarning) {
        if (currentWarning.nameClass === nameClass) {
            findWarningClass = true;
            return;
        }
    });
    if (!findWarningClass) {
        warning_array.push({
            warning: warning,
            nameClass: nameClass,
            arrayCall: arrayCall
        });
    }
};
var print_warnings = function () {
    warning_array.forEach(function (current_warning) {
        console.log(chalk_1["default"].yellow("[" + ++count_warning + "] " + current_warning.warning + " \n " + current_warning.arrayCall + " \n"));
    });
};
var current_error_postion = function (exportEntry) {
    return " " + exportEntry.position.fileName + " (" + exportEntry.position.line + "," + exportEntry.position.character + ")";
};
var check_export = function (export_old, export_new) {
    export_old.forEach(function (currentExport_old) {
        var currentExport_new = export_new.filter(function (currentExport_new) {
            return currentExport_new.name === currentExport_old.name;
        });
        if (currentExport_new.length > 1) {
            var arrayCall_1 = [];
            currentExport_new.forEach(function (error) {
                arrayCall_1.push("" + current_error_postion(error));
            });
            add_warning("Multiple export " + currentExport_new[0].name + " times " + currentExport_new.length, currentExport_new[0].name, arrayCall_1);
        }
        else if (currentExport_new.length === 0) {
            add_error("Not find export " + currentExport_old.name, currentExport_old.name);
        }
    });
};
var expandStarExport = function (node) {
    var ed = node;
    var exports = [{ name: "x" }];
    var exportSpecifiers = exports.map(function (e) { return ts.createExportSpecifier(e.name, e.name); });
    var exportClause = ts.createNamedExports(exportSpecifiers);
    var newEd = ts.updateExportDeclaration(ed, ed.decorators, ed.modifiers, exportClause, ed.moduleSpecifier);
    return newEd;
};
/** Generate documentation for all classes in a set of .ts files */
function generatExportList(fileNames, options) {
    // Build a program using the set of root file names in fileNames
    var program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    var checker = program.getTypeChecker();
    var exportCurrentVersion = [];
    // Visit every sourceFile in the program
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, visit);
        }
    }
    classList.forEach(function (classNode) {
        if (classNode.symbol.parent) {
            var pathClass_1 = classNode.symbol.parent.escapedName.replace(/"/g, "");
            exportedAllPath.forEach(function (currenPath) {
                var pathNoExtension = currenPath.replace(/\.[^/.]+$/, "");
                if (pathNoExtension === pathClass_1) {
                    // console.log('pathClass'+ pathClass);
                    // console.log('pathNoExtension   '+ pathNoExtension);
                    extractExport(classNode);
                    return;
                }
            });
        }
    });
    exportCurrentVersion.sort(function (nameA, nameB) { return nameA.name.localeCompare(nameB.name); });
    console.log(chalk_1["default"].green('Saving new export in export-new.json'));
    fs.writeFileSync('export-new.json', JSON.stringify(exportCurrentVersion, undefined, 4));
    try {
        var export_old = JSON.parse(fs.readFileSync('export-2.0.0.json', 'utf8'));
    }
    catch (error) {
        console.log(chalk_1["default"].red('export-2.0.0.json not present'));
        throw new Error('Undetected export comapring file');
    }
    var export_new = JSON.parse(JSON.stringify(exportCurrentVersion));
    console.log(chalk_1["default"].green('Comparing export-2.0.0.json and export-new.json'));
    check_export(export_old, export_new);
    print_warnings();
    print_errors();
    if (error_array.length > 0) {
        throw new Error('Export problems detected');
    }
    else {
        return;
    }
    function extractExport(node) {
        //skip file with export-check: exclude comment
        if (node.getFullText(node.getSourceFile()).indexOf('export-check: exclude') > 0) {
            return;
        }
        var _a = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
        //console.log(line + " " + character + " " + node.getSourceFile().fileName);
        var symbol = checker.getSymbolAtLocation(node);
        if (symbol) {
            var arryCalls = recursiveStackSave(node);
            var className = symbol.escapedName;
            var filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
            exportCurrentVersion.push(serializeClass(className, line, character, filename, arryCalls));
            // if (className === "ContentMetadataService") {
            //     console.log(chalk.red("exportedAllPath" + exportedAllPath));
            //     console.log(chalk.red("ContentMetadataService"));
            //     recursiveStack(node);
            // }
        }
        else {
            var arryCalls = recursiveStackSave(node);
            var className = node.name.escapedText;
            var filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
            exportCurrentVersion.push(serializeClass(className, line, character, filename, arryCalls));
            // if (className === "ContentMetadataService") {
            //     console.log(chalk.greenBright("exportedAllPath" + exportedAllPath));
            //     console.log(chalk.greenBright("ContentMetadataService"));
            //     recursiveStack(node);
            // }
        }
    }
    function recursiveStackSave(node, arrayCalls) {
        if (!arrayCalls) {
            arrayCalls = [];
        }
        var filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
        var _a = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
        arrayCalls.push(node.getSourceFile().fileName);
        if (node.parent) {
            recursiveStackSave(node.parent, arrayCalls);
        }
        return arrayCalls;
    }
    function recursiveStack(node) {
        var filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
        var _a = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
        console.log(chalk_1["default"].bgCyan(line + " " + character + " " + node.getSourceFile().fileName));
        if (node.parent) {
            recursiveStack(node.parent);
        }
    }
    /** visit nodes finding exported classes */
    function visit(node) {
        // Only consider exported nodes
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            if (node.decorators) {
                node.decorators.forEach(function (decorator) {
                    visit(decorator);
                });
            }
            classList.push(node);
        }
        if (node.kind === ts.SyntaxKind.PropertyAssignment) {
            var initializer = node.initializer;
            visit(initializer);
        }
        if (node.kind === ts.SyntaxKind.Identifier) {
            extractExport(node);
        }
        if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            node.elements.forEach(function (element) {
                visit(element);
            });
        }
        if (node.kind === ts.SyntaxKind.Decorator &&
            node.expression.expression.text === "NgModule") {
            node.expression.arguments.forEach(function (argument) {
                argument.properties.forEach(function (property) {
                    if (property.name.escapedText === "exports") {
                        visit(property);
                    }
                });
            });
        }
        if (ts.isExportDeclaration(node)) {
            if (node.exportClause) {
                node.exportClause.elements.forEach(function (exportCurrent) {
                    extractExport(exportCurrent);
                });
            }
            else {
                node.parent.resolvedModules.forEach(function (currentModule) {
                    if (currentModule) {
                        var find_1;
                        exportedAllPath.forEach(function (currentExported) {
                            if (currentModule.resolvedFileName === currentExported) {
                                find_1 = currentExported;
                            }
                        });
                        if (!find_1) {
                            exportedAllPath.push(currentModule.resolvedFileName);
                        }
                    }
                });
                visit(node.moduleSpecifier);
            }
        }
        if (ts.isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }
    /** Serialize a symbol into a json object */
    function serializeSymbol(className, line, character, fileName, arryCalls) {
        return {
            position: {
                line: line,
                character: character,
                fileName: fileName
            },
            name: className
        };
    }
    /** Serialize a class symbol information */
    function serializeClass(className, line, character, fileName, arryCalls) {
        var details = serializeSymbol(className, line, character, fileName, arryCalls);
        return details;
    }
    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
        return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
}
generatExportList(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS, removeComments: false
});
