/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    AppConfigService,
    AuthenticationService,
    BasicAlfrescoAuthService,
    CoreTestingModule,
    LoginErrorEvent,
    LoginSuccessEvent,
    UserPreferencesService
} from '@alfresco/adf-core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { OidcAuthenticationService } from '../../../auth/oidc/oidc-authentication.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let element: any;
    let authService: AuthenticationService;
    let router: Router;
    let userPreferences: UserPreferencesService;
    let appConfigService: AppConfigService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;

    let usernameInput;
    let passwordInput;

    const getLoginErrorElement = () => element.querySelector('#login-error');

    const getLoginErrorMessage = () => {
        const errorMessage = undefined;
        const errorElement = element.querySelector('#login-error .adf-login-error-message');

        if (errorElement) {
            return errorElement.innerText;
        }

        return errorMessage;
    };

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule],
            providers: [
                {
                    provide: OidcAuthenticationService,
                    useValue: {
                        ssoLogin: () => {
                            /* noop */
                        },
                        isPublicUrl: () => false,
                        hasValidIdToken: () => false,
                        isLoggedIn: () => false
                    }
                }
            ]
        });
        fixture = TestBed.createComponent(LoginComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.showRememberMe = true;
        component.showLoginActions = true;

        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
        authService = TestBed.inject(AuthenticationService);
        router = TestBed.inject(Router);
        userPreferences = TestBed.inject(UserPreferencesService);
        appConfigService = TestBed.inject(AppConfigService);

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            usernameInput = element.querySelector('#username');
            passwordInput = element.querySelector('#password');
        });
    }));

    afterEach(() => {
        fixture.destroy();
    });

    const loginWithCredentials = (username: string, password: string) => {
        usernameInput.value = username;
        passwordInput.value = password;

        usernameInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        element.querySelector('.adf-login-button').click();
        fixture.detectChanges();
    };

    it('should be autocomplete off', () => {
        expect(element.querySelector('#adf-login-form').getAttribute('autocomplete')).toBe('off');
    });

    it('should redirect to route on successful login', () => {
        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));
        const redirect = '/home';
        component.successRoute = redirect;
        spyOn(router, 'navigate');
        loginWithCredentials('fake-username', 'fake-password');
        expect(router.navigate).toHaveBeenCalledWith([redirect]);
    });

    it('should use the input successRoute as redirect if defined', () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(router, 'navigate');

        component.successRoute = 'input-route';
        appConfigService.config = {};

        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledWith(['input-route']);
    });

    it('should use the successRoute route from app.config if the input successRoute is NOT defined', () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(router, 'navigate');

        component.successRoute = undefined;
        appConfigService.config.successRoute = 'route-app-config';

        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledWith(['route-app-config']);
    });

    it('should use the successRoute route from app.config if both successRoute are defined', () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(router, 'navigate');

        component.successRoute = 'input-route';
        appConfigService.config.successRoute = 'route-app-config';

        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledWith(['route-app-config']);
    });

    it('should redirect to previous route state on successful login', fakeAsync(() => {
        appConfigService.config = {};
        appConfigService.config.providers = 'ECM';

        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));
        const redirect = '/home';
        component.successRoute = redirect;
        basicAlfrescoAuthService.setRedirect({ provider: 'ECM', url: 'some-route' });

        spyOn(router, 'navigateByUrl');

        loginWithCredentials('fake-username', 'fake-password');
        expect(router.navigateByUrl).toHaveBeenCalledWith('some-route');
    }));

    it('should update user preferences upon login', async () => {
        spyOn(userPreferences, 'setStoragePrefix').and.callThrough();
        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));

        component.success.subscribe(() => {
            expect(userPreferences.setStoragePrefix).toHaveBeenCalledWith('fake-username');
        });

        loginWithCredentials('fake-username', 'fake-password');
        fixture.detectChanges();
        await fixture.whenStable();
    });

    describe('Login button', () => {
        const getLoginButton = () => element.querySelector('#login-button');
        const getLoginButtonText = () => element.querySelector('#login-button span.adf-login-button-label').innerText;

        it('should be rendered with the proper key by default', () => {
            expect(getLoginButton()).not.toBeNull();
            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.LOGIN');
        });

        it('should be changed to the "checking key" after a login attempt', () => {
            spyOn(component, 'performLogin').and.stub();

            loginWithCredentials('fake-username', 'fake-password');

            expect(element.querySelector('#checking-spinner')).not.toBeNull();
            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.CHECKING');
        });

        it('should be changed back to the default after a failed login attempt', () => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(throwError('Fake server error'));
            loginWithCredentials('fake-wrong-username', 'fake-wrong-password');

            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.LOGIN');
        });

        it('should be changed to the "welcome key" after a successful login attempt', () => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));
            loginWithCredentials('fake-username', 'fake-password');

            expect(getLoginButtonText()).toEqual('LOGIN.BUTTON.WELCOME');
        });

        it('Should enable login button after entering a valid username and a password', () => {
            usernameInput.value = 'username';
            component.form.controls.username.markAsDirty();
            usernameInput.dispatchEvent(new Event('input'));

            passwordInput.value = 'password';
            component.form.controls.password.markAsDirty();
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const loginButton = getLoginButton();
            expect(loginButton.disabled).toBe(false);
        });

        it('Should disable login button when username is not valid', () => {
            usernameInput.value = 'u';
            component.form.controls.username.markAsDirty();
            usernameInput.dispatchEvent(new Event('input'));

            passwordInput.value = 'password';
            component.form.controls.password.markAsDirty();
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const loginButton = getLoginButton();
            expect(loginButton.disabled).toBe(true);
        });

        it('Should disable login button when password is not valid', () => {
            usernameInput.value = 'username';
            component.form.controls.username.markAsDirty();
            usernameInput.dispatchEvent(new Event('input'));

            passwordInput.value = '';
            component.form.controls.password.markAsDirty();
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const loginButton = getLoginButton();
            expect(loginButton.disabled).toBe(true);
        });

        it('Should disable login button when username and password are empty', () => {
            usernameInput.value = '';
            component.form.controls.username.markAsDirty();
            usernameInput.dispatchEvent(new Event('input'));

            passwordInput.value = '';
            component.form.controls.password.markAsDirty();
            passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const loginButton = getLoginButton();
            expect(loginButton.disabled).toBe(true);
        });
    });

    describe('Remember me', () => {
        it('should be checked by default', () => {
            expect(element.querySelector('#adf-login-remember input[type="checkbox"]').checked).toBe(true);
        });

        it('should set the component rememberMe property properly', () => {
            element.querySelector('#adf-login-remember').dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(component.rememberMe).toBe(false);

            element.querySelector('#adf-login-remember').dispatchEvent(new Event('change'));
            fixture.detectChanges();

            expect(component.rememberMe).toBe(true);
        });

        it('should be taken into consideration during login attempt', fakeAsync(() => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));
            component.rememberMe = false;

            loginWithCredentials('fake-username', 'fake-password');

            expect(basicAlfrescoAuthService.login).toHaveBeenCalledWith('fake-username', 'fake-password', false);
        }));
    });

    it('should render Login form with all the keys to be translated', () => {
        expect(element.querySelector('[data-automation-id="username"]')).toBeDefined();
        expect(element.querySelectorAll('.adf-login-form-input-label')[0].innerText).toEqual('LOGIN.LABEL.USERNAME');

        expect(element.querySelector('#adf-login-remember')).toBeDefined();
        expect(element.querySelector('#adf-login-remember').innerText).toContain('LOGIN.LABEL.REMEMBER');

        expect(element.querySelector('[data-automation-id="password"]')).toBeDefined();
        expect(element.querySelectorAll('.adf-login-form-input-label')[1].innerText).toContain('LOGIN.LABEL.PASSWORD');

        expect(element.querySelector('#adf-login-action-left')).toBeDefined();
        expect(element.querySelector('#adf-login-action-left').innerText).toEqual('LOGIN.ACTION.HELP');

        expect(element.querySelector('#adf-login-action-right')).toBeDefined();
        expect(element.querySelector('#adf-login-action-right').innerText).toEqual('LOGIN.ACTION.REGISTER');
    });

    describe('Copyright text', () => {
        it('should render the default copyright text', () => {
            expect(element.querySelector('[data-automation-id="login-copyright"]')).toBeDefined();
            expect(element.querySelector('[data-automation-id="login-copyright"]').innerText).toEqual(
                '\u00A9 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.'
            );
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

    describe('Error', () => {
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

        it('should throw a validation min-length error by default when the username is not at least 2 characters long', () => {
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

        it('should return error with a wrong username', (done) => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(throwError(new Error()));

            component.error.subscribe(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(getLoginErrorElement()).toBeDefined();
                    expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
                    done();
                });
            });

            loginWithCredentials('fake-wrong-username', 'fake-password');
        });

        it('should return error with a wrong password', (done) => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(throwError(new Error()));

            component.error.subscribe(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.isError).toBe(true);
                    expect(getLoginErrorElement()).toBeDefined();
                    expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
                    done();
                });
            });

            loginWithCredentials('fake-username', 'fake-wrong-password');
        });

        it('should return error with a wrong username and password', (done) => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(throwError(new Error()));

            component.error.subscribe(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.isError).toBe(true);
                    expect(getLoginErrorElement()).toBeDefined();
                    expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
                    done();
                });
            });

            loginWithCredentials('fake-wrong-username', 'fake-wrong-password');
        });

        it('should return CORS error when server CORS error occurs', (done) => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(
                throwError({
                    error: {
                        crossDomain: true,
                        message: 'ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin'
                    }
                })
            );

            component.error.subscribe(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.isError).toBe(true);
                    expect(getLoginErrorElement()).toBeDefined();
                    expect(getLoginErrorMessage()).toEqual('ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin');
                    done();
                });
            });

            loginWithCredentials('fake-username-CORS-error', 'fake-password');
        });

        it('should return CSRF error when server CSRF error occurs', fakeAsync(() => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(throwError({ message: 'ERROR: Invalid CSRF-token', status: 403 }));

            component.error.subscribe(() => {
                fixture.detectChanges();

                expect(component.isError).toBe(true);
                expect(getLoginErrorElement()).toBeDefined();
                expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CSRF');
            });

            loginWithCredentials('fake-username-CSRF-error', 'fake-password');
        }));

        it('should return ECM read-only error when error occurs', fakeAsync(() => {
            spyOn(basicAlfrescoAuthService, 'login').and.returnValue(
                throwError({
                    message: 'ERROR: 00170728 Access Denied.  The system is currently in read-only mode',
                    status: 403
                })
            );

            component.error.subscribe(() => {
                fixture.detectChanges();

                expect(component.isError).toBe(true);
                expect(getLoginErrorElement()).toBeDefined();
                expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ECM-LICENSE');
            });

            loginWithCredentials('fake-username-ECM-access-error', 'fake-password');
        }));
    });

    it('should trim the username value', () => {
        usernameInput.value = 'username ';
        component.form.controls.password.markAsDirty();
        usernameInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        expect(usernameInput.value).toEqual('username');
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

    it('should return success event after the login have succeeded', (done) => {
        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));

        expect(component.isError).toBe(false);

        component.success.subscribe(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.isError).toBe(false);
                done();
            });
        });

        loginWithCredentials('fake-username', 'fake-password');
    });

    it('should emit success event after the login has succeeded and discard password', fakeAsync(() => {
        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(of({ type: 'type', ticket: 'ticket' }));

        component.success.subscribe((event) => {
            fixture.detectChanges();

            expect(component.isError).toBe(false);
            expect(event).toEqual(new LoginSuccessEvent({ type: 'type', ticket: 'ticket' }, 'fake-username', null));
        });

        loginWithCredentials('fake-username', 'fake-password');
    }));

    it('should emit error event after the login has failed', fakeAsync(() => {
        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(throwError('Fake server error'));

        component.error.subscribe((error) => {
            fixture.detectChanges();

            expect(component.isError).toBe(true);
            expect(getLoginErrorElement()).toBeDefined();
            expect(getLoginErrorMessage()).toEqual('LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS');
            expect(error).toEqual(new LoginErrorEvent('Fake server error'));
        });

        loginWithCredentials('fake-username', 'fake-wrong-password');
    }));

    it('should show password as text when show password is true', () => {
        component.isPasswordShow = false;
        component.toggleShowPassword(new MouseEvent('click'));

        fixture.detectChanges();

        expect(component.isPasswordShow).toBe(true);
        expect(element.querySelector('#password').type).toEqual('text');
    });

    it('should password be hidden when show password is false', () => {
        component.isPasswordShow = true;
        component.toggleShowPassword(new MouseEvent('click'));

        fixture.detectChanges();

        expect(component.isPasswordShow).toBe(false);
        expect(element.querySelector('#password').type).toEqual('password');
    });

    it('should emit only the username and not the password as part of the executeSubmit', fakeAsync(() => {
        spyOn(basicAlfrescoAuthService, 'login').and.returnValue(EMPTY);

        component.executeSubmit.subscribe((res) => {
            fixture.detectChanges();

            expect(res.values.controls.username).toBeDefined('username mandatory');
            expect(res.values.controls.username.value).toEqual('fake-username');
            expect(res.values.controls.password).toBeUndefined('The password not not be part of the emitted values');
        });

        loginWithCredentials('fake-username', 'fake-password');
    }));

    describe('SSO ', () => {
        describe('implicitFlow ', () => {
            beforeEach(() => {
                appConfigService.config.oauth2 = { implicitFlow: true, silentLogin: false };
                appConfigService.load();
            });

            it('should not show login username and password if SSO implicit flow is active', fakeAsync(() => {
                spyOn(authService, 'isOauth').and.returnValue(true);
                component.ngOnInit();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('#username')).toBeNull();
                    expect(element.querySelector('#password')).toBeNull();
                });
            }));

            it('should not render the implicitFlow button in case silentLogin is enabled', fakeAsync(() => {
                spyOn(authService, 'isOauth').and.returnValue(true);
                appConfigService.config.oauth2 = { implicitFlow: true, silentLogin: true };

                spyOn(component, 'redirectToSSOLogin').and.stub();

                component.ngOnInit();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(component.ssoLogin).toBe(false);
                    expect(component.redirectToSSOLogin).toHaveBeenCalled();
                });
            }));

            it('should render the implicitFlow button in case silentLogin is disabled', fakeAsync(() => {
                spyOn(authService, 'isOauth').and.returnValue(true);

                component.ngOnInit();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(component.ssoLogin).toBe(true);
                });
            }));

            it('should not show the login base auth button', fakeAsync(() => {
                spyOn(authService, 'isOauth').and.returnValue(true);

                component.ngOnInit();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('#login-button')).toBeNull();
                });
            }));

            it('should show the login SSO button', fakeAsync(() => {
                spyOn(authService, 'isOauth').and.returnValue(true);

                component.ngOnInit();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(element.querySelector('#login-button-sso')).toBeDefined();
                });
            }));
        });
    });
});
