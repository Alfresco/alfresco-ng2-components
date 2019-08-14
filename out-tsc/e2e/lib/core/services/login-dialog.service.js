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
var material_1 = require("@angular/material");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var login_dialog_component_1 = require("../login/components/login-dialog.component");
var LoginDialogService = /** @class */ (function () {
    function LoginDialogService(dialog) {
        this.dialog = dialog;
    }
    /**
     * Opens a dialog to choose a file to upload.
     * @param actionName Name of the action to show in the title
     * @param title Title for the dialog
     * @returns Information about the chosen file(s)
     */
    LoginDialogService.prototype.openLogin = function (actionName, title) {
        var logged = new rxjs_1.Subject();
        logged.subscribe({
            complete: this.close.bind(this)
        });
        var data = {
            title: title,
            actionName: actionName,
            logged: logged
        };
        this.openLoginDialog(data, 'adf-login-dialog', '630px');
        return logged;
    };
    LoginDialogService.prototype.openLoginDialog = function (data, currentPanelClass, chosenWidth) {
        this.dialog.open(login_dialog_component_1.LoginDialogComponent, { data: data, panelClass: currentPanelClass, width: chosenWidth });
    };
    /** Closes the currently open dialog. */
    LoginDialogService.prototype.close = function () {
        this.dialog.closeAll();
    };
    LoginDialogService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], LoginDialogService);
    return LoginDialogService;
}());
exports.LoginDialogService = LoginDialogService;
//# sourceMappingURL=login-dialog.service.js.map