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
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var DropdownSitesComponent = (function () {
    function DropdownSitesComponent(sitesService) {
        this.sitesService = sitesService;
        this.hideMyFiles = false;
        this.change = new core_1.EventEmitter();
        this.MY_FILES_VALUE = 'default';
        this.siteList = [];
    }
    DropdownSitesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sitesService.getSites().subscribe(function (result) {
            _this.siteList = result;
        }, function (error) { });
    };
    DropdownSitesComponent.prototype.selectedSite = function () {
        var _this = this;
        var siteFound;
        if (this.siteSelected === this.MY_FILES_VALUE) {
            siteFound = new ng2_alfresco_core_1.SiteModel();
        }
        else {
            siteFound = this.siteList.find(function (site) { return site.guid === _this.siteSelected; });
        }
        this.change.emit(siteFound);
    };
    __decorate([
        core_1.Input()
    ], DropdownSitesComponent.prototype, "hideMyFiles", void 0);
    __decorate([
        core_1.Output()
    ], DropdownSitesComponent.prototype, "change", void 0);
    DropdownSitesComponent = __decorate([
        core_1.Component({
            selector: 'adf-sites-dropdown',
            styleUrls: ['./sites-dropdown.component.scss'],
            templateUrl: './sites-dropdown.component.html'
        })
    ], DropdownSitesComponent);
    return DropdownSitesComponent;
}());
exports.DropdownSitesComponent = DropdownSitesComponent;
