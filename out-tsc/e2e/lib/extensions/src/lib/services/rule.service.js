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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var extension_loader_service_1 = require("./extension-loader.service");
var RuleService = /** @class */ (function () {
    function RuleService(loader) {
        this.loader = loader;
        this.context = null;
        this.rules = [];
        this.evaluators = {};
    }
    RuleService.prototype.setup = function (config) {
        this.rules = this.loader.getRules(config);
    };
    /**
     * Adds one or more new rule evaluators to the existing set.
     * @param values The new evaluators to add
     */
    RuleService.prototype.setEvaluators = function (values) {
        if (values) {
            this.evaluators = Object.assign({}, this.evaluators, values);
        }
    };
    /**
     * Retrieves a rule using its ID value.
     * @param id The ID value to look for
     * @returns The rule or null if not found
     */
    RuleService.prototype.getRuleById = function (id) {
        return this.rules.find(function (ref) { return ref.id === id; });
    };
    /**
     * Retrieves a RuleEvaluator function using its key name.
     * @param key Key name to look for
     * @returns RuleEvaluator or null if not found
     */
    RuleService.prototype.getEvaluator = function (key) {
        if (key && key.startsWith('!')) {
            var fn_1 = this.evaluators[key.substring(1)];
            return function (context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return !fn_1.apply(void 0, [context].concat(args));
            };
        }
        return this.evaluators[key];
    };
    /**
     * Evaluates a rule.
     * @param ruleId ID of the rule to evaluate
     * @param context Custom rule execution context.
     * @returns True if the rule passed, false otherwise
     */
    RuleService.prototype.evaluateRule = function (ruleId, context) {
        var ruleRef = this.getRuleById(ruleId);
        context = context || this.context;
        if (ruleRef) {
            var evaluator = this.getEvaluator(ruleRef.type);
            if (evaluator) {
                return evaluator.apply(void 0, [context].concat(ruleRef.parameters));
            }
        }
        else {
            var evaluator = this.getEvaluator(ruleId);
            if (evaluator) {
                return evaluator(context);
            }
        }
        return false;
    };
    RuleService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [extension_loader_service_1.ExtensionLoaderService])
    ], RuleService);
    return RuleService;
}());
exports.RuleService = RuleService;
//# sourceMappingURL=rule.service.js.map