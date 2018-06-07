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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LogService, StorageService, AuthenticationSSOService } from '@alfresco/adf-core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    @ViewChild('alfrescologin')
    alfrescologin: any;

    providers = 'ECM';
    customValidation: any;

    disableCsrf = false;
    isECM = true;
    isBPM = false;
    isSSO = false;
    showFooter = true;
    customMinLength = 2;

    constructor(private router: Router,
                private authSSO: AuthenticationSSOService,
                private storage: StorageService,
                private logService: LogService) {
        this.customValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(this.customMinLength)])],
            password: ['', Validators.required]
        };
    }

    ngOnInit() {
        this.alfrescologin.addCustomValidationError('username', 'required', 'LOGIN.MESSAGES.USERNAME-REQUIRED');
        this.alfrescologin.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN', {minLength: this.customMinLength});
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
            this.isSSO = false;
        } else if (this.providers === 'ECM') {
            this.isECM = true;
            this.isBPM = false;
            this.isSSO = false;
        } else if (this.providers === 'ALL') {
            this.isECM = true;
            this.isBPM = true;
            this.isSSO = false;
        } else if (this.providers === 'OAUTH') {
            this.isECM = false;
            this.isBPM = false;
            this.isSSO = true;
        }
    }

    onLogin($event) {
        this.authSSO.setToken($event.token.ticket);

        this.router.navigate(['/home']);
    }

    onError($event) {
        this.logService.error($event);
    }

    toggleECM() {
        this.isECM = !this.isECM;
        this.storage.setItem('providers', this.updateProvider());
    }

    toggleSSO() {
        this.isSSO = !this.isSSO;
        this.storage.setItem('providers', this.updateProvider());
    }

    toggleBPM() {
        this.isBPM = !this.isBPM;
        this.storage.setItem('providers', this.updateProvider());
    }

    toggleCSRF() {
        this.disableCsrf = !this.disableCsrf;
    }

    toggleFooter() {
        this.showFooter = !this.showFooter;
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

        if (this.isSSO) {
            this.providers = 'OAUTH';
            return this.providers;
        }

        this.providers = '';
        return this.providers;
    }

    checkForm(event: any) {
        const values = event.values;
        this.logService.log(values);
    }
}
