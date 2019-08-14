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
var login_component_1 = require("./login.component");
var LoginDialogPanelComponent = /** @class */ (function () {
    function LoginDialogPanelComponent() {
        /** Emitted when the login succeeds. */
        this.success = new core_1.EventEmitter();
    }
    LoginDialogPanelComponent.prototype.submitForm = function () {
        this.login.submit();
    };
    LoginDialogPanelComponent.prototype.onLoginSuccess = function (event) {
        this.success.emit(event);
    };
    LoginDialogPanelComponent.prototype.isValid = function () {
        return this.login && this.login.form ? this.login.form.valid : false;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], LoginDialogPanelComponent.prototype, "success", void 0);
    __decorate([
        core_1.ViewChild('adfLogin'),
        __metadata("design:type", login_component_1.LoginComponent)
    ], LoginDialogPanelComponent.prototype, "login", void 0);
    LoginDialogPanelComponent = __decorate([
        core_1.Component({
            selector: 'adf-login-dialog-panel',
            templateUrl: './login-dialog-panel.component.html',
            styleUrls: ['./login-dialog-panel.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], LoginDialogPanelComponent);
    return LoginDialogPanelComponent;
}());
exports.LoginDialogPanelComponent = LoginDialogPanelComponent;
//# sourceMappingURL=login-dialog-panel.component.js.map