"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
Object.defineProperty(exports, "__esModule", { value: true });
var action_extensions_1 = require("./action.extensions");
function getValue(target, key) {
    if (!target) {
        return undefined;
    }
    var keys = key.split('.');
    key = '';
    do {
        key += keys.shift();
        var value = target[key];
        if (value !== undefined &&
            (typeof value === 'object' || !keys.length)) {
            target = value;
            key = '';
        }
        else if (!keys.length) {
            target = undefined;
        }
        else {
            key += '.';
        }
    } while (keys.length);
    return target;
}
exports.getValue = getValue;
function filterEnabled(entry) {
    return !entry.disabled;
}
exports.filterEnabled = filterEnabled;
function sortByOrder(a, b) {
    var left = a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
    var right = b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;
    return left - right;
}
exports.sortByOrder = sortByOrder;
function reduceSeparators(acc, el, i, arr) {
    // remove leading separator
    if (i === 0) {
        if (arr[i].type === action_extensions_1.ContentActionType.separator) {
            return acc;
        }
    }
    // remove duplicate separators
    if (i > 0) {
        var prev = arr[i - 1];
        if (prev.type === action_extensions_1.ContentActionType.separator &&
            el.type === action_extensions_1.ContentActionType.separator) {
            return acc;
        }
        // remove trailing separator
        if (i === arr.length - 1) {
            if (el.type === action_extensions_1.ContentActionType.separator) {
                return acc;
            }
        }
    }
    return acc.concat(el);
}
exports.reduceSeparators = reduceSeparators;
function reduceEmptyMenus(acc, el) {
    if (el.type === action_extensions_1.ContentActionType.menu) {
        if ((el.children || []).length === 0) {
            return acc;
        }
    }
    return acc.concat(el);
}
exports.reduceEmptyMenus = reduceEmptyMenus;
function mergeObjects() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var result = {};
    objects.forEach(function (source) {
        Object.keys(source).forEach(function (prop) {
            if (!prop.startsWith('$')) {
                if (prop in result && Array.isArray(result[prop])) {
                    // result[prop] = result[prop].concat(source[prop]);
                    result[prop] = mergeArrays(result[prop], source[prop]);
                }
                else if (prop in result && typeof result[prop] === 'object') {
                    result[prop] = mergeObjects(result[prop], source[prop]);
                }
                else {
                    result[prop] = source[prop];
                }
            }
        });
    });
    return result;
}
exports.mergeObjects = mergeObjects;
function mergeArrays(left, right) {
    var result = [];
    var map = {};
    (left || []).forEach(function (entry) {
        var element = entry;
        if (element && element.hasOwnProperty('id')) {
            map[element.id] = element;
        }
        else {
            result.push(element);
        }
    });
    (right || []).forEach(function (entry) {
        var element = entry;
        if (element && element.hasOwnProperty('id') && map[element.id]) {
            var merged = mergeObjects(map[element.id], element);
            map[element.id] = merged;
        }
        else {
            result.push(element);
        }
    });
    return Object.keys(map).map(function (key) { return map[key]; }).concat(result);
}
exports.mergeArrays = mergeArrays;
//# sourceMappingURL=extension-utils.js.map