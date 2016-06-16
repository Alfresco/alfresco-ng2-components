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
    TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';
import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders,
  setBaseTestProviders
} from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { provide } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AlfrescoLoginComponent } from './alfresco-login.component';
import { AuthenticationMock } from './../assets/authentication.service.mock';
import { TranslationMock } from './../assets/translation.service.mock';

describe('AlfrescoLogin', () => {
  let authService;

  setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

  beforeEachProviders(() => {
    authService = new AuthenticationMock();

    return [
      authService.getProviders(),
      provide(AlfrescoTranslationService, {useClass: TranslationMock})
    ];
  });

  it('should render `Login` form with all the keys to be translated',
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
          expect(element.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-REQUIRED');

          expect(element.querySelector('[for="password"]')).toBeDefined();
          expect(element.querySelector('[for="password"]').innerText).toEqual('LOGIN.LABEL.PASSWORD');
          expect(element.querySelector('#password-required').innerText).toEqual('LOGIN.MESSAGES.PASSWORD-REQUIRED');

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

  it('should render min-length error when the username is lower than 4 characters',
    inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
          expect(component.formError.username).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
          expect(compiled.querySelector('#username-error').innerText).toEqual('LOGIN.MESSAGES.USERNAME-MIN');
        });
    }));

  it('should render no errors when the username and password are correct',
    inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
    inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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

  it('should return success true after the login have succeeded ',
    inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb
        .createAsync(AlfrescoLoginComponent)
        .then((fixture) => {
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

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-wrong-username';
          component.form.controls.password._value = 'fake-password';

          fixture.detectChanges();
          component.onValueChanged();

          compiled.querySelector('button').click();

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(true);
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

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-username';
          component.form.controls.password._value = 'fake-wrong-password';

          fixture.detectChanges();
          component.onValueChanged();

          compiled.querySelector('button').click();

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(true);
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

          let compiled = fixture.debugElement.nativeElement;

          component.form.controls.username._value = 'fake-wrong-username';
          component.form.controls.password._value = 'fake-wrong-password';

          fixture.detectChanges();
          component.onValueChanged();

          compiled.querySelector('button').click();

          fixture.detectChanges();

          expect(fixture.componentInstance.error).toBe(true);
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

