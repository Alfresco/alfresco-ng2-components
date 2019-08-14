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
var app_config_service_1 = require("../app-config/app-config.service");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var storage_service_1 = require("./storage.service");
var user_preferences_service_1 = require("./user-preferences.service");
var demo_form_mock_1 = require("../mock/form/demo-form.mock");
var CoreAutomationService = /** @class */ (function () {
    function CoreAutomationService(appConfigService, alfrescoApiService, userPreferencesService, storageService) {
        this.appConfigService = appConfigService;
        this.alfrescoApiService = alfrescoApiService;
        this.userPreferencesService = userPreferencesService;
        this.storageService = storageService;
        this.forms = new demo_form_mock_1.DemoForm();
    }
    CoreAutomationService.prototype.setup = function () {
        var _this = this;
        var adfProxy = window['adf'] || {};
        adfProxy.setConfigField = function (field, value) {
            _this.appConfigService.config[field] = JSON.parse(value);
        };
        adfProxy.setStorageItem = function (key, data) {
            _this.storageService.setItem(key, data);
        };
        adfProxy.setUserPreference = function (key, data) {
            _this.userPreferencesService.set(key, data);
        };
        adfProxy.setFormInEditor = function (json) {
            _this.forms.formDefinition = JSON.parse(json);
        };
        adfProxy.setCloudFormInEditor = function (json) {
            _this.forms.cloudFormDefinition = JSON.parse(json);
        };
        adfProxy.clearStorage = function () {
            _this.storageService.clear();
        };
        adfProxy.apiReset = function () {
            _this.alfrescoApiService.reset();
        };
        window['adf'] = adfProxy;
    };
    CoreAutomationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
            alfresco_api_service_1.AlfrescoApiService,
            user_preferences_service_1.UserPreferencesService,
            storage_service_1.StorageService])
    ], CoreAutomationService);
    return CoreAutomationService;
}());
exports.CoreAutomationService = CoreAutomationService;
//# sourceMappingURL=automation.service.js.map