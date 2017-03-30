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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement }    from '@angular/core';
import { AlfrescoAuthenticationService, CoreModule } from 'ng2-alfresco-core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AlfrescoLoginComponent } from './alfresco-login.component';
import { AuthenticationMock } from './../assets/authentication.service.mock';
import { TranslationMock } from './../assets/translation.service.mock';

describe('AlfrescoLogin', () => {
    let component: any;
    let fixture: ComponentFixture<AlfrescoLoginComponent>;
    let debug: DebugElement;
    let element: any;

    let usernameInput, passwordInput;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [AlfrescoLoginComponent],
            providers: [
                {provide: AlfrescoAuthenticationService, useClass: AuthenticationMock},
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlfrescoLoginComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        usernameInput = element.querySelector('#username');
        passwordInput = element.querySelector('#password');

        fixture.detectChanges();
    });

    it('should render Login form with all the keys to be translated', () => {
        expect(element.querySelector('[for="username"]')).toBeDefined();
        expect(element.querySelector('[for="username"]').innerText).toEqual('LOGIN.LABEL.USERNAME');

        expect(element.querySelector('[for="password"]')).toBeDefined();
        expect(element.querySelector('[for="password"]').innerText).toEqual('LOGIN.LABEL.PASSWORD');

        expect(element.querySelector('#login-button')).toBeDefined();
        expect(element.querySelector('#login-button').innerText).toEqual('LOGIN.BUTTON.LOGIN');

        expect(element.querySelector('#login-remember')).toBeDefined();
        expect(element.querySelector('#login-remember').innerText).toEqual('LOGIN.LABEL.REMEMBER');

        expect(element.querySelector('#login-action-help')).toBeDefined();
        expect(element.querySelector('#login-action-help').innerText).toEqual('LOGIN.ACTION.HELP');

        expect(element.querySelector('#login-action-register')).toBeDefined();
        expect(element.querySelector('#login-action-register').innerText).toEqual('LOGIN.ACTION.REGISTER');
    });

    it('should render user and password input fields with default values', () => {
        expect(element.querySelector('form')).toBeDefined();
        expect(element.querySelector('input[type="password"]')).toBeDefined();
        expect(element.querySelector('input[type="text"]')).toBeDefined();
        expect(element.querySelector('input[type="password"]').value).toEqual('');
        expect(element.querySelector('input[type="text"]').value).toEqual('');
    });

    it('should render validation min-length error when the username is just 1 character', () => {
        usernameInput.value = '1';
        usernameInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
        expect(element.querySelector('#username-error')).toBeDefined();
        expect(element.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
    });

    it('should render validation min-length error when the username is lower than 2 characters', () => {
        usernameInput.value = '1';
        usernameInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
        expect(element.querySelector('#username-error')).toBeDefined();
        expect(element.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
    });

    it('should render validation required error when the username is empty and dirty', () => {
        usernameInput.value = '';
        component.form.controls.username.markAsDirty();
        usernameInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-REQUIRED');
        expect(element.querySelector('#username-error')).toBeDefined();
        expect(element.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-REQUIRED');
    });

    it('should render validation required error when the password is empty and dirty', () => {
        passwordInput.value = '';
        component.form.controls.password.markAsDirty();
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.password).toBeDefined();
        expect(component.formError.password).toEqual('LOGIN.MESSAGES.PASSWORD-REQUIRED');
        expect(element.querySelector('#password-required')).toBeDefined();
        expect(element.querySelector('#password-required').innerText).toEqual('LOGIN.MESSAGES.PASSWORD-REQUIRED');
    });

    it('should trim the username value', () => {
        usernameInput.value = 'username ';
        component.form.controls.password.markAsDirty();
        usernameInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(usernameInput.value).toEqual('username');
    });

    it('should render no validation errors when the username and password are filled', () => {
        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        component.form.controls.username.markAsDirty();
        component.form.controls.password.markAsDirty();

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toEqual('');
        expect(component.formError.password).toEqual('');
        expect(element.querySelector('#username-error')).toBeNull();
        expect(element.querySelector('#password-required')).toBeNull();
    });

    it('should render the new values after user and password values are changed', () => {
        usernameInput.value = 'fake-change-username';
        passwordInput.value = 'fake-change-password';

        component.form.controls.username.markAsDirty();
        component.form.controls.password.markAsDirty();

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(element.querySelector('input[type="text"]').value).toEqual('fake-change-username');
        expect(element.querySelector('input[type="password"]').value).toEqual('fake-change-password');
    });

    it('should return success true after the login have succeeded', () => {
        component.providers = 'ECM';
        expect(component.error).toBe(false);
        expect(component.success).toBe(false);

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(false);
        expect(component.success).toBe(true);
    });

    it('should return error with a wrong username', () => {
        component.providers = 'ECM';
        expect(component.error).toBe(false);
        expect(component.success).toBe(false);

        usernameInput.value = 'fake-wrong-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
    });

    it('should return error with a wrong password', () => {
        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-wrong-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
    });

    it('should return error with a wrong username and password', () => {
        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        usernameInput.value = 'fake-wrong-username';
        passwordInput.value = 'fake-wrong-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
    });

    it('should return CORS error when server CORS error occurs', () => {
        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        usernameInput.value = 'fake-username-CORS-error';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin');
    });

    it('should return CSRF error when server CSRF error occurs', () => {
        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        usernameInput.value = 'fake-username-CSRF-error';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CSRF');
    });

    it('should return ECOM read-oly error when error occurs', () => {
        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        usernameInput.value = 'fake-username-ECM-access-error';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ECM-LICENSE');
    });

    it('should emit onSuccess event after the login has succeeded', () => {
        spyOn(component.onSuccess, 'emit');
        component.providers = 'ECM';

        expect(component.error).toBe(false);
        expect(component.success).toBe(false);

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(false);
        expect(component.success).toBe(true);
        expect(element.querySelector('#login-success')).toBeDefined();
        expect(element.querySelector('#login-success').innerHTML).toEqual('LOGIN.MESSAGES.LOGIN-SUCCESS');
        expect(component.onSuccess.emit).toHaveBeenCalledWith({
            token: true,
            username: 'fake-username',
            password: 'fake-password'
        });
    });

    it('should emit onError event after the login has failed', () => {
        spyOn(component.onError, 'emit');

        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-wrong-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
        expect(component.onError.emit).toHaveBeenCalledWith('Fake server error');
    });

    it('should render the password in clear when the toggleShowPassword is call', () => {
        component.isPasswordShow = false;
        component.toggleShowPassword();

        fixture.detectChanges();

        expect(component.isPasswordShow).toBe(true);
        expect(element.querySelector('#password').type).toEqual('text');
    });

    it('should render the hide password when the password is in clear and the toggleShowPassword is call', () => {
        component.isPasswordShow = true;
        component.toggleShowPassword();

        fixture.detectChanges();

        expect(component.isPasswordShow).toBe(false);
        expect(element.querySelector('#password').type).toEqual('password');
    });

    it('should emit onError event when the providers is undefined', () => {
        spyOn(component.onError, 'emit');

        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        element.querySelector('button').click();

        fixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(element.querySelector('#login-error')).toBeDefined();
        expect(element.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS');
        expect(component.onError.emit).toHaveBeenCalledWith('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS');
    });
});
