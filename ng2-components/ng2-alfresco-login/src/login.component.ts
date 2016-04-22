import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators} from 'angular2/common';
import {Authentication} from './authentication.service';
declare let componentHandler;

@Component({
    selector: 'login',
    moduleId: 'node_modules/ng2-alfresco-login/src/',
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],

})
export class Login {
    form:ControlGroup;
    error:boolean = false;

    isErrorStyle(field:ControlGroup) {
        componentHandler.upgradeAllRegistered();
        if (field.valid) {
            return false;
        } else {
            return true;
        }
    }

    constructor(fb:FormBuilder, public auth:Authentication, public router:Router) {
        this.form = fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.required]
        });
    }

    onSubmit(value:any, event) {
        if (event) {
            event.preventDefault();
        }
        this.auth.login('POST', value.username, value.password)
            .subscribe(
                (token:any) => this.router.navigate(['Home']),
                () => {
                    this.error = true;
                }
            );
    }
}
