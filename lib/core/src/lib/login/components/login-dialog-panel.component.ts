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

import { Component, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginSuccessEvent } from '../models/login-success.event';

@Component({
    selector: 'adf-login-dialog-panel',
    templateUrl: './login-dialog-panel.component.html',
    styleUrls: ['./login-dialog-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginDialogPanelComponent {
    /** Emitted when the login succeeds. */
    @Output()
    success = new EventEmitter<LoginSuccessEvent>();

    @ViewChild('adfLogin')
    login: LoginComponent;

    submitForm(): void {
        this.login.submit();
    }

    onLoginSuccess(event: LoginSuccessEvent) {
        this.success.emit(event);
    }

    isValid() {
        return this.login && this.login.form ? this.login.form.valid : false;
    }
}
