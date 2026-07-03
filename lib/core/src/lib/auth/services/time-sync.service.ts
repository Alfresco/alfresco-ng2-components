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

import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, NgZone, inject } from '@angular/core';
import { interval, Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';

export interface TimeSync {
    outOfSync: boolean;
    timeOutOfSyncInSec?: number;
    localDateTimeISO: string;
    serverDateTimeISO: string;
}

/** Default interval for periodic clock re-sync (5 minutes). */
const DEFAULT_PERIODIC_SYNC_INTERVAL_MS = 5 * 60 * 1000;

@Injectable({
    providedIn: 'root'
})
export class TimeSyncService {
    private readonly _injector = inject(Injector);
    private readonly _ngZone = inject(NgZone);

    private readonly _http: HttpClient;

    /**
     * The signed offset in milliseconds between the adjusted server time and the local clock.
     * Positive means the local clock is behind the server; negative means it is ahead.
     * Defaults to 0 until `syncClockOffset` has successfully run.
     */
    clockOffsetMs = 0;

    private _periodicSyncSubscription: Subscription | null = null;
    private _visibilityChangeHandler: (() => void) | null = null;

    constructor() {
        this._http = this._injector.get(HttpClient);
    }

    /**
     * Returns the current local time corrected by the last measured clock offset.
     * Use this instead of `Date.now()` when evaluating token expiration to avoid
     * false positives caused by VM / Citrix clock drift.
     *
     * @returns corrected timestamp in milliseconds
     */
    getCorrectedNow(): number {
        return Date.now() + this.clockOffsetMs;
    }

    /**
     * Syncs the clock offset by making a HEAD request to the application root URL
     * (served by nginx) and reading the `Date` response header. This avoids any
     * dependency on a dedicated time endpoint or on IAM being reachable.
     *
     * The HEAD request is lightweight (no response body) and targets the same origin,
     * so there are no CORS issues. Nginx always includes a `Date` header in its responses.
     *
     * @param maxAllowedOffsetMs Optional safety cap. If the computed offset exceeds this value,
     *                           it is ignored to prevent a compromised proxy from
     *                           tricking the client into accepting expired tokens.
     * @returns Observable that completes after the offset has been stored (or silently on error)
     */
    syncClockOffset(maxAllowedOffsetMs?: number): Observable<void> {
        const appRootUrl = this.getAppRootUrl();

        try {
            const startTime = Date.now();
            return this._http.head(appRootUrl, { observe: 'response', responseType: 'text' }).pipe(
                timeout(5000),
                map((response) => {
                    const endTime = Date.now();
                    const dateHeader = response.headers.get('date');

                    if (!dateHeader) {
                        return;
                    }

                    const serverTimeInMs = new Date(dateHeader).getTime();
                    if (isNaN(serverTimeInMs)) {
                        return;
                    }

                    const roundTripTimeInMs = endTime - startTime;
                    const adjustedServerTimeInMs = serverTimeInMs + roundTripTimeInMs / 2;
                    const newOffset = adjustedServerTimeInMs - endTime;

                    if (maxAllowedOffsetMs != null && Math.abs(newOffset) > maxAllowedOffsetMs) {
                        return;
                    }

                    this.clockOffsetMs = newOffset;
                }),
                catchError(() => of(void 0))
            );
        } catch {
            return of(void 0);
        }
    }

    /**
     * Checks the time synchronisation status using the stored clock offset.
     *
     * @param maxAllowedClockSkewInSec - The maximum allowed clock skew in seconds.
     * @returns An Observable that emits a TimeSync result.
     */
    checkTimeSync(maxAllowedClockSkewInSec: number): Observable<TimeSync> {
        const localCurrentTimeInMs = Date.now();
        const adjustedServerTimeInMs = localCurrentTimeInMs + this.clockOffsetMs;
        const timeOffsetInMs = Math.abs(this.clockOffsetMs);
        const maxAllowedClockSkewInMs = maxAllowedClockSkewInSec * 1000;

        return of({
            outOfSync: timeOffsetInMs > maxAllowedClockSkewInMs,
            timeOutOfSyncInSec: timeOffsetInMs / 1000,
            localDateTimeISO: new Date(localCurrentTimeInMs).toISOString(),
            serverDateTimeISO: new Date(adjustedServerTimeInMs).toISOString()
        });
    }

    /**
     * Checks if the local time is out of sync with the server time.
     *
     * @param maxAllowedClockSkewInSec - The maximum allowed clock skew in seconds.
     * @returns An Observable that emits a boolean indicating whether the local time is out of sync.
     */
    isLocalTimeOutOfSync(maxAllowedClockSkewInSec: number): Observable<boolean> {
        return this.checkTimeSync(maxAllowedClockSkewInSec).pipe(map((sync) => sync.outOfSync));
    }

    /**
     * Starts periodic re-synchronization of the clock offset to protect against
     * progressive clock drift during a user session (common in Citrix/VM environments).
     *
     * Re-sync is triggered:
     * - On a regular interval (default: every 5 minutes)
     * - When the document becomes visible again (e.g., Citrix session resumes after idle)
     *
     * @param intervalMs How often to re-sync in milliseconds (default: 5 minutes)
     * @param maxAllowedOffsetMs Safety cap for the offset. If exceeded, the new offset is ignored.
     */
    startPeriodicSync(intervalMs: number = DEFAULT_PERIODIC_SYNC_INTERVAL_MS, maxAllowedOffsetMs?: number): void {
        this.stopPeriodicSync();

        this._ngZone.runOutsideAngular(() => {
            this._periodicSyncSubscription = interval(intervalMs)
                .pipe(switchMap(() => this.syncClockOffset(maxAllowedOffsetMs)))
                .subscribe();

            this._visibilityChangeHandler = () => {
                if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                    this.syncClockOffset(maxAllowedOffsetMs).subscribe();
                }
            };

            if (typeof document !== 'undefined') {
                document.addEventListener('visibilitychange', this._visibilityChangeHandler);
            }
        });
    }

    /**
     * Stops the periodic clock re-synchronization and removes the visibility change listener.
     */
    stopPeriodicSync(): void {
        this._periodicSyncSubscription?.unsubscribe();
        this._periodicSyncSubscription = null;

        if (this._visibilityChangeHandler && typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
            this._visibilityChangeHandler = null;
        }
    }

    /**
     * Returns the application root URL to use for time sync HEAD requests.
     * Uses the current page's base path (everything up to and including the last `/`
     * in the pathname) so that nginx handles the request regardless of app deployment path.
     *
     * Example: for `https://host/aae-xxx/ui/workspace-lprbu/`, returns that same URL.
     */
    private getAppRootUrl(): string {
        if (typeof window !== 'undefined') {
            return window.location.href.split('?')[0].split('#')[0];
        }
        return '/';
    }
}
