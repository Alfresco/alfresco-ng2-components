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

import {
    Component, EventEmitter,
    Input, OnInit, Output, TemplateRef, ViewEncapsulation, OnDestroy
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { LogService } from '../../services/log.service';
import { TranslationService } from '../../services/translation.service';
import { UserPreferencesService } from '../../services/user-preferences.service';

import { LoginErrorEvent } from '../models/login-error.event';
import { LoginSubmitEvent } from '../models/login-submit.event';
import { LoginSuccessEvent } from '../models/login-success.event';
import {
    AppConfigService,
    AppConfigValues
} from '../../app-config/app-config.service';
import { OauthConfigModel } from '../../models/oauth-config.model';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum LoginSteps {
    Landing = 0,
    Checking = 1,
    Welcome = 2
}

interface ValidationMessage {
    value: string;
    params?: any;
}

@Component({
    selector: 'adf-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'adf-login'
    }
})
export class LoginComponent implements OnInit, OnDestroy {
    isPasswordShow: boolean = false;

    /**
     * Should the `Remember me` checkbox be shown? When selected, this
     * option will remember the logged-in user after the browser is closed
     * to avoid logging in repeatedly.
     */
    @Input()
    showRememberMe: boolean = true;

    /** Should the extra actions (`Need Help`, `Register`, etc) be shown? */
    @Input()
    showLoginActions: boolean = true;

    /** Sets the URL of the NEED HELP link in the footer. */
    @Input()
    needHelpLink: string = '';

    /** Sets the URL of the REGISTER link in the footer. */
    @Input()
    registerLink: string = '';

    /** Path to a custom logo image. */
    @Input()
    logoImageUrl: string = './assets/images/alfresco-logo.svg';

    /** Path to a custom background image. */
    @Input()
    backgroundImageUrl: string = './assets/images/background.svg';

    /** The copyright text below the login box. */
    @Input()
    copyrightText: string = '\u00A9 2016 Alfresco Software, Inc. All Rights Reserved.';

    /** Custom validation rules for the login form. */
    @Input()
    fieldsValidation: any;

    /** Route to redirect to on successful login. */
    @Input()
    successRoute: string = null;

    /** Emitted when the login is successful. */
    @Output()
    success = new EventEmitter<LoginSuccessEvent>();

    /** Emitted when the login fails. */
    @Output()
    error = new EventEmitter<LoginErrorEvent>();

    /** Emitted when the login form is submitted. */
    @Output()
    executeSubmit = new EventEmitter<LoginSubmitEvent>();

    implicitFlow: boolean = false;

    form: FormGroup;
    isError: boolean = false;
    errorMsg: string;
    actualLoginStep: any = LoginSteps.Landing;
    LoginSteps: any = LoginSteps;
    rememberMe: boolean = true;
    formError: { [id: string]: string };
    minLength: number = 2;
    footerTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    data: any;

    private _message: { [id: string]: { [id: string]: ValidationMessage } };
    private onDestroy$ = new Subject<boolean>();

    /**
     * Constructor
     * @param _fb
     * @param authService
     * @param translate
     */
    constructor(
        private _fb: FormBuilder,
        private authService: AuthenticationService,
        private translateService: TranslationService,
        private logService: LogService,
        private router: Router,
        private appConfig: AppConfigService,
        private userPreferences: UserPreferencesService,
        private location: Location,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {
        this.initFormError();
        this.initFormFieldsMessages();
    }

    ngOnInit() {
        if (this.authService.isOauth()) {
            const oauth: OauthConfigModel = this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);
            if (oauth && oauth.implicitFlow) {
                this.implicitFlow = true;
            }
        }

        if (this.authService.isEcmLoggedIn() || this.authService.isBpmLoggedIn()) {
            this.location.forward();
        } else {
            this.route.queryParams.subscribe((params: Params) => {
                const url = params['redirectUrl'];
                const provider = this.appConfig.get<string>(AppConfigValues.PROVIDERS);

                this.authService.setRedirect({ provider, url });
            });
        }

        if (this.hasCustomFieldsValidation()) {
            this.form = this._fb.group(this.fieldsValidation);
        } else {
            this.initFormFieldsDefault();
            this.initFormFieldsMessagesDefault();
        }
        this.form.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => this.onValueChanged(data));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    submit() {
        this.onSubmit(this.form.value);
    }

    /**
     * Method called on submit form
     * @param values
     * @param event
     */
    onSubmit(values: any): void {
        this.disableError();

        const args = new LoginSubmitEvent({
            controls: { username: this.form.controls.username }
        });
        this.executeSubmit.emit(args);

        if (!args.defaultPrevented) {
            this.performLogin(values);
        }
    }

    implicitLogin() {
        this.authService.ssoImplicitLogin();
    }

    /**
     * The method check the error in the form and push the error in the formError object
     * @param data
     */
    onValueChanged(data: any) {
        this.disableError();
        for (const field in this.formError) {
            if (field) {
                this.formError[field] = '';
                const hasError =
                    (this.form.controls[field].errors && data[field] !== '') ||
                    (this.form.controls[field].dirty &&
                        !this.form.controls[field].valid);
                if (hasError) {
                    for (const key in this.form.controls[field].errors) {
                        if (key) {
                            const message = this._message[field][key];
                            if (message && message.value) {
                                const translated = this.translateService.instant(message.value, message.params);
                                this.formError[field] += translated;
                            }
                        }
                    }
                }
            }
        }
    }

    private performLogin(values: any) {
        this.actualLoginStep = LoginSteps.Checking;
        this.authService
            .login(values.username, values.password, this.rememberMe)
            .subscribe(
                (token: any) => {
                    const redirectUrl = this.authService.getRedirect();

                    this.actualLoginStep = LoginSteps.Welcome;
                    this.userPreferences.setStoragePrefix(values.username);
                    values.password = null;
                    this.success.emit(
                        new LoginSuccessEvent(token, values.username, null)
                    );

                    if (redirectUrl) {
                        this.authService.setRedirect(null);
                        this.router.navigateByUrl(redirectUrl);
                    } else if (this.successRoute) {
                        this.router.navigate([this.successRoute]);
                    }
                },
                (err: any) => {
                    this.actualLoginStep = LoginSteps.Landing;
                    this.displayErrorMessage(err);
                    this.isError = true;
                    this.error.emit(new LoginErrorEvent(err));
                },
                () => this.logService.info('Login done')
            );
    }

    /**
     * Check and display the right error message in the UI
     */
    private displayErrorMessage(err: any): void {
        if (
            err.error &&
            err.error.crossDomain &&
            err.error.message.indexOf('Access-Control-Allow-Origin') !== -1
        ) {
            this.errorMsg = err.error.message;
        } else if (
            err.status === 403 &&
            err.message.indexOf('Invalid CSRF-token') !== -1
        ) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CSRF';
        } else if (
            err.status === 403 &&
            err.message.indexOf('The system is currently in read-only mode') !==
            -1
        ) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ECM-LICENSE';
        } else {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
        }
    }

    /**
     * Add a custom form error for a field
     * @param field
     * @param msg
     */
    public addCustomFormError(field: string, msg: string) {
        this.formError[field] += msg;
    }

    /**
     * Add a custom validation rule error for a field
     * @param field
     * @param ruleId - i.e. required | minlength | maxlength
     * @param msg
     */
    addCustomValidationError(
        field: string,
        ruleId: string,
        msg: string,
        params?: any
    ) {
        this._message[field][ruleId] = {
            value: msg,
            params
        };
    }

    /**
     * Display and hide the password value.
     */
    toggleShowPassword(event: MouseEvent | KeyboardEvent) {
        event.stopPropagation();
        this.isPasswordShow = !this.isPasswordShow;
    }

    /**
     * The method return if a field is valid or not
     * @param field
     */
    isErrorStyle(field: AbstractControl) {
        return !field.valid && field.dirty && !field.pristine;
    }

    /**
     * Trim username
     */
    trimUsername(event: any) {
        event.target.value = event.target.value.trim();
    }

    getBackgroundUrlImageUrl(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(`url(${this.backgroundImageUrl})`);
    }

    /**
     * Default formError values
     */
    private initFormError() {
        this.formError = {
            username: '',
            password: ''
        };
    }

    /**
     * Init form fields messages
     */
    private initFormFieldsMessages() {
        this._message = {
            username: {},
            password: {}
        };
    }

    /**
     * Default form fields messages
     */
    private initFormFieldsMessagesDefault() {
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
    }

    private initFormFieldsDefault() {
        this.form = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * Disable the error flag
     */
    private disableError() {
        this.isError = false;
        this.initFormError();
    }

    private hasCustomFieldsValidation(): boolean {
        return this.fieldsValidation !== undefined;
    }
}
