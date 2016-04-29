import { Router } from 'angular2/router';
import { ControlGroup, FormBuilder } from 'angular2/common';
import { AlfrescoAuthenticationService } from './alfresco-authentication.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
export declare class AlfrescoLoginComponent {
    auth: AlfrescoAuthenticationService;
    router: Router;
    method: string;
    translate: TranslateService;
    form: ControlGroup;
    error: boolean;
    success: boolean;
    /**
     * Constructor
     * @param fb
     * @param auth
     * @param router
     */
    constructor(fb: FormBuilder, auth: AlfrescoAuthenticationService, router: Router, translate: TranslateService);
    /**
     * Method called on submit form
     * @param value
     * @param event
     */
    onSubmit(value: any, event: any): void;
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
