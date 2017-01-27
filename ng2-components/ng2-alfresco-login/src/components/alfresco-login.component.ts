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

import { Component, Input, Output, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlfrescoTranslationService, AlfrescoAuthenticationService, AlfrescoSettingsService, LogService } from 'ng2-alfresco-core';
import { FormSubmitEvent } from '../models/form-submit-event.model';

declare let componentHandler: any;

@Component({
    selector: 'alfresco-login',
    moduleId: module.id,
    templateUrl: './alfresco-login.component.html',
    styleUrls: ['./alfresco-login.component.css']
})
export class AlfrescoLoginComponent implements OnInit {

    baseComponentPath = module.id.replace('/alfresco-login.component.js', '');

    isPasswordShow: boolean = false;

    @Input()
    needHelpLink: string = '';

    @Input()
    registerLink: string = '';

    @Input()
    logoImageUrl: string;

    @Input()
    backgroundImageUrl: string;

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

    formError: { [id: string]: string };

    minLenght: number = 2;

    footerTemplate: TemplateRef<any>;

    headerTemplate: TemplateRef<any>;

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
                private logService: LogService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-login', 'node_modules/ng2-alfresco-login/src');
        }

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
            this.performeLogin(values);
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
    private performeLogin(values: any) {
        this.authService.login(values.username, values.password)
            .subscribe(
                (token: any) => {
                    this.success = true;
                    this.onSuccess.emit({token: token, username: values.username, password: values.password});
                },
                (err: any) => {
                    this.displayErrorMessage(err);
                    this.enableError();
                    this.onError.emit(err);
                    this.logService.error(err);
                },
                () => this.logService.info('Login done')
            );
    }

    /**
     * Check and display the right error message in the UI
     */
    private displayErrorMessage(err: any): void {
        if (err.error && err.error.crossDomain && err.error.message.indexOf('the network is offline, Origin is not allowed by' +
                ' Access-Control-Allow-Origin') !== -1) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CORS';
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
        if (this.isPasswordShow) {
            (<HTMLInputElement>document.getElementById('password')).type = 'text';
        } else {
            (<HTMLInputElement>document.getElementById('password')).type = 'password';
        }
    }

    /**
     * The method return if a field is valid or not
     * @param field
     * @returns {boolean}
     */
    isErrorStyle(field: FormGroup) {
        if (typeof componentHandler !== 'undefined') {
            componentHandler.upgradeAllRegistered();
        }
        return !field.valid && field.dirty && !field.pristine;
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

        this.translateService.get('LOGIN.MESSAGES.USERNAME-MIN',  {minLenght: this.minLenght}).subscribe((res: string) => {
            this._message['username']['minlength'] = res;
        });
    }

    private initFormFieldsDefault() {
        this.form = this._fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(this.minLenght)])],
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
