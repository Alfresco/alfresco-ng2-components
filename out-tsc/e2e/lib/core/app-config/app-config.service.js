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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var object_utils_1 = require("../utils/object-utils");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/* spellchecker: disable */
var AppConfigValues;
(function (AppConfigValues) {
    AppConfigValues["APP_CONFIG_LANGUAGES_KEY"] = "languages";
    AppConfigValues["PROVIDERS"] = "providers";
    AppConfigValues["OAUTHCONFIG"] = "oauth2";
    AppConfigValues["ECMHOST"] = "ecmHost";
    AppConfigValues["BASESHAREURL"] = "baseShareUrl";
    AppConfigValues["BPMHOST"] = "bpmHost";
    AppConfigValues["IDENTITY_HOST"] = "identityHost";
    AppConfigValues["AUTHTYPE"] = "authType";
    AppConfigValues["CONTEXTROOTECM"] = "contextRootEcm";
    AppConfigValues["CONTEXTROOTBPM"] = "contextRootBpm";
    AppConfigValues["ALFRESCO_REPOSITORY_NAME"] = "alfrescoRepositoryName";
    AppConfigValues["LOG_LEVEL"] = "logLevel";
    AppConfigValues["LOGIN_ROUTE"] = "loginRoute";
    AppConfigValues["DISABLECSRF"] = "disableCSRF";
    AppConfigValues["AUTH_WITH_CREDENTIALS"] = "auth.withCredentials";
    AppConfigValues["APPLICATION"] = "application";
    AppConfigValues["STORAGE_PREFIX"] = "application.storagePrefix";
    AppConfigValues["NOTIFY_DURATION"] = "notificationDefaultDuration";
})(AppConfigValues = exports.AppConfigValues || (exports.AppConfigValues = {}));
var Status;
(function (Status) {
    Status["INIT"] = "init";
    Status["LOADING"] = "loading";
    Status["LOADED"] = "loaded";
})(Status = exports.Status || (exports.Status = {}));
/* spellchecker: enable */
var AppConfigService = /** @class */ (function () {
    function AppConfigService(http) {
        this.http = http;
        this.config = {
            application: {
                name: 'Alfresco ADF Application'
            },
            ecmHost: 'http://{hostname}{:port}/ecm',
            bpmHost: 'http://{hostname}{:port}/bpm',
            logLevel: 'silent',
            alfrescoRepositoryName: 'alfresco-1'
        };
        this.status = Status.INIT;
        this.onLoadSubject = new rxjs_1.Subject();
        this.onLoad = this.onLoadSubject.asObservable();
    }
    /**
     * Requests notification of a property value when it is loaded.
     * @param property The desired property value
     * @returns Property value, when loaded
     */
    AppConfigService.prototype.select = function (property) {
        return this.onLoadSubject
            .pipe(operators_1.map(function (config) { return config[property]; }), operators_1.distinctUntilChanged());
    };
    /**
     * Gets the value of a named property.
     * @param key Name of the property
     * @param defaultValue Value to return if the key is not found
     * @returns Value of the property
     */
    AppConfigService.prototype.get = function (key, defaultValue) {
        var result = object_utils_1.ObjectUtils.getValue(this.config, key);
        if (typeof result === 'string') {
            var keywords = new Map();
            keywords.set('hostname', this.getLocationHostname());
            keywords.set(':port', this.getLocationPort(':'));
            keywords.set('port', this.getLocationPort());
            keywords.set('protocol', this.getLocationProtocol());
            result = this.formatString(result, keywords);
        }
        if (result === undefined) {
            return defaultValue;
        }
        return result;
    };
    /**
     * Gets the location.protocol value.
     * @returns The location.protocol string
     */
    AppConfigService.prototype.getLocationProtocol = function () {
        return location.protocol;
    };
    /**
     * Gets the location.hostname property.
     * @returns Value of the property
     */
    AppConfigService.prototype.getLocationHostname = function () {
        return location.hostname;
    };
    /**
     * Gets the location.port property.
     * @param prefix Text added before port value
     * @returns Port with prefix
     */
    AppConfigService.prototype.getLocationPort = function (prefix) {
        if (prefix === void 0) { prefix = ''; }
        return location.port ? prefix + location.port : '';
    };
    /**
     * Loads the config file.
     * @returns Notification when loading is complete
     */
    AppConfigService.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var configUrl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configUrl = "app.config.json?v=" + Date.now();
                        if (!(this.status === Status.INIT)) return [3 /*break*/, 2];
                        this.status = Status.LOADING;
                        return [4 /*yield*/, this.http.get(configUrl).subscribe(function (data) {
                                _this.status = Status.LOADED;
                                _this.config = Object.assign({}, _this.config, data || {});
                                _this.onLoadSubject.next(_this.config);
                                resolve(_this.config);
                            }, function () {
                                resolve(_this.config);
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (this.status === Status.LOADED) {
                            resolve(this.config);
                        }
                        else if (this.status === Status.LOADING) {
                            this.onLoad.subscribe(function () {
                                resolve(_this.config);
                            });
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AppConfigService.prototype.formatString = function (str, keywords) {
        var result = str;
        keywords.forEach(function (value, key) {
            var expr = new RegExp('{' + key + '}', 'gm');
            result = result.replace(expr, value);
        });
        return result;
    };
    AppConfigService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], AppConfigService);
    return AppConfigService;
}());
exports.AppConfigService = AppConfigService;
//# sourceMappingURL=app-config.service.js.map