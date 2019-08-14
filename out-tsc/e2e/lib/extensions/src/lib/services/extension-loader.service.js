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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var action_extensions_1 = require("../config/action.extensions");
var extension_utils_1 = require("../config/extension-utils");
var ExtensionLoaderService = /** @class */ (function () {
    function ExtensionLoaderService(http) {
        this.http = http;
    }
    ExtensionLoaderService.prototype.load = function (configPath, pluginsPath, extensions) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.loadConfig(configPath, 0).then(function (result) {
                if (result) {
                    var config_1 = result.config;
                    var override = sessionStorage.getItem('app.extension.config');
                    if (override) {
                        config_1 = JSON.parse(override);
                    }
                    if (config_1.$references && config_1.$references.length > 0) {
                        var plugins = config_1.$references.map(function (name, idx) {
                            return _this.loadConfig(pluginsPath + "/" + name, idx);
                        });
                        Promise.all(plugins).then(function (results) {
                            var configs = results
                                .filter(function (entry) { return entry; })
                                .sort(extension_utils_1.sortByOrder)
                                .map(function (entry) { return entry.config; });
                            if (extensions && extensions.length > 0) {
                                configs.push.apply(configs, extensions);
                            }
                            if (configs.length > 0) {
                                config_1 = extension_utils_1.mergeObjects.apply(void 0, [config_1].concat(configs));
                            }
                            config_1 = __assign({}, config_1, _this.getMetadata(result.config), { $references: configs.map(function (ext) { return _this.getMetadata(ext); }) });
                            resolve(config_1);
                        });
                    }
                    else {
                        resolve(config_1);
                    }
                }
            });
        });
    };
    ExtensionLoaderService.prototype.getMetadata = function (config) {
        var result = {};
        Object
            .keys(config)
            .filter(function (key) { return key.startsWith('$'); })
            .forEach(function (key) {
            result[key] = config[key];
        });
        return result;
    };
    ExtensionLoaderService.prototype.loadConfig = function (url, order) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(url).subscribe(function (config) {
                resolve({
                    order: order,
                    config: config
                });
            }, function () {
                resolve(null);
            });
        });
    };
    /**
     * Retrieves configuration elements.
     * Filters element by **enabled** and **order** attributes.
     * Example:
     *  `getElements<ViewerExtensionRef>(config, 'features.viewer.content')`
     */
    ExtensionLoaderService.prototype.getElements = function (config, key, fallback) {
        if (fallback === void 0) { fallback = []; }
        var values = extension_utils_1.getValue(config, key) || fallback || [];
        return values.filter(extension_utils_1.filterEnabled).sort(extension_utils_1.sortByOrder);
    };
    ExtensionLoaderService.prototype.getContentActions = function (config, key) {
        return this.getElements(config, key).map(this.setActionDefaults);
    };
    ExtensionLoaderService.prototype.getRules = function (config) {
        if (config && config.rules) {
            return config.rules;
        }
        return [];
    };
    ExtensionLoaderService.prototype.getRoutes = function (config) {
        if (config) {
            return config.routes || [];
        }
        return [];
    };
    ExtensionLoaderService.prototype.getActions = function (config) {
        if (config) {
            return config.actions || [];
        }
        return [];
    };
    ExtensionLoaderService.prototype.getFeatures = function (config) {
        if (config) {
            return config.features || [];
        }
        return [];
    };
    ExtensionLoaderService.prototype.setActionDefaults = function (action) {
        if (action) {
            action.type = action.type || action_extensions_1.ContentActionType.default;
            action.icon = action.icon || 'extension';
        }
        return action;
    };
    ExtensionLoaderService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ExtensionLoaderService);
    return ExtensionLoaderService;
}());
exports.ExtensionLoaderService = ExtensionLoaderService;
//# sourceMappingURL=extension-loader.service.js.map