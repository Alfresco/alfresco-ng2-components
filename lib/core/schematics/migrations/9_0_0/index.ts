/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from 'typescript';
import { Rule, Tree } from '@angular-devkit/schematics';

const PDF_SYMBOLS = [
    'PdfViewerComponent',
    'PdfPasswordDialogComponent',
    'PdfThumbListComponent',
    'PdfThumbComponent',
    'PDFJS_MODULE',
    'PDFJS_VIEWER_MODULE',
    'RenderingQueueServices'
];

const OLD_SOURCE = '@alfresco/adf-core';
const NEW_SOURCE = '@alfresco/adf-core/viewer/pdf';

/**
 * @returns Schematic rule for migrating PDF viewer imports to the secondary entrypoint
 */
export function migratePdfViewerImports(): Rule {
    return (tree: Tree) => {
        let providerAdded = false;

        tree.visit((filePath: string) => {
            if (
                !filePath.includes('/.git/') &&
                !filePath.includes('/node_modules/') &&
                !filePath.includes('/.angular/') &&
                !filePath.includes('/.nxcache/') &&
                /\.ts$/.test(filePath)
            ) {
                const bufferContent = tree.read(filePath);
                if (!bufferContent) {
                    return;
                }

                const fileContent = bufferContent.toString();

                if (PDF_SYMBOLS.some((sym) => fileContent.includes(sym))) {
                    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);
                    const updatedContent = movePdfImports(sourceFile, fileContent);

                    if (updatedContent !== fileContent) {
                        tree.overwrite(filePath, updatedContent);
                    }
                }

                if (!providerAdded && fileContent.includes('providePdfViewer')) {
                    providerAdded = true;
                }
            }
        });

        if (!providerAdded) {
            addProvidePdfViewerToAppConfig(tree);
        }

        return tree;
    };
}

/**
 * @param sourceFile - the parsed TypeScript source file
 * @param fileContent - the raw file content string
 * @returns updated file content with PDF imports moved to the secondary entrypoint
 */
function movePdfImports(sourceFile: ts.SourceFile, fileContent: string): string {
    const importDeclarations = sourceFile.statements.filter(ts.isImportDeclaration);
    const coreImport = importDeclarations.find((decl) => {
        const moduleSpecifier = decl.moduleSpecifier.getText().replace(/['"]/g, '');
        return moduleSpecifier === OLD_SOURCE;
    });

    if (!coreImport?.importClause?.namedBindings || !ts.isNamedImports(coreImport.importClause.namedBindings)) {
        return fileContent;
    }

    const namedImports = coreImport.importClause.namedBindings.elements;
    const pdfImports = namedImports.filter((el) => PDF_SYMBOLS.includes(el.name.text));
    const remainingImports = namedImports.filter((el) => !PDF_SYMBOLS.includes(el.name.text));

    if (pdfImports.length === 0) {
        return fileContent;
    }

    const pdfImportNames = pdfImports.map((el) => el.name.text);

    const existingNewImport = importDeclarations.find((decl) => decl.moduleSpecifier.getText().replace(/['"]/g, '') === NEW_SOURCE);

    const existingNewImportNames: string[] = [];
    if (existingNewImport?.importClause?.namedBindings && ts.isNamedImports(existingNewImport.importClause.namedBindings)) {
        existingNewImportNames.push(...existingNewImport.importClause.namedBindings.elements.map((el) => el.name.text));
    }

    const mergedNames = [...new Set([...existingNewImportNames, ...pdfImportNames])];
    const mergedImportStatement = `import { ${mergedNames.join(', ')} } from '${NEW_SOURCE}';`;

    const edits: { start: number; end: number; replacement: string }[] = [];

    if (remainingImports.length === 0) {
        edits.push({ start: coreImport.getFullStart(), end: coreImport.getEnd(), replacement: '' });
    } else {
        const remainingNames = remainingImports.map((el) => el.getText()).join(', ');
        const updatedImport = `import { ${remainingNames} } from '${OLD_SOURCE}';`;
        edits.push({ start: coreImport.getStart(), end: coreImport.getEnd(), replacement: updatedImport });
    }

    if (existingNewImport) {
        edits.push({ start: existingNewImport.getStart(), end: existingNewImport.getEnd(), replacement: mergedImportStatement });
    }

    edits.sort((a, b) => b.start - a.start);
    let updatedContent = fileContent;
    for (const edit of edits) {
        updatedContent = updatedContent.slice(0, edit.start) + edit.replacement + updatedContent.slice(edit.end);
    }

    if (!existingNewImport) {
        const updatedSource = ts.createSourceFile('temp.ts', updatedContent, ts.ScriptTarget.Latest, true);
        const firstNonImport = updatedSource.statements.find((stmt) => !ts.isImportDeclaration(stmt));
        const insertPos = firstNonImport ? firstNonImport.getFullStart() : updatedContent.length;
        updatedContent = updatedContent.slice(0, insertPos).trimEnd() + '\n' + mergedImportStatement + '\n' + updatedContent.slice(insertPos);
    }

    return updatedContent.replace(/\n{3,}/g, '\n\n');
}

/**
 * @param tree - the schematic file tree
 */
function addProvidePdfViewerToAppConfig(tree: Tree): void {
    const candidates = ['src/app/app.config.ts', 'src/app/app.module.ts', 'src/main.ts'];
    let targetPath: string | null = null;

    for (const candidate of candidates) {
        if (tree.exists(`/${candidate}`)) {
            targetPath = `/${candidate}`;
            break;
        }
    }

    if (!targetPath) {
        tree.visit((filePath: string) => {
            if (targetPath) {
                return;
            }
            if (!filePath.includes('/node_modules/') && !filePath.includes('/.git/') && /\.ts$/.test(filePath)) {
                const content = tree.read(filePath)?.toString() ?? '';
                if (content.includes('bootstrapApplication') || content.includes('ApplicationConfig')) {
                    targetPath = filePath;
                }
            }
        });
    }

    if (!targetPath) {
        return;
    }

    const buffer = tree.read(targetPath);
    if (!buffer) {
        return;
    }
    const content = buffer.toString();

    if (content.includes('providePdfViewer')) {
        return;
    }

    const sourceFile = ts.createSourceFile(targetPath, content, ts.ScriptTarget.Latest, true);
    const result = insertProvidePdfViewer(sourceFile, content);

    if (result !== content) {
        tree.overwrite(targetPath, result);
    }
}

/**
 * @param sourceFile - the parsed TypeScript source file
 * @param content - the raw file content
 * @returns updated content with providePdfViewer() added to providers
 */
function insertProvidePdfViewer(sourceFile: ts.SourceFile, content: string): string {
    const providersArray = findProvidersArray(sourceFile);
    if (!providersArray) {
        return content;
    }

    const lastElement = providersArray.elements[providersArray.elements.length - 1];
    let insertPos: number;
    let prefix: string;

    if (lastElement) {
        insertPos = lastElement.getEnd();
        prefix = ', providePdfViewer()';
    } else {
        insertPos = providersArray.getStart() + 1;
        prefix = 'providePdfViewer()';
    }

    let updatedContent = content.slice(0, insertPos) + prefix + content.slice(insertPos);

    const importStatement = `import { providePdfViewer } from '${NEW_SOURCE}';\n`;
    const existingPdfImport = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .find((decl) => decl.moduleSpecifier.getText().replace(/['"]/g, '') === NEW_SOURCE);

    if (existingPdfImport) {
        if (!content.includes('providePdfViewer')) {
            const updatedSource = ts.createSourceFile('temp.ts', updatedContent, ts.ScriptTarget.Latest, true);
            const existingDecl = updatedSource.statements
                .filter(ts.isImportDeclaration)
                .find((decl) => decl.moduleSpecifier.getText().replace(/['"]/g, '') === NEW_SOURCE);

            if (existingDecl?.importClause?.namedBindings && ts.isNamedImports(existingDecl.importClause.namedBindings)) {
                const names = existingDecl.importClause.namedBindings.elements.map((el) => el.name.text);
                if (!names.includes('providePdfViewer')) {
                    names.push('providePdfViewer');
                    const newImport = `import { ${names.join(', ')} } from '${NEW_SOURCE}';`;
                    updatedContent = updatedContent.slice(0, existingDecl.getStart()) + newImport + updatedContent.slice(existingDecl.getEnd());
                }
            }
        }
    } else {
        const firstImport = sourceFile.statements.find(ts.isImportDeclaration);
        const importInsertPos = firstImport ? firstImport.getFullStart() : 0;
        updatedContent = updatedContent.slice(0, importInsertPos) + importStatement + updatedContent.slice(importInsertPos);
    }

    return updatedContent;
}

/**
 * @param sourceFile - the TypeScript source file to search
 * @returns the providers ArrayLiteralExpression if found
 */
function findProvidersArray(sourceFile: ts.SourceFile): ts.ArrayLiteralExpression | null {
    let result: ts.ArrayLiteralExpression | null = null;

    const visit = (node: ts.Node): void => {
        if (result) {
            return;
        }

        if (ts.isPropertyAssignment(node) && node.name.getText() === 'providers' && ts.isArrayLiteralExpression(node.initializer)) {
            result = node.initializer;
            return;
        }

        ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return result;
}

export default migratePdfViewerImports;
