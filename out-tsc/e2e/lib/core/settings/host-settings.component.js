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
var forms_1 = require("@angular/forms");
var app_config_service_1 = require("../app-config/app-config.service");
var storage_service_1 = require("../services/storage.service");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var keycodes_1 = require("@angular/cdk/keycodes");
var HostSettingsComponent = /** @class */ (function () {
    function HostSettingsComponent(formBuilder, storageService, alfrescoApiService, appConfig) {
        this.formBuilder = formBuilder;
        this.storageService = storageService;
        this.alfrescoApiService = alfrescoApiService;
        this.appConfig = appConfig;
        this.HOST_REGEX = '^(http|https):\/\/.*[^/]$';
        /**
         * Tells the component which provider options are available. Possible valid values
         * are "ECM" (Content), "BPM" (Process) , "ALL" (Content and Process), 'OAUTH2' SSO.
         */
        this.providers = ['BPM', 'ECM', 'ALL'];
        this.showSelectProviders = true;
        /** Emitted when the URL is invalid. */
        this.error = new core_1.EventEmitter();
        /** Emitted when the user cancels the changes. */
        this.cancel = new core_1.EventEmitter();
        /** Emitted when the changes are successfully applied. */
        this.success = new core_1.EventEmitter();
    }
    HostSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.providers.length === 1) {
            this.showSelectProviders = false;
        }
        var providerSelected = this.appConfig.get(app_config_service_1.AppConfigValues.PROVIDERS);
        var authType = this.appConfig.get(app_config_service_1.AppConfigValues.AUTHTYPE, 'BASIC');
        this.form = this.formBuilder.group({
            providersControl: [providerSelected, forms_1.Validators.required],
            authType: authType
        });
        this.addFormGroups();
        if (authType === 'OAUTH') {
            this.addOAuthFormGroup();
            this.addIdentityHostFormControl();
        }
        this.form.get('authType').valueChanges.subscribe(function (value) {
            if (value === 'BASIC') {
                _this.form.removeControl('oauthConfig');
                _this.form.removeControl('identityHost');
            }
            else {
                _this.addOAuthFormGroup();
                _this.addIdentityHostFormControl();
            }
        });
        this.providersControl.valueChanges.subscribe(function () {
            _this.removeFormGroups();
            _this.addFormGroups();
        });
    };
    HostSettingsComponent.prototype.removeFormGroups = function () {
        this.form.removeControl('bpmHost');
        this.form.removeControl('ecmHost');
    };
    HostSettingsComponent.prototype.addFormGroups = function () {
        this.addBPMFormControl();
        this.addECMFormControl();
    };
    HostSettingsComponent.prototype.addOAuthFormGroup = function () {
        var oauthFormGroup = this.createOAuthFormGroup();
        this.form.addControl('oauthConfig', oauthFormGroup);
    };
    HostSettingsComponent.prototype.addBPMFormControl = function () {
        if ((this.isBPM() || this.isALL() || this.isOAUTH()) && !this.bpmHost) {
            var bpmFormControl = this.createBPMFormControl();
            this.form.addControl('bpmHost', bpmFormControl);
        }
    };
    HostSettingsComponent.prototype.addIdentityHostFormControl = function () {
        var identityHostFormControl = this.createIdentityFormControl();
        this.form.addControl('identityHost', identityHostFormControl);
    };
    HostSettingsComponent.prototype.addECMFormControl = function () {
        if ((this.isECM() || this.isALL()) && !this.ecmHost) {
            var ecmFormControl = this.createECMFormControl();
            this.form.addControl('ecmHost', ecmFormControl);
        }
    };
    HostSettingsComponent.prototype.createOAuthFormGroup = function () {
        var oauth = this.appConfig.get(app_config_service_1.AppConfigValues.OAUTHCONFIG, {});
        return this.formBuilder.group({
            host: [oauth.host, [forms_1.Validators.required, forms_1.Validators.pattern(this.HOST_REGEX)]],
            clientId: [oauth.clientId, forms_1.Validators.required],
            redirectUri: [oauth.redirectUri, forms_1.Validators.required],
            redirectUriLogout: [oauth.redirectUriLogout],
            scope: [oauth.scope, forms_1.Validators.required],
            secret: oauth.secret,
            silentLogin: oauth.silentLogin,
            implicitFlow: oauth.implicitFlow
        });
    };
    HostSettingsComponent.prototype.createBPMFormControl = function () {
        return new forms_1.FormControl(this.appConfig.get(app_config_service_1.AppConfigValues.BPMHOST), [forms_1.Validators.required, forms_1.Validators.pattern(this.HOST_REGEX)]);
    };
    HostSettingsComponent.prototype.createIdentityFormControl = function () {
        return new forms_1.FormControl(this.appConfig.get(app_config_service_1.AppConfigValues.IDENTITY_HOST), [forms_1.Validators.required, forms_1.Validators.pattern(this.HOST_REGEX)]);
    };
    HostSettingsComponent.prototype.createECMFormControl = function () {
        return new forms_1.FormControl(this.appConfig.get(app_config_service_1.AppConfigValues.ECMHOST), [forms_1.Validators.required, forms_1.Validators.pattern(this.HOST_REGEX)]);
    };
    HostSettingsComponent.prototype.onCancel = function () {
        this.cancel.emit(true);
    };
    HostSettingsComponent.prototype.onSubmit = function (values) {
        this.storageService.setItem(app_config_service_1.AppConfigValues.PROVIDERS, values.providersControl);
        if (this.isBPM()) {
            this.saveBPMValues(values);
        }
        else if (this.isECM()) {
            this.saveECMValues(values);
        }
        else if (this.isALL()) {
            this.saveECMValues(values);
            this.saveBPMValues(values);
        }
        if (this.isOAUTH()) {
            this.saveOAuthValues(values);
        }
        this.storageService.setItem(app_config_service_1.AppConfigValues.AUTHTYPE, values.authType);
        this.alfrescoApiService.reset();
        this.alfrescoApiService.getInstance().invalidateSession();
        this.success.emit(true);
    };
    HostSettingsComponent.prototype.keyDownFunction = function (event) {
        if (event.keyCode === keycodes_1.ENTER && this.form.valid) {
            this.onSubmit(this.form.value);
        }
    };
    HostSettingsComponent.prototype.saveOAuthValues = function (values) {
        this.storageService.setItem(app_config_service_1.AppConfigValues.OAUTHCONFIG, JSON.stringify(values.oauthConfig));
        this.storageService.setItem(app_config_service_1.AppConfigValues.IDENTITY_HOST, values.identityHost);
    };
    HostSettingsComponent.prototype.saveBPMValues = function (values) {
        this.storageService.setItem(app_config_service_1.AppConfigValues.BPMHOST, values.bpmHost);
    };
    HostSettingsComponent.prototype.saveECMValues = function (values) {
        this.storageService.setItem(app_config_service_1.AppConfigValues.ECMHOST, values.ecmHost);
    };
    HostSettingsComponent.prototype.isBPM = function () {
        return this.providersControl.value === 'BPM';
    };
    HostSettingsComponent.prototype.isECM = function () {
        return this.providersControl.value === 'ECM';
    };
    HostSettingsComponent.prototype.isALL = function () {
        return this.providersControl.value === 'ALL';
    };
    HostSettingsComponent.prototype.isOAUTH = function () {
        return this.form.get('authType').value === 'OAUTH';
    };
    Object.defineProperty(HostSettingsComponent.prototype, "providersControl", {
        get: function () {
            return this.form.get('providersControl');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "bpmHost", {
        get: function () {
            return this.form.get('bpmHost');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "ecmHost", {
        get: function () {
            return this.form.get('ecmHost');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "host", {
        get: function () {
            return this.oauthConfig.get('host');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "identityHost", {
        get: function () {
            return this.form.get('identityHost');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "clientId", {
        get: function () {
            return this.oauthConfig.get('clientId');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "scope", {
        get: function () {
            return this.oauthConfig.get('scope');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "secretId", {
        get: function () {
            return this.oauthConfig.get('secretId');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "implicitFlow", {
        get: function () {
            return this.oauthConfig.get('implicitFlow');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "silentLogin", {
        get: function () {
            return this.oauthConfig.get('silentLogin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "redirectUri", {
        get: function () {
            return this.oauthConfig.get('redirectUri');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "redirectUriLogout", {
        get: function () {
            return this.oauthConfig.get('redirectUriLogout');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostSettingsComponent.prototype, "oauthConfig", {
        get: function () {
            return this.form.get('oauthConfig');
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], HostSettingsComponent.prototype, "providers", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], HostSettingsComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], HostSettingsComponent.prototype, "cancel", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], HostSettingsComponent.prototype, "success", void 0);
    HostSettingsComponent = __decorate([
        core_1.Component({
            selector: 'adf-host-settings',
            templateUrl: 'host-settings.component.html',
            host: {
                'class': 'adf-host-settings'
            },
            styleUrls: ['host-settings.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            storage_service_1.StorageService,
            alfresco_api_service_1.AlfrescoApiService,
            app_config_service_1.AppConfigService])
    ], HostSettingsComponent);
    return HostSettingsComponent;
}());
exports.HostSettingsComponent = HostSettingsComponent;
//# sourceMappingURL=host-settings.component.js.map