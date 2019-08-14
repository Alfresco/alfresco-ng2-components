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
/* tslint:disable:no-input-rename  */
/* tslint:disable:rxjs-no-subject-value */
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var user_preferences_service_1 = require("../services/user-preferences.service");
var js_api_1 = require("@alfresco/js-api");
var operators_1 = require("rxjs/operators");
var InfinitePaginationComponent = /** @class */ (function () {
    function InfinitePaginationComponent(cdr, userPreferencesService) {
        this.cdr = cdr;
        this.userPreferencesService = userPreferencesService;
        this.onDestroy$ = new rxjs_1.Subject();
        /** Is a new page loading? */
        this.isLoading = false;
        /** Emitted when the "Load More" button is clicked. */
        this.loadMore = new core_1.EventEmitter();
        this.pagination = InfinitePaginationComponent_1.DEFAULT_PAGINATION;
        this.requestPaginationModel = {
            skipCount: 0,
            merge: true
        };
    }
    InfinitePaginationComponent_1 = InfinitePaginationComponent;
    Object.defineProperty(InfinitePaginationComponent.prototype, "target", {
        get: function () {
            return this._target;
        },
        /** Component that provides custom pagination support. */
        set: function (target) {
            var _this = this;
            if (target) {
                this._target = target;
                target.pagination
                    .pipe(operators_1.takeUntil(this.onDestroy$))
                    .subscribe(function (pagination) {
                    _this.isLoading = false;
                    _this.pagination = pagination;
                    if (!_this.pagination.hasMoreItems) {
                        _this.pagination.hasMoreItems = false;
                    }
                    _this.cdr.detectChanges();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    InfinitePaginationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userPreferencesService
            .select(user_preferences_service_1.UserPreferenceValues.PaginationSize)
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (pageSize) {
            _this.pageSize = _this.pageSize || pageSize;
            _this.requestPaginationModel.maxItems = _this.pageSize;
        });
    };
    InfinitePaginationComponent.prototype.onLoadMore = function () {
        this.requestPaginationModel.skipCount = 0;
        this.requestPaginationModel.merge = false;
        this.requestPaginationModel.maxItems += this.pageSize;
        this.loadMore.next(this.requestPaginationModel);
        if (this._target) {
            this.isLoading = true;
            this._target.updatePagination(this.requestPaginationModel);
        }
    };
    InfinitePaginationComponent.prototype.reset = function () {
        this.pagination.skipCount = 0;
        this.pagination.maxItems = this.pageSize;
        if (this._target) {
            this._target.updatePagination(this.pagination);
        }
    };
    InfinitePaginationComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    var InfinitePaginationComponent_1;
    InfinitePaginationComponent.DEFAULT_PAGINATION = new js_api_1.Pagination({
        skipCount: 0,
        maxItems: 25,
        totalItems: 0
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], InfinitePaginationComponent.prototype, "target", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], InfinitePaginationComponent.prototype, "pageSize", void 0);
    __decorate([
        core_1.Input('loading'),
        __metadata("design:type", Boolean)
    ], InfinitePaginationComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], InfinitePaginationComponent.prototype, "loadMore", void 0);
    InfinitePaginationComponent = InfinitePaginationComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-infinite-pagination',
            host: { 'class': 'infinite-adf-pagination' },
            templateUrl: './infinite-pagination.component.html',
            styleUrls: ['./infinite-pagination.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef,
            user_preferences_service_1.UserPreferencesService])
    ], InfinitePaginationComponent);
    return InfinitePaginationComponent;
}());
exports.InfinitePaginationComponent = InfinitePaginationComponent;
//# sourceMappingURL=infinite-pagination.component.js.map