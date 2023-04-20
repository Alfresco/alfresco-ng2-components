/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoginDialogPanelComponent } from './login-dialog-panel.component';
import { of } from 'rxjs';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('LoginDialogPanelComponent', () => {
    let component: LoginDialogPanelComponent;
    let fixture: ComponentFixture<LoginDialogPanelComponent>;
    let element: HTMLElement;
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let authService: AuthenticationService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LoginDialogPanelComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthenticationService);

        fixture.detectChanges();
        await fixture.whenStable();

        usernameInput = element.querySelector('#username');
        passwordInput = element.querySelector('#password');
    });

    afterEach(() => {
        fixture.destroy();
    });

    const loginWithCredentials = (username: string, password: string) => {
        usernameInput.value = username;
        passwordInput.value = password;

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        component.submitForm();
        fixture.detectChanges();
    };

    it('should be created', () => {
        expect(element.querySelector('#adf-login-form')).not.toBeNull();
        expect(element.querySelector('#adf-login-form')).toBeDefined();
    });

    it('should be able to login', (done) => {
        component.success.subscribe((event) => {
            expect(event.token.type).toBe('type');
            expect(event.token.ticket).toBe('ticket');
            done();
        });
        spyOn(authService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));
        loginWithCredentials('fake-username', 'fake-password');
    });

    it('should return false when the login form is empty', () => {
        usernameInput.value = '';
        passwordInput.value = '';
        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.isValid()).toBeFalsy();
    });

    it('should return true when the login form is empty', () => {
        usernameInput.value = 'fake-user';
        passwordInput.value = 'fake-psw';
        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.isValid()).toBeTruthy();
    });
});
