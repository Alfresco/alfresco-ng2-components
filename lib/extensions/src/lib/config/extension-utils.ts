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

import { ContentActionRef, ContentActionType } from './action.extensions';

export const getValue = (target: any, key: string): any => {
    if (!target) {
        return undefined;
    }

    const keys = key.split('.');
    key = '';

    do {
        key += keys.shift();
        const value = target[key];
        if (
            value !== undefined &&
            (typeof value === 'object' || !keys.length)
        ) {
            target = value;
            key = '';
        } else if (!keys.length) {
            target = undefined;
        } else {
            key += '.';
        }
    } while (keys.length);

    return target;
};

export const filterEnabled = (entry: { disabled?: boolean }): boolean => !entry.disabled;

export const sortByOrder = (
    a: { order?: number | undefined },
    b: { order?: number | undefined }
) => {
    const left = a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
    const right = b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;
    return left - right;
};

export const reduceSeparators = (
    acc: ContentActionRef[],
    el: ContentActionRef,
    i: number,
    arr: ContentActionRef[]
): ContentActionRef[] => {
    // remove leading separator
    if (i === 0) {
        if (arr[i].type === ContentActionType.separator) {
            return acc;
        }
    }
    // remove duplicate separators
    if (i > 0) {
        const prev = arr[i - 1];
        if (
            prev.type === ContentActionType.separator &&
            el.type === ContentActionType.separator
        ) {
            return acc;
        }

        // remove trailing separator
        if (i === arr.length - 1) {
            if (el.type === ContentActionType.separator) {
                return acc;
            }
        }
    }

    return acc.concat(el);
};

export const reduceEmptyMenus = (
    acc: ContentActionRef[],
    el: ContentActionRef
): ContentActionRef[] => {
    if (el.type === ContentActionType.menu) {
        if ((el.children || []).length === 0) {
            return acc;
        }
    }
    return acc.concat(el);
};

export const mergeObjects = (...objects: any[]): any => {
    const result = {};

    objects.forEach((source) => {
        Object.keys(source).forEach((prop) => {
            let replace = false;

            if (prop.endsWith('.$replace')) {
                replace = true;
                prop = prop.replace('.$replace', '');
            }

            if (!prop.startsWith('$')) {
                if (replace) {
                    result[prop] = source[`${prop}.$replace`];
                } else if (prop in result && Array.isArray(result[prop])) {
                    result[prop] = mergeArrays(result[prop], source[prop]);
                } else if (prop in result && typeof result[prop] === 'object') {
                    result[prop] = mergeObjects(result[prop], source[prop]);
                } else {
                    result[prop] = source[prop];
                }
            }
        });
    });

    return result;
};

export const mergeArrays = (left: any[], right: any[]): any[] => {
    const result = [];
    const map = {};

    (left || []).forEach((entry) => {
        const element = entry;
        if (element && element.hasOwnProperty('id')) {
            map[element.id] = element;
        } else {
            result.push(element);
        }
    });

    (right || []).forEach((entry) => {
        const element = entry;
        if (element && element.hasOwnProperty('id') && map[element.id]) {
            const merged = mergeObjects(map[element.id], element);
            map[element.id] = merged;
        } else {
            result.push(element);
        }
    });

    return Object.keys(map).map((key) => map[key]).concat(result);
};
