/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export class DataTablePathParserHelper {
    private readonly splitPathRegEx = /\.(?![^[]*\])/g;
    private readonly removeSquareBracketsRegEx = /^\[(.*)\]$/;

    retrieveDataFromPath(data: any, path: string): any[] {
        const properties = this.splitPathIntoProperties(path);
        const currentProperty = this.removeSquareBracketsFromProperty(properties.shift());

        if (!this.isPropertyExistsInData(data, currentProperty)) {
            return [];
        }

        const nestedData = data[currentProperty];

        if (Array.isArray(nestedData)) {
            return nestedData;
        }

        return this.retrieveDataFromPath(nestedData, properties.join('.'));
    }

    private splitPathIntoProperties(path: string): string[] {
        return path.split(this.splitPathRegEx);
    }

    private removeSquareBracketsFromProperty(property: string): string {
        return property.replace(this.removeSquareBracketsRegEx, '$1');
    }

    private isPropertyExistsInData(data: any, property: string): boolean {
        return Object.prototype.hasOwnProperty.call(data, property);
    }
}
