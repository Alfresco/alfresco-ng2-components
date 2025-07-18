/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppConfigService, AppConfigValues } from '../../../app-config';
import { AuthenticationService, BasicAlfrescoAuthService } from '../../../auth';
import { OidcAuthenticationService } from '../../../auth/oidc/oidc-authentication.service';
import { UserPreferencesService } from '../../../common';
import { TranslationService } from '../../../translation';

import { LoginErrorEvent } from '../../models/login-error.event';
import { LoginSubmitEvent } from '../../models/login-submit.event';
import { LoginSuccessEvent } from '../../models/login-success.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// eslint-disable-next-line no-shadow
enum LoginSteps {
    Landing = 0,
    Checking = 1,
    Welcome = 2
}

interface ValidationMessage {
    value: string;
    params?: any;
}

interface LoginFormValues {
    username: string;
    password: string;
}

@Component({
    selector: 'adf-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatCardModule,
        ReactiveFormsModule,
        TranslatePipe,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCheckboxModule
    ],
    host: { class: 'adf-login' }
})
export class LoginComponent implements OnInit {
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
    copyrightText: string = '\u00A9 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.';

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

    ssoLogin: boolean = false;

    form: UntypedFormGroup;
    isError: boolean = false;
    errorMsg: string;
    actualLoginStep: any = LoginSteps.Landing;
    LoginSteps = LoginSteps;
    rememberMe: boolean = true;
    formError: { [id: string]: string };
    minLength: number = 2;
    footerTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    data: any;

    private _message: { [id: string]: { [id: string]: ValidationMessage } };

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private _fb: UntypedFormBuilder,
        private authService: AuthenticationService,
        private basicAlfrescoAuthService: BasicAlfrescoAuthService,
        private oidcAuthenticationService: OidcAuthenticationService,
        private translateService: TranslationService,
        private router: Router,
        private appConfig: AppConfigService,
        private userPreferences: UserPreferencesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.initFormError();
        this.initFormFieldsDefault();
        this.initFormFieldsMessages();

        this.successRoute = this.appConfig.get<string>('successRoute', this.successRoute);

        if (this.authService.isLoggedIn()) {
            this.router.navigate([this.successRoute]);
        } else {
            if (this.authService.isOauth()) {
                const oauth = this.appConfig.oauth2;
                if (oauth?.silentLogin) {
                    this.redirectToSSOLogin();
                } else if (oauth?.implicitFlow || oauth?.codeFlow) {
                    this.ssoLogin = true;
                }
            }

            this.route.queryParams.subscribe((params: Params) => {
                const url = params['redirectUrl'];
                const provider = this.appConfig.get<string>(AppConfigValues.PROVIDERS);

                this.basicAlfrescoAuthService.setRedirect({ provider, url });
            });
        }

        if (this.fieldsValidation) {
            this.form = this._fb.group(this.fieldsValidation);
        }

        this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => this.onValueChanged(data));
    }

    submit() {
        this.onSubmit(this.form.value);
    }

    redirectToSSOLogin() {
        this.oidcAuthenticationService.ssoLogin();
    }

    /**
     * Method called on submit form
     *
     * @param values login form values
     */
    onSubmit(values: LoginFormValues): void {
        this.disableError();

        const args = new LoginSubmitEvent({
            controls: { username: this.form.controls.username }
        });
        this.executeSubmit.emit(args);

        if (!args.defaultPrevented) {
            this.actualLoginStep = LoginSteps.Checking;

            this.performLogin(values);
        }
    }

    implicitLogin() {
        if (this.authService.isLoggedIn()) {
            this.router.navigate([this.successRoute]);
        }
        this.oidcAuthenticationService.ssoLogin();
    }

    /**
     * The method check the error in the form and push the error in the formError object
     *
     * @param data form data
     */
    onValueChanged(data: any) {
        this.disableError();
        for (const field in this.formError) {
            if (field) {
                this.formError[field] = '';
                const hasError =
                    (this.form.controls[field].errors && data[field] !== '') || (this.form.controls[field].dirty && !this.form.controls[field].valid);
                if (hasError) {
                    for (const key in this.form.controls[field].errors) {
                        if (key) {
                            const message = this._message[field][key];
                            if (message?.value) {
                                const translated = this.translateService.instant(message.value, message.params);
                                this.formError[field] += translated;
                            }
                        }
                    }
                }
            }
        }
    }

    performLogin(values: { username: string; password: string }) {
        this.authService.login(values.username, values.password, this.rememberMe).subscribe(
            async (token: any) => {
                const redirectUrl = this.basicAlfrescoAuthService.getRedirect();

                this.actualLoginStep = LoginSteps.Welcome;
                this.userPreferences.setStoragePrefix(values.username);
                values.password = null;
                this.success.emit(new LoginSuccessEvent(token, values.username, null));

                if (redirectUrl) {
                    this.basicAlfrescoAuthService.setRedirect(null);
                    await this.router.navigateByUrl(redirectUrl);
                } else if (this.successRoute) {
                    await this.router.navigate([this.successRoute]);
                }
            },
            (err: any) => {
                this.actualLoginStep = LoginSteps.Landing;
                this.displayErrorMessage(err);
                this.isError = true;
                this.error.emit(new LoginErrorEvent(err));
            }
        );
    }

    /**
     * Check and display the right error message in the UI
     *
     * @param err error object
     */
    private displayErrorMessage(err: any): void {
        if (err.error?.crossDomain && err.error.message.indexOf('Access-Control-Allow-Origin') !== -1) {
            this.errorMsg = err.error.message;
        } else if (err.status === 403 && err.message.indexOf('Invalid CSRF-token') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CSRF';
        } else if (err.status === 403 && err.message.indexOf('The system is currently in read-only mode') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ECM-LICENSE';
        } else {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
        }
    }

    /**
     * Add a custom form error for a field
     *
     * @param field field
     * @param msg error message
     */
    public addCustomFormError(field: string, msg: string) {
        this.formError[field] += msg;
    }

    /**
     * Add a custom validation rule error for a field
     *
     * @param field field
     * @param ruleId - i.e. required | minlength | maxlength
     * @param msg message
     * @param params parameters
     */
    addCustomValidationError(field: string, ruleId: string, msg: string, params?: any) {
        if (field !== '__proto__' && field !== 'constructor' && field !== 'prototype') {
            this._message[field][ruleId] = {
                value: msg,
                params
            };
        }
    }

    /**
     * Display and hide the password value.
     *
     * @param event input event
     */
    toggleShowPassword(event: Event) {
        event.stopPropagation();
        this.isPasswordShow = !this.isPasswordShow;
    }

    /**
     * The method return if a field is valid or not
     *
     * @param field form field to check
     * @returns `true` if form field should display an error, otherwise `false`
     */
    isErrorStyle(field: AbstractControl): boolean {
        return !field.valid && field.dirty && !field.pristine;
    }

    /**
     * Trim username
     *
     * @param event event
     */
    trimUsername(event: any) {
        event.target.value = event.target.value.trim();
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
            username: {
                required: {
                    value: 'LOGIN.MESSAGES.USERNAME-REQUIRED'
                },
                minlength: {
                    value: 'LOGIN.MESSAGES.USERNAME-MIN',
                    params: {
                        minLength: this.minLength
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
            username: ['', Validators.compose([Validators.required, Validators.minLength(this.minLength)])],
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
}
