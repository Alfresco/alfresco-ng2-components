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

import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LoginDialogComponentData } from './login-dialog-component-data.interface';
import { LoginDialogPanelComponent } from './login-dialog-panel.component';
@Component({
    selector: 'adf-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginDialogComponent {

    @ViewChild('adfLoginPanel')
    loginPanel: LoginDialogPanelComponent;

    buttonActionName = '';

    constructor(@Inject(MAT_DIALOG_DATA) public data: LoginDialogComponentData) {
        this.buttonActionName = data.actionName ? `LOGIN.DIALOG.${data.actionName.toUpperCase()}` : 'LOGIN.DIALOG.CHOOSE';
    }

    close() {
        this.data.logged.complete();
    }

    submitForm(): void {
        this.loginPanel.submitForm();
    }

    onLoginSuccess(event: any) {
        this.data.logged.next(event);
        this.close();
    }

    isFormValid() {
        return this.loginPanel ? this.loginPanel.isValid() : false;
    }
}
