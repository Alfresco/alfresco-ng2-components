/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ApplicationRef, NgZone, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthenticationService } from '../services/authentication.service';
import { NoopTranslateModule } from '../../testing';
import { IdleActivityTracker } from './idle-activity-tracker';
import { SESSION_TIMEOUT_OPTIONS } from './session-timeout.config';
import { SessionTimeoutSyncChannel } from './session-timeout-sync-channel';
import { SessionTimeoutService } from './session-timeout.service';

const IDLE_TIMEOUT_MS = 50;
const DIALOG_TIMEOUT_MS = 100;

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('SessionTimeoutService without zone.js change detection', () => {
    let service: SessionTimeoutService;
    let logout: jasmine.Spy<() => Observable<void>>;

    const getDialogElement = (): Element | null => document.querySelector('adf-session-timeout-dialog');

    const getDialogContinueButton = (): Element | null => document.querySelector('[data-automation-id="session-timeout-dialog__continue-button"]');

    const settle = async (ms: number) => {
        await wait(ms);
        await TestBed.inject(ApplicationRef).whenStable();
    };

    beforeEach(() => {
        logout = jasmine.createSpy('logout').and.returnValue(new Observable<void>((subscriber) => subscriber.complete()));
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [
                provideZonelessChangeDetection(),
                SessionTimeoutService,
                IdleActivityTracker,
                SessionTimeoutSyncChannel,
                {
                    provide: SESSION_TIMEOUT_OPTIONS,
                    useValue: { enabled: true, idleTimeoutMs: IDLE_TIMEOUT_MS, dialogTimeoutMs: DIALOG_TIMEOUT_MS }
                },
                {
                    provide: AuthenticationService,
                    useValue: { isLoggedIn: () => true, logout, onLogin: new Subject(), onLogout: new Subject() }
                },
                {
                    provide: AppConfigService,
                    useValue: { isLoaded: true, get: (_key: string, fallback: unknown) => fallback, onLoad: new Subject() }
                }
            ]
        });
        service = TestBed.inject(SessionTimeoutService);
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    it('should run without zone.js change detection', () => {
        expect(TestBed.inject(NgZone).constructor.name).toBe('NoopNgZone');
    });

    it('should render the countdown dialog when the idle timeout elapses', async () => {
        service.start();

        await settle(IDLE_TIMEOUT_MS + 20);

        expect(getDialogElement()).not.toBeNull();
        expect(getDialogContinueButton()).not.toBeNull();
    });

    it('should log out and remove the dialog when the countdown is not answered', async () => {
        service.start();
        await settle(IDLE_TIMEOUT_MS + 20);

        await settle(DIALOG_TIMEOUT_MS + 20);

        expect(logout).toHaveBeenCalledTimes(1);
        expect(getDialogElement()).toBeNull();
    });
});
