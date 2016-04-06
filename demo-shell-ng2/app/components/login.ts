import {Component} from "angular2/core";
import {Router, ROUTER_DIRECTIVES} from "angular2/router";
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators} from "angular2/common";
import {Authentication} from "../services/authentication";

@Component({
    selector: 'login',
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
    template: `
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <form [ngFormModel]="form" (submit)="onSubmit(form.value, $event)">
                    <div *ngIf="error">Check your password</div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input class="form-control" type="text" ngControl="username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input class="form-control" type="password" ngControl="password">
                    </div>
                    <button type="submit" class="btn btn-default" [disabled]="!form.valid">Login</button>
                </form>
            </div>
        </div>
    `
})
export class Login {
    form: ControlGroup;
    error: boolean = false;

    constructor(fb: FormBuilder, public auth: Authentication, public router: Router) {
        this.form = fb.group({
            username:  ['', Validators.required],
            password:  ['', Validators.required]
        });
    }

    onSubmit(value: any, event) {
        //event.preventDefault();
        this.auth.login(value.username, value.password)
            .subscribe(
                //(token: any) => this.router.navigate(['../Home']),
                (token: any) => this.router.navigate(['Home']),
                () => { this.error = true; }
            );
    }
}
