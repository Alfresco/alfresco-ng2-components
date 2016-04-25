import {Component, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators} from 'angular2/common';
import {Authentication} from './authentication.service';
declare let componentHandler;
declare let __moduleName: string;

@Component({
    selector: 'alfresco-login',
    moduleId: __moduleName,
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],

})
export class Login {
    @Input() method: string = 'GET';

    form:ControlGroup;
    error:boolean = false;

    /**
     * Constructor
     * @param fb
     * @param auth
     * @param router
     */
    constructor(fb:FormBuilder, public auth:Authentication, public router:Router) {
        this.form = fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.required]
        });
    }

    /**
     * Method called on submit form
     * @param value
     * @param event
     */
    onSubmit(value:any, event) {
        if (event) {
            event.preventDefault();
        }
        this.auth.login(this.method, value.username, value.password)
            .subscribe(
                (token:any) => this.router.navigate(['Home']),
                () => {
                    this.error = true;
                }
            );
    }

    /**
     * The method return if a field is valid or not
     * @param field
     * @returns {boolean}
     */
    isErrorStyle(field:ControlGroup) {
        componentHandler.upgradeAllRegistered();
        if (field.valid) {
            return false;
        } else {
            return true;
        }
    }
}
