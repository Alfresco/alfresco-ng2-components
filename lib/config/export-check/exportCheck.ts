import * as ts from "typescript";
import * as fs from "fs";
import chalk from "chalk";

var nconf = require('nconf');
var baseParh = "./config/export-check/";

nconf.add('config', { type: 'file', file: `${baseParh}export-check-config.json` });

var newLibExports = baseParh + nconf.get('export-last-version');
var exportFilesVersions = nconf.get('export-versions').map((currentFile) => {
    return baseParh + currentFile;
});

interface DocEntry {
    position?: {
        line: number,
        character: number,
        fileName: string
    },
    name?: string,
    skipError?: boolean
};

let error_array = [];
let warning_array = [];
let exportedAllPath: Array<string> = [];
let classList: Array<any> = [];

let add_error = function (error: string, nameClass: string) {
    let findErrorClass = false;

    error_array.forEach((currentError) => {

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

}

let count_error = 0;
let count_warning = 0;

let print_errors = function () {
    error_array.forEach((current_error) => {
        console.log(chalk.red(`[${++count_error}] ${current_error.error}\n`));
    });
}


let add_warning = function (warning: string, nameClass: string, arrayCall: string[]) {

    let findWarningClass = false;

    warning_array.forEach((currentWarning) => {

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
}

let print_warnings = function () {
    warning_array.forEach((current_warning) => {
        console.log(chalk.yellow(`[${++count_warning}] ${current_warning.warning} \n ${current_warning.arrayCall} \n`));
    });
}

let currentErrorPostion = function (exportEntry) {
    return ` ${exportEntry.position.fileName} (${exportEntry.position.line},${exportEntry.position.character})`
}

let check_export = function (exportLastMajor: any, exportNew: any) {

    exportLastMajor.forEach((currentexportLastMajor) => {

        let currentexportNew = exportNew.filter((currentexportNew) => {
            return currentexportNew.name === currentexportLastMajor.name;
        });

        if (currentexportNew.length > 1) {

            let arrayCall = [];

            currentexportNew.forEach((error) => {
                arrayCall.push(`${currentErrorPostion(error)}`);
            })

            add_warning(`Multiple export ${currentexportNew[0].name} times ${currentexportNew.length}`, currentexportNew[0].name, arrayCall);

        } else if (currentexportNew.length === 0) {
            if (!currentexportLastMajor.skipError) {
                add_error(`Not find export ${currentexportLastMajor.name} , old path: [${currentErrorPostion(currentexportLastMajor)}]`, currentexportLastMajor.name);
            }
        }
    });
};

let expandStarExport = function (node: ts.Node): ts.ExportDeclaration {
    const ed = node as ts.Node as ts.ExportDeclaration;
    const exports = [{ name: "x" }];
    const exportSpecifiers = exports.map(e => ts.createExportSpecifier(e.name, e.name));
    const exportClause = ts.createNamedExports(exportSpecifiers);
    const newEd = ts.updateExportDeclaration(ed, ed.decorators, ed.modifiers, exportClause, ed.moduleSpecifier);

    return newEd as ts.ExportDeclaration
};

/** Generate documentation for all classes in a set of .ts files */
function generatExportList(fileNames: string[], options: ts.CompilerOptions): void {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();

    let exportCurrentVersion: DocEntry[] = [];

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, visit);
        }
    }

    classList.forEach((classNode) => {
        if (classNode.symbol.parent) {
            let pathClass = classNode.symbol.parent.escapedName.replace(/"/g, "");

            exportedAllPath.forEach((currenPath) => {
                let pathNoExtension = currenPath.replace(/\.[^/.]+$/, "");

                if (pathNoExtension === pathClass) {
                    // console.log('pathClass'+ pathClass);
                    // console.log('pathNoExtension   '+ pathNoExtension);
                    extractExport(classNode);
                    return;
                }

            });
        }
    });

    exportCurrentVersion.sort((nameA, nameB) => nameA.name.localeCompare(nameB.name));

    console.log(chalk.green(`Saving new export in ${newLibExports}`));

    fs.writeFileSync(newLibExports, JSON.stringify(exportCurrentVersion, undefined, 4));

    var exportNewJSON = JSON.parse(JSON.stringify(exportCurrentVersion));

    exportFilesVersions.forEach((currentExportVersionFile) => {

        error_array = [];
        warning_array = [];

        try {
            var currentExportVersionJSON = JSON.parse(fs.readFileSync(`${currentExportVersionFile}`, 'utf8'));
        } catch (error) {
            console.log(chalk.red(`${currentExportVersionFile} json not present`));
            throw new Error(`Undetected export comapring file ${currentExportVersionFile}`);
        }


        console.log(chalk.green(`Comparing ${newLibExports} and ${currentExportVersionFile}`));

        check_export(currentExportVersionJSON, exportNewJSON);

        print_warnings();
        print_errors();


        if (error_array.length > 0) {
            throw new Error('Export problems detected');
        } else {
            return;
        }

    })

    function extractExport(node: ts.Node) {
        //skip file with export-check: exclude comment
        if (node.getFullText(node.getSourceFile()).indexOf('export-check: exclude') > 0) {
            return;
        }

        let { line, character } = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
        //console.log(line + " " + character + " " + node.getSourceFile().fileName);

        let symbol = checker.getSymbolAtLocation(node);

        if (symbol) {
            let arryCalls = recursiveStackSave(node);

            let className: any = symbol.escapedName;
            let filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
            exportCurrentVersion.push(serializeClass(className, line, character, filename, arryCalls));

            // if (className === "ContentMetadataService") {
            //     console.log(chalk.red("exportedAllPath" + exportedAllPath));
            //     console.log(chalk.red("ContentMetadataService"));
            //     recursiveStack(node);
            // }

        } else {

            let arryCalls = recursiveStackSave(node);

            let className: any = (node as ts.ClassDeclaration).name.escapedText;
            let filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
            exportCurrentVersion.push(serializeClass(className, line, character, filename, arryCalls));

            // if (className === "ContentMetadataService") {
            //     console.log(chalk.greenBright("exportedAllPath" + exportedAllPath));
            //     console.log(chalk.greenBright("ContentMetadataService"));
            //     recursiveStack(node);
            // }

        }
    }

    function recursiveStackSave(node: ts.Node, arrayCalls?: string[]) {
        if (!arrayCalls) {
            arrayCalls = [];
        }

        let filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
        let { line, character } = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());

        arrayCalls.push(node.getSourceFile().fileName);

        if (node.parent) {
            recursiveStackSave(node.parent, arrayCalls)
        }

        return arrayCalls;

    }

    function recursiveStack(node: ts.Node) {
        let filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length);
        let { line, character } = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
        console.log(chalk.bgCyan(line + " " + character + " " + node.getSourceFile().fileName));

        if (node.parent) {
            recursiveStack(node.parent)
        }

    }

    /** visit nodes finding exported classes */
    function visit(node: ts.Node) {
        // Only consider exported nodes

        if (node.kind === ts.SyntaxKind.ClassDeclaration) {

            if (node.decorators) {
                node.decorators.forEach((decorator) => {
                    visit(decorator as ts.Node);
                });
            }

            classList.push(node);
        }

        if (node.kind === ts.SyntaxKind.PropertyAssignment) {
            const initializer = (node as ts.PropertyAssignment).initializer;

            visit(initializer as ts.Node);
        }

        if (node.kind === ts.SyntaxKind.Identifier) {
            extractExport(node);
        }

        if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            (node  as ts.ArrayLiteralExpression).elements.forEach((element) => {
                visit(element as ts.Node);
            });
        }

        if (node.kind === ts.SyntaxKind.Decorator &&
            ((node as ts.Decorator).expression as any).expression.text === "NgModule") {

            ((node as ts.Decorator).expression as any).arguments.forEach((argument) => {
                argument.properties.forEach((property) => {
                    if (property.name.escapedText === "exports") {
                        visit(property as ts.Node);
                    }
                });
            });
        }

        if (ts.isExportDeclaration(node)) {
            if (node.exportClause) {
                node.exportClause.elements.forEach(exportCurrent => {
                    extractExport(exportCurrent as ts.Node);
                });
            } else {
                (node.parent as any).resolvedModules.forEach((currentModule) => {

                    if (currentModule) {
                        let find;
                        exportedAllPath.forEach((currentExported) => {
                            if (currentModule.resolvedFileName === currentExported) {
                                find = currentExported;
                            }
                        })

                        if (!find) {
                            exportedAllPath.push(currentModule.resolvedFileName);
                        }
                    }
                })

                visit(node.moduleSpecifier);
            }

        }

        if (ts.isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }

    /** Serialize a symbol into a json object */
    function serializeSymbol(className: string, line?: number, character?: number, fileName?: string, arryCalls?: string[]): DocEntry {

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
    function serializeClass(className: string, line?: number, character?: number, fileName?: string, arryCalls?: string[]) {
        let details = serializeSymbol(className, line, character, fileName, arryCalls);

        return details;
    }

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node: ts.Node): boolean {
        return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
}

generatExportList(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS, removeComments: false
});
