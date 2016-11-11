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

import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'login-demo',
    templateUrl: './login-demo.component.html',
    styleUrls: ['./login-demo.component.css']
})
export class LoginDemoComponent implements OnInit {

    @ViewChild('alfrescologin')
    alfrescologin: any;

    providers: string = 'ECM';
    disableCsrf: boolean = false;
    blackListUsername: string;
    customValidation: any;

    isECM: boolean = true;
    isBPM: boolean = false;

    constructor(public router: Router) {
        this.customValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.required]
        };
    }

    ngOnInit() {
        this.alfrescologin.addCustomValidationError('username', 'required', 'LOGIN.MESSAGES.USERNAME-REQUIRED');
        this.alfrescologin.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN');
        this.alfrescologin.addCustomValidationError('password', 'required', 'LOGIN.MESSAGES.PASSWORD-REQUIRED');

        if (localStorage.getItem('providers')) {
            this.providers = localStorage.getItem('providers');
        }

        this.setProviders();
    }

    setProviders() {
        if (this.providers === 'BPM') {
            this.isECM = false;
            this.isBPM = true;
        } else if (this.providers === 'ECM') {
            this.isECM = true;
            this.isBPM = false;
        } else if (this.providers === 'ALL') {
            this.isECM = true;
            this.isBPM = true;
        }
    }

    onLogin($event) {
        console.log($event);
        this.router.navigate(['/home']);
    }

    onError($event) {
        console.log($event);
    }

    toggleECM(checked) {
        if (checked && this.providers === 'BPM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'ECM';
        } else if (!checked && this.providers === 'ALL') {
            this.providers = 'BPM';
        } else if (!checked && this.providers === 'ECM') {
            this.providers = '';
        }

        if (this.providers) {
            localStorage.setItem('providers', this.providers);
        }
    }

    toggleBPM(checked) {
        if (checked && this.providers === 'ECM') {
            this.providers = 'ALL';
        } else if (checked) {
            this.providers = 'BPM';
        } else if (!checked && this.providers === 'ALL') {
            this.providers = 'ECM';
        } else if (!checked && this.providers === 'BPM') {
            this.providers = '';
        }

        if (this.providers) {
            localStorage.setItem('providers', this.providers);
        }
    }

    toggleCSRF() {
        this.disableCsrf = !this.disableCsrf;
    }

    validateForm(event: any) {
        let values = event.values;
        if (values.controls['username'].value === this.blackListUsername) {
            this.alfrescologin.addCustomFormError('username', 'This particular username has been blocked');
            event.preventDefault();
        }
    }

}
