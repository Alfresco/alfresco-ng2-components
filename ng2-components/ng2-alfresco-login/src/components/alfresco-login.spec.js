System.register(['angular2/platform/testing/browser', 'angular2/testing', 'angular2/core', './alfresco-login', 'rxjs/Rx', '../services/alfresco-authentication', 'angular2/src/router/router', 'angular2/router', 'angular2/src/mock/location_mock', 'ng2-translate/ng2-translate'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, testing_1, core_1, alfresco_login_1, Rx_1, alfresco_authentication_1, router_1, router_2, location_mock_1, ng2_translate_1;
    var AuthenticationMock, TranslationMock;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (alfresco_login_1_1) {
                alfresco_login_1 = alfresco_login_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (alfresco_authentication_1_1) {
                alfresco_authentication_1 = alfresco_authentication_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (router_2_1) {
                router_2 = router_2_1;
            },
            function (location_mock_1_1) {
                location_mock_1 = location_mock_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            }],
        execute: function() {
            AuthenticationMock = (function () {
                function AuthenticationMock() {
                    this.mockName = 'Mocked Service';
                }
                AuthenticationMock.prototype.login = function (method, username, password) {
                    if (username === 'fake-username' && password === 'fake-password') {
                        return Rx_1.Observable.of(true);
                    }
                    else {
                        return Rx_1.Observable.throw('Fake server error');
                    }
                };
                AuthenticationMock.prototype.getProviders = function () {
                    return [core_1.provide(alfresco_authentication_1.AlfrescoAuthenticationService, { useValue: this })];
                };
                return AuthenticationMock;
            }());
            TranslationMock = (function () {
                function TranslationMock() {
                    this.onLangChange = new core_1.EventEmitter();
                }
                TranslationMock.prototype.setDefaultLang = function () {
                };
                TranslationMock.prototype.use = function () {
                };
                TranslationMock.prototype.get = function (key, interpolateParams) {
                    if (!key) {
                        throw new Error('Parameter "key" required');
                    }
                    return Rx_1.Observable.of(key);
                };
                return TranslationMock;
            }());
            testing_1.describe('AlfrescoLogin', function () {
                var authService, location, router;
                testing_1.setBaseTestProviders(browser_1.TEST_BROWSER_PLATFORM_PROVIDERS, browser_1.TEST_BROWSER_APPLICATION_PROVIDERS);
                testing_1.beforeEachProviders(function () {
                    authService = new AuthenticationMock();
                    return [
                        authService.getProviders(),
                        router_2.RouteRegistry,
                        core_1.provide(router_2.Location, { useClass: location_mock_1.SpyLocation }),
                        core_1.provide(router_2.ROUTER_PRIMARY_COMPONENT, { useValue: alfresco_login_1.AlfrescoLoginComponent }),
                        core_1.provide(router_2.Router, { useClass: router_1.RootRouter }),
                        core_1.provide(ng2_translate_1.TranslateService, { useClass: TranslationMock })
                    ];
                });
                testing_1.beforeEach(testing_1.inject([router_2.Router, router_2.Location], function (r, l) {
                    router = r;
                    location = l;
                }));
                testing_1.it('should render `Login` form with all the keys to be translated', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        fixture.detectChanges();
                        var element = fixture.nativeElement;
                        testing_1.expect(element.querySelector('h2').innerText).toEqual('login');
                        testing_1.expect(element.querySelector('[for="username"]')).toBeDefined();
                        testing_1.expect(element.querySelector('[for="username"]').innerText).toEqual('username');
                        testing_1.expect(element.querySelector('#username-error').innerText).toEqual('input-required-message');
                        testing_1.expect(element.querySelector('[for="password"]')).toBeDefined();
                        testing_1.expect(element.querySelector('[for="password"]').innerText).toEqual('password');
                        testing_1.expect(element.querySelector('#password-required').innerText).toEqual('input-required-message');
                    });
                }));
                testing_1.it('should render user and password input fields with default values', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        var element = fixture.nativeElement;
                        testing_1.expect(element.querySelector('form')).toBeDefined();
                        testing_1.expect(element.querySelector('input[type="password"]')).toBeDefined();
                        testing_1.expect(element.querySelector('input[type="text"]')).toBeDefined();
                        testing_1.expect(element.querySelector('input[type="password"]').value).toEqual('');
                        testing_1.expect(element.querySelector('input[type="text"]').value).toEqual('');
                    });
                }));
                testing_1.it('should render min-length error when the username is lower than 4 characters', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'us';
                        fixture.detectChanges();
                        component.onValueChanged();
                        fixture.detectChanges();
                        testing_1.expect(component.formError).toBeDefined(true);
                        testing_1.expect(component.formError.username).toBeDefined(true);
                        testing_1.expect(component.formError.username).toEqual('input-min-message');
                        testing_1.expect(compiled.querySelector('#username-error').innerText).toEqual('input-min-message');
                    });
                }));
                testing_1.it('should render no errors when the username and password are correct', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'fake-user';
                        component.form.controls.password._value = 'fake-password';
                        fixture.detectChanges();
                        component.onValueChanged();
                        fixture.detectChanges();
                        testing_1.expect(component.formError).toBeDefined(true);
                        testing_1.expect(component.formError.username).toEqual('');
                        testing_1.expect(component.formError.password).toEqual('');
                        testing_1.expect(compiled.querySelector('#login-error')).toBeNull();
                    });
                }));
                testing_1.it('should render the new values after user and password values are changed', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'my username';
                        component.form.controls.password._value = 'my password';
                        fixture.detectChanges();
                        testing_1.expect(compiled.querySelector('input[type="password"]').value).toEqual('my password');
                        testing_1.expect(compiled.querySelector('input[type="text"]').value).toEqual('my username');
                    });
                }));
                testing_1.it('should navigate to Home route after the login have succeeded ', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        router.config([new router_2.Route({ path: '/home', name: 'Home', component: alfresco_login_1.AlfrescoLoginComponent })]);
                        spyOn(router, 'navigate').and.callThrough();
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'fake-username';
                        component.form.controls.password._value = 'fake-password';
                        fixture.detectChanges();
                        compiled.querySelector('button').click();
                        fixture.detectChanges();
                        testing_1.expect(component.error).toBe(false);
                        testing_1.expect(router.navigate).toHaveBeenCalledWith(['Home']);
                    });
                }));
                testing_1.it('should return error with a wrong username ', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        spyOn(router, 'navigate').and.callThrough();
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'fake-wrong-username';
                        component.form.controls.password._value = 'fake-password';
                        fixture.detectChanges();
                        compiled.querySelector('button').click();
                        fixture.detectChanges();
                        testing_1.expect(fixture.componentInstance.error).toBe(true);
                        testing_1.expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
                    });
                }));
                testing_1.it('should return error with a wrong password ', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        spyOn(router, 'navigate').and.callThrough();
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'fake-username';
                        component.form.controls.password._value = 'fake-wrong-password';
                        fixture.detectChanges();
                        compiled.querySelector('button').click();
                        fixture.detectChanges();
                        testing_1.expect(fixture.componentInstance.error).toBe(true);
                        testing_1.expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
                    });
                }));
                testing_1.it('should return error with a wrong username and password ', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        spyOn(router, 'navigate').and.callThrough();
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'fake-wrong-username';
                        component.form.controls.password._value = 'fake-wrong-password';
                        fixture.detectChanges();
                        compiled.querySelector('button').click();
                        fixture.detectChanges();
                        testing_1.expect(fixture.componentInstance.error).toBe(true);
                        testing_1.expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
                    });
                }));
                testing_1.it('should emit onSuccess event after the login has succeeded', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        spyOn(component.onSuccess, 'emit');
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'fake-username';
                        component.form.controls.password._value = 'fake-password';
                        fixture.detectChanges();
                        var nativeElement = fixture.nativeElement;
                        var button = nativeElement.querySelector('button');
                        button.dispatchEvent(new Event('click'));
                        fixture.detectChanges();
                        testing_1.expect(fixture.componentInstance.error).toBe(false);
                        testing_1.expect(compiled.querySelector('#login-success').innerHTML).toEqual('login-success-message');
                        testing_1.expect(component.onSuccess.emit).toHaveBeenCalledWith({ value: 'Login OK' });
                    });
                }));
                testing_1.it('should emit onError event after the login has failed', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                    return tcb
                        .createAsync(alfresco_login_1.AlfrescoLoginComponent)
                        .then(function (fixture) {
                        var component = fixture.componentInstance;
                        component.isErrorStyle = function () {
                        };
                        spyOn(component.onError, 'emit');
                        var compiled = fixture.debugElement.nativeElement;
                        component.form.controls.username._value = 'fake-wrong-username';
                        component.form.controls.password._value = 'fake-password';
                        fixture.detectChanges();
                        // trigger the click
                        var nativeElement = fixture.nativeElement;
                        var button = nativeElement.querySelector('button');
                        button.dispatchEvent(new Event('click'));
                        fixture.detectChanges();
                        testing_1.expect(fixture.componentInstance.error).toBe(true);
                        testing_1.expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
                        testing_1.expect(component.onError.emit).toHaveBeenCalledWith({ value: 'Login KO' });
                    });
                }));
            });
        }
    }
});
//# sourceMappingURL=alfresco-login.spec.js.map