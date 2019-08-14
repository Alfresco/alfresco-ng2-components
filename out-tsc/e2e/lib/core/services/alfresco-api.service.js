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
var js_api_1 = require("@alfresco/js-api");
var app_config_service_1 = require("../app-config/app-config.service");
var rxjs_1 = require("rxjs");
var storage_service_1 = require("./storage.service");
/* tslint:disable:adf-file-name */
var AlfrescoApiService = /** @class */ (function () {
    function AlfrescoApiService(appConfig, storageService) {
        this.appConfig = appConfig;
        this.storageService = storageService;
        /**
         * Publish/subscribe to events related to node updates.
         */
        this.nodeUpdated = new rxjs_1.Subject();
        this.alfrescoApiInitializedSubject = new rxjs_1.Subject();
        this.alfrescoApiInitialized = this.alfrescoApiInitializedSubject.asObservable();
    }
    AlfrescoApiService.prototype.getInstance = function () {
        return this.alfrescoApi;
    };
    Object.defineProperty(AlfrescoApiService.prototype, "taskApi", {
        get: function () {
            return this.getInstance().activiti.taskApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "contentApi", {
        get: function () {
            return this.getInstance().content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "nodesApi", {
        get: function () {
            return this.getInstance().nodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "renditionsApi", {
        get: function () {
            return this.getInstance().core.renditionsApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "sharedLinksApi", {
        get: function () {
            return this.getInstance().core.sharedlinksApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "sitesApi", {
        get: function () {
            return this.getInstance().core.sitesApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "favoritesApi", {
        get: function () {
            return this.getInstance().core.favoritesApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "peopleApi", {
        get: function () {
            return this.getInstance().core.peopleApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "searchApi", {
        get: function () {
            return this.getInstance().search.searchApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "versionsApi", {
        get: function () {
            return this.getInstance().core.versionsApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "classesApi", {
        get: function () {
            return this.getInstance().core.classesApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoApiService.prototype, "groupsApi", {
        get: function () {
            return this.getInstance().core.groupsApi;
        },
        enumerable: true,
        configurable: true
    });
    AlfrescoApiService.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appConfig.load().then(function () {
                            _this.storageService.prefix = _this.appConfig.get(app_config_service_1.AppConfigValues.STORAGE_PREFIX, '');
                            _this.initAlfrescoApi();
                            _this.alfrescoApiInitializedSubject.next();
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AlfrescoApiService.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.initAlfrescoApi();
                return [2 /*return*/];
            });
        });
    };
    AlfrescoApiService.prototype.initAlfrescoApi = function () {
        var oauth = Object.assign({}, this.appConfig.get(app_config_service_1.AppConfigValues.OAUTHCONFIG, null));
        if (oauth) {
            oauth.redirectUri = window.location.origin + (oauth.redirectUri || '/');
            oauth.redirectUriLogout = window.location.origin + (oauth.redirectUriLogout || '/');
        }
        var config = new js_api_1.AlfrescoApiConfig({
            provider: this.appConfig.get(app_config_service_1.AppConfigValues.PROVIDERS),
            hostEcm: this.appConfig.get(app_config_service_1.AppConfigValues.ECMHOST),
            hostBpm: this.appConfig.get(app_config_service_1.AppConfigValues.BPMHOST),
            authType: this.appConfig.get(app_config_service_1.AppConfigValues.AUTHTYPE, 'BASIC'),
            contextRootBpm: this.appConfig.get(app_config_service_1.AppConfigValues.CONTEXTROOTBPM),
            contextRoot: this.appConfig.get(app_config_service_1.AppConfigValues.CONTEXTROOTECM),
            disableCsrf: this.appConfig.get(app_config_service_1.AppConfigValues.DISABLECSRF),
            withCredentials: this.appConfig.get(app_config_service_1.AppConfigValues.AUTH_WITH_CREDENTIALS, false),
            oauth2: oauth
        });
        if (this.alfrescoApi && this.isDifferentConfig(this.lastConfig, config)) {
            this.lastConfig = config;
            this.alfrescoApi.configureJsApi(config);
        }
        else {
            this.lastConfig = config;
            this.alfrescoApi = new js_api_1.AlfrescoApiCompatibility(config);
        }
    };
    AlfrescoApiService.prototype.isDifferentConfig = function (lastConfig, newConfig) {
        return JSON.stringify(lastConfig) !== JSON.stringify(newConfig);
    };
    AlfrescoApiService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
            storage_service_1.StorageService])
    ], AlfrescoApiService);
    return AlfrescoApiService;
}());
exports.AlfrescoApiService = AlfrescoApiService;
//# sourceMappingURL=alfresco-api.service.js.map