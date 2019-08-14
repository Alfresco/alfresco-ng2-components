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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var authentication_service_1 = require("../../services/authentication.service");
var log_service_1 = require("../../services/log.service");
var translation_service_1 = require("../../services/translation.service");
var user_preferences_service_1 = require("../../services/user-preferences.service");
var login_error_event_1 = require("../models/login-error.event");
var login_submit_event_1 = require("../models/login-submit.event");
var login_success_event_1 = require("../models/login-success.event");
var app_config_service_1 = require("../../app-config/app-config.service");
var platform_browser_1 = require("@angular/platform-browser");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var LoginSteps;
(function (LoginSteps) {
    LoginSteps[LoginSteps["Landing"] = 0] = "Landing";
    LoginSteps[LoginSteps["Checking"] = 1] = "Checking";
    LoginSteps[LoginSteps["Welcome"] = 2] = "Welcome";
})(LoginSteps || (LoginSteps = {}));
var LoginComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param _fb
     * @param authService
     * @param translate
     */
    function LoginComponent(_fb, authService, translateService, logService, router, appConfig, userPreferences, location, route, sanitizer) {
        this._fb = _fb;
        this.authService = authService;
        this.translateService = translateService;
        this.logService = logService;
        this.router = router;
        this.appConfig = appConfig;
        this.userPreferences = userPreferences;
        this.location = location;
        this.route = route;
        this.sanitizer = sanitizer;
        this.isPasswordShow = false;
        /**
         * Should the `Remember me` checkbox be shown? When selected, this
         * option will remember the logged-in user after the browser is closed
         * to avoid logging in repeatedly.
         */
        this.showRememberMe = true;
        /** Should the extra actions (`Need Help`, `Register`, etc) be shown? */
        this.showLoginActions = true;
        /** Sets the URL of the NEED HELP link in the footer. */
        this.needHelpLink = '';
        /** Sets the URL of the REGISTER link in the footer. */
        this.registerLink = '';
        /** Path to a custom logo image. */
        this.logoImageUrl = './assets/images/alfresco-logo.svg';
        /** Path to a custom background image. */
        this.backgroundImageUrl = './assets/images/background.svg';
        /** The copyright text below the login box. */
        this.copyrightText = '\u00A9 2016 Alfresco Software, Inc. All Rights Reserved.';
        /** Route to redirect to on successful login. */
        this.successRoute = null;
        /** Emitted when the login is successful. */
        this.success = new core_1.EventEmitter();
        /** Emitted when the login fails. */
        this.error = new core_1.EventEmitter();
        /** Emitted when the login form is submitted. */
        this.executeSubmit = new core_1.EventEmitter();
        this.implicitFlow = false;
        this.isError = false;
        this.actualLoginStep = LoginSteps.Landing;
        this.LoginSteps = LoginSteps;
        this.rememberMe = true;
        this.minLength = 2;
        this.onDestroy$ = new rxjs_1.Subject();
        this.initFormError();
        this.initFormFieldsMessages();
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.authService.isOauth()) {
            var oauth = this.appConfig.get(app_config_service_1.AppConfigValues.OAUTHCONFIG, null);
            if (oauth && oauth.implicitFlow) {
                this.implicitFlow = true;
            }
        }
        if (this.authService.isEcmLoggedIn() || this.authService.isBpmLoggedIn()) {
            this.location.forward();
        }
        else {
            this.route.queryParams.subscribe(function (params) {
                var url = params['redirectUrl'];
                var provider = _this.appConfig.get(app_config_service_1.AppConfigValues.PROVIDERS);
                _this.authService.setRedirect({ provider: provider, url: url });
            });
        }
        if (this.hasCustomFieldsValidation()) {
            this.form = this._fb.group(this.fieldsValidation);
        }
        else {
            this.initFormFieldsDefault();
            this.initFormFieldsMessagesDefault();
        }
        this.form.valueChanges
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (data) { return _this.onValueChanged(data); });
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    LoginComponent.prototype.submit = function () {
        this.onSubmit(this.form.value);
    };
    /**
     * Method called on submit form
     * @param values
     * @param event
     */
    LoginComponent.prototype.onSubmit = function (values) {
        this.disableError();
        if (this.authService.isOauth() && !this.authService.isSSODiscoveryConfigured()) {
            this.errorMsg = 'LOGIN.MESSAGES.SSO-WRONG-CONFIGURATION';
            this.isError = true;
        }
        else {
            var args = new login_submit_event_1.LoginSubmitEvent({
                controls: { username: this.form.controls.username }
            });
            this.executeSubmit.emit(args);
            if (args.defaultPrevented) {
                return false;
            }
            else {
                this.performLogin(values);
            }
        }
    };
    LoginComponent.prototype.implicitLogin = function () {
        if (this.authService.isOauth() && !this.authService.isSSODiscoveryConfigured()) {
            this.errorMsg = 'LOGIN.MESSAGES.SSO-WRONG-CONFIGURATION';
            this.isError = true;
        }
        else {
            this.authService.ssoImplicitLogin();
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
                    (this.form.controls[field].dirty &&
                        !this.form.controls[field].valid);
                if (hasError) {
                    for (var key in this.form.controls[field].errors) {
                        if (key) {
                            var message = this._message[field][key];
                            if (message && message.value) {
                                var translated = this.translateService.instant(message.value, message.params);
                                this.formError[field] += translated;
                            }
                        }
                    }
                }
            }
        }
    };
    LoginComponent.prototype.performLogin = function (values) {
        var _this = this;
        this.actualLoginStep = LoginSteps.Checking;
        this.authService
            .login(values.username, values.password, this.rememberMe)
            .subscribe(function (token) {
            var redirectUrl = _this.authService.getRedirect();
            _this.actualLoginStep = LoginSteps.Welcome;
            _this.userPreferences.setStoragePrefix(values.username);
            values.password = null;
            _this.success.emit(new login_success_event_1.LoginSuccessEvent(token, values.username, null));
            if (redirectUrl) {
                _this.authService.setRedirect(null);
                _this.router.navigateByUrl(redirectUrl);
            }
            else if (_this.successRoute) {
                _this.router.navigate([_this.successRoute]);
            }
        }, function (err) {
            _this.actualLoginStep = LoginSteps.Landing;
            _this.displayErrorMessage(err);
            _this.isError = true;
            _this.error.emit(new login_error_event_1.LoginErrorEvent(err));
        }, function () { return _this.logService.info('Login done'); });
    };
    /**
     * Check and display the right error message in the UI
     */
    LoginComponent.prototype.displayErrorMessage = function (err) {
        if (err.error &&
            err.error.crossDomain &&
            err.error.message.indexOf('Access-Control-Allow-Origin') !== -1) {
            this.errorMsg = err.error.message;
        }
        else if (err.status === 403 &&
            err.message.indexOf('Invalid CSRF-token') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CSRF';
        }
        else if (err.status === 403 &&
            err.message.indexOf('The system is currently in read-only mode') !==
                -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ECM-LICENSE';
        }
        else {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
        }
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
        this._message[field][ruleId] = {
            value: msg,
            params: params
        };
    };
    /**
     * Display and hide the password value.
     */
    LoginComponent.prototype.toggleShowPassword = function (event) {
        event.stopPropagation();
        this.isPasswordShow = !this.isPasswordShow;
    };
    /**
     * The method return if a field is valid or not
     * @param field
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
    LoginComponent.prototype.getBackgroundUrlImageUrl = function () {
        return this.sanitizer.bypassSecurityTrustStyle("url(" + this.backgroundImageUrl + ")");
    };
    /**
     * Default formError values
     */
    LoginComponent.prototype.initFormError = function () {
        this.formError = {
            username: '',
            password: ''
        };
    };
    /**
     * Init form fields messages
     */
    LoginComponent.prototype.initFormFieldsMessages = function () {
        this._message = {
            username: {},
            password: {}
        };
    };
    /**
     * Default form fields messages
     */
    LoginComponent.prototype.initFormFieldsMessagesDefault = function () {
        this._message = {
            username: {
                required: {
                    value: 'LOGIN.MESSAGES.USERNAME-REQUIRED'
                },
                minLength: {
                    value: 'LOGIN.MESSAGES.USERNAME-MIN',
                    params: {
                        get minLength() {
                            return this.minLength;
                        }
                    }
                }
            },
            password: {
                required: {
                    value: 'LOGIN.MESSAGES.PASSWORD-REQUIRED'
                }
            }
        };
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
    LoginComponent.prototype.hasCustomFieldsValidation = function () {
        return this.fieldsValidation !== undefined;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LoginComponent.prototype, "showRememberMe", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LoginComponent.prototype, "showLoginActions", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], LoginComponent.prototype, "needHelpLink", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], LoginComponent.prototype, "registerLink", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], LoginComponent.prototype, "logoImageUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], LoginComponent.prototype, "backgroundImageUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], LoginComponent.prototype, "copyrightText", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "fieldsValidation", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], LoginComponent.prototype, "successRoute", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "success", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "executeSubmit", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'adf-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            host: {
                class: 'adf-login'
            }
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            authentication_service_1.AuthenticationService,
            translation_service_1.TranslationService,
            log_service_1.LogService,
            router_1.Router,
            app_config_service_1.AppConfigService,
            user_preferences_service_1.UserPreferencesService,
            common_1.Location,
            router_1.ActivatedRoute,
            platform_browser_1.DomSanitizer])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map