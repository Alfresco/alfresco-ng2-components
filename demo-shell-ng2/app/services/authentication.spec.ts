import {
    it,
    inject,
    injectAsync,
    describe,
    beforeEachProviders,
    TestComponentBuilder
} from 'angular2/testing';

import {provide, Injector} from 'angular2/core';
import {Http, HTTP_PROVIDERS, XHRBackend, Response, ResponseOptions} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

import {Authentication} from "app/services/authentication";

describe('Authentication', () => {
    let injector,
        backend,
        mockBackend,
        httpService,
        service;

    beforeEach(() => {
        injector = Injector.resolveAndCreate([
            HTTP_PROVIDERS,
            // this next value should NOT be provided, but when it is,
            // we lose the ability to correlate the backend calls
            // to the test Is there a way to detect this has been
            // done and reject it out-of-hand?
            MockBackend,  // this is clearly wrong...
            provide(XHRBackend, {useClass: MockBackend}),
            Authentication
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

        mockBackend = injector.get(MockBackend);
        backend = injector.get(XHRBackend);
        httpService = injector.get(Http);
        service = injector.get(Authentication);
    });

    it('should return true and token if the user is logged in', () => {
        service.saveJwt('fake-local-token');
        expect(service.isLoggedIn()).toBe(true);
        expect(localStorage.getItem('token')).toBeDefined();
        expect(localStorage.getItem('token')).toEqual('fake-local-token');
    });

    it('should return false and token undefined if the user is not logged in', () => {
        expect(service.isLoggedIn()).toEqual(false);
        expect(localStorage.getItem('token')).not.toBeDefined();

    });

    it('should return true and token on sign in', () => {
        backend.connections.subscribe(connection => {
            connection.mockRespond(new Response(new ResponseOptions({body: { data: { ticket: 'fake-post-token'}}})));
        });
        service.token = '';
        service.login('POST', 'fakeUser', 'fakePassword')
            .subscribe( () => {
                expect(service.isLoggedIn()).toBe(true);
                expect(service.token).toEqual('fake-post-token');
                expect(localStorage.getItem('token')).toBeDefined();
                expect(localStorage.getItem('token')).toEqual('fake-post-token');
            }
        );
    });

    it('should return false and token undefined on log out', () => {
        service.token = 'fake-token';
        localStorage.setItem('token','fake-token');
        service.logout()
            .subscribe( () => {
                expect(service.isLoggedIn()).toBe(false);
                expect(service.token).not.toBeDefined();
                expect(localStorage.getItem('token')).not.toBeDefined();
            }
        );
    });

});

