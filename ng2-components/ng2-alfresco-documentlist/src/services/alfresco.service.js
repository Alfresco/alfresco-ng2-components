/**
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', '../../../ng2-alfresco-core/services'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1, services_1;
    var AlfrescoService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (services_1_1) {
                services_1 = services_1_1;
            }],
        execute: function() {
            AlfrescoService = (function () {
                function AlfrescoService(http, settings) {
                    this.http = http;
                    this.settings = settings;
                    this._host = 'http://127.0.0.1:8080';
                    this._baseUrlPath = '/alfresco/service/slingshot/doclib/doclist/all/site/';
                    this._host = settings.host;
                }
                Object.defineProperty(AlfrescoService.prototype, "host", {
                    get: function () {
                        return this._host;
                    },
                    set: function (value) {
                        this._host = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AlfrescoService.prototype.getBaseUrl = function () {
                    return this.host + this._baseUrlPath;
                };
                AlfrescoService.prototype.getFolder = function (folder) {
                    var headers = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Authorization': this.settings.getAuthToken()
                    });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.http
                        .get(this.getBaseUrl() + folder, options)
                        .map(function (res) { return res.json(); })
                        .do(function (data) { return console.log(data); }) // eyeball results in the console
                        .catch(this.handleError);
                };
                AlfrescoService.prototype.getDocumentThumbnailUrl = function (document) {
                    return this._host +
                        '/alfresco/service/api/node/' +
                        document.nodeRef.replace('://', '/') + '/content/thumbnails/doclib?c=queue&amp;ph=true&amp;lastModified=1';
                };
                AlfrescoService.prototype.getContentUrl = function (document) {
                    return this._host + '/alfresco/service/' + document.contentUrl;
                };
                AlfrescoService.prototype.handleError = function (error) {
                    // in a real world app, we may send the error to some remote logging infrastructure
                    // instead of just logging it to the console
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                AlfrescoService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, services_1.AlfrescoSettingsService])
                ], AlfrescoService);
                return AlfrescoService;
            }());
            exports_1("AlfrescoService", AlfrescoService);
        }
    }
});
//# sourceMappingURL=alfresco.service.js.map