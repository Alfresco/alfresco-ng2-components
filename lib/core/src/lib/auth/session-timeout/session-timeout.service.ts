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

import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthenticationService } from '../services/authentication.service';
import {
    SESSION_TIMEOUT_CONFIG_KEY,
    SESSION_TIMEOUT_OPTIONS,
    SessionTimeoutOptions,
    DEFAULT_SESSION_TIMEOUT_OPTIONS,
    normalizeSessionTimeoutOptions
} from './session-timeout.config';
import { IdleActivityTracker } from './idle-activity-tracker';
import { SessionTimeoutSyncChannel, SessionTimeoutSyncEvent } from './session-timeout-sync-channel';
import { SessionTimeoutDialogComponent, SessionTimeoutDialogData, SESSION_TIMEOUT_BACKDROP_CLASS } from './session-timeout-dialog.component';

const ACTIVITY_SYNC_THROTTLE_MS = 1000;

@Injectable()
export class SessionTimeoutService implements OnDestroy {
    private readonly appConfigService = inject(AppConfigService);
    private readonly authService = inject(AuthenticationService);
    private readonly dialog = inject(MatDialog);
    private readonly ngZone = inject(NgZone);
    private readonly providerOptions = inject<SessionTimeoutOptions>(SESSION_TIMEOUT_OPTIONS);
    private readonly tracker = inject(IdleActivityTracker);
    private readonly syncChannel = inject(SessionTimeoutSyncChannel);
    private readonly subscription = new Subscription();
    private sessionSubscription: Subscription | undefined;
    private timeoutId: ReturnType<typeof setTimeout> | undefined;
    private dialogTimeoutId: ReturnType<typeof setTimeout> | undefined;
    private dialogRef: MatDialogRef<SessionTimeoutDialogComponent, boolean> | undefined;
    private idleTimeoutMs = DEFAULT_SESSION_TIMEOUT_OPTIONS.idleTimeoutMs;
    private dialogTimeoutMs = DEFAULT_SESSION_TIMEOUT_OPTIONS.dialogTimeoutMs;
    private lastActivityAt = Date.now();
    private isStarted = false;
    private isSessionActive = false;
    private isLoggingOut = false;
    private isDialogExpired = false;
    private lastActivitySyncAt = 0;

    start(): void {
        if (this.isStarted) {
            return;
        }

        if (this.appConfigService.isLoaded === false) {
            this.appConfigService.onLoad.pipe(take(1)).subscribe(() => {
                this.startFromLoadedConfig();
            });
            return;
        }

        this.startFromLoadedConfig();
    }

    ngOnDestroy(): void {
        this.clearTimeout();
        this.clearDialogTimeout();
        this.dialogRef?.close();
        this.tracker.stop();
        this.syncChannel.close();
        this.sessionSubscription?.unsubscribe();
        this.subscription.unsubscribe();
    }

    private startFromLoadedConfig(): void {
        if (this.isStarted) {
            return;
        }

        const appConfigOptions = this.appConfigService.get(SESSION_TIMEOUT_CONFIG_KEY, {}) as SessionTimeoutOptions;
        const mergedOptions = {
            ...DEFAULT_SESSION_TIMEOUT_OPTIONS,
            ...appConfigOptions,
            ...this.providerOptions
        };
        const options = normalizeSessionTimeoutOptions(mergedOptions);

        if (!options.enabled) {
            return;
        }

        this.idleTimeoutMs = options.idleTimeoutMs;
        this.dialogTimeoutMs = options.dialogTimeoutMs;
        this.isStarted = true;
        this.subscribeToAuthEvents();

        if (this.authService.isLoggedIn()) {
            this.isSessionActive = true;
            this.isLoggingOut = false;
            this.activateSessionTimeout();
        }
    }

    private subscribeToAuthEvents(): void {
        this.subscription.add(
            this.authService.onLogin.subscribe(() => {
                const isLoggedIn = this.authService.isLoggedIn();

                if (!isLoggedIn) {
                    this.clearSessionState();
                    return;
                }

                this.isSessionActive = true;
                this.isLoggingOut = false;
                this.activateSessionTimeout();
            })
        );

        this.subscription.add(
            this.authService.onLogout.subscribe(() => {
                this.clearSessionState();
            })
        );
    }

    private activateSessionTimeout(): void {
        this.ngZone.runOutsideAngular(() => {
            if (!this.canArmSessionTimeout()) {
                return;
            }

            if (this.sessionSubscription) {
                this.refreshSession();
                return;
            }

            this.sessionSubscription = new Subscription();
            this.tracker.start();
            this.syncChannel.open();
            this.subscribeToTrackerEvents();
            this.subscribeToSyncEvents();
            this.refreshSession();
        });
    }

    private subscribeToTrackerEvents(): void {
        this.sessionSubscription?.add(
            this.tracker.activity$.subscribe(() => {
                this.handleActivity();
            })
        );

        this.sessionSubscription?.add(
            this.tracker.visibilityChange$.subscribe((state) => {
                this.handleVisibilityChange(state);
            })
        );
    }

    private subscribeToSyncEvents(): void {
        this.sessionSubscription?.add(
            this.syncChannel.messages$.subscribe((syncEvent) => {
                this.handleSyncEvent(syncEvent);
            })
        );
    }

    private handleActivity(): void {
        if (this.dialogRef) {
            return;
        }

        this.refreshSession({ shouldNotifyActivity: true });
    }

    private handleVisibilityChange(state: DocumentVisibilityState): void {
        if (state === 'visible') {
            this.handleTimeout();
        }
    }

    private handleSyncEvent(syncEvent: SessionTimeoutSyncEvent): void {
        if (!this.canArmSessionTimeout() && syncEvent.type !== 'logout' && syncEvent.type !== 'expired') {
            return;
        }

        if (syncEvent.type === 'activity' || syncEvent.type === 'continue') {
            this.continueSession();
            return;
        }

        if (syncEvent.type === 'timeout') {
            if (syncEvent.createdAt >= this.lastActivityAt) {
                this.openContinueWorkingDialog(false);
            }
            return;
        }

        // Another tab's session expired without a response: expire locally immediately
        // instead of waiting out this tab's own countdown.
        if (syncEvent.type === 'expired') {
            this.expireSession(false);
            return;
        }

        this.logout(false);
    }

    private refreshSession(options?: { shouldNotifyActivity?: boolean }): void {
        if (!this.canArmSessionTimeout()) {
            return;
        }

        this.lastActivityAt = Date.now();
        if (options?.shouldNotifyActivity === true) {
            this.notifyActivity();
        }
        this.scheduleTimeout();
    }

    private scheduleTimeout(): void {
        this.clearTimeout();

        if (!this.canArmSessionTimeout()) {
            return;
        }

        const elapsedMs = Date.now() - this.lastActivityAt;
        const remainingMs = Math.max(this.idleTimeoutMs - elapsedMs, 0);
        this.timeoutId = setTimeout(() => this.handleTimeout(), remainingMs);
    }

    private handleTimeout(): void {
        if (!this.canArmSessionTimeout()) {
            this.clearTimeout();
            return;
        }

        const elapsedMs = Date.now() - this.lastActivityAt;
        if (elapsedMs < this.idleTimeoutMs) {
            this.scheduleTimeout();
            return;
        }

        this.openContinueWorkingDialog();
    }

    private openContinueWorkingDialog(shouldNotifyTabs = true): void {
        if (this.dialogRef) {
            return;
        }

        if (!this.canArmSessionTimeout()) {
            return;
        }

        this.clearTimeout();
        this.isDialogExpired = false;
        this.dialogRef = this.ngZone.run(() =>
            this.dialog.open<SessionTimeoutDialogComponent, SessionTimeoutDialogData, boolean>(SessionTimeoutDialogComponent, {
                data: {
                    dialogTimeoutMs: this.dialogTimeoutMs
                },
                backdropClass: SESSION_TIMEOUT_BACKDROP_CLASS,
                disableClose: true,
                width: '420px'
            })
        );
        this.dialogTimeoutId = setTimeout(() => {
            this.isDialogExpired = true;
            this.dialogRef?.close(false);
        }, this.dialogTimeoutMs);
        if (shouldNotifyTabs) {
            this.syncChannel.post('timeout');
        }

        this.dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((shouldContinueWorking) => {
                this.clearDialogTimeout();
                this.dialogRef = undefined;
                const wasDialogExpired = this.isDialogExpired;
                this.isDialogExpired = false;

                if (shouldContinueWorking === true) {
                    this.continueSession();
                    this.syncChannel.post('continue');
                    return;
                }

                // An unanswered dialog (auto-closed on timeout) expires the local session state;
                // an explicit "Log out" click runs the normal logout flow.
                if (wasDialogExpired) {
                    this.expireSession();
                    return;
                }

                if (shouldContinueWorking === false) {
                    this.logout();
                }
            });
    }

    private continueSession(): void {
        this.closeDialogWithoutAction();
        this.refreshSession();
    }

    private logout(shouldNotifyTabs = true): void {
        if (this.isLoggingOut) {
            return;
        }

        this.isSessionActive = false;
        this.isLoggingOut = true;
        this.clearTimeout();
        this.clearDialogTimeout();
        if (shouldNotifyTabs) {
            this.syncChannel.post('logout');
        }
        this.ngZone.run(() => this.authService.logout().pipe(take(1)).subscribe());
    }

    private expireSession(shouldNotifyTabs = true): void {
        if (this.isLoggingOut) {
            return;
        }

        this.isLoggingOut = true;
        if (shouldNotifyTabs) {
            this.syncChannel.post('expired');
        }
        this.authService.reset();
        this.clearSessionState();
    }

    private clearSessionState(): void {
        this.isSessionActive = false;
        this.dialogRef?.close();
        this.clearTimeout();
        this.clearDialogTimeout();
        this.sessionSubscription?.unsubscribe();
        this.sessionSubscription = undefined;
        this.tracker.stop();
        this.syncChannel.close();
    }

    private closeDialogWithoutAction(): void {
        const dialogRef = this.dialogRef;
        if (!dialogRef) {
            return;
        }

        this.dialogRef = undefined;
        this.clearDialogTimeout();
        dialogRef.close();
    }

    private canArmSessionTimeout(): boolean {
        return this.isSessionActive && !this.isLoggingOut && this.authService.isLoggedIn();
    }

    private notifyActivity(): void {
        const now = Date.now();
        if (now - this.lastActivitySyncAt < ACTIVITY_SYNC_THROTTLE_MS) {
            return;
        }

        this.lastActivitySyncAt = now;
        this.syncChannel.post('activity');
    }

    private clearTimeout(): void {
        if (this.timeoutId === undefined) {
            return;
        }

        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
    }

    private clearDialogTimeout(): void {
        if (this.dialogTimeoutId === undefined) {
            return;
        }

        clearTimeout(this.dialogTimeoutId);
        this.dialogTimeoutId = undefined;
    }
}
