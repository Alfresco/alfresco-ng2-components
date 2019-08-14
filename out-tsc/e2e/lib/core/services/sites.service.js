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
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("./alfresco-api.service");
var operators_1 = require("rxjs/operators");
var SitesService = /** @class */ (function () {
    function SitesService(apiService) {
        this.apiService = apiService;
    }
    /**
     * Gets a list of all sites in the repository.
     * @param opts Options supported by JS-API
     * @returns List of sites
     */
    SitesService.prototype.getSites = function (opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        var defaultOptions = {
            skipCount: 0,
            include: ['properties']
        };
        var queryOptions = Object.assign({}, defaultOptions, opts);
        return rxjs_1.from(this.apiService.getInstance().core.sitesApi.getSites(queryOptions))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the details for a site.
     * @param siteId ID of the target site
     * @param opts Options supported by JS-API
     * @returns Information about the site
     */
    SitesService.prototype.getSite = function (siteId, opts) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.sitesApi.getSite(siteId, opts))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Deletes a site.
     * @param siteId Site to delete
     * @param permanentFlag True: deletion is permanent; False: site is moved to the trash
     * @returns Null response notifying when the operation is complete
     */
    SitesService.prototype.deleteSite = function (siteId, permanentFlag) {
        var _this = this;
        if (permanentFlag === void 0) { permanentFlag = true; }
        var options = {};
        options.permanent = permanentFlag;
        return rxjs_1.from(this.apiService.getInstance().core.sitesApi.deleteSite(siteId, options))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a site's content.
     * @param siteId ID of the target site
     * @returns Site content
     */
    SitesService.prototype.getSiteContent = function (siteId) {
        return this.getSite(siteId, { relations: ['containers'] });
    };
    /**
     * Gets a list of all a site's members.
     * @param siteId ID of the target site
     * @returns Site members
     */
    SitesService.prototype.getSiteMembers = function (siteId) {
        return this.getSite(siteId, { relations: ['members'] });
    };
    /**
     * Gets the username of the user currently logged into ACS.
     * @returns Username string
     */
    SitesService.prototype.getEcmCurrentLoggedUserName = function () {
        return this.apiService.getInstance().getEcmUsername();
    };
    SitesService.prototype.handleError = function (error) {
        console.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    SitesService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService])
    ], SitesService);
    return SitesService;
}());
exports.SitesService = SitesService;
//# sourceMappingURL=sites.service.js.map