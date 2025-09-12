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
import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';

interface MigrationData {
    change: {
        importedValue: string;
        importSource: string;
    };
    to: {
        importedValue: string;
        importSource: string;
    };
}

const alfrescoApiServiceMigration: MigrationData = {
    change: {
        importedValue: 'AlfrescoApiService',
        importSource: '@alfresco/adf-core'
    },
    to: {
        importedValue: 'AlfrescoApiService',
        importSource: '@alfresco/adf-content-services'
    }
};

const alfrescoApiMockMigration: MigrationData = {
    change: {
        importedValue: 'AlfrescoApiServiceMock',
        importSource: '@alfresco/adf-core'
    },
    to: {
        importedValue: 'AlfrescoApiServiceMock',
        importSource: '@alfresco/adf-content-services'
    }
};

const alfrescoApiFactoryMigration: MigrationData = {
    change: {
        importedValue: 'AlfrescoApiFactory',
        importSource: '@alfresco/adf-core'
    },
    to: {
        importedValue: 'AlfrescoApiFactory',
        importSource: '@alfresco/adf-content-services'
    }
};

const migrations: MigrationData[] = [alfrescoApiServiceMigration, alfrescoApiMockMigration, alfrescoApiFactoryMigration];

/**
 * @returns Schematic rule for updating imports
 */
export function updateAlfrescoApiImports(): Rule {
    return (tree: Tree) => {
        tree.visit((filePath: string) => visitor(filePath, tree));
        return tree;
    };
}

export const visitor = (filePath: string, tree: Pick<Tree, 'read' | 'overwrite'>): void => {
    if (
        !filePath.includes('/.git/') &&
        !filePath.includes('/node_modules/') &&
        !filePath.includes('/.angular/') &&
        !filePath.includes('/.nxcache/') &&
        /\.ts$/.test(filePath)
    ) {
        const bufferFileContent = tree.read(filePath);

        if (!bufferFileContent) {
            throw new SchematicsException(`Could not read file: ${filePath}`);
        }

        const fileContent = bufferFileContent.toString();
        const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

        migrations.forEach((migrationData) => {
            const fileWithUpdatedImport = moveImport(bufferFileContent, sourceFile, migrationData);

            if (fileWithUpdatedImport) {
                tree.overwrite(filePath, fileWithUpdatedImport);
            }
        });
    }
};

const moveImport = (bufferFileContent: Buffer, sourceFile: ts.SourceFile, migrationData: MigrationData): string | undefined => {
    const fileContent = bufferFileContent.toString();
    const predictImport = fileContent.includes(migrationData.change.importedValue);

    if (predictImport) {
        const moduleImports = sourceFile.statements.filter(ts.isImportDeclaration);

        const importDeclaration = moduleImports.find((moduleImport) => {
            const currentImportSource = moduleImport.moduleSpecifier.getText().replace(/['"]/g, '');
            return currentImportSource === migrationData.change.importSource;
        });

        if (!importDeclaration?.importClause?.namedBindings) {
            return undefined;
        }

        if (!ts.isNamedImports(importDeclaration.importClause.namedBindings)) {
            return undefined;
        }

        const namedImportsElements = importDeclaration.importClause.namedBindings.elements;
        const importedValue = namedImportsElements.find((binding) => binding.name.text === migrationData.change.importedValue);

        if (importedValue) {
            let updatedContent =
                namedImportsElements.length === 1
                    ? removeTextRange(fileContent, importDeclaration.getFullStart(), importDeclaration.getEnd())
                    : removeTextRange(fileContent, importedValue.getFullStart(), importedValue.getEnd());
            const alreadyImported = moduleImports.some((moduleImport) => {
                const currentImportSource = moduleImport.moduleSpecifier.getText().replace(/['"]/g, '');
                return (
                    currentImportSource === migrationData.to.importSource &&
                    moduleImport.importClause?.namedBindings &&
                    ts.isNamedImports(moduleImport.importClause.namedBindings) &&
                    moduleImport.importClause.namedBindings.elements.some((element) => element.name.text === migrationData.to.importedValue)
                );
            });

            if (!alreadyImported) {
                const firstNonImport = sourceFile.statements.find((statement) => !ts.isImportDeclaration(statement));
                const insertPosition = firstNonImport ? firstNonImport.getFullStart() : fileContent.length;

                updatedContent =
                    updatedContent.slice(0, insertPosition).trimEnd() +
                    `\nimport { ${migrationData.to.importedValue} } from '${migrationData.to.importSource}';\n` +
                    updatedContent.slice(insertPosition);
            }
            updatedContent = updatedContent.replace(/^\s*\n+/g, '').replace(/\n{3,}/g, '\n\n');

            return updatedContent;
        }
    }

    return undefined;
};

const removeTextRange = (text: string, start: number, end: number): string => text.slice(0, start) + text.slice(end);

export default updateAlfrescoApiImports;
