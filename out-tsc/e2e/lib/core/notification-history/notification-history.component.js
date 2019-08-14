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
var notification_service_1 = require("../services/notification.service");
var material_1 = require("@angular/material");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var NotificationHistoryComponent = /** @class */ (function () {
    function NotificationHistoryComponent(notificationService) {
        var _this = this;
        this.notificationService = notificationService;
        this.onDestroy$ = new rxjs_1.Subject();
        this.notifications = [];
        /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
        this.menuPositionX = 'after';
        /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
        this.menuPositionY = 'below';
        this.notificationService.messages
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (message) {
            _this.notifications.push(message);
        });
    }
    NotificationHistoryComponent.prototype.isEmptyNotification = function () {
        return (!this.notifications || this.notifications.length === 0);
    };
    NotificationHistoryComponent.prototype.onKeyPress = function (event) {
        this.closeUserModal(event);
    };
    NotificationHistoryComponent.prototype.markAsRead = function () {
        this.notifications = [];
    };
    NotificationHistoryComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    NotificationHistoryComponent.prototype.closeUserModal = function ($event) {
        if ($event.keyCode === 27) {
            this.trigger.closeMenu();
        }
    };
    __decorate([
        core_1.ViewChild(material_1.MatMenuTrigger),
        __metadata("design:type", material_1.MatMenuTrigger)
    ], NotificationHistoryComponent.prototype, "trigger", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NotificationHistoryComponent.prototype, "menuPositionX", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], NotificationHistoryComponent.prototype, "menuPositionY", void 0);
    NotificationHistoryComponent = __decorate([
        core_1.Component({
            selector: 'adf-notification-history',
            styleUrls: ['notification-history.component.scss'],
            templateUrl: 'notification-history.component.html'
        }),
        __metadata("design:paramtypes", [notification_service_1.NotificationService])
    ], NotificationHistoryComponent);
    return NotificationHistoryComponent;
}());
exports.NotificationHistoryComponent = NotificationHistoryComponent;
//# sourceMappingURL=notification-history.component.js.map