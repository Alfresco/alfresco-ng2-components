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
function not(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!args || args.length === 0) {
        return false;
    }
    return args
        .every(function (arg) {
        var evaluator = context.getEvaluator(arg.value);
        if (!evaluator) {
            console.warn('evaluator not found: ' + arg.value);
            return false;
        }
        return !evaluator.apply(void 0, [context].concat((arg.parameters || [])));
    });
}
exports.not = not;
function every(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!args || args.length === 0) {
        return false;
    }
    return args
        .every(function (arg) {
        var evaluator = context.getEvaluator(arg.value);
        if (!evaluator) {
            console.warn('evaluator not found: ' + arg.value);
            return false;
        }
        return evaluator.apply(void 0, [context].concat((arg.parameters || [])));
    });
}
exports.every = every;
function some(context) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!args || args.length === 0) {
        return false;
    }
    return args
        .some(function (arg) {
        var evaluator = context.getEvaluator(arg.value);
        if (!evaluator) {
            console.warn('evaluator not found: ' + arg.value);
            return false;
        }
        return evaluator.apply(void 0, [context].concat((arg.parameters || [])));
    });
}
exports.some = some;
//# sourceMappingURL=core.evaluators.js.map