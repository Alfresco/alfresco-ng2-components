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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var js_api_1 = require("@alfresco/js-api");
/* tslint:disable:adf-file-name */
var ExternalAlfrescoApiService = /** @class */ (function () {
    function ExternalAlfrescoApiService() {
    }
    ExternalAlfrescoApiService.prototype.getInstance = function () {
        return this.alfrescoApi;
    };
    Object.defineProperty(ExternalAlfrescoApiService.prototype, "contentApi", {
        get: function () {
            return this.getInstance().content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExternalAlfrescoApiService.prototype, "nodesApi", {
        get: function () {
            return this.getInstance().nodes;
        },
        enumerable: true,
        configurable: true
    });
    ExternalAlfrescoApiService.prototype.init = function (ecmHost, contextRoot) {
        var domainPrefix = this.createPrefixFromHost(ecmHost);
        var config = {
            provider: 'ECM',
            hostEcm: ecmHost,
            authType: 'BASIC',
            contextRoot: contextRoot,
            domainPrefix: domainPrefix
        };
        this.initAlfrescoApi(config);
    };
    ExternalAlfrescoApiService.prototype.initAlfrescoApi = function (config) {
        if (this.alfrescoApi) {
            this.alfrescoApi.configureJsApi(config);
        }
        else {
            this.alfrescoApi = new js_api_1.AlfrescoApiCompatibility(config);
        }
    };
    ExternalAlfrescoApiService.prototype.createPrefixFromHost = function (url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        var result = null;
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            result = match[2];
        }
        return result;
    };
    ExternalAlfrescoApiService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ExternalAlfrescoApiService);
    return ExternalAlfrescoApiService;
}());
exports.ExternalAlfrescoApiService = ExternalAlfrescoApiService;
//# sourceMappingURL=external-alfresco-api.service.js.map