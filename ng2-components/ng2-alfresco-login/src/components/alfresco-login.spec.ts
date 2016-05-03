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
import {Component, provide, Injector} from 'angular2/core';
import {AlfrescoLoginComponent} from './alfresco-login';
import {Observable} from 'rxjs/Rx';
import {AlfrescoAuthenticationService} from '../services/alfresco-authentication';
import { RootRouter } from 'angular2/src/router/router';
import { Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, Route } from 'angular2/router';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import {dispatchEvent} from 'angular2/src/testing/utils';
import {TranslateService} from 'ng2-translate/ng2-translate';

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
    setDefaultLang() {

    }

    use() {

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

    it('should render `Login` form with input fields user and password with default value', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
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


    it('should render the new values after change the user and password values', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                let compiled = fixture.debugElement.nativeElement;

                let password = compiled.querySelector('input[type="password"]');
                let username = compiled.querySelector('input[type="text"]');

                password.value = 'my password';
                username.value = 'my username';

                expect(compiled.querySelector('input[type="password"]').value).toEqual('my password');
                expect(compiled.querySelector('input[type="text"]').value).toEqual('my username');
            });
    }));

    it('should navigate to Home route after the login OK ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                router.config([new Route({path: '/home', name: 'Home', component: AlfrescoLoginComponent})]);
                spyOn(router, 'navigate').and.callThrough();
                let compiled = fixture.debugElement.nativeElement;

                let password = compiled.querySelector('input[type="password"]');
                let username = compiled.querySelector('input[type="text"]');

                fixture.debugElement.componentInstance.form._value.username = 'fake-username';
                fixture.debugElement.componentInstance.form._value.password = 'fake-password';

                compiled.querySelector('button').click();

                expect(fixture.componentInstance.error).toBe(false);
                expect(router.navigate).toHaveBeenCalledWith(['Home']);
            });
    }));

    it('should return error with a wrong username ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                spyOn(router, 'navigate').and.callThrough();
                let compiled = fixture.debugElement.nativeElement;

                let password = compiled.querySelector('input[type="password"]');
                let username = compiled.querySelector('input[type="text"]');

                fixture.debugElement.componentInstance.form._value.username = 'fake-wrong-username';
                fixture.debugElement.componentInstance.form._value.password = 'fake-password';

                compiled.querySelector('button').click();

                expect(fixture.componentInstance.error).toBe(true);
            });
    }));

    it('should return error with a wrong password ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                spyOn(router, 'navigate').and.callThrough();
                let compiled = fixture.debugElement.nativeElement;

                let password = compiled.querySelector('input[type="password"]');
                let username = compiled.querySelector('input[type="text"]');

                fixture.debugElement.componentInstance.form._value.username = 'fake-username';
                fixture.debugElement.componentInstance.form._value.password = 'fake-wrong-password';

                compiled.querySelector('button').click();

                expect(fixture.componentInstance.error).toBe(true);
            });
    }));

    it('should return error with a wrong username and password ', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoLoginComponent)
            .then((fixture) => {
                spyOn(router, 'navigate').and.callThrough();
                let compiled = fixture.debugElement.nativeElement;

                let password = compiled.querySelector('input[type="password"]');
                let username = compiled.querySelector('input[type="text"]');

                fixture.debugElement.componentInstance.form._value.username = 'fake-wrong-username';
                fixture.debugElement.componentInstance.form._value.password = 'fake-wrong-password';

                compiled.querySelector('button').click();

                expect(fixture.componentInstance.error).toBe(true);
            });
    }));

});

