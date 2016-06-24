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
    beforeEachProviders
} from '@angular/core/testing';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AlfrescoLoginComponent } from './alfresco-login.component';
import { AuthenticationMock } from './../assets/authentication.service.mock';
import { TranslationMock } from './../assets/translation.service.mock';

describe('AlfrescoLogin', () => {

    beforeEachProviders(() => {
        return [
            { provide: AlfrescoAuthenticationService, useClass: AuthenticationMock },
            { provide: AlfrescoTranslationService, useClass: TranslationMock }
        ];
    });

    it('should render Login form with all the keys to be translated',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    fixture.detectChanges();

                    let element = fixture.nativeElement;

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
        }));

    it('should render user and password input fields with default values',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    expect(element.querySelector('form')).toBeDefined();
                    expect(element.querySelector('input[type="password"]')).toBeDefined();
                    expect(element.querySelector('input[type="text"]')).toBeDefined();
                    expect(element.querySelector('input[type="password"]').value).toEqual('');
                    expect(element.querySelector('input[type="text"]').value).toEqual('');
                });
        }));

    it('should render validation min-length error when the username is lower than 4 characters',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');

                    fixture.detectChanges();

                    usernameInput.value = '123';
                    usernameInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);

                    fixture.detectChanges();

                    expect(component.formError).toBeDefined();
                    expect(component.formError.username).toBeDefined();
                    expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
                    expect(compiled.querySelector('#username-error')).toBeDefined();
                    expect(compiled.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
                });
        }));

    it('should render validation required error when the username is empty',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');

                    fixture.detectChanges();

                    usernameInput.value = '';
                    usernameInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);

                    fixture.detectChanges();

                    expect(component.formError).toBeDefined();
                    expect(component.formError.username).toBeDefined();
                    expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-REQUIRED');
                    expect(compiled.querySelector('#username-error')).toBeDefined();
                    expect(compiled.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-REQUIRED');
                });
        }));

    it('should render validation required error when the password is empty',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    let compiled = fixture.debugElement.nativeElement;
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    passwordInput.value = '';
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);

                    fixture.detectChanges();

                    expect(component.formError).toBeDefined();
                    expect(component.formError.password).toBeDefined();
                    expect(component.formError.password).toEqual('LOGIN.MESSAGES.PASSWORD-REQUIRED');
                    expect(compiled.querySelector('#password-required')).toBeDefined();
                    expect(compiled.querySelector('#password-required').innerText).toEqual('LOGIN.MESSAGES.PASSWORD-REQUIRED');
                });
        }));

    it('should render no validation errors when the username and password are filled',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-username';
                    passwordInput.value = 'fake-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);

                    fixture.detectChanges();

                    expect(component.formError).toBeDefined();
                    expect(component.formError.username).toEqual('');
                    expect(component.formError.password).toEqual('');
                    expect(compiled.querySelector('#username-error')).toBeNull();
                    expect(compiled.querySelector('#password-required')).toBeNull();
                });
        }));

    it('should render the new values after user and password values are changed',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-change-username';
                    passwordInput.value = 'fake-change-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);

                    fixture.detectChanges();

                    expect(compiled.querySelector('input[type="text"]').value).toEqual('fake-change-username');
                    expect(compiled.querySelector('input[type="password"]').value).toEqual('fake-change-password');
                });
        }));

    it('should return success true after the login have succeeded ',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    expect(component.error).toBe(false);
                    expect(component.success).toBe(false);

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-username';
                    passwordInput.value = 'fake-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);
                    compiled.querySelector('button').click();

                    fixture.detectChanges();

                    expect(component.error).toBe(false);
                    expect(component.success).toBe(true);
                });
        }));

    it('should return error with a wrong username ',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    expect(component.error).toBe(false);
                    expect(component.success).toBe(false);

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-wrong-username';
                    passwordInput.value = 'fake-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);
                    compiled.querySelector('button').click();

                    fixture.detectChanges();

                    expect(component.error).toBe(true);
                    expect(component.success).toBe(false);
                    expect(compiled.querySelector('#login-error')).toBeDefined();
                    expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR');
                });
        }));

    it('should return error with a wrong password ',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    expect(component.success).toBe(false);
                    expect(component.error).toBe(false);

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-username';
                    passwordInput.value = 'fake-wrong-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);
                    compiled.querySelector('button').click();

                    fixture.detectChanges();

                    expect(component.error).toBe(true);
                    expect(component.success).toBe(false);
                    expect(compiled.querySelector('#login-error')).toBeDefined();
                    expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR');
                });
        }));

    it('should return error with a wrong username and password ',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    expect(component.success).toBe(false);
                    expect(component.error).toBe(false);

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-wrong-username';
                    passwordInput.value = 'fake-wrong-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);
                    compiled.querySelector('button').click();

                    fixture.detectChanges();

                    expect(component.error).toBe(true);
                    expect(component.success).toBe(false);
                    expect(compiled.querySelector('#login-error')).toBeDefined();
                    expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR');
                });
        }));


    it('should emit onSuccess event after the login has succeeded',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    spyOn(component.onSuccess, 'emit');

                    expect(component.error).toBe(false);
                    expect(component.success).toBe(false);

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-username';
                    passwordInput.value = 'fake-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);
                    compiled.querySelector('button').click();

                    fixture.detectChanges();

                    expect(component.error).toBe(false);
                    expect(component.success).toBe(true);
                    expect(compiled.querySelector('#login-success')).toBeDefined();
                    expect(compiled.querySelector('#login-success').innerHTML).toEqual('LOGIN.MESSAGES.LOGIN-SUCCESS');
                    expect(component.onSuccess.emit).toHaveBeenCalledWith({value: 'Login OK'});
                });
        }));

    it('should emit onError event after the login has failed',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.isErrorStyle = function () {
                        console.log('mock');
                    };

                    spyOn(component.onError, 'emit');

                    expect(component.success).toBe(false);
                    expect(component.error).toBe(false);

                    let compiled = fixture.debugElement.nativeElement;
                    let usernameInput = compiled.querySelector('#username');
                    let passwordInput = compiled.querySelector('#password');

                    fixture.detectChanges();

                    usernameInput.value = 'fake-username';
                    passwordInput.value = 'fake-wrong-password';
                    usernameInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));

                    fixture.detectChanges();

                    component.onValueChanged(null);
                    compiled.querySelector('button').click();

                    fixture.detectChanges();

                    expect(component.error).toBe(true);
                    expect(component.success).toBe(false);
                    expect(compiled.querySelector('#login-error')).toBeDefined();
                    expect(compiled.querySelector('#login-error').innerText).toEqual('LOGIN.MESSAGES.LOGIN-ERROR');
                    expect(component.onError.emit).toHaveBeenCalledWith({value: 'Login KO'});
                });
        }));

    it('should render the password in clear when the toggleShowPassword is call',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;

                    let compiled = fixture.debugElement.nativeElement;

                    fixture.detectChanges();

                    component.isPasswordShow = false;
                    component.toggleShowPassword();

                    fixture.detectChanges();

                    expect(component.isPasswordShow).toBe(true);
                    expect(compiled.querySelector('#password').type).toEqual('text');
                });
        }));

    it('should render the hide password when the password is in clear and the toggleShowPassword is call',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(AlfrescoLoginComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;

                    let compiled = fixture.debugElement.nativeElement;

                    fixture.detectChanges();

                    component.isPasswordShow = true;
                    component.toggleShowPassword();

                    fixture.detectChanges();

                    expect(component.isPasswordShow).toBe(false);
                    expect(compiled.querySelector('#password').type).toEqual('password');
                });
        }));
});

