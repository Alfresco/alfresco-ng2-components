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
var router_1 = require("@angular/router");
var translation_service_1 = require("../../services/translation.service");
var ErrorContentComponent = /** @class */ (function () {
    function ErrorContentComponent(route, router, translateService) {
        this.route = route;
        this.router = router;
        this.translateService = translateService;
        /** Target URL for the secondary button. */
        this.secondaryButtonUrl = 'report-issue';
        /** Target URL for the return button. */
        this.returnButtonUrl = '/';
        /** Error code associated with this error. */
        this.errorCode = ErrorContentComponent_1.UNKNOWN_ERROR;
    }
    ErrorContentComponent_1 = ErrorContentComponent;
    ErrorContentComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.route) {
            this.route.params.forEach(function (params) {
                if (params['id']) {
                    _this.errorCode = _this.checkErrorExists(params['id']) ? params['id'] : ErrorContentComponent_1.UNKNOWN_ERROR;
                }
            });
        }
    };
    ErrorContentComponent.prototype.checkErrorExists = function (errorCode) {
        var errorMessage = this.translateService.instant('ERROR_CONTENT.' + errorCode);
        return errorMessage !== ('ERROR_CONTENT.' + errorCode);
    };
    ErrorContentComponent.prototype.getTranslations = function () {
        this.hasSecondButton = this.translateService.instant('ERROR_CONTENT.' + this.errorCode + '.SECONDARY_BUTTON.TEXT') ? true : false;
    };
    ErrorContentComponent.prototype.ngAfterContentChecked = function () {
        this.getTranslations();
    };
    ErrorContentComponent.prototype.onSecondButton = function () {
        this.router.navigate(['/' + this.secondaryButtonUrl]);
    };
    ErrorContentComponent.prototype.onReturnButton = function () {
        this.router.navigate(['/' + this.returnButtonUrl]);
    };
    var ErrorContentComponent_1;
    ErrorContentComponent.UNKNOWN_ERROR = 'UNKNOWN';
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ErrorContentComponent.prototype, "secondaryButtonUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ErrorContentComponent.prototype, "returnButtonUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ErrorContentComponent.prototype, "errorCode", void 0);
    ErrorContentComponent = ErrorContentComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-error-content',
            templateUrl: './error-content.component.html',
            styleUrls: ['./error-content.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-error-content' }
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router,
            translation_service_1.TranslationService])
    ], ErrorContentComponent);
    return ErrorContentComponent;
}());
exports.ErrorContentComponent = ErrorContentComponent;
//# sourceMappingURL=error-content.component.js.map