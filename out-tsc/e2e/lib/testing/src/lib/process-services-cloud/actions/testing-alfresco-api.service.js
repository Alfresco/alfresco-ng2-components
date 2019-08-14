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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var js_api_1 = require("@alfresco/js-api");
var adf_core_1 = require("@alfresco/adf-core");
var TestingAlfrescoApiService = /** @class */ (function (_super) {
    __extends(TestingAlfrescoApiService, _super);
    function TestingAlfrescoApiService(appConfig, storageService) {
        var _this = _super.call(this, null, null) || this;
        _this.appConfig = appConfig;
        _this.storageService = storageService;
        _this.config = {};
        var oauth = Object.assign({}, _this.appConfig.get(adf_core_1.AppConfigValues.OAUTHCONFIG, null));
        _this.storageService.prefix = _this.appConfig.get(adf_core_1.AppConfigValues.STORAGE_PREFIX, '');
        _this.config = new js_api_1.AlfrescoApiConfig({
            provider: _this.appConfig.get(adf_core_1.AppConfigValues.PROVIDERS),
            hostEcm: _this.appConfig.get(adf_core_1.AppConfigValues.ECMHOST),
            hostBpm: _this.appConfig.get(adf_core_1.AppConfigValues.BPMHOST),
            authType: _this.appConfig.get(adf_core_1.AppConfigValues.AUTHTYPE, 'BASIC'),
            contextRootBpm: _this.appConfig.get(adf_core_1.AppConfigValues.CONTEXTROOTBPM),
            contextRoot: _this.appConfig.get(adf_core_1.AppConfigValues.CONTEXTROOTECM),
            disableCsrf: _this.appConfig.get(adf_core_1.AppConfigValues.DISABLECSRF),
            withCredentials: _this.appConfig.get(adf_core_1.AppConfigValues.AUTH_WITH_CREDENTIALS, false),
            domainPrefix: _this.storageService.prefix,
            oauth2: oauth
        });
        return _this;
    }
    TestingAlfrescoApiService.prototype.getInstance = function () {
        if (this.alfrescoApi) {
            this.alfrescoApi.configureJsApi(this.config);
        }
        else {
            this.alfrescoApi = new js_api_1.AlfrescoApiCompatibility(this.config);
        }
        return this.alfrescoApi;
    };
    return TestingAlfrescoApiService;
}(adf_core_1.AlfrescoApiService));
exports.TestingAlfrescoApiService = TestingAlfrescoApiService;
//# sourceMappingURL=testing-alfresco-api.service.js.map