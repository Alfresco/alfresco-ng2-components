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
var ecm_user_service_1 = require("../userinfo/services/ecm-user.service");
var people_process_service_1 = require("../services/people-process.service");
var user_preferences_service_1 = require("../services/user-preferences.service");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var CommentListComponent = /** @class */ (function () {
    function CommentListComponent(peopleProcessService, ecmUserService, userPreferenceService) {
        this.peopleProcessService = peopleProcessService;
        this.ecmUserService = ecmUserService;
        this.userPreferenceService = userPreferenceService;
        /** Emitted when the user clicks on one of the comment rows. */
        this.clickRow = new core_1.EventEmitter();
        this.onDestroy$ = new rxjs_1.Subject();
    }
    CommentListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userPreferenceService
            .select(user_preferences_service_1.UserPreferenceValues.Locale)
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (locale) { return _this.currentLocale = locale; });
    };
    CommentListComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    CommentListComponent.prototype.selectComment = function (comment) {
        if (this.selectedComment) {
            this.selectedComment.isSelected = false;
        }
        comment.isSelected = true;
        this.selectedComment = comment;
        this.clickRow.emit(this.selectedComment);
    };
    CommentListComponent.prototype.getUserShortName = function (user) {
        var shortName = '';
        if (user) {
            if (user.firstName) {
                shortName = user.firstName[0].toUpperCase();
            }
            if (user.lastName) {
                shortName += user.lastName[0].toUpperCase();
            }
        }
        return shortName;
    };
    CommentListComponent.prototype.isPictureDefined = function (user) {
        return user.pictureId || user.avatarId;
    };
    CommentListComponent.prototype.getUserImage = function (user) {
        if (this.isAContentUsers(user)) {
            return this.ecmUserService.getUserProfileImage(user.avatarId);
        }
        else {
            return this.peopleProcessService.getUserImage(user);
        }
    };
    CommentListComponent.prototype.isAContentUsers = function (user) {
        return user.avatarId;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], CommentListComponent.prototype, "comments", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], CommentListComponent.prototype, "clickRow", void 0);
    CommentListComponent = __decorate([
        core_1.Component({
            selector: 'adf-comment-list',
            templateUrl: './comment-list.component.html',
            styleUrls: ['./comment-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [people_process_service_1.PeopleProcessService,
            ecm_user_service_1.EcmUserService,
            user_preferences_service_1.UserPreferencesService])
    ], CommentListComponent);
    return CommentListComponent;
}());
exports.CommentListComponent = CommentListComponent;
//# sourceMappingURL=comment-list.component.js.map