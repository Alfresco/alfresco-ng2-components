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

export class ObjectUtils {
    /**
     * Gets a value from an object by composed key
     * ObjectUtils.getValue({ item: { nodeType: 'cm:folder' }}, 'item.nodeType') ==> 'cm:folder'
     *
     * @param target
     * @param key
     */
    static getValue(target: any, key: string): any {

        if (!target) {
            return undefined;
        }

        const keys = key.split('.');
        key = '';

        do {
            key += keys.shift();
            const value = target[key];
            if (value !== undefined && (typeof value === 'object' || !keys.length)) {
                target = value;
                key = '';
            } else if (!keys.length) {
                target = undefined;
            } else {
                key += '.';
            }
        } while (keys.length);

        return target;
    }

    static merge(...objects): any {
        const result = {};

        objects.forEach((source) => {
            Object.keys(source).forEach((prop) => {
                if (prop in result && Array.isArray(result[prop])) {
                    result[prop] = result[prop].concat(source[prop]);
                } else if (prop in result && typeof result[prop] === 'object') {
                    result[prop] = ObjectUtils.merge(result[prop], source[prop]);
                } else {
                    result[prop] = source[prop];
                }
            });
        });

        return result;
    }

    static isObject(target: any): boolean {
        return target === Object(target);
    }

    static isEmpty(target: any): boolean {
        return target && Object.keys(target).length === 0 && Object.getPrototypeOf(target) === Object.prototype;
    }

    static hasKeys(target: any): boolean {
        return target && Object.keys(target).length > 0;
    }

    static isBooleanObject(target: any): boolean {
        return Object.values(target).every(value => typeof value === 'boolean');
    }

    static booleanPrettify(target: any, enhancer?: (param: string) => string): string {

        if (
            !target ||
            ObjectUtils.isEmpty(target) ||
            !ObjectUtils.isBooleanObject(target)
            ) {
            return '';
        }

        if (
            !ObjectUtils.isObject(target) ||
            !ObjectUtils.hasKeys(target)
            ) {
            return target.toString();
        }

        const greenBorderWhiteCheckSymbol = '&#9989';
        const redCrossSymbol = '&#10060';

        target = Object.keys(target).map((key) => {
            if (target[key]) {
                if (enhancer) {
                    return `${greenBorderWhiteCheckSymbol} ${enhancer(key)}`;
                } else {
                    return `${greenBorderWhiteCheckSymbol} ${key}`;
                }

            }

            if (enhancer) {
                return `${redCrossSymbol} ${enhancer(key)}`;
            } else {
                return `${redCrossSymbol} ${key}`;
            }

        }).join('\n');

        return target;
    }
}
