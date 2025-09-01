/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { BasicAlfrescoAuthService } from './basic-alfresco-auth.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { ProcessAuth } from './process-auth';
import { ContentAuth } from './content-auth';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

describe('BasicAlfrescoAuthService', () => {
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let processAuth: ProcessAuth;
    let contentAuth: ContentAuth;
    let appConfig: AppConfigService;
    let appConfigSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BasicAlfrescoAuthService, provideHttpClient()]
        });
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);

        processAuth = TestBed.inject(ProcessAuth);
        spyOn(processAuth, 'getToken').and.returnValue('Mock Process Auth ticket');
        contentAuth = TestBed.inject(ContentAuth);
        spyOn(contentAuth, 'getToken').and.returnValue('Mock Content Auth ticket');

        appConfig = TestBed.inject(AppConfigService);
        appConfigSpy = spyOn(appConfig, 'get');
        appConfigSpy.withArgs(AppConfigValues.CONTEXTROOTBPM).and.returnValue('activiti-app');
        appConfigSpy.withArgs(AppConfigValues.CONTEXTROOTECM).and.returnValue('alfresco');
    });

    it('should return content services ticket when requestUrl contains ECM context root', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.exmple.com/alfresco/mock-api-url');
        const base64Segment = ticket.split('Basic ')[1];
        expect(atob(base64Segment)).toEqual('Mock Content Auth ticket');
    });

    it('should return process services ticket when requestUrl contains ECM context root', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.example.com/activiti-app/mock-api-url');
        expect(ticket).toEqual('Basic Mock Process Auth ticket');
    });

    it('should return content services ticket when requestUrl contains both ECM and BPM context root, but ECM context root comes before', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.exmple.com/alfresco/activiti-app/mock-api-url');
        const base64Segment = ticket.split('Basic ')[1];
        expect(atob(base64Segment)).toEqual('Mock Content Auth ticket');
    });

    it('should return process services ticket when requestUrl contains both ECM and BPM context root, but BPM context root comes before', () => {
        const ticket = basicAlfrescoAuthService.getTicketEcmBase64('http://www.example.com/activiti-app/alfresco/mock-api-url');
        expect(ticket).toEqual('Basic Mock Process Auth ticket');
    });

    describe('login', () => {
        let contentAuthSpy: jasmine.Spy;
        let processAuthSpy: jasmine.Spy;

        beforeEach(() => {
            contentAuthSpy = spyOn(contentAuth, 'login');
            processAuthSpy = spyOn(processAuth, 'login');
        });

        it('should return both ECM and BPM tickets after the login', async () => {
            appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('ALL');
            const mockContentTicket = { ticket: 'mock-content-ticket' };
            const mockProcessTicket = { ticket: 'mock-process-ticket' };
            const onLogin = firstValueFrom(basicAlfrescoAuthService.onLogin.pipe(take(1)));
            contentAuthSpy.and.returnValue(Promise.resolve(mockContentTicket));
            processAuthSpy.and.returnValue(Promise.resolve(mockProcessTicket));

            const result = await firstValueFrom(basicAlfrescoAuthService.login('username', 'password'));

            expect(result).toEqual({
                type: 'ALL',
                ticket: [mockContentTicket, mockProcessTicket]
            });
            expect(contentAuth.login).toHaveBeenCalledWith('username', 'password');
            expect(processAuth.login).toHaveBeenCalledWith('username', 'password');
            expect(await onLogin).toBe('success');
        });

        it('should return login fail on ECM login failure', async () => {
            appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('ECM');
            const mockError = 'ECM login failed';
            contentAuthSpy.and.returnValue(Promise.reject(mockError));

            const onError = firstValueFrom(basicAlfrescoAuthService.onError.pipe(take(1)));

            await expectAsync(firstValueFrom(basicAlfrescoAuthService.login('username', 'password'))).toBeRejectedWith(mockError);

            expect(contentAuth.login).toHaveBeenCalledWith('username', 'password');
            expect(processAuth.login).not.toHaveBeenCalled();
            expect(await onError).toBe('ECM login failed');
        });

        it('should return login fail on BPM login failure', async () => {
            appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('BPM');
            const mockError = 'BPM login failed';
            processAuthSpy.and.returnValue(Promise.reject(mockError));

            const onError = firstValueFrom(basicAlfrescoAuthService.onError.pipe(take(1)));

            await expectAsync(firstValueFrom(basicAlfrescoAuthService.login('username', 'password'))).toBeRejectedWith(mockError);

            expect(contentAuth.login).not.toHaveBeenCalled();
            expect(processAuth.login).toHaveBeenCalledWith('username', 'password');
            expect(await onError).toBe('BPM login failed');
        });
    });

    describe('isLoggedIn', () => {
        let contentAuthSpy: jasmine.Spy;
        let processAuthSpy: jasmine.Spy;

        beforeEach(() => {
            contentAuthSpy = spyOn(contentAuth, 'isLoggedIn');
            processAuthSpy = spyOn(processAuth, 'isLoggedIn');
        });

        it('should default to false when no provider is set', () => {
            appConfigSpy.withArgs(AppConfigValues.AUTH_WITH_CREDENTIALS, false).and.returnValue(false);
            appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue(null);

            const result = basicAlfrescoAuthService.isLoggedIn();

            expect(result).toBeFalse();
            expect(contentAuth.isLoggedIn).not.toHaveBeenCalled();
            expect(processAuth.isLoggedIn).not.toHaveBeenCalled();
        });

        describe('BPM provider', () => {
            it('should return processAuth value', () => {
                appConfigSpy.withArgs(AppConfigValues.AUTH_WITH_CREDENTIALS, false).and.returnValue(true);
                appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('BPM');
                processAuthSpy.and.returnValue(true);

                const result = basicAlfrescoAuthService.isLoggedIn();

                expect(result).toBeTrue();
                expect(processAuth.isLoggedIn).toHaveBeenCalled();
            });
        });

        describe('ECM provider', () => {
            it('should return true when kerberos enabled', () => {
                appConfigSpy.withArgs(AppConfigValues.AUTH_WITH_CREDENTIALS, false).and.returnValue(true);
                appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('ECM');

                const result = basicAlfrescoAuthService.isLoggedIn();

                expect(result).toBeTrue();
            });

            it('should return contentAuth value when kerberos disabled', () => {
                appConfigSpy.withArgs(AppConfigValues.AUTH_WITH_CREDENTIALS, false).and.returnValue(false);
                appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('ECM');
                contentAuthSpy.and.returnValue(true);

                const result = basicAlfrescoAuthService.isLoggedIn();

                expect(result).toBeTrue();
                expect(contentAuth.isLoggedIn).toHaveBeenCalled();
            });
        });

        describe('ALL provider', () => {
            it('should return true when kerberos enabled', () => {
                appConfigSpy.withArgs(AppConfigValues.AUTH_WITH_CREDENTIALS, false).and.returnValue(true);
                appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('ALL');

                const result = basicAlfrescoAuthService.isLoggedIn();

                expect(result).toBeTrue();
                expect(processAuth.isLoggedIn).not.toHaveBeenCalled();
                expect(contentAuth.isLoggedIn).not.toHaveBeenCalled();
            });

            it('should return true if both contentAuth or processAuth is logged in when kerberos disabled', () => {
                appConfigSpy.withArgs(AppConfigValues.AUTH_WITH_CREDENTIALS, false).and.returnValue(false);
                appConfigSpy.withArgs(AppConfigValues.PROVIDERS).and.returnValue('ALL');
                contentAuthSpy.and.returnValue(true);
                processAuthSpy.and.returnValue(true);

                const result = basicAlfrescoAuthService.isLoggedIn();

                expect(result).toBeTrue();
                expect(contentAuth.isLoggedIn).toHaveBeenCalled();
                expect(processAuth.isLoggedIn).toHaveBeenCalled();
            });
        });
    });
});
