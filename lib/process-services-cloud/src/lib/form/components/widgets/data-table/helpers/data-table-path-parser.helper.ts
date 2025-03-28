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

import { DataRow } from '@alfresco/adf-core';

export class DataTablePathParserHelper {
    private readonly removeSquareBracketsRegEx = /^\[(.*)\]$/;
    private readonly indexReferencesRegEx = /(\[\d+\])+$/;

    retrieveDataFromPath(data: any, path: string): DataRow[] | undefined {
        if (!path) {
            return undefined;
        }

        const properties = this.splitPathIntoProperties(path);
        const currentProperty = properties.shift();
        const propertyIndexReferences = this.getIndexReferencesFromProperty(currentProperty);
        const purePropertyName = this.extractPurePropertyName(currentProperty);
        const isPropertyWithMultipleIndexReferences = propertyIndexReferences.length > 1;

        if (isPropertyWithMultipleIndexReferences || !this.isPropertyExistsInData(data, purePropertyName)) {
            return undefined;
        }

        const isPropertyWithSingleIndexReference = propertyIndexReferences.length === 1;
        const nestedData = isPropertyWithSingleIndexReference ? data[purePropertyName]?.[propertyIndexReferences[0]] : data[purePropertyName];

        if (nestedData && properties.length === 0) {
            if (this.isDataArrayOrObject(nestedData)) {
                return Array.isArray(nestedData) ? nestedData : [nestedData];
            }
        }

        return this.retrieveDataFromPath(nestedData, properties.join('.'));
    }

    splitPathIntoProperties(path: string): string[] {
        const properties: string[] = [];
        const separator = '.';
        const openBracket = '[';
        const closeBracket = ']';

        let currentPropertyBuffer = '';
        let bracketCount = 0;
        const isPropertySeparatorOutsideBrackets = () => bracketCount === 0;

        if (!path) {
            return properties;
        }

        for (const char of path) {
            switch (char) {
                case separator:
                    if (isPropertySeparatorOutsideBrackets()) {
                        properties.push(currentPropertyBuffer);
                        currentPropertyBuffer = '';
                    } else {
                        currentPropertyBuffer += char;
                    }
                    break;
                case openBracket:
                    bracketCount++;
                    currentPropertyBuffer += char;
                    break;
                case closeBracket:
                    bracketCount--;
                    currentPropertyBuffer += char;
                    break;
                default:
                    currentPropertyBuffer += char;
                    break;
            }
        }

        if (currentPropertyBuffer) {
            properties.push(currentPropertyBuffer);
        }

        return properties;
    }

    getIndexReferencesFromProperty(property: string): number[] {
        const match = this.indexReferencesRegEx.exec(property);
        if (!match) {
            return [];
        }

        const indexReferencesString = match[0];
        const numbersFromBrackets = indexReferencesString.slice(1, -1).split('][').map(Number);

        return numbersFromBrackets;
    }

    extractPurePropertyName(property: string): string {
        const propertyIndexReferences = this.getIndexReferencesFromProperty(property);
        const numberOfIndexReferences = propertyIndexReferences.length;

        if (property == null) {
            return '';
        } else if (numberOfIndexReferences !== 0) {
            return this.removeSquareBracketsAndIndexReferencesFromProperty(property);
        } else {
            return this.removeSquareBracketsFromProperty(property);
        }
    }

    private removeSquareBracketsAndIndexReferencesFromProperty(property: string): string {
        const propertyWithoutIndexReferences = property?.replace(this.indexReferencesRegEx, '');

        return this.removeSquareBracketsFromProperty(propertyWithoutIndexReferences);
    }

    private removeSquareBracketsFromProperty(property: string): string {
        return property?.replace(this.removeSquareBracketsRegEx, '$1');
    }

    private isPropertyExistsInData(data: any, property: string): boolean {
        return Object.prototype.hasOwnProperty.call(data, property);
    }

    private isDataArrayOrObject(data: any): boolean {
        if (data == null) {
            return false;
        }
        return Array.isArray(data) || typeof data === 'object';
    }
}
