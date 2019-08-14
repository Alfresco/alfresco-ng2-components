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
var http_1 = require("@angular/common/http");
var authentication_service_1 = require("../services/authentication.service");
var discovery_api_service_1 = require("../services/discovery-api.service");
var object_datatable_adapter_1 = require("../datatable/data/object-datatable-adapter");
var app_config_service_1 = require("../app-config/app-config.service");
var adf_extensions_1 = require("@alfresco/adf-extensions");
var AboutComponent = /** @class */ (function () {
    function AboutComponent(http, appConfig, authService, discovery, appExtensions) {
        this.http = http;
        this.appConfig = appConfig;
        this.authService = authService;
        this.discovery = discovery;
        this.extensionColumns = ['$id', '$name', '$version', '$vendor', '$license', '$runtime', '$description'];
        /** Commit corresponding to the version of ADF to be used. */
        this.githubUrlCommitAlpha = 'https://github.com/Alfresco/alfresco-ng2-components/commits/';
        /** Toggles showing/hiding of extensions block. */
        this.showExtensions = true;
        /** Regular expression for filtering dependencies packages. */
        this.regexp = '^(@alfresco)';
        this.ecmHost = '';
        this.bpmHost = '';
        this.ecmVersion = null;
        this.bpmVersion = null;
        this.extensions$ = appExtensions.references$;
    }
    AboutComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.authService.isEcmLoggedIn()) {
            this.discovery.getEcmProductInfo().subscribe(function (ecmVers) {
                _this.ecmVersion = ecmVers;
                _this.modules = new object_datatable_adapter_1.ObjectDataTableAdapter(_this.ecmVersion.modules, [
                    { type: 'text', key: 'id', title: 'ABOUT.TABLE_HEADERS.MODULES.ID', sortable: true },
                    { type: 'text', key: 'title', title: 'ABOUT.TABLE_HEADERS.MODULES.TITLE', sortable: true },
                    { type: 'text', key: 'version', title: 'ABOUT.TABLE_HEADERS.MODULES.DESCRIPTION', sortable: true },
                    {
                        type: 'text',
                        key: 'installDate',
                        title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_DATE',
                        sortable: true
                    },
                    {
                        type: 'text',
                        key: 'installState',
                        title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_STATE',
                        sortable: true
                    },
                    {
                        type: 'text',
                        key: 'versionMin',
                        title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MIN',
                        sortable: true
                    },
                    {
                        type: 'text',
                        key: 'versionMax',
                        title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MAX',
                        sortable: true
                    }
                ]);
                _this.status = new object_datatable_adapter_1.ObjectDataTableAdapter([_this.ecmVersion.status], [
                    { type: 'text', key: 'isReadOnly', title: 'ABOUT.TABLE_HEADERS.STATUS.READ_ONLY', sortable: true },
                    {
                        type: 'text',
                        key: 'isAuditEnabled',
                        title: 'ABOUT.TABLE_HEADERS.STATUS.AUDIT_ENABLED',
                        sortable: true
                    },
                    {
                        type: 'text',
                        key: 'isQuickShareEnabled',
                        title: 'ABOUT.TABLE_HEADERS.STATUS.QUICK_SHARE_ENABLED',
                        sortable: true
                    },
                    {
                        type: 'text',
                        key: 'isThumbnailGenerationEnabled',
                        title: 'ABOUT.TABLE_HEADERS.STATUS.THUMBNAIL_ENABLED',
                        sortable: true
                    }
                ]);
                _this.license = new object_datatable_adapter_1.ObjectDataTableAdapter([_this.ecmVersion.license], [
                    { type: 'text', key: 'issuedAt', title: 'ABOUT.TABLE_HEADERS.LICENSE.ISSUES_AT', sortable: true },
                    { type: 'text', key: 'expiresAt', title: 'ABOUT.TABLE_HEADERS.LICENSE.EXPIRES_AT', sortable: true },
                    {
                        type: 'text',
                        key: 'remainingDays',
                        title: 'ABOUT.TABLE_HEADERS.LICENSE.REMAINING_DAYS',
                        sortable: true
                    },
                    { type: 'text', key: 'holder', title: 'ABOUT.TABLE_HEADERS.LICENSE.HOLDER', sortable: true },
                    { type: 'text', key: 'mode', title: 'ABOUT.TABLE_HEADERS.LICENSE.MODE', sortable: true },
                    {
                        type: 'text',
                        key: 'isClusterEnabled',
                        title: 'ABOUT.TABLE_HEADERS.LICENSE.CLUSTER_ENABLED',
                        sortable: true
                    },
                    {
                        type: 'text',
                        key: 'isCryptodocEnabled',
                        title: 'ABOUT.TABLE_HEADERS.LICENSE.CRYPTODOC_ENABLED',
                        sortable: true
                    }
                ]);
            });
        }
        if (this.authService.isBpmLoggedIn()) {
            this.discovery.getBpmProductInfo().subscribe(function (bpmVers) {
                _this.bpmVersion = bpmVers;
            });
        }
        this.http.get('./versions.json?' + new Date()).subscribe(function (response) {
            var alfrescoPackages = Object.keys(response.dependencies).filter(function (val) {
                return new RegExp(_this.regexp).test(val);
            });
            var alfrescoPackagesTableRepresentation = [];
            alfrescoPackages.forEach(function (val) {
                alfrescoPackagesTableRepresentation.push({
                    name: val,
                    version: (response.dependencies[val].version || response.dependencies[val].required.version)
                });
            });
            _this.gitHubLinkCreation(alfrescoPackagesTableRepresentation);
            _this.data = new object_datatable_adapter_1.ObjectDataTableAdapter(alfrescoPackagesTableRepresentation, [
                { type: 'text', key: 'name', title: 'Name', sortable: true },
                { type: 'text', key: 'version', title: 'Version', sortable: true }
            ]);
        });
        this.ecmHost = this.appConfig.get(app_config_service_1.AppConfigValues.ECMHOST);
        this.bpmHost = this.appConfig.get(app_config_service_1.AppConfigValues.BPMHOST);
    };
    AboutComponent.prototype.gitHubLinkCreation = function (alfrescoPackagesTableRepresentation) {
        var corePackage = alfrescoPackagesTableRepresentation.find(function (packageUp) {
            return packageUp.name === '@alfresco/adf-core';
        });
        if (corePackage) {
            var commitIsh = corePackage.version.split('-');
            if (commitIsh.length > 1) {
                this.githubUrlCommitAlpha = this.githubUrlCommitAlpha + commitIsh[1];
            }
            else {
                this.githubUrlCommitAlpha = this.githubUrlCommitAlpha + corePackage.version;
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AboutComponent.prototype, "githubUrlCommitAlpha", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AboutComponent.prototype, "showExtensions", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AboutComponent.prototype, "regexp", void 0);
    AboutComponent = __decorate([
        core_1.Component({
            selector: 'adf-about',
            templateUrl: './about.component.html',
            styleUrls: ['./about.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [http_1.HttpClient,
            app_config_service_1.AppConfigService,
            authentication_service_1.AuthenticationService,
            discovery_api_service_1.DiscoveryApiService,
            adf_extensions_1.AppExtensionService])
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;
//# sourceMappingURL=about.component.js.map