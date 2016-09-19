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

import {
    it,
    describe,
    expect,
    inject,
    beforeEach,
    beforeEachProviders
} from '@angular/core/testing';
import { PLATFORM_PIPES } from '@angular/core';
import { AlfrescoAuthenticationService, AlfrescoSettingsService, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AlfrescoLoginComponent } from './alfresco-login.component';
import { AuthenticationMock } from './../assets/authentication.service.mock';
import { TranslationMock } from './../assets/translation.service.mock';

describe('AlfrescoLogin', () => {

    let componentFixture;
    let component;

    beforeEachProviders(() => {
        return [
            { provide: PLATFORM_PIPES, useValue: AlfrescoPipeTranslate, multi: true },
            { provide: AlfrescoAuthenticationService, useClass: AuthenticationMock },
            AlfrescoSettingsService,
            { provide: AlfrescoTranslationService, useClass: TranslationMock }
        ];
    });

    beforeEach(
        inject(
            [TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb
                    .createAsync(AlfrescoLoginComponent)
                    .then(fixture => {
                        componentFixture = fixture;
                        component = fixture.componentInstance;
                    });
            }
        )
    );

    it('should render Login form with all the keys to be translated', () => {
        componentFixture.detectChanges();

        let element = componentFixture.nativeElement;

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
        let element = componentFixture.nativeElement;
        expect(element.querySelector('form')).toBeDefined();
        expect(element.querySelector('input[type="password"]')).toBeDefined();
        expect(element.querySelector('input[type="text"]')).toBeDefined();
        expect(element.querySelector('input[type="password"]').value).toEqual('');
        expect(element.querySelector('input[type="text"]').value).toEqual('');
    });

    it('should render validation min-length error when the username is just 1 character', () => {
        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');

        componentFixture.detectChanges();

        usernameInput.value = '1';
        usernameInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
        expect(compiled.querySelector('#username-error')).toBeDefined();
        expect(compiled.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
    });

    it('should render validation min-length error when the username is lower than 4 characters', () => {
        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');

        componentFixture.detectChanges();

        usernameInput.value = '123';
        usernameInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
        expect(compiled.querySelector('#username-error')).toBeDefined();
        expect(compiled.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
    });

    it('should render validation required error when the username is empty and dirty', () => {
        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');

        componentFixture.detectChanges();

        usernameInput.value = '';
        component.form.controls.username.markAsDirty();
        usernameInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-REQUIRED');
        expect(compiled.querySelector('#username-error')).toBeDefined();
        expect(compiled.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-REQUIRED');
    });

    it('should render validation required error when the password is empty and dirty', () => {
        let compiled = componentFixture.debugElement.nativeElement;
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        passwordInput.value = '';
        component.form.controls.password.markAsDirty();
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.password).toBeDefined();
        expect(component.formError.password).toEqual('LOGIN.MESSAGES.PASSWORD-REQUIRED');
        expect(compiled.querySelector('#password-required')).toBeDefined();
        expect(compiled.querySelector('#password-required').innerText).toEqual('LOGIN.MESSAGES.PASSWORD-REQUIRED');
    });

    it('should render no validation errors when the username and password are filled', () => {
        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        component.form.controls.username.markAsDirty();
        component.form.controls.password.markAsDirty();

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toEqual('');
        expect(component.formError.password).toEqual('');
        expect(compiled.querySelector('#username-error')).toBeNull();
        expect(compiled.querySelector('#password-required')).toBeNull();
    });

    it('should render the new values after user and password values are changed', () => {
        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-change-username';
        passwordInput.value = 'fake-change-password';

        component.form.controls.username.markAsDirty();
        component.form.controls.password.markAsDirty();

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        expect(compiled.querySelector('input[type="text"]').value).toEqual('fake-change-username');
        expect(compiled.querySelector('input[type="password"]').value).toEqual('fake-change-password');
    });

    it('should return success true after the login have succeeded', () => {
        component.providers = 'ECM';
        expect(component.error).toBe(false);
        expect(component.success).toBe(false);

        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        compiled.querySelector('button').click();

        componentFixture.detectChanges();

        expect(component.error).toBe(false);
        expect(component.success).toBe(true);
    });

    it('should return error with a wrong username', () => {
        component.providers = 'ECM';
        expect(component.error).toBe(false);
        expect(component.success).toBe(false);

        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-wrong-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        compiled.querySelector('button').click();

        componentFixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(compiled.querySelector('#login-error')).toBeDefined();
        expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
    });

    it('should return error with a wrong password', () => {
        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-wrong-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        compiled.querySelector('button').click();

        componentFixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(compiled.querySelector('#login-error')).toBeDefined();
        expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
    });

    it('should return error with a wrong username and password', () => {
        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-wrong-username';
        passwordInput.value = 'fake-wrong-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        compiled.querySelector('button').click();

        componentFixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(compiled.querySelector('#login-error')).toBeDefined();
        expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
    });

    it('should emit onSuccess event after the login has succeeded', () => {
        spyOn(component.onSuccess, 'emit');
        component.providers = 'ECM';
        expect(component.error).toBe(false);
        expect(component.success).toBe(false);

        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        compiled.querySelector('button').click();

        componentFixture.detectChanges();

        expect(component.error).toBe(false);
        expect(component.success).toBe(true);
        expect(compiled.querySelector('#login-success')).toBeDefined();
        expect(compiled.querySelector('#login-success').innerHTML).toEqual('LOGIN.MESSAGES.LOGIN-SUCCESS');
        expect(component.onSuccess.emit).toHaveBeenCalledWith({ token: true, username: 'fake-username', password: 'fake-password' });
    });

    it('should emit onError event after the login has failed', () => {
        spyOn(component.onError, 'emit');

        component.providers = 'ECM';
        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-wrong-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        compiled.querySelector('button').click();

        componentFixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(compiled.querySelector('#login-error')).toBeDefined();
        expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
        expect(component.onError.emit).toHaveBeenCalledWith('Fake server error');
    });

    it('should render the password in clear when the toggleShowPassword is call', () => {
        let compiled = componentFixture.debugElement.nativeElement;

        componentFixture.detectChanges();

        component.isPasswordShow = false;
        component.toggleShowPassword();

        componentFixture.detectChanges();

        expect(component.isPasswordShow).toBe(true);
        expect(compiled.querySelector('#password').type).toEqual('text');
    });

    it('should render the hide password when the password is in clear and the toggleShowPassword is call', () => {
        let compiled = componentFixture.debugElement.nativeElement;

        componentFixture.detectChanges();

        component.isPasswordShow = true;
        component.toggleShowPassword();

        componentFixture.detectChanges();

        expect(component.isPasswordShow).toBe(false);
        expect(compiled.querySelector('#password').type).toEqual('password');
    });

    it('should emit onError event when the providers is undefined', () => {
        spyOn(component.onError, 'emit');

        expect(component.success).toBe(false);
        expect(component.error).toBe(false);

        let compiled = componentFixture.debugElement.nativeElement;
        let usernameInput = compiled.querySelector('#username');
        let passwordInput = compiled.querySelector('#password');

        componentFixture.detectChanges();

        usernameInput.value = 'fake-username';
        passwordInput.value = 'fake-password';

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));

        componentFixture.detectChanges();

        compiled.querySelector('button').click();

        componentFixture.detectChanges();

        expect(component.error).toBe(true);
        expect(component.success).toBe(false);
        expect(compiled.querySelector('#login-error')).toBeDefined();
        expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS');
        expect(component.onError.emit).toHaveBeenCalledWith('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS');
    });
});

