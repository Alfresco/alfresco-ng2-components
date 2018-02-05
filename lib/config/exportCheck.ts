import * as ts from "typescript";
import * as fs from "fs";
import chalk from "chalk";

interface DocEntry {
    position?: {
        line: number,
        character: number,
        fileName: string
    },
    name?: string,
    fileName?: string,
    documentation?: string,
    type?: string,
    constructors?: DocEntry[],
    parameters?: DocEntry[],
    returnType?: string
};

let error_array = [];

let add_error = function (error: string) {
    error_array.push(error);
}

let print_error = function () {
    error_array.forEach((current_error) => {
        console.log(chalk.red(current_error));
    });
}

let current_error_postion = function (exportEntry) {
    return ` ${exportEntry.position.fileName} (${exportEntry.position.line},${exportEntry.position.character})`
}

let check_parameters = function (currentExport_old, currentExport_new: any, count_error: number) {
//check parameters
    currentExport_old.constructors[0].parameters.forEach((currentParameters_old) => {

        let currentParameters_new = currentExport_new[0].constructors[0].parameters.find((currentParameters_new) => {
            return currentParameters_new.name === currentParameters_old.name;
        });

        if (!currentParameters_new) {
            add_error(`\n[${++count_error}] Not find parameter in ${currentExport_old.name} \n missing paramaeter: ${currentParameters_old.name}`);
        } else {

            if (currentParameters_old.type !== currentParameters_new.type) {
                add_error(`\n[${++count_error}] Different type parameter ${currentParameters_old.name} \n Old type: ${currentParameters_old.type.replace('typeof', '')} \n New type: ${currentParameters_new.type.replace('typeof', '')}  \n`);
            }
        }

    });
    return count_error;
};

let check_export = function (export_old: any, export_new: any) {
    let count_error = 0;

    export_old.forEach((currentExport_old) => {

        let currentExport_new = export_new.filter((currentExport_new) => {
            return currentExport_new.name === currentExport_old.name;
        });

        if (currentExport_new.length > 1) {
            add_error(`\n[${++count_error}] Multiple export ${currentExport_new[0].name} times ${currentExport_new.length}`);

            currentExport_new.forEach((error) => {
                add_error(`${current_error_postion(error)}`);
            })


        } else if (currentExport_new.length === 0) {
            add_error(`\n[${++count_error}] Not find export ${currentExport_old.name}`);
        } else if (currentExport_new.length === 1) {

            //check export type
            if (currentExport_old.type !== currentExport_new[0].type) {
                add_error(`\n[${++count_error}] Different type export ${currentExport_old.name} \n Old type: ${currentExport_old.type.replace('typeof', '')} \n New type: ${currentExport_new[0].type.replace('typeof', '')}  ${current_error_postion(currentExport_new[0])}`);
            }

            count_error = check_parameters(currentExport_old, currentExport_new, count_error);

        }

    });
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

    exportCurrentVersion.sort((nameA, nameB) => nameA.name.localeCompare(nameB.name));

    console.log(chalk.green('Saving new export in export-new.json'));

    fs.writeFileSync('export-new.json', JSON.stringify(exportCurrentVersion, undefined, 4));

    var export_old = JSON.parse(fs.readFileSync('export-2.0.0.json', 'utf8'));
    var export_new = JSON.parse(JSON.stringify(exportCurrentVersion));

    console.log(chalk.green('Comparing export-2.0.0.json and export-new.json'));

    check_export(export_old, export_new);

    print_error();

    if (error_array.length > 0) {
        throw new Error('Export problems detected');
    } else {
        return;
    }

    /** visit nodes finding exported classes */
    function visit(node: ts.Node) {
        // Only consider exported nodes
        if (!isNodeExported(node)) {
            return;
        }

        if (ts.isClassDeclaration(node) && node.name) {

            //skip file with export-check: exclude comment
            if (node.getFullText(node.getSourceFile()).indexOf('export-check: exclude') > 0) {
                console.log(node.getText(node.getSourceFile()));
                return;
            }

            let { line, character } = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());

            // This is a top level class, get its symbol
            let symbol = checker.getSymbolAtLocation(node.name);

            if (symbol) {
                let filename = node.getSourceFile().fileName.substring(node.getSourceFile().fileName.indexOf('lib'), node.getSourceFile().fileName.length)
                exportCurrentVersion.push(serializeClass(symbol, line, character, filename));
            }
            // No need to walk any further, class expressions/inner declarations
            // cannot be exported
        }
        else if (ts.isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }

    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol: ts.Symbol, line?: number, character?: number, fileName?: string): DocEntry {
        return {
            position: {
                line: line,
                character: character,
                fileName: fileName
            },
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
        };
    }

    /** Serialize a class symbol information */
    function serializeClass(symbol: ts.Symbol, line?: number, character?: number, fileName?: string) {
        let details = serializeSymbol(symbol, line, character, fileName);

        // Get the construct signatures
        let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
        details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
        return details;
    }

    /** Serialize a signature (call or construct) */
    function serializeSignature(signature: ts.Signature) {
        return {
            parameters: signature.parameters.map((currentParam) => {
                return serializeSymbol(currentParam);
            }),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node: ts.Node): boolean {
        return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
}

generatExportList(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS, removeComments: false
});
