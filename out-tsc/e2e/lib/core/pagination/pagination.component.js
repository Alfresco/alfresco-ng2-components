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
var js_api_1 = require("@alfresco/js-api");
var rxjs_1 = require("rxjs");
var pagination_model_1 = require("../models/pagination.model");
var user_preferences_service_1 = require("../services/user-preferences.service");
var operators_1 = require("rxjs/operators");
var PaginationComponent = /** @class */ (function () {
    function PaginationComponent(cdr, userPreferencesService) {
        this.cdr = cdr;
        this.userPreferencesService = userPreferencesService;
        /** Pagination object. */
        this.pagination = PaginationComponent_1.DEFAULT_PAGINATION;
        /** Emitted when pagination changes in any way. */
        this.change = new core_1.EventEmitter();
        /** Emitted when the page number changes. */
        this.changePageNumber = new core_1.EventEmitter();
        /** Emitted when the page size changes. */
        this.changePageSize = new core_1.EventEmitter();
        /** Emitted when the next page is requested. */
        this.nextPage = new core_1.EventEmitter();
        /** Emitted when the previous page is requested. */
        this.prevPage = new core_1.EventEmitter();
        this.onDestroy$ = new rxjs_1.Subject();
    }
    PaginationComponent_1 = PaginationComponent;
    PaginationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userPreferencesService
            .select(user_preferences_service_1.UserPreferenceValues.PaginationSize)
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (pagSize) { return _this.pagination.maxItems = pagSize; });
        if (!this.supportedPageSizes) {
            this.supportedPageSizes = this.userPreferencesService.supportedPageSizes;
        }
        if (this.target) {
            this.target.pagination
                .pipe(operators_1.takeUntil(this.onDestroy$))
                .subscribe(function (pagination) {
                if (pagination.count === 0 && !_this.isFirstPage) {
                    _this.goPrevious();
                }
                _this.pagination = pagination;
                _this.cdr.detectChanges();
            });
        }
        if (!this.pagination) {
            this.pagination = PaginationComponent_1.DEFAULT_PAGINATION;
        }
    };
    Object.defineProperty(PaginationComponent.prototype, "lastPage", {
        get: function () {
            var _a = this.pagination, maxItems = _a.maxItems, totalItems = _a.totalItems;
            return (totalItems && maxItems)
                ? Math.ceil(totalItems / maxItems)
                : 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "current", {
        get: function () {
            var _a = this.pagination, maxItems = _a.maxItems, skipCount = _a.skipCount;
            return (skipCount && maxItems)
                ? Math.floor(skipCount / maxItems) + 1
                : 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "isLastPage", {
        get: function () {
            return this.current === this.lastPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "isFirstPage", {
        get: function () {
            return this.current === 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "next", {
        get: function () {
            return this.isLastPage ? this.current : this.current + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "previous", {
        get: function () {
            return this.isFirstPage ? 1 : this.current - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "hasItems", {
        get: function () {
            return this.pagination && this.pagination.count > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "isEmpty", {
        get: function () {
            return !this.hasItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "range", {
        get: function () {
            var _a = this.pagination, skipCount = _a.skipCount, maxItems = _a.maxItems, totalItems = _a.totalItems;
            var isLastPage = this.isLastPage;
            var start = totalItems ? skipCount + 1 : 0;
            var end = isLastPage ? totalItems : skipCount + maxItems;
            return [start, end];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "pages", {
        get: function () {
            return Array(this.lastPage)
                .fill('n')
                .map(function (item, index) { return (index + 1); });
        },
        enumerable: true,
        configurable: true
    });
    PaginationComponent.prototype.goNext = function () {
        if (this.hasItems) {
            var maxItems = this.pagination.maxItems;
            var skipCount = (this.next - 1) * maxItems;
            this.pagination.skipCount = skipCount;
            this.handlePaginationEvent(PaginationComponent_1.ACTIONS.NEXT_PAGE, {
                skipCount: skipCount,
                maxItems: maxItems
            });
        }
    };
    PaginationComponent.prototype.goPrevious = function () {
        if (this.hasItems) {
            var maxItems = this.pagination.maxItems;
            var skipCount = (this.previous - 1) * maxItems;
            this.pagination.skipCount = skipCount;
            this.handlePaginationEvent(PaginationComponent_1.ACTIONS.PREV_PAGE, {
                skipCount: skipCount,
                maxItems: maxItems
            });
        }
    };
    PaginationComponent.prototype.onChangePageNumber = function (pageNumber) {
        if (this.hasItems) {
            var maxItems = this.pagination.maxItems;
            var skipCount = (pageNumber - 1) * maxItems;
            this.pagination.skipCount = skipCount;
            this.handlePaginationEvent(PaginationComponent_1.ACTIONS.CHANGE_PAGE_NUMBER, {
                skipCount: skipCount,
                maxItems: maxItems
            });
        }
    };
    PaginationComponent.prototype.onChangePageSize = function (maxItems) {
        this.pagination.skipCount = 0;
        this.userPreferencesService.paginationSize = maxItems;
        this.handlePaginationEvent(PaginationComponent_1.ACTIONS.CHANGE_PAGE_SIZE, {
            skipCount: 0,
            maxItems: maxItems
        });
    };
    PaginationComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    PaginationComponent.prototype.handlePaginationEvent = function (action, params) {
        var _a = PaginationComponent_1.ACTIONS, NEXT_PAGE = _a.NEXT_PAGE, PREV_PAGE = _a.PREV_PAGE, CHANGE_PAGE_NUMBER = _a.CHANGE_PAGE_NUMBER, CHANGE_PAGE_SIZE = _a.CHANGE_PAGE_SIZE;
        var _b = this, change = _b.change, changePageNumber = _b.changePageNumber, changePageSize = _b.changePageSize, nextPage = _b.nextPage, prevPage = _b.prevPage, pagination = _b.pagination;
        var paginationModel = Object.assign({}, pagination, params);
        if (action === NEXT_PAGE) {
            nextPage.emit(paginationModel);
        }
        if (action === PREV_PAGE) {
            prevPage.emit(paginationModel);
        }
        if (action === CHANGE_PAGE_NUMBER) {
            changePageNumber.emit(paginationModel);
        }
        if (action === CHANGE_PAGE_SIZE) {
            changePageSize.emit(paginationModel);
        }
        change.emit(params);
        if (this.target) {
            this.target.updatePagination(params);
        }
    };
    var PaginationComponent_1;
    PaginationComponent.DEFAULT_PAGINATION = new js_api_1.Pagination({
        skipCount: 0,
        maxItems: 25,
        totalItems: 0
    });
    PaginationComponent.ACTIONS = {
        NEXT_PAGE: 'NEXT_PAGE',
        PREV_PAGE: 'PREV_PAGE',
        CHANGE_PAGE_SIZE: 'CHANGE_PAGE_SIZE',
        CHANGE_PAGE_NUMBER: 'CHANGE_PAGE_NUMBER'
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PaginationComponent.prototype, "target", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], PaginationComponent.prototype, "supportedPageSizes", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", pagination_model_1.PaginationModel)
    ], PaginationComponent.prototype, "pagination", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], PaginationComponent.prototype, "change", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], PaginationComponent.prototype, "changePageNumber", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], PaginationComponent.prototype, "changePageSize", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], PaginationComponent.prototype, "nextPage", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], PaginationComponent.prototype, "prevPage", void 0);
    __decorate([
        core_1.HostBinding('class.adf-pagination__empty'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], PaginationComponent.prototype, "isEmpty", null);
    PaginationComponent = PaginationComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-pagination',
            host: { 'class': 'adf-pagination' },
            templateUrl: './pagination.component.html',
            styleUrls: ['./pagination.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef, user_preferences_service_1.UserPreferencesService])
    ], PaginationComponent);
    return PaginationComponent;
}());
exports.PaginationComponent = PaginationComponent;
//# sourceMappingURL=pagination.component.js.map