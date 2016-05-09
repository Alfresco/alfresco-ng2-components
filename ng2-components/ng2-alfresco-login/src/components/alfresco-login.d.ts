/**
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
import { EventEmitter } from 'angular2/core';
import { Router } from 'angular2/router';
import { ControlGroup, FormBuilder } from 'angular2/common';
import { AlfrescoAuthenticationService } from '../services/alfresco-authentication';
import { TranslateService } from 'ng2-translate/ng2-translate';
export declare class AlfrescoLoginComponent {
    private _fb;
    auth: AlfrescoAuthenticationService;
    router: Router;
    method: string;
    onSuccess: EventEmitter<{}>;
    onError: EventEmitter<{}>;
    translate: TranslateService;
    form: ControlGroup;
    error: boolean;
    success: boolean;
    formError: {
        [id: string]: string;
    };
    private _message;
    /**
     * Constructor
     * @param _fb
     * @param auth
     * @param router
     */
    constructor(_fb: FormBuilder, auth: AlfrescoAuthenticationService, router: Router, translate: TranslateService);
    /**
     * Method called on submit form
     * @param value
     * @param event
     */
    onSubmit(value: any, event: any): void;
    /**
     * The method check the error in the form and push the error in the formError object
     * @param data
     */
    onValueChanged(data: any): void;
    /**
     * The method return if a field is valid or not
     * @param field
     * @returns {boolean}
     */
    isErrorStyle(field: ControlGroup): boolean;
    /**
     * Initial configuration for Multi language
     * @param translate
     */
    translationInit(translate: TranslateService): void;
}
