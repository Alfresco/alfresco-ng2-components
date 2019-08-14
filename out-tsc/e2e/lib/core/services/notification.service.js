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
var material_1 = require("@angular/material");
var translation_service_1 = require("./translation.service");
var app_config_service_1 = require("../app-config/app-config.service");
var rxjs_1 = require("rxjs");
var NotificationService = /** @class */ (function () {
    function NotificationService(snackBar, translationService, appConfigService) {
        this.snackBar = snackBar;
        this.translationService = translationService;
        this.appConfigService = appConfigService;
        this.DEFAULT_DURATION_MESSAGE = 5000;
        this.messages = new rxjs_1.Subject();
        this.DEFAULT_DURATION_MESSAGE = this.appConfigService.get(app_config_service_1.AppConfigValues.NOTIFY_DURATION) || this.DEFAULT_DURATION_MESSAGE;
    }
    /**
     * Opens a SnackBar notification to show a message.
     * @param message The message (or resource key) to show.
     * @param config Time before notification disappears after being shown or MatSnackBarConfig object
     * @returns Information/control object for the SnackBar
     */
    NotificationService.prototype.openSnackMessage = function (message, config) {
        if (!config) {
            config = this.DEFAULT_DURATION_MESSAGE;
        }
        var translatedMessage = this.translationService.instant(message);
        if (typeof config === 'number') {
            config = {
                duration: config
            };
        }
        this.messages.next({ message: translatedMessage, dateTime: new Date });
        return this.snackBar.open(translatedMessage, null, config);
    };
    /**
     * Opens a SnackBar notification with a message and a response button.
     * @param message The message (or resource key) to show.
     * @param action Caption for the response button
     * @param config Time before notification disappears after being shown or MatSnackBarConfig object
     * @returns Information/control object for the SnackBar
     */
    NotificationService.prototype.openSnackMessageAction = function (message, action, config) {
        if (!config) {
            config = this.DEFAULT_DURATION_MESSAGE;
        }
        var translatedMessage = this.translationService.instant(message);
        if (typeof config === 'number') {
            config = {
                duration: config
            };
        }
        this.messages.next({ message: translatedMessage, dateTime: new Date });
        return this.snackBar.open(translatedMessage, action, config);
    };
    /**
     *  dismiss the notification snackbar
     */
    NotificationService.prototype.dismissSnackMessageAction = function () {
        return this.snackBar.dismiss();
    };
    NotificationService.prototype.showMessage = function (message, panelClass, action) {
        message = this.translationService.instant(message);
        this.messages.next({ message: message, dateTime: new Date });
        return this.snackBar.open(message, action, {
            duration: this.DEFAULT_DURATION_MESSAGE,
            panelClass: panelClass
        });
    };
    /**
     * Rase error message
     * @param message Text message or translation key for the message.
     * @param action Action name
     */
    NotificationService.prototype.showError = function (message, action) {
        return this.showMessage(message, 'adf-error-snackbar', action);
    };
    /**
     * Rase info message
     * @param message Text message or translation key for the message.
     * @param action Action name
     */
    NotificationService.prototype.showInfo = function (message, action) {
        return this.showMessage(message, 'adf-info-snackbar', action);
    };
    /**
     * Rase warning message
     * @param message Text message or translation key for the message.
     * @param action Action name
     */
    NotificationService.prototype.showWarning = function (message, action) {
        return this.showMessage(message, 'adf-warning-snackbar', action);
    };
    NotificationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [material_1.MatSnackBar,
            translation_service_1.TranslationService,
            app_config_service_1.AppConfigService])
    ], NotificationService);
    return NotificationService;
}());
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map