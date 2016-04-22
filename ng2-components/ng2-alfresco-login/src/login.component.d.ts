import { Router } from 'angular2/router';
import { ControlGroup, FormBuilder } from 'angular2/common';
import { Authentication } from './authentication.service';
export declare class Login {
    auth: Authentication;
    router: Router;
    form: ControlGroup;
    error: boolean;
    isErrorStyle(field: ControlGroup): boolean;
    constructor(fb: FormBuilder, auth: Authentication, router: Router);
    onSubmit(value: any, event: any): void;
}
