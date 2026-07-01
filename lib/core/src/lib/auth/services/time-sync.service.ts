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
import { Injectable, Injector, inject } from '@angular/core';
import { AppConfigService } from '../../app-config/app-config.service';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface TimeSync {
    outOfSync: boolean;
    timeOutOfSyncInSec?: number;
    localDateTimeISO: string;
    serverDateTimeISO: string;
}

@Injectable({
    providedIn: 'root'
})
export class TimeSyncService {
    private readonly _injector = inject(Injector);
    private readonly _appConfigService = inject(AppConfigService);

    private readonly _http: HttpClient;

    /**
     * The signed offset in milliseconds between the adjusted server time and the local clock.
     * Positive means the local clock is behind the server; negative means it is ahead.
     * Defaults to 0 until `syncClockOffset` has successfully run.
     */
    clockOffsetMs = 0;

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
     * Fetches the server time once and stores the signed clock offset in `clockOffsetMs`.
     * Call this at application start-up (fire-and-forget) so subsequent calls to
     * `getCorrectedNow` compensate for any VM / Citrix clock drift.
     * If `serverTimeUrl` is not configured or the request fails, the offset is left at 0.
     *
     * @returns Observable that completes after the offset has been stored (or silently on error)
     */
    syncClockOffset(): Observable<void> {
        try {
            const startTime = Date.now();
            return this.getServerTime().pipe(
                map((serverTimeResponse: number) => {
                    const endTime = Date.now();
                    const roundTripTimeInMs = endTime - startTime;

                    const isServerTimeResponseInMs = serverTimeResponse.toString().length === 13;
                    const serverTimeInMs = isServerTimeResponseInMs ? serverTimeResponse : serverTimeResponse * 1000;
                    const adjustedServerTimeInMs = serverTimeInMs + roundTripTimeInMs / 2;

                    this.clockOffsetMs = adjustedServerTimeInMs - Date.now();
                }),
                catchError(() => {
                    this.clockOffsetMs = 0;
                    return of(void 0);
                })
            );
        } catch {
            this.clockOffsetMs = 0;
            return of(void 0);
        }
    }

    checkTimeSync(maxAllowedClockSkewInSec: number): Observable<TimeSync> {
        const startTime = Date.now();

        return this.getServerTime().pipe(
            map((serverTimeResponse: number) => {
                let serverTimeInMs: number;

                const endTime = Date.now();
                const roundTripTimeInMs = endTime - startTime;

                const isServerTimeResponseInMs = serverTimeResponse.toString().length === 13;
                if (!isServerTimeResponseInMs) {
                    serverTimeInMs = serverTimeResponse * 1000;
                } else {
                    serverTimeInMs = serverTimeResponse;
                }

                const adjustedServerTimeInMs = serverTimeInMs + roundTripTimeInMs / 2;
                const localCurrentTimeInMs = Date.now();
                const timeOffsetInMs = Math.abs(localCurrentTimeInMs - adjustedServerTimeInMs);
                const maxAllowedClockSkewInMs = maxAllowedClockSkewInSec * 1000;

                return {
                    outOfSync: timeOffsetInMs > maxAllowedClockSkewInMs,
                    timeOffsetInSec: timeOffsetInMs / 1000,
                    localDateTimeISO: new Date(localCurrentTimeInMs).toISOString(),
                    serverDateTimeISO: new Date(adjustedServerTimeInMs).toISOString()
                };
            }),
            catchError((error) => throwError(() => new Error(error)))
        );
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

    private getServerTime(): Observable<number> {
        return from(this._http.get<number>(this.getServerTimeUrl())).pipe(
            timeout(5000),
            catchError(() => throwError(() => new Error('Failed to get server time')))
        );
    }

    private getServerTimeUrl(): string {
        const serverTimeUrl = this._appConfigService.get('serverTimeUrl', '');
        if (!serverTimeUrl) {
            throw new Error('serverTimeUrl is not configured.');
        }
        return serverTimeUrl;
    }
}
