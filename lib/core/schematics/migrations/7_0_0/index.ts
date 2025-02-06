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

import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { Project, NamedImports, SourceFile, ImportSpecifier, ImportDeclaration } from 'ts-morph';

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
    const project = new Project();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (tree: Tree, _context: SchematicContext) => {
        tree.visit((filePath: string) => visitor(filePath, tree, project));

        return tree;
    };
}

export const visitor = (filePath: string, tree: Pick<Tree, 'read' | 'overwrite'>, project: Project) => {
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

        migrations.forEach((migrationData) => {
            const fileWithUpdatedImport = moveImport(filePath, bufferFileContent, project, migrationData);

            if (fileWithUpdatedImport) {
                tree.overwrite(filePath, fileWithUpdatedImport);
            }
        });
    }
};

const moveImport = (filePath: string, bufferFileContent: Buffer, project: Project, migrationData: MigrationData): string | undefined => {
    const fileContent = bufferFileContent.toString();
    const predictImport = fileContent.includes(migrationData.change.importedValue);

    if (predictImport) {
        const sourceFile = project.getSourceFile(`migration-${filePath}`) ?? project.createSourceFile(`migration-${filePath}`, fileContent);

        const alfrescoApiImportResult = getImportedValueFromSource(sourceFile, {
            importedIdentifier: migrationData.change.importedValue,
            from: migrationData.change.importSource
        });

        if (alfrescoApiImportResult?.importedValue) {
            if (alfrescoApiImportResult.allImportedValuesCount === 1) {
                // There is only one import e.g. import { A } from 'A';
                // Therefore, we need to remove whole import statement
                alfrescoApiImportResult.importSource?.remove();
            } else {
                alfrescoApiImportResult.importedValue?.remove();
            }

            const alfrescoContentServiceImport = getSourceImport(sourceFile, migrationData.to.importSource);

            if (alfrescoContentServiceImport) {
                alfrescoContentServiceImport.addNamedImport(migrationData.to.importedValue);
            } else {
                sourceFile.insertStatements(
                    sourceFile.getImportDeclarations().length + 1,
                    `import { ${migrationData.to.importedValue} } from '${migrationData.to.importSource}';`
                );
            }

            return sourceFile.getFullText();
        }
    }

    return undefined;
};

const getSourceImport = (sourceFile: SourceFile, from: string): ImportDeclaration | undefined => {
    const moduleImports = sourceFile.getImportDeclarations();

    const importDeclaration = moduleImports.find((moduleImport) => {
        const currentImportSource = moduleImport.getModuleSpecifierValue();
        return currentImportSource === from;
    });

    return importDeclaration;
};

const getImportedValueFromSource = (
    sourceFile: SourceFile,
    searchedImport: {
        importedIdentifier: string;
        from: string;
    }
): {
    importedValue: ImportSpecifier | undefined;
    importSource: ImportDeclaration | undefined;
    allImportedValuesCount: number | undefined;
} => {
    const importSource = getSourceImport(sourceFile, searchedImport.from);

    if (!importSource) {
        return {
            importedValue: undefined,
            importSource: undefined,
            allImportedValuesCount: undefined
        };
    }

    const importedValues = importSource?.getImportClause();
    const namedImports = importedValues?.getNamedBindings() as NamedImports;
    const namedImportsElements = namedImports?.getElements() ?? [];

    const importedValue = namedImportsElements.find((binding) => binding.getName() === searchedImport.importedIdentifier);

    return {
        importedValue,
        importSource,
        allImportedValuesCount: namedImportsElements.length
    };
};

export default updateAlfrescoApiImports;
