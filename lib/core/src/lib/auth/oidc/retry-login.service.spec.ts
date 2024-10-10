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

import { TestBed } from '@angular/core/testing';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { RetryLoginService } from './retry-login.service';

describe('RetryLoginService', () => {
    let service: RetryLoginService;
    let oauthService: jasmine.SpyObj<OAuthService>;
    let spyOnConsoleError: jasmine.Spy;

    beforeEach(() => {
        const oauthServiceSpy = jasmine.createSpyObj('OAuthService', ['tryLogin']);

        TestBed.configureTestingModule({
            providers: [
                RetryLoginService,
                { provide: OAuthService, useValue: oauthServiceSpy }
            ]
        });

        service = TestBed.inject(RetryLoginService);
        oauthService = TestBed.inject(OAuthService) as jasmine.SpyObj<OAuthService>;
        spyOnConsoleError = spyOn(console, 'error');
    });

    it('should login successfully on the first attempt', async () => {
        oauthService.tryLogin.and.returnValue(Promise.resolve(true));

        const result = await service.tryToLoginTimes({});

        expect(result).toBeTrue();
        expect(oauthService.tryLogin).toHaveBeenCalledTimes(1);
    });

    it('should retry login up to 3 times', async () => {
        oauthService.tryLogin.and.returnValues(
            Promise.reject(new Error('error')),
            Promise.reject(new Error('error')),
            Promise.resolve(true)
        );

        const result = await service.tryToLoginTimes({}, 3);

        expect(spyOnConsoleError).toHaveBeenCalledWith('Login attempt 1 of 3 failed. Retrying...');
        expect(spyOnConsoleError).toHaveBeenCalledWith('Login attempt 2 of 3 failed. Retrying...');
        expect(result).toBeTrue();
        expect(oauthService.tryLogin).toHaveBeenCalledTimes(3);
    });

    it('should fail after 2 attempts throwing an error', async () => {
        oauthService.tryLogin.and.rejectWith({ reason: 'fake-error' } as unknown as OAuthErrorEvent);

        try {
            await service.tryToLoginTimes({}, 2);
            fail('Expected to throw an error');
        } catch (error) {
            expect(error).toEqual(new Error('Login failed after 2 attempts. caused by: fake-error'));
            expect(oauthService.tryLogin).toHaveBeenCalledTimes(2);
        }
    });

    it('should fail after 2 attempts throwing an error if error is returned as string instead of object', async () => {
        oauthService.tryLogin.and.rejectWith('fake-message-error');

        try {
            await service.tryToLoginTimes({}, 2);
            fail('Expected to throw an error');
        } catch (error) {
            expect(error).toEqual(new Error('Login failed after 2 attempts. caused by: fake-message-error'));
            expect(oauthService.tryLogin).toHaveBeenCalledTimes(2);
        }
    });

    it('should fail after default max logint attempts ', async () => {
        oauthService.tryLogin.and.rejectWith({ reason: 'fake-error' } as unknown as OAuthErrorEvent);

        try {
            await service.tryToLoginTimes({});
            fail('Expected to throw an error');
        } catch (error) {
            expect(error).toEqual(new Error('Login failed after 3 attempts. caused by: fake-error'));
            expect(oauthService.tryLogin).toHaveBeenCalledTimes(3);
        }
    });
});
