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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var component_model_1 = require("../models/component.model");
var object_utils_1 = require("../utils/object-utils");
var operators_1 = require("rxjs/operators");
var TranslateLoaderService = /** @class */ (function () {
    function TranslateLoaderService(http) {
        this.http = http;
        this.prefix = 'i18n';
        this.suffix = '.json';
        this.providers = [];
        this.queue = [];
        this.defaultLang = 'en';
    }
    TranslateLoaderService.prototype.setDefaultLang = function (value) {
        this.defaultLang = value || 'en';
    };
    TranslateLoaderService.prototype.registerProvider = function (name, path) {
        var registered = this.providers.find(function (provider) { return provider.name === name; });
        if (registered) {
            registered.path = path;
        }
        else {
            this.providers.push(new component_model_1.ComponentTranslationModel({ name: name, path: path }));
        }
    };
    TranslateLoaderService.prototype.providerRegistered = function (name) {
        return this.providers.find(function (x) { return x.name === name; }) ? true : false;
    };
    TranslateLoaderService.prototype.fetchLanguageFile = function (lang, component, fallbackUrl) {
        var _this = this;
        var translationUrl = fallbackUrl || component.path + "/" + this.prefix + "/" + lang + this.suffix + "?v=" + Date.now();
        return this.http.get(translationUrl).pipe(operators_1.map(function (res) {
            component.json[lang] = res;
        }), operators_1.retry(3), operators_1.catchError(function () {
            if (!fallbackUrl && lang.includes('-')) {
                var langId = lang.split('-')[0];
                if (langId && langId !== _this.defaultLang) {
                    var url = component.path + "/" + _this.prefix + "/" + langId + _this.suffix + "?v=" + Date.now();
                    return _this.fetchLanguageFile(lang, component, url);
                }
            }
            return rxjs_1.throwError("Failed to load " + translationUrl);
        }));
    };
    TranslateLoaderService.prototype.getComponentToFetch = function (lang) {
        var _this = this;
        var observableBatch = [];
        if (!this.queue[lang]) {
            this.queue[lang] = [];
        }
        this.providers.forEach(function (component) {
            if (!_this.isComponentInQueue(lang, component.name)) {
                _this.queue[lang].push(component.name);
                observableBatch.push(_this.fetchLanguageFile(lang, component));
            }
        });
        return observableBatch;
    };
    TranslateLoaderService.prototype.init = function (lang) {
        if (this.queue[lang] === undefined) {
            this.queue[lang] = [];
        }
    };
    TranslateLoaderService.prototype.isComponentInQueue = function (lang, name) {
        return (this.queue[lang] || []).find(function (x) { return x === name; }) ? true : false;
    };
    TranslateLoaderService.prototype.getFullTranslationJSON = function (lang) {
        var result = {};
        this.providers
            .slice(0)
            .sort(function (a, b) {
            if (a.name === 'app') {
                return 1;
            }
            if (b.name === 'app') {
                return -1;
            }
            return a.name.localeCompare(b.name);
        })
            .forEach(function (model) {
            if (model.json && model.json[lang]) {
                result = object_utils_1.ObjectUtils.merge(result, model.json[lang]);
            }
        });
        return result;
    };
    TranslateLoaderService.prototype.getTranslation = function (lang) {
        var _this = this;
        var hasFailures = false;
        var batch = this.getComponentToFetch(lang).map(function (observable) {
            return observable.pipe(operators_1.catchError(function (error) {
                console.warn(error);
                hasFailures = true;
                return rxjs_1.of(error);
            }));
        }).slice();
        return new rxjs_1.Observable(function (observer) {
            if (batch.length > 0) {
                rxjs_1.forkJoin(batch).subscribe(function () {
                    var fullTranslation = _this.getFullTranslationJSON(lang);
                    if (fullTranslation) {
                        observer.next(fullTranslation);
                    }
                    if (hasFailures) {
                        observer.error('Failed to load some resources');
                    }
                    else {
                        observer.complete();
                    }
                }, function (err) {
                    observer.error('Failed to load some resources');
                });
            }
            else {
                var fullTranslation = _this.getFullTranslationJSON(lang);
                if (fullTranslation) {
                    observer.next(fullTranslation);
                    observer.complete();
                }
            }
        });
    };
    TranslateLoaderService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], TranslateLoaderService);
    return TranslateLoaderService;
}());
exports.TranslateLoaderService = TranslateLoaderService;
//# sourceMappingURL=translate-loader.service.js.map