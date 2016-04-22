import { Router } from 'angular2/router';
import { ControlGroup, FormBuilder } from 'angular2/common';
import { Authentication } from './authentication.service';
export declare class Login {
    auth: Authentication;
    router: Router;
    method: string;
    form: ControlGroup;
    error: boolean;
    /**
     * Constructor
     * @param fb
     * @param auth
     * @param router
     */
    constructor(fb: FormBuilder, auth: Authentication, router: Router);
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
}
