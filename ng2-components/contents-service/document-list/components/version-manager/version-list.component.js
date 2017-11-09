"use strict";
/*!
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var VersionListComponent = (function () {
    function VersionListComponent(alfrescoApi) {
        this.alfrescoApi = alfrescoApi;
        this.versions = [];
        this.isLoading = true;
        this.versionsApi = this.alfrescoApi.versionsApi;
    }
    VersionListComponent.prototype.ngOnChanges = function () {
        this.loadVersionHistory();
    };
    VersionListComponent.prototype.restore = function (versionId) {
        this.versionsApi
            .revertVersion(this.id, versionId, { majorVersion: true, comment: '' })
            .then(this.loadVersionHistory.bind(this));
    };
    VersionListComponent.prototype.loadVersionHistory = function () {
        var _this = this;
        this.isLoading = true;
        this.versionsApi.listVersionHistory(this.id).then(function (data) {
            _this.versions = data.list.entries;
            _this.isLoading = false;
        });
    };
    __decorate([
        core_1.Input()
    ], VersionListComponent.prototype, "id", void 0);
    VersionListComponent = __decorate([
        core_1.Component({
            selector: 'adf-version-list',
            templateUrl: './version-list.component.html',
            styleUrls: ['./version-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            host: {
                'class': 'adf-version-list'
            }
        })
    ], VersionListComponent);
    return VersionListComponent;
}());
exports.VersionListComponent = VersionListComponent;
