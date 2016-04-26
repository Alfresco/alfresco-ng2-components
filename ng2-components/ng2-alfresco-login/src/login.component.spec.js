System.register(['angular2/platform/testing/browser', 'angular2/testing', 'angular2/core', './login.component', 'rxjs/Rx', './authentication.service', 'angular2/src/router/router', 'angular2/router', 'angular2/src/mock/location_mock'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, testing_1, core_1, login_component_1, Rx_1, authentication_service_1, router_1, router_2, location_mock_1;
    var AuthenticationMock;
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
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (authentication_service_1_1) {
                authentication_service_1 = authentication_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (router_2_1) {
                router_2 = router_2_1;
            },
            function (location_mock_1_1) {
                location_mock_1 = location_mock_1_1;
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
                    return [core_1.provide(authentication_service_1.Authentication, { useValue: this })];
                };
                return AuthenticationMock;
            }());
            testing_1.describe('Login', function () {
                var authService, location, router;
                testing_1.setBaseTestProviders(browser_1.TEST_BROWSER_PLATFORM_PROVIDERS, browser_1.TEST_BROWSER_APPLICATION_PROVIDERS);
                testing_1.beforeEachProviders(function () {
                    authService = new AuthenticationMock();
                    return [
                        authService.getProviders(),
                        router_2.RouteRegistry,
                        core_1.provide(router_2.Location, { useClass: location_mock_1.SpyLocation }),
                        core_1.provide(router_2.ROUTER_PRIMARY_COMPONENT, { useValue: login_component_1.Login }),
                        core_1.provide(router_2.Router, { useClass: router_1.RootRouter })
                    ];
                });
                testing_1.beforeEach(testing_1.inject([router_2.Router, router_2.Location], function (r, l) {
                    router = r;
                    location = l;
                }));
                testing_1.it('should render `Login` header', testing_1.injectAsync([testing_1.TestComponentBuilder, authentication_service_1.Authentication, router_2.Router], function (tcb, authService, router) {
                    return tcb
                        .createAsync(login_component_1.Login)
                        .then(function (fixture) {
                        var element = fixture.nativeElement;
                        testing_1.expect(element.querySelector('h2').innerText).toBe('Login');
                        testing_1.expect(element.querySelector('form')).toBeDefined();
                    });
                }));
                testing_1.it('should render `Login` form with input fields user and password with default value', testing_1.injectAsync([testing_1.TestComponentBuilder, authentication_service_1.Authentication, router_2.Router], function (tcb, authService, router) {
                    return tcb
                        .createAsync(login_component_1.Login)
                        .then(function (fixture) {
                        var element = fixture.nativeElement;
                        testing_1.expect(element.querySelector('form')).toBeDefined();
                        testing_1.expect(element.querySelector('input[type="password"]')).toBeDefined();
                        testing_1.expect(element.querySelector('input[type="text"]')).toBeDefined();
                        testing_1.expect(element.querySelector('input[type="password"]').value).toEqual('');
                        testing_1.expect(element.querySelector('input[type="text"]').value).toEqual('');
                    });
                }));
                testing_1.it('should render the new values after change the user and password values', testing_1.injectAsync([testing_1.TestComponentBuilder, authentication_service_1.Authentication, router_2.Router], function (tcb, authService, router) {
                    return tcb
                        .createAsync(login_component_1.Login)
                        .then(function (fixture) {
                        var compiled = fixture.debugElement.nativeElement;
                        var password = compiled.querySelector('input[type="password"]');
                        var username = compiled.querySelector('input[type="text"]');
                        password.value = 'my password';
                        username.value = 'my username';
                        testing_1.expect(compiled.querySelector('input[type="password"]').value).toEqual('my password');
                        testing_1.expect(compiled.querySelector('input[type="text"]').value).toEqual('my username');
                    });
                }));
                testing_1.it('should navigate to Home route after the login OK ', testing_1.injectAsync([testing_1.TestComponentBuilder, authentication_service_1.Authentication, router_2.Router], function (tcb, authService, router) {
                    return tcb
                        .createAsync(login_component_1.Login)
                        .then(function (fixture) {
                        router.config([new router_2.Route({ path: '/home', name: 'Home', component: login_component_1.Login })]);
                        spyOn(router, 'navigate').and.callThrough();
                        var compiled = fixture.debugElement.nativeElement;
                        var password = compiled.querySelector('input[type="password"]');
                        var username = compiled.querySelector('input[type="text"]');
                        fixture.debugElement.componentInstance.form._value.username = 'fake-username';
                        fixture.debugElement.componentInstance.form._value.password = 'fake-password';
                        compiled.querySelector('button').click();
                        testing_1.expect(fixture.componentInstance.error).toBe(false);
                        testing_1.expect(router.navigate).toHaveBeenCalledWith(['Home']);
                    });
                }));
                testing_1.it('should return error with a wrong username ', testing_1.injectAsync([testing_1.TestComponentBuilder, authentication_service_1.Authentication, router_2.Router], function (tcb, authService, router) {
                    return tcb
                        .createAsync(login_component_1.Login)
                        .then(function (fixture) {
                        spyOn(router, 'navigate').and.callThrough();
                        var compiled = fixture.debugElement.nativeElement;
                        var password = compiled.querySelector('input[type="password"]');
                        var username = compiled.querySelector('input[type="text"]');
                        fixture.debugElement.componentInstance.form._value.username = 'fake-wrong-username';
                        fixture.debugElement.componentInstance.form._value.password = 'fake-password';
                        compiled.querySelector('button').click();
                        testing_1.expect(fixture.componentInstance.error).toBe(true);
                    });
                }));
                testing_1.it('should return error with a wrong password ', testing_1.injectAsync([testing_1.TestComponentBuilder, authentication_service_1.Authentication, router_2.Router], function (tcb, authService, router) {
                    return tcb
                        .createAsync(login_component_1.Login)
                        .then(function (fixture) {
                        spyOn(router, 'navigate').and.callThrough();
                        var compiled = fixture.debugElement.nativeElement;
                        var password = compiled.querySelector('input[type="password"]');
                        var username = compiled.querySelector('input[type="text"]');
                        fixture.debugElement.componentInstance.form._value.username = 'fake-username';
                        fixture.debugElement.componentInstance.form._value.password = 'fake-wrong-password';
                        compiled.querySelector('button').click();
                        testing_1.expect(fixture.componentInstance.error).toBe(true);
                    });
                }));
                testing_1.it('should return error with a wrong username and password ', testing_1.injectAsync([testing_1.TestComponentBuilder, authentication_service_1.Authentication, router_2.Router], function (tcb, authService, router) {
                    return tcb
                        .createAsync(login_component_1.Login)
                        .then(function (fixture) {
                        spyOn(router, 'navigate').and.callThrough();
                        var compiled = fixture.debugElement.nativeElement;
                        var password = compiled.querySelector('input[type="password"]');
                        var username = compiled.querySelector('input[type="text"]');
                        fixture.debugElement.componentInstance.form._value.username = 'fake-wrong-username';
                        fixture.debugElement.componentInstance.form._value.password = 'fake-wrong-password';
                        compiled.querySelector('button').click();
                        testing_1.expect(fixture.componentInstance.error).toBe(true);
                    });
                }));
            });
        }
    }
});
//# sourceMappingURL=login.component.spec.js.map