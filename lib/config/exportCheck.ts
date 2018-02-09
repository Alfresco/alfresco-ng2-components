import * as ts from "typescript";
import * as fs from "fs";
import chalk from "chalk";

interface DocEntry {
    position?: {
        line: number,
        character: number,
        fileName: string
    },
    name?: string
};

let error_array = [];
let warning_array = [];
let exportedAllPath: Array<string> = [];
let classList: Array<any> = [];


let add_error = function (error: string) {
    error_array.push(error);
}

let print_errors = function () {
    error_array.forEach((current_error) => {
        console.log(chalk.red(`${current_error}`));
    });
}

let add_warning = function (error: string) {
    warning_array.push(error);
}

let print_warnings = function () {
    warning_array.forEach((current_warning) => {
        console.log(chalk.yellow(`${current_warning}`));
    });
}

let current_error_postion = function (exportEntry) {
    return ` ${exportEntry.position.fileName} (${exportEntry.position.line},${exportEntry.position.character})`
}

let check_export = function (export_old: any, export_new: any) {
    let count_error = 0;
    let count_warning = 0;

    export_old.forEach((currentExport_old) => {

        let currentExport_new = export_new.filter((currentExport_new) => {
            return currentExport_new.name === currentExport_old.name;
        });

        if (currentExport_new.length > 1) {
            add_warning(`\n[${++count_warning}] Multiple export ${currentExport_new[0].name} times ${currentExport_new.length}`);

            currentExport_new.forEach((error) => {
                add_warning(`${current_error_postion(error)}`);
            })

        } else if (currentExport_new.length === 0) {
            add_error(`\n[${++count_error}] Not find export ${currentExport_old.name}`);
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
        if(classNode.symbol.parent) {
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

    console.log(chalk.green('Saving new export in export-new.json'));

    fs.writeFileSync('export-new.json', JSON.stringify(exportCurrentVersion, undefined, 4));

    try {
        var export_old = JSON.parse(fs.readFileSync('export-2.0.0.json', 'utf8'));
    } catch (error) {
        console.log(chalk.red('export-2.0.0.json not present'));
        throw new Error('Undetected export comapring file');
    }

    var export_new = JSON.parse(JSON.stringify(exportCurrentVersion));

    console.log(chalk.green('Comparing export-2.0.0.json and export-new.json'));

    check_export(export_old, export_new);

    print_warnings();
    print_errors();

    if (error_array.length > 0) {
        throw new Error('Export problems detected');
    } else {
        return;
    }

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

                    let find;
                    exportedAllPath.forEach((currentExported) => {
                        if (currentModule.resolvedFileName === currentExported) {
                            find = currentExported;
                        }
                    })

                    if (!find) {
                        exportedAllPath.push(currentModule.resolvedFileName);
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
