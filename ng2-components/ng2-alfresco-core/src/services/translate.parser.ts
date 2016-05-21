/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

export class Parser {
    templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;


    /**
     * Interpolates a string to replace parameters
     * "This is a {{ key }}" ==> "This is a value", with params = { key: "value" }
     * @param expr
     * @param params
     * @returns {string}
     */
    public interpolate(expr: string, params?: any): string {
        if (typeof expr !== 'string' || !params) {
            return expr;
        }

        return expr.replace(this.templateMatcher, (substring: string, b: string) => {
            let r = this.getValue(params, b);
            return typeof r !== 'undefined' ? r : substring;
        });
    }

    /**
     * Gets a value from an object by composed key
     * parser.getValue({ key1: { keyA: 'valueI' }}, 'key1.keyA') ==> 'valueI'
     * @param target
     * @param key
     * @returns {string}
     */
    public getValue(target: any, key: string): string {
        let keys = key.split('.');
        key = '';
        do {
            key += keys.shift();
            if (target[key] !== undefined && (typeof target[key] === 'object' || !keys.length)) {
                target = target[key];
                key = '';
            } else if (!keys.length) {
                target = undefined;
            } else {
                key += '.';
            }
        } while (keys.length);

        return target;
    }

}
