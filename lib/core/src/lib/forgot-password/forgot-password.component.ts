/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeopleApi, ClientBody } from '@alfresco/js-api';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'adf-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    private peopleApi: PeopleApi;
    forgotPasswordForm: FormGroup;
    isSaveInProgress: boolean = false;
    passwordResetStatus: boolean = false;

    constructor(
        private apiService: AlfrescoApiService,
        private formBuilder: FormBuilder,
        private router: Router) { }

    ngOnInit(): void {
        this.passwordResetStatus = false;
        this.forgotPasswordForm = this.formBuilder.group({
            userName: ['', [Validators.required]]
        });
    }

    get peopleApiInstance() {
        return (
            this.peopleApi ||
            (this.peopleApi = new PeopleApi(this.apiService.getInstance()))
        );
    }

    sendInstructions() {
        this.isSaveInProgress = true;
        this.passwordResetStatus = true;

        this.peopleApiInstance.requestPasswordReset(
            this.forgotPasswordForm.controls.userName.value, { 'client': 'workspace' } as ClientBody);
    }

    isButtonDisabled(): boolean {
        return this.forgotPasswordForm.invalid || this.isSaveInProgress;
    }

    close() {
        this.router.navigate(['./login']);
      }
}
