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

import { TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS } from 'angular2/platform/testing/browser';
import {
  it,
  describe,
  expect,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder,
  setBaseTestProviders
} from 'angular2/testing';
import { provide } from 'angular2/core';
import { Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, Route } from 'angular2/router';
import { RootRouter } from 'angular2/src/router/router';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import { AlfrescoTranslationService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { AlfrescoLoginComponent } from './alfresco-login.component';
import { AuthenticationMock } from './../assets/authentication.service.mock';
import { TranslationMock } from './../assets/translation.service.mock';

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
      provide(AlfrescoTranslationService, {useClass: TranslationMock})
    ];
  });

  beforeEach(inject([Router, Location], (r, l) => {
    router = r;
    location = l;
  }));

  it('should render `Login` form with all the keys to be translated',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          fixture.detectChanges();

          let element = fixture.nativeElement;

          expect(element.querySelector('h2').innerText).toEqual('login');

          expect(element.querySelector('[for="username"]')).toBeDefined();
          expect(element.querySelector('[for="username"]').innerText).toEqual('username');
          expect(element.querySelector('#username-error').innerText).toEqual('input-required-message');

          expect(element.querySelector('[for="password"]')).toBeDefined();
          expect(element.querySelector('[for="password"]').innerText).toEqual('password');
          expect(element.querySelector('#password-required').innerText).toEqual('input-required-message');

        });
    }));

  it('should render user and password input fields with default values',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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

  it('should render min-length error when the username is lower than 4 characters',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'us';

          fixture.detectChanges();

          component.onValueChanged();

          fixture.detectChanges();

          expect(component.formError).toBeDefined(true);
          expect(component.formError.username).toBeDefined(true);
          expect(component.formError.username).toEqual('input-min-message');
          expect(compiled.querySelector('#username-error').innerText).toEqual('input-min-message');
        });
    }));

  it('should render no errors when the username and password are correct',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-user';
          component.form.controls.password._value = 'fake-password';

          fixture.detectChanges();

          component.onValueChanged();

          fixture.detectChanges();

          expect(component.formError).toBeDefined(true);
          expect(component.formError.username).toEqual('');
          expect(component.formError.password).toEqual('');
          expect(compiled.querySelector('#login-error')).toBeNull();
        });
    }));

  it('should render the new values after user and password values are changed',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          let compiled = fixture.debugElement.nativeElement;
          component.form.controls.username._value = 'my username';
          component.form.controls.password._value = 'my password';

          fixture.detectChanges();
          component.onValueChanged();

          expect(compiled.querySelector('input[type="password"]').value).toEqual('my password');
          expect(compiled.querySelector('input[type="text"]').value).toEqual('my username');
        });
    }));

  it('should navigate to Home route after the login have succeeded ',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          router.config([new Route({path: '/home', name: 'Home', component: AlfrescoLoginComponent})]);
          spyOn(router, 'navigate').and.callThrough();
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-username';
          component.form.controls.password._value = 'fake-password';

          fixture.detectChanges();
          component.onValueChanged();

          compiled.querySelector('button').click();

          fixture.detectChanges();

          expect(component.error).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['Home']);
        });
    }));

  it('should return error with a wrong username ',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          spyOn(router, 'navigate').and.callThrough();
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-wrong-username';
          component.form.controls.password._value = 'fake-password';

          fixture.detectChanges();
          component.onValueChanged();

          compiled.querySelector('button').click();

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(true);
          expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
        });
    }));

  it('should return error with a wrong password ',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          spyOn(router, 'navigate').and.callThrough();
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-username';
          component.form.controls.password._value = 'fake-wrong-password';

          fixture.detectChanges();
          component.onValueChanged();

          compiled.querySelector('button').click();

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(true);
          expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
        });
    }));

  it('should return error with a wrong username and password ',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          spyOn(router, 'navigate').and.callThrough();
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-wrong-username';
          component.form.controls.password._value = 'fake-wrong-password';

          fixture.detectChanges();
          component.onValueChanged();

          compiled.querySelector('button').click();

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(true);
          expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
        });
    }));


  it('should emit onSuccess event after the login has succeeded',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          spyOn(component.onSuccess, 'emit');

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-username';
          component.form.controls.password._value = 'fake-password';

          fixture.detectChanges();
          component.onValueChanged();

          let nativeElement = fixture.nativeElement;
          let button = nativeElement.querySelector('button');
          button.dispatchEvent(new Event('click'));

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(false);
          expect(compiled.querySelector('#login-success').innerHTML).toEqual('login-success-message');
          expect(component.onSuccess.emit).toHaveBeenCalledWith({value: 'Login OK'});
        });
    }));

  it('should emit onError event after the login has failed',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
          let component = fixture.componentInstance;
          component.isErrorStyle = function () {
            console.log('mock');
          };

          spyOn(component.onError, 'emit');

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-wrong-username';
          component.form.controls.password._value = 'fake-password';

          fixture.detectChanges();
          component.onValueChanged();

          // trigger the click
          let nativeElement = fixture.nativeElement;
          let button = nativeElement.querySelector('button');
          button.dispatchEvent(new Event('click'));

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(true);
          expect(compiled.querySelector('#login-error').innerText).toEqual('login-error-message');
          expect(component.onError.emit).toHaveBeenCalledWith({value: 'Login KO'});
        });
    }));

});
