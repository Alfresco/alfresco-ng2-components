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

import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { Observable, Subject, defer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthenticationService } from '../services/authentication.service';
import { SessionTimeoutService } from './session-timeout.service';
import { SessionTimeoutOptions, SESSION_TIMEOUT_OPTIONS } from './session-timeout.config';
import { IdleActivityTracker } from './idle-activity-tracker';
import { SessionTimeoutSyncChannel, SessionTimeoutSyncEvent } from './session-timeout-sync-channel';
import { SESSION_TIMEOUT_BACKDROP_CLASS } from './session-timeout-dialog.component';

describe('SessionTimeoutService', () => {
    let authService: {
        isLoggedIn: jasmine.Spy<() => boolean>;
        logout: jasmine.Spy<() => Observable<void>>;
        reset: jasmine.Spy<() => void>;
        onLogin: Subject<unknown>;
        onLogout: Subject<unknown>;
    };
    let logoutSideEffect: jasmine.Spy;
    let appConfigService: {
        get: jasmine.Spy<(key: string, fallback: SessionTimeoutOptions) => SessionTimeoutOptions>;
        isLoaded: boolean;
        onLoad: Subject<unknown>;
    };
    let dialog: {
        open: jasmine.Spy;
    };
    let tracker: {
        start: jasmine.Spy;
        stop: jasmine.Spy;
        activity$: Subject<void>;
        visibilityChange$: Subject<DocumentVisibilityState>;
    };
    let syncChannel: {
        open: jasmine.Spy;
        close: jasmine.Spy;
        post: jasmine.Spy;
        messages$: Subject<SessionTimeoutSyncEvent>;
    };
    let dialogClosed$: Subject<boolean | undefined>;
    let isLoggedIn: boolean;

    const configureTestingModule = (sessionTimeoutOptions?: SessionTimeoutOptions, providerOptions?: SessionTimeoutOptions) => {
        isLoggedIn = true;
        logoutSideEffect = jasmine.createSpy('logoutSideEffect');
        authService = {
            isLoggedIn: jasmine.createSpy('isLoggedIn').and.callFake(() => isLoggedIn),
            logout: jasmine.createSpy('logout').and.callFake(() =>
                defer(() => {
                    logoutSideEffect();
                    return new Observable<void>((subscriber) => subscriber.complete());
                })
            ),
            reset: jasmine.createSpy('reset'),
            onLogin: new Subject<unknown>(),
            onLogout: new Subject<unknown>()
        };
        appConfigService = {
            get: jasmine.createSpy('get').and.callFake((_key: string, fallback: SessionTimeoutOptions) => sessionTimeoutOptions ?? fallback),
            isLoaded: true,
            onLoad: new Subject<unknown>()
        };
        dialogClosed$ = new Subject<boolean | undefined>();
        dialog = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: () => dialogClosed$,
                close: (value?: boolean) => {
                    dialogClosed$.next(value);
                    dialogClosed$.complete();
                }
            })
        };
        tracker = {
            start: jasmine.createSpy('start'),
            stop: jasmine.createSpy('stop'),
            activity$: new Subject<void>(),
            visibilityChange$: new Subject<DocumentVisibilityState>()
        };
        syncChannel = {
            open: jasmine.createSpy('open'),
            close: jasmine.createSpy('close'),
            post: jasmine.createSpy('post'),
            messages$: new Subject<SessionTimeoutSyncEvent>()
        };
        TestBed.configureTestingModule({
            providers: [
                SessionTimeoutService,
                { provide: SESSION_TIMEOUT_OPTIONS, useValue: providerOptions ?? {} },
                { provide: AuthenticationService, useValue: authService },
                { provide: AppConfigService, useValue: appConfigService },
                { provide: MatDialog, useValue: dialog },
                { provide: IdleActivityTracker, useValue: tracker },
                { provide: SessionTimeoutSyncChannel, useValue: syncChannel }
            ]
        });
    };

    const startService = ({ emitLoginEvent = true } = {}) => {
        const service = TestBed.inject(SessionTimeoutService);
        service.start();
        if (emitLoginEvent) {
            authService.onLogin.next(undefined);
        }

        return service;
    };

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should not activate when session timeout is disabled', fakeAsync(() => {
        configureTestingModule({ enabled: false, idleTimeoutMs: 1000 });

        startService();
        tick(1000);

        expect(tracker.start).not.toHaveBeenCalled();
        expect(syncChannel.open).not.toHaveBeenCalled();
        expect(dialog.open).not.toHaveBeenCalled();
        expect(authService.logout).not.toHaveBeenCalled();
    }));

    it('should not activate by default when enabled is not configured', fakeAsync(() => {
        configureTestingModule({ idleTimeoutMs: 1000 });

        startService();

        expect(tracker.start).not.toHaveBeenCalled();
        expect(syncChannel.open).not.toHaveBeenCalled();
    }));

    it('should wait for app config to load before starting', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });
        appConfigService.isLoaded = false;

        startService({ emitLoginEvent: false });
        tick(1000);

        expect(tracker.start).not.toHaveBeenCalled();

        appConfigService.isLoaded = true;
        appConfigService.onLoad.next({});
        flushMicrotasks();
        authService.onLogin.next(undefined);
        tick(1000);

        expect(tracker.start).toHaveBeenCalledTimes(1);
        expect(dialog.open).toHaveBeenCalledTimes(1);
    }));

    it('should start tracker and open sync channel on login when logged in', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();

        expect(tracker.start).toHaveBeenCalledTimes(1);
        expect(syncChannel.open).toHaveBeenCalledTimes(1);
    }));

    it('should clear session state when login event fires but user is not logged in', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });
        isLoggedIn = false;

        startService();
        tick(1000);

        expect(tracker.start).not.toHaveBeenCalled();
        expect(dialog.open).not.toHaveBeenCalled();
    }));

    it('should arm immediately on start when a session is already authenticated', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        // No onLogin event is emitted: the session predates this service.
        startService({ emitLoginEvent: false });

        expect(tracker.start).toHaveBeenCalledTimes(1);
        expect(syncChannel.open).toHaveBeenCalledTimes(1);

        tick(1000);
        expect(dialog.open).toHaveBeenCalledTimes(1);
    }));

    it('should not leak handler subscriptions across logout and login cycles', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        expect(tracker.activity$.observers.length).toBe(1);
        expect(syncChannel.messages$.observers.length).toBe(1);

        authService.onLogout.next({});
        flushMicrotasks();

        // Logout must tear down the session-scoped subscriptions.
        expect(tracker.activity$.observers.length).toBe(0);
        expect(syncChannel.messages$.observers.length).toBe(0);

        authService.onLogin.next(undefined);

        // Re-login arms exactly one fresh set, never two.
        expect(tracker.activity$.observers.length).toBe(1);
        expect(syncChannel.messages$.observers.length).toBe(1);
    }));

    it('should not re-arm or duplicate subscriptions when redundant login events fire', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        authService.onLogin.next(undefined);
        authService.onLogin.next(undefined);

        expect(tracker.start).toHaveBeenCalledTimes(1);
        expect(syncChannel.open).toHaveBeenCalledTimes(1);
        expect(tracker.activity$.observers.length).toBe(1);
        expect(syncChannel.messages$.observers.length).toBe(1);
    }));

    it('should open dialog after idle timeout with no activity', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);

        expect(dialog.open).toHaveBeenCalledTimes(1);
        expect(dialog.open).toHaveBeenCalledWith(
            jasmine.any(Function),
            jasmine.objectContaining({
                data: { dialogTimeoutMs: 60000 },
                backdropClass: SESSION_TIMEOUT_BACKDROP_CLASS,
                disableClose: true,
                width: '420px'
            })
        );
        expect(authService.logout).not.toHaveBeenCalled();
    }));

    it('should reschedule timeout when activity occurs before idle timeout', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(750);
        tracker.activity$.next();
        tick(750);

        expect(dialog.open).not.toHaveBeenCalled();

        tick(250);

        expect(dialog.open).toHaveBeenCalledTimes(1);
    }));

    it('should ignore activity while dialog is open', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);

        expect(dialog.open).toHaveBeenCalledTimes(1);

        tracker.activity$.next();
        tick(1000);

        expect(dialog.open).toHaveBeenCalledTimes(1);
    }));

    it('should continue working when dialog is confirmed', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);

        dialogClosed$.next(true);
        flushMicrotasks();

        expect(authService.logout).not.toHaveBeenCalled();
        expect(syncChannel.post).toHaveBeenCalledWith('continue');

        tick(999);
        expect(dialog.open).toHaveBeenCalledTimes(1);

        tick(1);
        expect(dialog.open).toHaveBeenCalledTimes(2);
    }));

    it('should run the full logout flow when the dialog auto-closes on timeout', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000, dialogTimeoutMs: 500 });

        startService();
        tick(1000);
        tick(500);
        flushMicrotasks();

        // An unanswered (timed-out) dialog logs the user out and redirects, same as the explicit "Log out" button.
        expect(authService.logout).toHaveBeenCalledTimes(1);
        expect(logoutSideEffect).toHaveBeenCalledTimes(1);
        expect(authService.reset).not.toHaveBeenCalled();
        // Other tabs are told to log out too.
        expect(syncChannel.post).toHaveBeenCalledWith('logout');
    }));

    it('should logout (not redirect) when the user explicitly chooses to log out', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);
        dialogClosed$.next(false);
        flushMicrotasks();

        expect(authService.logout).toHaveBeenCalledTimes(1);
        expect(logoutSideEffect).toHaveBeenCalledTimes(1);
    }));

    it('should logout once when dialog is rejected (idempotent)', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);
        dialogClosed$.next(false);
        flushMicrotasks();

        expect(authService.logout).toHaveBeenCalledTimes(1);
        expect(syncChannel.post).toHaveBeenCalledWith('logout');

        // Try to logout again
        dialogClosed$.next(false);
        flushMicrotasks();

        expect(authService.logout).toHaveBeenCalledTimes(1);
    }));

    it('should throttle activity sync posts to one per 1000ms', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 5000 });

        startService();

        tracker.activity$.next();
        tracker.activity$.next();
        tracker.activity$.next();

        expect(syncChannel.post).toHaveBeenCalledWith('activity');
        expect(syncChannel.post).toHaveBeenCalledTimes(1);

        tick(999);
        tracker.activity$.next();
        expect(syncChannel.post).toHaveBeenCalledTimes(1);

        tick(1);
        tracker.activity$.next();
        expect(syncChannel.post).toHaveBeenCalledTimes(2);
    }));

    it('should continue session when inbound activity message received', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(750);
        syncChannel.messages$.next({
            type: 'activity',
            sourceTabId: 'other-tab',
            createdAt: Date.now()
        });
        tick(750);

        expect(dialog.open).not.toHaveBeenCalled();

        tick(250);
        expect(dialog.open).toHaveBeenCalledTimes(1);
    }));

    it('should continue session when inbound continue message received', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);

        expect(dialog.open).toHaveBeenCalledTimes(1);

        // When continue is received, the dialog closes without a value
        // We need to complete the dialog observable to avoid the EmptyError
        const dialogCloseSpy = jasmine.createSpy('dialogClose');
        const mockDialogRef = dialog.open.calls.mostRecent().returnValue;
        mockDialogRef.close = dialogCloseSpy;

        syncChannel.messages$.next({
            type: 'continue',
            sourceTabId: 'other-tab',
            createdAt: Date.now()
        });

        expect(dialogCloseSpy).toHaveBeenCalled();

        // Session should continue, new timeout scheduled
        tick(999);
        expect(dialog.open).toHaveBeenCalledTimes(1);

        tick(1);
        expect(dialog.open).toHaveBeenCalledTimes(2);
    }));

    it('should open dialog when inbound timeout message received without re-broadcasting', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        const service = startService();
        (service as any).lastActivityAt = Date.now() - 500;

        syncChannel.messages$.next({
            type: 'timeout',
            sourceTabId: 'other-tab',
            createdAt: Date.now()
        });

        expect(dialog.open).toHaveBeenCalledTimes(1);
        expect(syncChannel.post).not.toHaveBeenCalledWith('timeout');
    }));

    it('should not open dialog when inbound timeout message is stale', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        const service = startService();
        (service as any).lastActivityAt = Date.now();

        syncChannel.messages$.next({
            type: 'timeout',
            sourceTabId: 'other-tab',
            createdAt: Date.now() - 1000
        });

        expect(dialog.open).not.toHaveBeenCalled();
    }));

    it('should logout when inbound logout message received without re-broadcasting', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        syncChannel.messages$.next({
            type: 'logout',
            sourceTabId: 'other-tab',
            createdAt: Date.now()
        });

        expect(authService.logout).toHaveBeenCalledTimes(1);
        expect(syncChannel.post).not.toHaveBeenCalledWith('logout');
    }));

    it('should re-evaluate timeout when visibility changes to visible', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(500);

        // Simulate elapsed time during hidden state
        const service = TestBed.inject(SessionTimeoutService);
        (service as any).lastActivityAt = Date.now() - 1001;

        tracker.visibilityChange$.next('visible');
        flushMicrotasks();

        expect(dialog.open).toHaveBeenCalledTimes(1);
    }));

    it('should clear state and stop tracker on logout event', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);

        expect(dialog.open).toHaveBeenCalledTimes(1);

        authService.onLogout.next({});
        flushMicrotasks();

        expect(tracker.stop).toHaveBeenCalledTimes(1);
        expect(syncChannel.close).toHaveBeenCalledTimes(1);
    }));

    it('should tear down resources on ngOnDestroy', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        const service = startService();
        tick(1000);

        expect(dialog.open).toHaveBeenCalledTimes(1);

        service.ngOnDestroy();

        expect(tracker.stop).toHaveBeenCalledTimes(1);
        expect(syncChannel.close).toHaveBeenCalledTimes(1);
    }));

    it('should not logout when dialog is closed without explicit choice', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);
        dialogClosed$.next(undefined);
        flushMicrotasks();

        expect(authService.logout).not.toHaveBeenCalled();
    }));

    it('should use provider options over app config options', fakeAsync(() => {
        configureTestingModule({ enabled: false, idleTimeoutMs: 1000 }, { enabled: true, idleTimeoutMs: 500 });

        startService();
        tick(500);

        expect(dialog.open).toHaveBeenCalledTimes(1);
    }));

    it('should post timeout message when dialog opens', fakeAsync(() => {
        configureTestingModule({ enabled: true, idleTimeoutMs: 1000 });

        startService();
        tick(1000);

        expect(syncChannel.post).toHaveBeenCalledWith('timeout');
    }));
});
