/**
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
import {TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS} from 'angular2/platform/testing/browser';
import {it, describe, expect, inject, injectAsync, beforeEach, beforeEachProviders, TestComponentBuilder, setBaseTestProviders} from 'angular2/testing';
import {Component, provide, Injector, EventEmitter} from 'angular2/core';
import {AlfrescoLoginComponent} from './alfresco-login';
import {Observable} from 'rxjs/Rx';
import {AlfrescoAuthenticationService} from '../services/alfresco-authentication';
import { RootRouter } from 'angular2/src/router/router';
import { Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, Route } from 'angular2/router';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import {dispatchEvent} from 'angular2/src/testing/utils';
import {TranslateService, LangChangeEvent} from 'ng2-translate/ng2-translate';

class AuthenticationMock {
    public mockName:string = 'Mocked Service';

    login(method:string, username:string, password:string) {
        if (username === 'fake-username' && password === 'fake-password') {
            return Observable.of(true);
        } else {
            return Observable.throw('Fake server error');
        }
    }

    getProviders():Array<any> {
        return [provide(AlfrescoAuthenticationService, {useValue: this})];
    }
}

class TranslationMock {

    public onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();

    setDefaultLang() {

    }

    use() {
    }

    public get(key: string|Array<string>, interpolateParams?: Object): Observable<string|any> {
        if(!key) {
            throw new Error('Parameter "key" required');
        }
        return Observable.of(key);
    }
}

describe('AlfrescoLogin', () => {
    let authService, location, router;

    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    beforeEachProviders(() => {
        authService = new AuthenticationMock();

        return [
            authService.getProviders(),
            RouteRegistry,
            provide(Location, {useClass: SpyLocation}),
            provide(ROUTER_PRIMARY_COMPONENT, {useValue: AlfrescoLoginComponent}),
            provide(Router, {useClass: RootRouter}),
            provide(TranslateService, {useClass: TranslationMock})
        ];
    });

    beforeEach(inject([Router, Location], (r, l) => {
        router = r;
        location = l;
    }));

    it('should render `Login` form with all the keys to be translated', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };

                fixture.detectChanges();

                let element = fixture.nativeElement;

                expect(element.querySelector('h2').innerText).toEqual('login');

                expect(element.querySelector('[for="username"]')).toBeDefined();
                expect(element.querySelector('[for="username"]').innerText).toEqual('username');
                expect(element.querySelector('#username-required').innerText).toEqual('input-required-message');

                expect(element.querySelector('[for="password"]')).toBeDefined();
                expect(element.querySelector('[for="password"]').innerText).toEqual('password');
                expect(element.querySelector('#password-required').innerText).toEqual('input-required-message');

            });
    }));

    it('should render user and password input fields with default values', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
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


    it('should render the new values after user and password values are changed', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };

                fixture.detectChanges();

                let compiled = fixture.debugElement.nativeElement;

                let password = compiled.querySelector('input[type="password"]');
                let username = compiled.querySelector('input[type="text"]');

                password.value = 'my password';
                username.value = 'my username';

                expect(compiled.querySelector('input[type="password"]').value).toEqual('my password');
                expect(compiled.querySelector('input[type="text"]').value).toEqual('my username');
            });
    }));

    it('should navigate to Home route after the login have succeeded ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                router.config([new Route({path: '/home', name: 'Home', component: AlfrescoLoginComponent})]);
                spyOn(router, 'navigate').and.callThrough();
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };

                let compiled = fixture.debugElement.nativeElement;

                component.form._value.username = 'fake-username';
                component.form._value.password = 'fake-password';

                compiled.querySelector('button').click();

                fixture.detectChanges();

                expect(component.error).toBe(false);
                expect(router.navigate).toHaveBeenCalledWith(['Home']);
            });
    }));

    it('should return error with a wrong username ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                spyOn(router, 'navigate').and.callThrough();
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };
                let compiled = fixture.debugElement.nativeElement;

                component.form._value.username = 'fake-wrong-username';
                component.form._value.password = 'fake-password';

                compiled.querySelector('button').click();

                fixture.detectChanges();

                expect(fixture.componentInstance.error).toBe(true);
            });
    }));

    it('should return error with a wrong password ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                spyOn(router, 'navigate').and.callThrough();
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };
                let compiled = fixture.debugElement.nativeElement;

                component.form._value.username = 'fake-username';
                component.form._value.password = 'fake-wrong-password';

                compiled.querySelector('button').click();

                fixture.detectChanges();

                expect(fixture.componentInstance.error).toBe(true);
            });
    }));

    it('should return error with a wrong username and password ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                spyOn(router, 'navigate').and.callThrough();
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };

                let compiled = fixture.debugElement.nativeElement;

                component.form._value.username = 'fake-wrong-username';
                component.form._value.password = 'fake-wrong-password';

                compiled.querySelector('button').click();

                fixture.detectChanges();

                expect(fixture.componentInstance.error).toBe(true);
            });
    }));


    it('should emit onSuccess event after the login has succeeded', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };
                spyOn(component.onSuccess, 'emit');

                component.form._value.username = 'fake-username';
                component.form._value.password = 'fake-password';

                // trigger the click
                let nativeElement = fixture.nativeElement;
                let button = nativeElement.querySelector('button');
                button.dispatchEvent(new Event('click'));

                fixture.detectChanges();

                expect(component.onSuccess.emit).toHaveBeenCalledWith({value: 'Login OK'});
            });
    }));

    it('should emit onError event after the login has failed', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                //pipes.config();
                let component = fixture.componentInstance;
                component.isErrorStyle = function () {

                };
                spyOn(component.onError, 'emit');

                component.form._value.username = 'fake-wrong-username';
                component.form._value.password = 'fake-password';

                // trigger the click
                let nativeElement = fixture.nativeElement;
                let button = nativeElement.querySelector('button');
                button.dispatchEvent(new Event('click'));

                fixture.detectChanges();

                expect(component.onError.emit).toHaveBeenCalledWith({value: 'Login KO'});
            });
    }));

});

