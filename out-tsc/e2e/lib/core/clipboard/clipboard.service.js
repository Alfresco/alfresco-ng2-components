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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var log_service_1 = require("../services/log.service");
var notification_service_1 = require("../services/notification.service");
var ClipboardService = /** @class */ (function () {
    function ClipboardService(document, logService, notificationService) {
        this.document = document;
        this.logService = logService;
        this.notificationService = notificationService;
    }
    /**
     * Checks if the target element can have its text copied.
     * @param target Target HTML element
     * @returns True if the text can be copied, false otherwise
     */
    ClipboardService.prototype.isTargetValid = function (target) {
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            return !target.hasAttribute('disabled');
        }
        return false;
    };
    /**
     * Copies text from an HTML element to the clipboard.
     * @param target HTML element to be copied
     * @param message Snackbar message to alert when copying happens
     */
    ClipboardService.prototype.copyToClipboard = function (target, message) {
        if (this.isTargetValid(target)) {
            try {
                target.select();
                target.setSelectionRange(0, target.value.length);
                this.document.execCommand('copy');
                this.notify(message);
            }
            catch (error) {
                this.logService.error(error);
            }
        }
    };
    /**
     * Copies a text string to the clipboard.
     * @param content Text to copy
     * @param message Snackbar message to alert when copying happens
     */
    ClipboardService.prototype.copyContentToClipboard = function (content, message) {
        try {
            document.addEventListener('copy', function (e) {
                e.clipboardData.setData('text/plain', (content));
                e.preventDefault();
                document.removeEventListener('copy', null);
            });
            document.execCommand('copy');
            this.notify(message);
        }
        catch (error) {
            this.logService.error(error);
        }
    };
    ClipboardService.prototype.notify = function (message) {
        if (message) {
            this.notificationService.openSnackMessage(message);
        }
    };
    ClipboardService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(platform_browser_1.DOCUMENT)),
        __metadata("design:paramtypes", [Object, log_service_1.LogService,
            notification_service_1.NotificationService])
    ], ClipboardService);
    return ClipboardService;
}());
exports.ClipboardService = ClipboardService;
//# sourceMappingURL=clipboard.service.js.map