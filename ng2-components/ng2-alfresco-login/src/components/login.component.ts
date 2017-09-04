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

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlfrescoAuthenticationService, AlfrescoSettingsService, AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { FormSubmitEvent } from '../models/form-submit-event.model';

declare var require: any;

enum LoginSteps {
    Landing = 0,
    Checking = 1,
    Welcome = 2
}

@Component({
    selector: 'adf-login, alfresco-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    host: {'(blur)': 'onBlur($event)'},
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    isPasswordShow: boolean = false;

    @Input()
    showRememberMe: boolean = true;

    @Input()
    showLoginActions: boolean = true;

    @Input()
    needHelpLink: string = '';

    @Input()
    registerLink: string = '';

    @Input()
    logoImageUrl: string = require('../assets/images/alfresco-logo.svg');

    @Input()
    backgroundImageUrl: string = require('../assets/images/background.svg');

    @Input()
    copyrightText: string = '&#169; 2016 Alfresco Software, Inc. All Rights Reserved.';

    @Input()
    providers: string;

    @Input()
    fieldsValidation: any;

    @Input()
    disableCsrf: boolean;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    @Output()
    executeSubmit: EventEmitter<FormSubmitEvent> = new EventEmitter<FormSubmitEvent>();

    form: FormGroup;
    error: boolean = false;
    errorMsg: string;
    success: boolean = false;
    actualLoginStep: any = LoginSteps.Landing;
    LoginSteps: any = LoginSteps;
    rememberMe: boolean = true;
    formError: { [id: string]: string };
    minLength: number = 2;
    footerTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    data: any;

    private _message: { [id: string]: { [id: string]: string } };

    /**
     * Constructor
     * @param _fb
     * @param authService
     * @param settingsService
     * @param translate
     */
    constructor(private _fb: FormBuilder,
                private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService,
                private translateService: AlfrescoTranslationService,
                private logService: LogService,
                private elementRef: ElementRef) {
        this.initFormError();
        this.initFormFieldsMessages();
    }

    ngOnInit() {
        if (this.hasCustomFiledsValidation()) {
            this.form = this._fb.group(this.fieldsValidation);
        } else {
            this.initFormFieldsDefault();
            this.initFormFieldsMessagesDefault();
        }
        this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    }

    /**
     * Method called on submit form
     * @param values
     * @param event
     */
    onSubmit(values: any) {
        if (!this.checkRequiredParams()) {
            return false;
        }
        this.settingsService.setProviders(this.providers);
        this.settingsService.csrfDisabled = this.disableCsrf;

        this.disableError();

        let args = new FormSubmitEvent(this.form);
        this.executeSubmit.emit(args);

        if (args.defaultPrevented) {
            return false;
        } else {
            this.performLogin(values);
        }
    }

    /**
     * The method check the error in the form and push the error in the formError object
     * @param data
     */
    onValueChanged(data: any) {
        this.success = false;
        this.disableError();
        for (let field in this.formError) {
            if (field) {
                this.formError[field] = '';
                let hasError = (this.form.controls[field].errors && data[field] !== '') ||
                    (this.form.controls[field].dirty && !this.form.controls[field].valid);
                if (hasError) {
                    for (let key in this.form.controls[field].errors) {
                        if (key) {
                            this.formError[field] += this._message[field][key] + '';
                        }
                    }
                }
            }
        }
    }

    /**
     * Performe the login service
     * @param values
     */
    private performLogin(values: any) {
        this.actualLoginStep = LoginSteps.Checking;
        this.authService.login(values.username, values.password, this.rememberMe)
            .subscribe(
                (token: any) => {
                    this.actualLoginStep = LoginSteps.Welcome;
                    this.success = true;
                    this.onSuccess.emit({token: token, username: values.username, password: values.password});
                },
                (err: any) => {
                    this.actualLoginStep = LoginSteps.Landing;
                    this.displayErrorMessage(err);
                    this.enableError();
                    this.onError.emit(err);
                },
                () => this.logService.info('Login done')
            );
    }

    /**
     * Check and display the right error message in the UI
     */
    private displayErrorMessage(err: any): void {
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
    }

    /**
     * Check the require parameter
     * @returns {boolean}
     */
    private checkRequiredParams(): boolean {
        if (this.providers === undefined || this.providers === null || this.providers === '') {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS';
            this.enableError();
            let messageProviders: any;
            messageProviders = this.translateService.get(this.errorMsg);
            this.onError.emit(messageProviders.value);
            return false;
        }
        return true;
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
    public addCustomValidationError(field: string, ruleId: string, msg: string, params?: any) {
        if (params) {
            this.translateService.get(msg, params).subscribe((res: string) => {
                this._message[field][ruleId] = res;
            });
        } else {
            this._message[field][ruleId] = msg;
        }
    }

    /**
     * Display and hide the password value.
     */
    toggleShowPassword() {
        this.isPasswordShow = !this.isPasswordShow;
        this.elementRef.nativeElement.querySelector('#password').type = this.isPasswordShow ? 'text' : 'password';
    }

    /**
     * The method return if a field is valid or not
     * @param field
     * @returns {boolean}
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

    /**
     * Default formError values
     */
    private initFormError() {
        this.formError = {
            'username': '',
            'password': ''
        };
    }

    /**
     * Init form fields messages
     */
    private initFormFieldsMessages() {
        this._message = {
            'username': {},
            'password': {}
        };
    }

    /**
     * Default form fields messages
     */
    private initFormFieldsMessagesDefault() {
        this._message = {
            'username': {
                'required': 'LOGIN.MESSAGES.USERNAME-REQUIRED'
            },
            'password': {
                'required': 'LOGIN.MESSAGES.PASSWORD-REQUIRED'
            }
        };

        this.translateService.get('LOGIN.MESSAGES.USERNAME-MIN', {minLength: this.minLength}).subscribe((res: string) => {
            this._message['username']['minlength'] = res;
        });
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
        this.error = false;
        this.initFormError();
    }

    /**
     * Enable the error flag
     */
    private enableError() {
        this.error = true;
    }

    private hasCustomFiledsValidation(): boolean {
        return this.fieldsValidation !== undefined;
    }
}
