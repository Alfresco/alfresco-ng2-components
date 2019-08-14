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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var extension_loader_service_1 = require("./extension-loader.service");
var core = require("../evaluators/core.evaluators");
var component_register_service_1 = require("./component-register.service");
var rule_service_1 = require("./rule.service");
var ExtensionService = /** @class */ (function () {
    function ExtensionService(loader, componentRegister, ruleService) {
        this.loader = loader;
        this.componentRegister = componentRegister;
        this.ruleService = ruleService;
        this.config = null;
        this.configPath = 'assets/app.extensions.json';
        this.pluginsPath = 'assets/plugins';
        this.routes = [];
        this.actions = [];
        this.features = [];
        this.authGuards = {};
    }
    /**
     * Loads and registers an extension config file and plugins (specified by path properties).
     * @returns The loaded config data
     */
    ExtensionService.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loader.load(this.configPath, this.pluginsPath)];
                    case 1:
                        config = _a.sent();
                        this.setup(config);
                        return [2 /*return*/, config];
                }
            });
        });
    };
    /**
     * Registers extensions from a config object.
     * @param config Object with config data
     */
    ExtensionService.prototype.setup = function (config) {
        if (!config) {
            console.warn('Extension configuration not found');
            return;
        }
        this.config = config;
        this.setEvaluators({
            'core.every': core.every,
            'core.some': core.some,
            'core.not': core.not
        });
        this.actions = this.loader.getActions(config);
        this.routes = this.loader.getRoutes(config);
        this.features = this.loader.getFeatures(config);
        this.ruleService.setup(config);
    };
    /**
     * Gets features by key.
     * @param key Key string, using dot notation
     * @returns Features array found by key
     */
    ExtensionService.prototype.getFeature = function (key) {
        var properties = Array.isArray(key) ? [key] : key.split('.');
        return properties.reduce(function (prev, curr) { return prev && prev[curr]; }, this.features) || [];
    };
    ExtensionService.prototype.getElements = function (key, fallback) {
        if (fallback === void 0) { fallback = []; }
        return this.loader.getElements(this.config, key, fallback);
    };
    /**
     * Adds one or more new rule evaluators to the existing set.
     * @param values The new evaluators to add
     */
    ExtensionService.prototype.setEvaluators = function (values) {
        this.ruleService.setEvaluators(values);
    };
    /**
     * Adds one or more new auth guards to the existing set.
     * @param values The new auth guards to add
     */
    ExtensionService.prototype.setAuthGuards = function (values) {
        if (values) {
            this.authGuards = Object.assign({}, this.authGuards, values);
        }
    };
    /**
     * Adds one or more new components to the existing set.
     * @param values The new components to add
     */
    ExtensionService.prototype.setComponents = function (values) {
        this.componentRegister.setComponents(values);
    };
    /**
     * Retrieves a route using its ID value.
     * @param id The ID value to look for
     * @returns The route or null if not found
     */
    ExtensionService.prototype.getRouteById = function (id) {
        return this.routes.find(function (route) { return route.id === id; });
    };
    /**
     * Retrieves one or more auth guards using an array of ID values.
     * @param ids Array of ID value to look for
     * @returns Array of auth guards or empty array if none were found
     */
    ExtensionService.prototype.getAuthGuards = function (ids) {
        var _this = this;
        return (ids || [])
            .map(function (id) { return _this.authGuards[id]; })
            .filter(function (guard) { return guard; });
    };
    /**
     * Retrieves an action using its ID value.
     * @param id The ID value to look for
     * @returns Action or null if not found
     */
    ExtensionService.prototype.getActionById = function (id) {
        return this.actions.find(function (action) { return action.id === id; });
    };
    /**
     * Retrieves a RuleEvaluator function using its key name.
     * @param key Key name to look for
     * @returns RuleEvaluator or null if not found
     */
    ExtensionService.prototype.getEvaluator = function (key) {
        return this.ruleService.getEvaluator(key);
    };
    /**
     * Evaluates a rule.
     * @param ruleId ID of the rule to evaluate
     * @param context Custom rule execution context.
     * @returns True if the rule passed, false otherwise
     */
    ExtensionService.prototype.evaluateRule = function (ruleId, context) {
        return this.ruleService.evaluateRule(ruleId, context);
    };
    /**
     * Retrieves a registered extension component using its ID value.
     * @param id The ID value to look for
     * @returns The component or null if not found
     */
    ExtensionService.prototype.getComponentById = function (id) {
        return this.componentRegister.getComponentById(id);
    };
    /**
     * Retrieves a rule using its ID value.
     * @param id The ID value to look for
     * @returns The rule or null if not found
     */
    ExtensionService.prototype.getRuleById = function (id) {
        return this.ruleService.getRuleById(id);
    };
    /**
     * Runs a lightweight expression stored in a string.
     * @param value String containing the expression or literal value
     * @param context Parameter object for the expression with details of app state
     * @returns Result of evaluated expression, if found, or the literal value otherwise
     */
    ExtensionService.prototype.runExpression = function (value, context) {
        var pattern = new RegExp(/\$\((.*\)?)\)/g);
        var matches = pattern.exec(value);
        if (matches && matches.length > 1) {
            var expression = matches[1];
            var fn = new Function('context', "return " + expression);
            var result = fn(context);
            return result;
        }
        return value;
    };
    ExtensionService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [extension_loader_service_1.ExtensionLoaderService,
            component_register_service_1.ComponentRegisterService,
            rule_service_1.RuleService])
    ], ExtensionService);
    return ExtensionService;
}());
exports.ExtensionService = ExtensionService;
//# sourceMappingURL=extension.service.js.map