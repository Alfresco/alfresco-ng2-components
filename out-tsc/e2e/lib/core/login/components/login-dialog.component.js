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
var material_1 = require("@angular/material");
var login_dialog_panel_component_1 = require("./login-dialog-panel.component");
var LoginDialogComponent = /** @class */ (function () {
    function LoginDialogComponent(data) {
        this.data = data;
        this.buttonActionName = '';
        this.buttonActionName = data.actionName ? "LOGIN.DIALOG." + data.actionName.toUpperCase() : 'LOGIN.DIALOG.CHOOSE';
    }
    LoginDialogComponent.prototype.close = function () {
        this.data.logged.complete();
    };
    LoginDialogComponent.prototype.submitForm = function () {
        this.loginPanel.submitForm();
    };
    LoginDialogComponent.prototype.onLoginSuccess = function (event) {
        this.data.logged.next(event);
        this.close();
    };
    LoginDialogComponent.prototype.isFormValid = function () {
        return this.loginPanel ? this.loginPanel.isValid() : false;
    };
    __decorate([
        core_1.ViewChild('adfLoginPanel'),
        __metadata("design:type", login_dialog_panel_component_1.LoginDialogPanelComponent)
    ], LoginDialogComponent.prototype, "loginPanel", void 0);
    LoginDialogComponent = __decorate([
        core_1.Component({
            selector: 'adf-login-dialog',
            templateUrl: './login-dialog.component.html',
            styleUrls: ['./login-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object])
    ], LoginDialogComponent);
    return LoginDialogComponent;
}());
exports.LoginDialogComponent = LoginDialogComponent;
//# sourceMappingURL=login-dialog.component.js.map