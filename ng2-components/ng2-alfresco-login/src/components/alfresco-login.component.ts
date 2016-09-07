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

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from '@angular/common';
import {
    AlfrescoTranslationService,
    AlfrescoPipeTranslate,
    AlfrescoAuthenticationService,
    AlfrescoSettingsService
} from 'ng2-alfresco-core';
import { FormSubmitEvent } from '../models/form-submit-event.model';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'alfresco-login',
    moduleId: __moduleName,
    directives: [FORM_DIRECTIVES],
    templateUrl: './alfresco-login.component.html',
    styleUrls: ['./alfresco-login.component.css'],
    pipes: [AlfrescoPipeTranslate]

})
export class AlfrescoLoginComponent implements OnInit {

    baseComponentPath = __moduleName.replace('/alfresco-login.component.js', '');

    isPasswordShow: boolean = false;

    @Input()
    logoImageUrl: string;

    @Input()
    backgroundImageUrl: string;

    @Input()
    providers: string;

    @Input()
    fieldsValidation: any;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    @Output()
    executeSubmit: EventEmitter<FormSubmitEvent> = new EventEmitter<FormSubmitEvent>();

    form: ControlGroup;
    error: boolean = false;
    errorMsg: string;
    success: boolean = false;

    formError: { [id: string]: string };

    private _message: { [id: string]: { [id: string]: string } };

    /**
     * Constructor
     * @param _fb
     * @param authService
     * @param settingsService
     * @param translate
     */
    constructor(private _fb: FormBuilder,
                public authService: AlfrescoAuthenticationService,
                public settingsService: AlfrescoSettingsService,
                private translate: AlfrescoTranslationService) {

        translate.addTranslationFolder('node_modules/ng2-alfresco-login/dist/src');

        this.initFormError();
        this.initFormMessages();
    }

    ngOnInit() {
        this.form = this._fb.group(this.fieldsValidation);
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
                this.enableError();
                this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
                this.onError.emit(err);
                console.log(err);
            },
            () => console.log('Login done')
        );
    }

    /**
     * Check the require parameter
     * @returns {boolean}
     */
    private checkRequiredParams(): boolean {
        if (this.providers === undefined) {
            this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS';
            this.enableError();
            let messageProviders: any;
            messageProviders = this.translate.get(this.errorMsg);
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
    public addCustomValidationError(field: string, ruleId: string, msg: string) {
        this._message[field][ruleId] = msg;
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
    isErrorStyle(field: ControlGroup) {
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
     * Default form messages values
     */
    private initFormMessages() {
        this._message = {
            'username': {
                'required': 'LOGIN.MESSAGES.USERNAME-REQUIRED',
                'minlength': 'LOGIN.MESSAGES.USERNAME-MIN'
            },
            'password': {
                'required': 'LOGIN.MESSAGES.PASSWORD-REQUIRED'
            }
        };
    }

    /**
     * Disable the error flag
     */
    private disableError() {
        this.error = false;
    }

    /**
     * Enable the error flag
     */
    private enableError() {
        this.error = true;
    }
}
