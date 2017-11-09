"use strict";
/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var login_error_event_1 = require("../models/login-error.event");
var login_submit_event_1 = require("../models/login-submit.event");
var login_success_event_1 = require("../models/login-success.event");
var LoginSteps;
(function (LoginSteps) {
    LoginSteps[LoginSteps["Landing"] = 0] = "Landing";
    LoginSteps[LoginSteps["Checking"] = 1] = "Checking";
    LoginSteps[LoginSteps["Welcome"] = 2] = "Welcome";
})(LoginSteps || (LoginSteps = {}));
var LoginComponent = (function () {
    /**
     * Constructor
     * @param _fb
     * @param authService
     * @param settingsService
     * @param translate
     */
    function LoginComponent(_fb, authService, settingsService, translateService, logService, elementRef, router, userPreferences) {
        this._fb = _fb;
        this.authService = authService;
        this.settingsService = settingsService;
        this.translateService = translateService;
        this.logService = logService;
        this.elementRef = elementRef;
        this.router = router;
        this.userPreferences = userPreferences;
        this.isPasswordShow = false;
        this.showRememberMe = true;
        this.showLoginActions = true;
        this.needHelpLink = '';
        this.registerLink = '';
        this.logoImageUrl = require('../assets/images/alfresco-logo.svg');
        this.backgroundImageUrl = require('../assets/images/background.svg');
        this.copyrightText = '\u00A9 2016 Alfresco Software, Inc. All Rights Reserved.';
        this.successRoute = null;
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.executeSubmit = new core_1.EventEmitter();
        this.isError = false;
        this.actualLoginStep = LoginSteps.Landing;
        this.LoginSteps = LoginSteps;
        this.rememberMe = true;
        this.minLength = 2;
        this.initFormError();
        this.initFormFieldsMessages();
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.hasCustomFiledsValidation()) {
            this.form = this._fb.group(this.fieldsValidation);
        }
        else {
            this.initFormFieldsDefault();
            this.initFormFieldsMessagesDefault();
        }
        this.form.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
    };
    /**
     * Method called on submit form
     * @param values
     * @param event
     */
    LoginComponent.prototype.onSubmit = function (values) {
        if (!this.checkRequiredParams()) {
            return false;
        }
        this.settingsService.setProviders(this.providers);
        this.settingsService.csrfDisabled = this.disableCsrf;
        this.disableError();
        var args = new login_submit_event_1.LoginSubmitEvent(this.form);
        this.executeSubmit.emit(args);
        if (args.defaultPrevented) {
            return false;
        }
        else {
            this.performLogin(values);
        }
    };
    /**
     * The method check the error in the form and push the error in the formError object
     * @param data
     */
    LoginComponent.prototype.onValueChanged = function (data) {
        this.disableError();
        for (var field in this.formError) {
            if (field) {
                this.formError[field] = '';
                var hasError = (this.form.controls[field].errors && data[field] !== '') ||
                    (this.form.controls[field].dirty && !this.form.controls[field].valid);
                if (hasError) {
                    for (var key in this.form.controls[field].errors) {
                        if (key) {
                            this.formError[field] += this._message[field][key] + '';
                        }
                    }
                }
            }
        }
    };
    /**
     * Performe the login service
     * @param values
     */
    LoginComponent.prototype.performLogin = function (values) {
        var _this = this;
        this.actualLoginStep = LoginSteps.Checking;
        this.authService.login(values.username, values.password, this.rememberMe)
            .subscribe(function (token) {
            var redirectUrl = _this.authService.getRedirectUrl();
            _this.actualLoginStep = LoginSteps.Welcome;
            _this.userPreferences.setStoragePrefix(values.username);
            _this.success.emit(new login_success_event_1.LoginSuccessEvent(token, values.username, values.password));
            if (redirectUrl) {
                _this.authService.setRedirectUrl(null);
                _this.router.navigate([redirectUrl]);
                return false;
            }
            if (_this.successRoute) {
                _this.router.navigate([_this.successRoute]);
            }
        }, function (err) {
            _this.actualLoginStep = LoginSteps.Landing;
            _this.displayErrorMessage(err);
            _this.enableError();
            _this.error.emit(new login_error_event_1.LoginErrorEvent(err));
        }, function () { return _this.logService.info('Login done'); });
    };
    /**
     * Check and display the right error message in the UI
     */
    LoginComponent.prototype.displayErrorMessage = function (err) {
        if (err.error && err.error.crossDomain && err.error.message.indexOf('Access-Control-Allow-Origin') !== -1) {
            this.errorMsg = err.error.message;
            return;
        }
        if (err.status === 403 && err.message.indexOf('Invalid CSRF-token') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CSRF';
            return;
        }
        if (err.status === 403 && err.message.indexOf('The system is currently in read-only mode') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ECM-LICENSE';
            return;
        }
        this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
    };
    /**
     * Check the require parameter
     * @returns {boolean}
     */
    LoginComponent.prototype.checkRequiredParams = function () {
        if (this.providers === undefined || this.providers === null || this.providers === '') {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS';
            this.enableError();
            var messageProviders = void 0;
            messageProviders = this.translateService.get(this.errorMsg);
            this.error.emit(new login_error_event_1.LoginErrorEvent(messageProviders.value));
            return false;
        }
        return true;
    };
    /**
     * Add a custom form error for a field
     * @param field
     * @param msg
     */
    LoginComponent.prototype.addCustomFormError = function (field, msg) {
        this.formError[field] += msg;
    };
    /**
     * Add a custom validation rule error for a field
     * @param field
     * @param ruleId - i.e. required | minlength | maxlength
     * @param msg
     */
    LoginComponent.prototype.addCustomValidationError = function (field, ruleId, msg, params) {
        var _this = this;
        if (params) {
            this.translateService.get(msg, params).subscribe(function (res) {
                _this._message[field][ruleId] = res;
            });
        }
        else {
            this._message[field][ruleId] = msg;
        }
    };
    /**
     * Display and hide the password value.
     */
    LoginComponent.prototype.toggleShowPassword = function () {
        this.isPasswordShow = !this.isPasswordShow;
        this.elementRef.nativeElement.querySelector('#password').type = this.isPasswordShow ? 'text' : 'password';
    };
    /**
     * The method return if a field is valid or not
     * @param field
     * @returns {boolean}
     */
    LoginComponent.prototype.isErrorStyle = function (field) {
        return !field.valid && field.dirty && !field.pristine;
    };
    /**
     * Trim username
     */
    LoginComponent.prototype.trimUsername = function (event) {
        event.target.value = event.target.value.trim();
    };
    /**
     * Default formError values
     */
    LoginComponent.prototype.initFormError = function () {
        this.formError = {
            'username': '',
            'password': ''
        };
    };
    /**
     * Init form fields messages
     */
    LoginComponent.prototype.initFormFieldsMessages = function () {
        this._message = {
            'username': {},
            'password': {}
        };
    };
    /**
     * Default form fields messages
     */
    LoginComponent.prototype.initFormFieldsMessagesDefault = function () {
        var _this = this;
        this._message = {
            'username': {
                'required': 'LOGIN.MESSAGES.USERNAME-REQUIRED'
            },
            'password': {
                'required': 'LOGIN.MESSAGES.PASSWORD-REQUIRED'
            }
        };
        this.translateService.get('LOGIN.MESSAGES.USERNAME-MIN', { minLength: this.minLength }).subscribe(function (res) {
            _this._message['username']['minlength'] = res;
        });
    };
    LoginComponent.prototype.initFormFieldsDefault = function () {
        this.form = this._fb.group({
            username: ['', forms_1.Validators.required],
            password: ['', forms_1.Validators.required]
        });
    };
    /**
     * Disable the error flag
     */
    LoginComponent.prototype.disableError = function () {
        this.isError = false;
        this.initFormError();
    };
    /**
     * Enable the error flag
     */
    LoginComponent.prototype.enableError = function () {
        this.isError = true;
    };
    LoginComponent.prototype.hasCustomFiledsValidation = function () {
        return this.fieldsValidation !== undefined;
    };
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "showRememberMe", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "showLoginActions", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "needHelpLink", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "registerLink", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "logoImageUrl", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "backgroundImageUrl", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "copyrightText", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "providers", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "fieldsValidation", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "disableCsrf", void 0);
    __decorate([
        core_1.Input()
    ], LoginComponent.prototype, "successRoute", void 0);
    __decorate([
        core_1.Output()
    ], LoginComponent.prototype, "success", void 0);
    __decorate([
        core_1.Output()
    ], LoginComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output()
    ], LoginComponent.prototype, "executeSubmit", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'adf-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss'],
            host: { '(blur)': 'onBlur($event)' },
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
