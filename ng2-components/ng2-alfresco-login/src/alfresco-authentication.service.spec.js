System.register(['angular2/testing', 'angular2/core', 'angular2/http', 'angular2/http/testing', './alfresco-authentication.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, core_1, http_1, testing_2, alfresco_authentication_service_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (testing_2_1) {
                testing_2 = testing_2_1;
            },
            function (alfresco_authentication_service_1_1) {
                alfresco_authentication_service_1 = alfresco_authentication_service_1_1;
            }],
        execute: function() {
            testing_1.describe('AlfrescoAuthentication', function () {
                var injector, backend, mockBackend, httpService, service;
                beforeEach(function () {
                    injector = core_1.Injector.resolveAndCreate([
                        http_1.HTTP_PROVIDERS,
                        testing_2.MockBackend,
                        core_1.provide(http_1.XHRBackend, { useClass: testing_2.MockBackend }),
                        alfresco_authentication_service_1.AlfrescoAuthenticationService
                    ]);
                    var store = {};
                    spyOn(localStorage, 'getItem').and.callFake(function (key) {
                        return store[key];
                    });
                    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
                        return store[key] = value + '';
                    });
                    spyOn(localStorage, 'clear').and.callFake(function () {
                        store = {};
                    });
                    spyOn(localStorage, 'removeItem').and.callFake(function (key) {
                        delete store[key];
                    });
                    spyOn(localStorage, 'key').and.callFake(function (i) {
                        var keys = Object.keys(store);
                        return keys[i] || null;
                    });
                    mockBackend = injector.get(testing_2.MockBackend);
                    backend = injector.get(http_1.XHRBackend);
                    httpService = injector.get(http_1.Http);
                    service = injector.get(alfresco_authentication_service_1.AlfrescoAuthenticationService);
                });
                testing_1.it('should return true and token if the user is logged in', function () {
                    service.saveJwt('fake-local-token');
                    expect(service.isLoggedIn()).toBe(true);
                    expect(localStorage.getItem('token')).toBeDefined();
                    expect(localStorage.getItem('token')).toEqual('fake-local-token');
                });
                testing_1.it('should return false and token undefined if the user is not logged in', function () {
                    expect(service.isLoggedIn()).toEqual(false);
                    expect(localStorage.getItem('token')).not.toBeDefined();
                });
                testing_1.it('should return true and token on sign in', function () {
                    backend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ body: { data: { ticket: 'fake-post-token' } } })));
                    });
                    service.token = '';
                    service.login('POST', 'fakeUser', 'fakePassword')
                        .subscribe(function () {
                        expect(service.isLoggedIn()).toBe(true);
                        expect(service.token).toEqual('fake-post-token');
                        expect(localStorage.getItem('token')).toBeDefined();
                        expect(localStorage.getItem('token')).toEqual('fake-post-token');
                    });
                });
                testing_1.it('should return false and token undefined on log out', function () {
                    service.token = 'fake-token';
                    localStorage.setItem('token', 'fake-token');
                    service.logout()
                        .subscribe(function () {
                        expect(service.isLoggedIn()).toBe(false);
                        expect(service.token).not.toBeDefined();
                        expect(localStorage.getItem('token')).not.toBeDefined();
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=alfresco-authentication.service.spec.js.map