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

import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { provideSessionTimeout } from './provide-session-timeout';
import { SessionTimeoutService } from './session-timeout.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthenticationService } from '../services/authentication.service';

describe('provideSessionTimeout', () => {
    it('registers SessionTimeoutService and runs its start() during app init', async () => {
        const startSpy = spyOn(SessionTimeoutService.prototype, 'start');
        TestBed.configureTestingModule({
            providers: [
                provideSessionTimeout(),
                { provide: AppConfigService, useValue: { get: () => ({}), isLoaded: true, onLoad: new Subject() } },
                {
                    provide: AuthenticationService,
                    useValue: { isLoggedIn: () => false, logout: () => {}, onLogin: new Subject(), onLogout: new Subject() }
                }
            ]
        });
        await TestBed.inject(ApplicationInitStatus).donePromise;
        expect(startSpy).toHaveBeenCalled();
    });

    it('waits for startWhen to emit true before starting SessionTimeoutService', async () => {
        const startWhen$ = new Subject<boolean>();
        const startSpy = spyOn(SessionTimeoutService.prototype, 'start');

        TestBed.configureTestingModule({
            providers: [
                provideSessionTimeout({ startWhen: () => startWhen$ }),
                { provide: AppConfigService, useValue: { get: () => ({}), isLoaded: true, onLoad: new Subject() } },
                {
                    provide: AuthenticationService,
                    useValue: { isLoggedIn: () => false, logout: () => {}, onLogin: new Subject(), onLogout: new Subject() }
                }
            ]
        });
        await TestBed.inject(ApplicationInitStatus).donePromise;

        expect(startSpy).not.toHaveBeenCalled();

        startWhen$.next(false);
        expect(startSpy).not.toHaveBeenCalled();

        startWhen$.next(true);
        expect(startSpy).toHaveBeenCalledTimes(1);

        startWhen$.next(true);
        expect(startSpy).toHaveBeenCalledTimes(1);
    });
});
