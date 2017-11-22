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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { AuthenticationService } from '../../services/authentication.service';

import { MaterialModule } from '../../material.module';
import { LoginErrorEvent } from '../models/login-error.event';
import { LoginSuccessEvent } from '../models/login-success.event';
import { AuthenticationMock } from './../../mock/authentication.service.mock';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let element: any;
    let authService: AuthenticationService;
    let router: Router;
    let userPreferences: UserPreferencesService;

    let usernameInput, passwordInput;

    const getLoginErrorElement = () => {
        return element.querySelector('#login-error');
    };

    const getLoginErrorMessage = () => {
        let errorMessage = undefined;
        let errorElement = element.querySelector('#login-error .login-error-message');

        if (errorElement) {
            return errorElement.innerText;
        }

        return errorMessage;
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MaterialModule
            ],
            declarations: [
                LoginComponent
            ],
            providers: [
                {provide: AuthenticationService, useClass: AuthenticationMock}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.showRememberMe = true;
        component.showLoginActions = true;

        usernameInput = element.querySelector('#username');
        passwordInput = element.querySelector('#password');

        authService = TestBed.get(AuthenticationService);
        router = TestBed.get(Router);
        userPreferences = TestBed.get(UserPreferencesService);

        fixture.detectChanges();
    });

    function loginWithCredentials(username, password, providers: string = 'ECM') {
        component.providers = providers;
        usernameInput.value = username;
        passwordInput.value = password;

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        element.querySelector('button').click();
        fixture.detectChanges();
    }

    it('should redirect to route on successful login', () => {
        const redirect = '/home';
        component.successRoute = redirect;
        spyOn(router, 'navigate');
        loginWithCredentials('fake-username', 'fake-password');
        expect(router.navigate).toHaveBeenCalledWith([redirect]);
    });

    it('should redirect to previous route state on successful login', () => {
        const redirect = '/home';
        component.successRoute = redirect;
        authService.setRedirectUrl('redirect-url');

        spyOn(router, 'navigate');

        loginWithCredentials('fake-username', 'fake-password');
        expect(router.navigate).toHaveBeenCalledWith(['redirect-url']);
    });

    it('should update user preferences upon login', async(() => {
        spyOn(userPreferences, 'setStoragePrefix').and.callThrough();

        component.success.subscribe(() => {
            expect(userPreferences.setStoragePrefix).toHaveBeenCalledWith('fake-username');
        });

        loginWithCredentials('fake-username', 'fake-password');
    }));

    describe('Login button', () => {

        const getLoginButton = () => element.querySelector('#login-button');
        const getLoginButtonText = () => element.querySelector('#login-button span.adf-login-button-label').innerText;

        it('should be rendered with the proper key by default', () => {
            expect(getLoginButton()).not.toBeNull();
            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.LOGIN');
        });

        it('should be changed to the "checking key" after a login attempt', () => {
            spyOn(authService, 'login').and.returnValue({
                subscribe: () => {
                }
            });

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
            expect(element.querySelector('#adf-login-remember input[type="checkbox"]').checked).toBe(true);
        });

        it('should set the component\'s rememberMe property properly', () => {
            element.querySelector('#adf-login-remember').dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(component.rememberMe).toBe(false);

            element.querySelector('#adf-login-remember').dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(component.rememberMe).toBe(true);
        });

        it('should be taken into consideration during login attempt', () => {
            spyOn(authService, 'login').and.returnValue({
                subscribe: () => {
                }
            });
            component.rememberMe = false;

            loginWithCredentials('fake-username', 'fake-password');

            expect(authService.login).toHaveBeenCalledWith('fake-username', 'fake-password', false);
        });
    });

    it('should render Login form with all the keys to be translated', () => {
        expect(element.querySelector('[for="username"]')).toBeDefined();
        expect(element.querySelector('[for="username"]').innerText).toEqual('LOGIN.LABEL.USERNAME');

        expect(element.querySelector('#adf-login-remember')).toBeDefined();
        expect(element.querySelector('#adf-login-remember').innerText).toContain('LOGIN.LABEL.REMEMBER');

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
            expect(element.querySelector('[data-automation-id="login-copyright"]').innerText).toEqual('\u00A9 2016 Alfresco Software, Inc. All Rights Reserved.');
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

    it('should not render a validation min-length as default', () => {
        usernameInput.value = '1';
        usernameInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toBe('');
        expect(element.querySelector('#username-error')).toBeNull();
    });

    it('should render validation min-length error when the username is just 1 character with a custom validation Validators.minLength(3)', () => {
        component.fieldsValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            password: ['', Validators.required]
        };
        component.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN');
        component.ngOnInit();
        fixture.detectChanges();

        usernameInput.value = '1';
        usernameInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.formError).toBeDefined();
        expect(component.formError.username).toBeDefined();
        expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
        expect(element.querySelector('#username-error')).toBeDefined();
        expect(element.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
    });

    it('should render validation min-length error when the username is lower than 3 characters with a custom validation Validators.minLength(3)', () => {
        component.fieldsValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            password: ['', Validators.required]
        };
        component.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN');
        component.ngOnInit();
        fixture.detectChanges();

        usernameInput.value = '12';
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

    it('should return success event after the login have succeeded', async(() => {
        component.providers = 'ECM';
        expect(component.isError).toBe(false);

        component.success.subscribe(() => {
            fixture.detectChanges();

            expect(component.isError).toBe(false);
        });

        loginWithCredentials('fake-username', 'fake-password');

    }));

    it('should return error with a wrong username', async(() => {
        component.providers = 'ECM';

        component.error.subscribe(() => {
            fixture.detectChanges();

            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
        });

        loginWithCredentials('fake-wrong-username', 'fake-password');
    }));

    it('should return error with a wrong password', async(() => {
        component.providers = 'ECM';

        component.error.subscribe(() => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
        });

        loginWithCredentials('fake-username', 'fake-wrong-password');
    }));

    it('should return error with a wrong username and password', async(() => {
        component.providers = 'ECM';

        component.error.subscribe(() => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
        });

        loginWithCredentials('fake-wrong-username', 'fake-wrong-password');
    }));

    it('should return CORS error when server CORS error occurs', async(() => {
        component.providers = 'ECM';

        component.error.subscribe(() => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin');
        });

        loginWithCredentials('fake-username-CORS-error', 'fake-password');
    }));

    it('should return CSRF error when server CSRF error occurs', async(() => {
        component.providers = 'ECM';

        component.error.subscribe(() => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CSRF');
        });

        loginWithCredentials('fake-username-CSRF-error', 'fake-password');
    }));

    it('should return ECOM read-oly error when error occurs', async(() => {
        component.providers = 'ECM';

        component.error.subscribe(() => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ECM-LICENSE');
        });

        loginWithCredentials('fake-username-ECM-access-error', 'fake-password');
    }));

    it('should emit success event after the login has succeeded', async(() => {
        component.providers = 'ECM';

        component.success.subscribe((event) => {
            fixture.detectChanges();

            expect(component.isError).toBe(false);
            expect(event).toEqual(
                new LoginSuccessEvent({type: 'type', ticket: 'ticket'}, 'fake-username', 'fake-password')
            );
        });

        loginWithCredentials('fake-username', 'fake-password');
    }));

    it('should emit error event after the login has failed', async(() => {
        component.providers = 'ECM';

        component.error.subscribe((error) => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
            expect(error).toEqual(
                new LoginErrorEvent('Fake server error')
            );
        });

        loginWithCredentials('fake-username', 'fake-wrong-password');
    }));

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

    it('should emit error event when the providers is undefined', async(() => {
        component.error.subscribe((error) => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS');
            expect(error).toEqual(new LoginErrorEvent('LOGIN.MESSAGES.LOGIN-ERROR-PROVIDERS'));
        });

        loginWithCredentials('fake-username', 'fake-password', null);
    }));
});
