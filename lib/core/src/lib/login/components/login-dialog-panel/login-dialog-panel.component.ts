/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoginFooterDirective } from '../../directives/login-footer.directive';
import { LoginHeaderDirective } from '../../directives/login-header.directive';
import { LoginSuccessEvent } from '../../models/login-success.event';
import { LoginComponent } from '../login/login.component';

@Component({
    selector: 'adf-login-dialog-panel',
    templateUrl: './login-dialog-panel.component.html',
    styleUrls: ['./login-dialog-panel.component.scss'],
    imports: [LoginComponent, LoginHeaderDirective, LoginFooterDirective],
    encapsulation: ViewEncapsulation.None
})
export class LoginDialogPanelComponent {
    /** Emitted when the login succeeds. */
    @Output()
    success = new EventEmitter<LoginSuccessEvent>();

    @ViewChild('adfLogin', { static: true })
    login: LoginComponent;

    submitForm(): void {
        this.login.submit();
    }

    onLoginSuccess(event: LoginSuccessEvent) {
        this.success.emit(event);
    }

    isValid() {
        return this.login?.form ? this.login.form.valid : false;
    }
}
