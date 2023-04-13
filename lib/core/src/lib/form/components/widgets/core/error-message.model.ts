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

/* eslint-disable @angular-eslint/component-selector */

export class ErrorMessageModel {

    message: string = '';
    attributes: Map<string, string> = null;

    constructor(obj?: any) {
        this.message = obj && obj.message ? obj.message : '';
        this.attributes = new Map();
    }

    isActive(): boolean {
        return !!this.message;
    }

    getAttributesAsJsonObj() {
        let result = {};
        if (this.attributes.size > 0) {
            const obj = Object.create(null);
            this.attributes.forEach((value, key) => {
                obj[key] = value;
            });
            result = JSON.stringify(obj);
        }
        return result;
    }
}
