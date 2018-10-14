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
import { LogService } from '@alfresco/adf-core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    @ViewChild('alfrescoLogin')
    alfrescoLogin: any;

    customValidation: any;
    customSuccessRouteURI = '';
    customLogoImageURL = './assets/images/alfresco-logo.svg';

    disableCsrf = false;
    showFooter = true;
    showRememberMe = true;
    customSuccessRoute = false;
    customLogoImage = false;
    customMinLength = 2;

    constructor(private router: Router,
                private logService: LogService) {
        this.customValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(this.customMinLength)])],
            password: ['', Validators.required]
        };
    }

    ngOnInit() {
        this.alfrescoLogin.addCustomValidationError('username', 'required', 'LOGIN.MESSAGES.USERNAME-REQUIRED');
        this.alfrescoLogin.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN', { minLength: this.customMinLength });
        this.alfrescoLogin.addCustomValidationError('password', 'required', 'LOGIN.MESSAGES.PASSWORD-REQUIRED');
    }

    onLogin($event) {
        this.router.navigate(['/home']);
    }

    onError($event) {
        this.logService.error($event);
    }

    toggleCSRF() {
        this.disableCsrf = !this.disableCsrf;
    }

    toggleFooter() {
        this.showFooter = !this.showFooter;
    }

    toggleRememberMe() {
        this.showRememberMe = !this.showRememberMe;
    }

    toggleSuccessRoute() {
        this.customSuccessRoute = !this.customSuccessRoute;
        if (!this.customSuccessRoute) {
            this.customSuccessRouteURI = null;
        }
    }

    toggleLogo() {
        this.customLogoImage = !this.customLogoImage;
        if (!this.customLogoImage) {
            this.customLogoImageURL = null;
        }
    }

    checkForm(event: any) {
        const values = event.values;
        this.logService.log(values);
    }
}
