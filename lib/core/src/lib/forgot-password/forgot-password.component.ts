/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeopleApi, ClientBody } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
    selector: 'app-forgot-password',
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
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
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
            this.forgotPasswordForm.controls.userName.value, { 'client': 'adw' } as ClientBody);
    }

    isButtonDisabled(): boolean {
        return this.forgotPasswordForm.invalid || this.isSaveInProgress;
    }
}
