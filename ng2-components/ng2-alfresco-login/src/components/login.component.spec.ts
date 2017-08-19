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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdCheckboxModule, MdInputModule } from '@angular/material';
import { AlfrescoAuthenticationService, CoreModule } from 'ng2-alfresco-core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AuthenticationMock } from './../assets/authentication.service.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { LoginComponent } from './login.component';

describe('AlfrescoLogin', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let debug: DebugElement;
    let element: any;

    let usernameInput, passwordInput;

    const getLoginErrorElement = () => element.querySelector('#login-error');
    const getLoginErrorMessage = () => element.querySelector('#login-error .login-error-message').innerText;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MdInputModule,
                MdCheckboxModule,
                CoreModule.forRoot()
            ],
            declarations: [LoginComponent],
            providers: [
                {provide: AlfrescoAuthenticationService, useClass: AuthenticationMock},
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.showRememberMe = true;
        component.showLoginActions = true;

        usernameInput = element.querySelector('#username');
        passwordInput = element.querySelector('#password');

        fixture.detectChanges();
    });

    function loginWithCredentials(username, password) {
        component.providers = 'ECM';
        usernameInput.value = username;
        passwordInput.value = password;

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        element.querySelector('button').click();
        fixture.detectChanges();
    }

    describe('Login button', () => {

        const getLoginButton = () => element.querySelector('#login-button');
        const getLoginButtonText = () => element.querySelector('#login-button span.adf-login-button-label').innerText;

        it('should be rendered with the proper key by default', () => {
            expect(getLoginButton()).not.toBeNull();
            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.LOGIN');
        });

        it('should be changed to the "checking key" after a login attempt', () => {
            const authService = TestBed.get(AlfrescoAuthenticationService);
            spyOn(authService, 'login').and.returnValue({ subscribe: () => { } });

            loginWithCredentials('fake-username', 'fake-password');

            expect(element.querySelector('#checking-spinner')).not.toBeNull();
            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.CHECKING');
        });

        it('should be changed back to the default after a failed login attempt', () => {
            loginWithCredentials('fake-wrong-username', 'fake-wrong-password');

            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.LOGIN');
        });

        it('should be changed to the "welcome key" after a successful login attempt', () => {
            loginWithCredentials('fake-username', 'fake-password');

            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.WELCOME');
        });
    });

    describe('Remember me', () => {

        it('should be checked by default', () => {
            expect(element.querySelector('.rememberme-cb input[type="checkbox"]').checked).toBe(true);
        });

        it('should set the component\'s rememberMe property properly', () => {
            element.querySelector('.rememberme-cb').dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(component.rememberMe).toBe(false);

            element.querySelector('.rememberme-cb').dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(component.rememberMe).toBe(true);
        });

        it('should be taken into consideration during login attempt', () => {
            const authService = TestBed.get(AlfrescoAuthenticationService);
            spyOn(authService, 'login').and.returnValue({ subscribe: () => { } });
            component.rememberMe = false;

            loginWithCredentials('fake-username', 'fake-password');

            expect(authService.login).toHaveBeenCalledWith('fake-username', 'fake-password', false);
        });
    });

    it('should render Login form with all the keys to be translated', () => {
        expect(element.querySelector('[for="username"]')).toBeDefined();
        expect(element.querySelector('[for="username"]').innerText).toEqual('LOGIN.LABEL.USERNAME');

        expect(element.querySelector('#login-remember')).toBeDefined();
        expect(element.querySelector('#login-remember').innerText).toContain('LOGIN.LABEL.REMEMBER');

        expect(element.querySelector('[for="password"]')).toBeDefined();
        expect(element.querySelector('[for="password"]').innerText).toEqual('LOGIN.LABEL.PASSWORD');

        expect(element.querySelector('#adf-login-action-left')).toBeDefined();
        expect(element.querySelector('#adf-login-action-left').innerText).toEqual('LOGIN.ACTION.HELP');

        expect(element.querySelector('#adf-login-action-right')).toBeDefined();
        expect(element.querySelector('#adf-login-action-right').innerText).toEqual('LOGIN.ACTION.REGISTER');
    });

    describe('Copyright text', () => {

        it('should render the default copyright text', () => {
            expect(element.querySelector('[data-automation-id="login-copyright"]')).toBeDefined();
            expect(element.querySelector('[data-automation-id="login-copyright"]').innerText).toEqual('© 2016 Alfresco Software, Inc. All Rights Reserved.');
        });

        it('should render the customised copyright text', () => {
            component.copyrightText = 'customised';
            fixture.detectChanges();

            expect(element.querySelector('[data-automation-id="login-copyright"]')).toBeDefined();
            expect(element.querySelector('[data-automation-id="login-copyright"]').innerText).toEqual('customised');
        });
    });

    it('should render user and password input fields with default values', () => {
        expect(element.querySelector('form')).toBeDefined();
        expect(element.querySelector('input[type="password"]')).toBeDefined();
        expect(element.querySelector('input[type="text"]')).toBeDefined();
        expect(element.querySelector('input[type="password"]').value).toEqual('');
        expect(element.querySelector('input[type="text"]').value).toEqual('');
    });

    it('should hide remember me if showRememberMe is false', () => {
        component.showRememberMe = false;

        fixture.detectChanges();

        expect(element.querySelector('#login-remember')).toBe(null);
    });

    it('should hide login actions if showLoginActions is false', () => {
        component.showLoginActions = false;

        fixture.detectChanges();

        expect(element.querySelector('#login-action-help')).toBe(null);
        expect(element.querySelector('#login-action-register')).toBe(null);
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin');
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CSRF');
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ECM-LICENSE');
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
        expect(element.querySelector('#login-success').innerHTML).toContain('LOGIN.MESSAGES.LOGIN-SUCCESS');
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
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
        expect(getLoginErrorElement()).toBeDefined();
        expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS');
        expect(component.onError.emit).toHaveBeenCalledWith('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS');
    });
});
