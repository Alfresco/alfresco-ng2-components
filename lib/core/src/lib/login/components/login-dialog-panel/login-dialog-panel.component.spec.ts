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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OidcAuthenticationService } from '../../../auth/oidc/oidc-authentication.service';
import { LoginDialogPanelComponent } from './login-dialog-panel.component';
import { BasicAlfrescoAuthService } from '../../../auth/basic-auth/basic-alfresco-auth.service';
import { provideCoreAuthTesting, UnitTestingUtils } from '../../../testing';

describe('LoginDialogPanelComponent', () => {
    let component: LoginDialogPanelComponent;
    let fixture: ComponentFixture<LoginDialogPanelComponent>;
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [LoginDialogPanelComponent],
            providers: [provideCoreAuthTesting(), { provide: OidcAuthenticationService, useValue: {} }]
        });
        fixture = TestBed.createComponent(LoginDialogPanelComponent);
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);

        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        fixture.detectChanges();
        await fixture.whenStable();

        usernameInput = testingUtils.getByCSS('#username').nativeElement;
        passwordInput = testingUtils.getByCSS('#password').nativeElement;
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
        expect(testingUtils.getByCSS('#adf-login-form')).not.toBeNull();
        expect(testingUtils.getByCSS('#adf-login-form')).toBeDefined();
    });

    it('should be able to login', (done) => {
        component.success.subscribe((event) => {
            expect(event.token.type).toBe('type');
            expect(event.token.ticket).toBe('ticket');
            done();
        });
        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));
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
