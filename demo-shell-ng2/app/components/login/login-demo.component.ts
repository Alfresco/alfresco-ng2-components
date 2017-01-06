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
import { StorageService, LogService } from 'ng2-alfresco-core';

@Component({
    selector: 'login-demo',
    templateUrl: './login-demo.component.html',
    styleUrls: ['./login-demo.component.css']
})
export class LoginDemoComponent implements OnInit {

    @ViewChild('alfrescologin')
    alfrescologin: any;

    providers: string = 'ECM';
    blackListUsername: string;
    customValidation: any;

    disableCsrf: boolean = false;
    isECM: boolean = true;
    isBPM: boolean = false;

    constructor(private router: Router,
                private storage: StorageService,
                private logService: LogService) {
        this.customValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.required]
        };
    }

    ngOnInit() {
        this.alfrescologin.addCustomValidationError('username', 'required', 'LOGIN.MESSAGES.USERNAME-REQUIRED');
        this.alfrescologin.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN');
        this.alfrescologin.addCustomValidationError('password', 'required', 'LOGIN.MESSAGES.PASSWORD-REQUIRED');

        if (this.storage.hasItem('providers')) {
            this.providers = this.storage.getItem('providers');
        }

        this.initProviders();
    }

    initProviders() {
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
        this.router.navigate(['/home']);
    }

    onError($event) {
        this.logService.error($event);
    }

    toggleECM() {
        this.isECM = !this.isECM;
        this.storage.setItem('providers', this.updateProvider());
    }

    toggleBPM() {
        this.isBPM = !this.isBPM;
        this.storage.setItem('providers', this.updateProvider());
    }

    toggleCSRF() {
        this.disableCsrf = !this.disableCsrf;
    }

    updateProvider() {
        if (this.isBPM && this.isECM) {
            this.providers = 'ALL';
            return this.providers;
        }

        if (this.isECM) {
            this.providers = 'ECM';
            return this.providers;
        }

        if (this.isBPM) {
            this.providers = 'BPM';
            return this.providers;
        }

        this.providers = '';
        return this.providers;
    };

    validateForm(event: any) {
        let values = event.values;
        if (values.controls['username'].value === this.blackListUsername) {
            this.alfrescologin.addCustomFormError('username', 'This particular username has been blocked');
            event.preventDefault();
        }
    }

}
