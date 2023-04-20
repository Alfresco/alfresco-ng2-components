/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Authentication } from '../authentication';
import { AuthenticationInterceptor, SHOULD_ADD_AUTH_TOKEN } from './authentication.interceptor';

class MockAuthentication extends Authentication {
  addTokenToHeader(httpHeaders: HttpHeaders): Observable<HttpHeaders> {
    return of(httpHeaders);
  }
}

const mockNext: HttpHandler = {
  handle: () => new Observable(subscriber => {
    subscriber.complete();
  })
};

const request = new HttpRequest('GET', 'http://localhost:4200');

describe('AuthenticationInterceptor', () => {
  let interceptor: AuthenticationInterceptor;
  let addTokenToHeaderSpy: jasmine.Spy<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationInterceptor, {provide: Authentication, useClass: MockAuthentication}]
    });
    interceptor = TestBed.inject(AuthenticationInterceptor);
    addTokenToHeaderSpy = spyOn(interceptor['authService'], 'addTokenToHeader');
  });

  it('should call add auth token method when SHOULD_ADD_AUTH_TOKEN context is set to true', () => {
    request.context.set(SHOULD_ADD_AUTH_TOKEN, true);
    interceptor.intercept(request, mockNext);
    expect(addTokenToHeaderSpy).toHaveBeenCalled();
  });

  it('should not call add auth token method when SHOULD_ADD_AUTH_TOKEN context is set to false', () => {
    request.context.set(SHOULD_ADD_AUTH_TOKEN, false);
    interceptor.intercept(request, mockNext);
    expect(addTokenToHeaderSpy).not.toHaveBeenCalled();
  });

  it('should not call add auth token method when SHOULD_ADD_AUTH_TOKEN context is not provided', () => {
    interceptor.intercept(request, mockNext);
    expect(addTokenToHeaderSpy).not.toHaveBeenCalled();
  });
});
