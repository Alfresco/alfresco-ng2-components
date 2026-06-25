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

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TimeSync {
    outOfSync: boolean;
    timeOutOfSyncInSec?: number;
    localDateTimeISO: string;
    serverDateTimeISO: string;
}

/**
 * Represents a snapshot of server time captured from an HTTP response header.
 * Used by {@link ServerTimeHeaderInterceptor} to feed time data into {@link TimeSyncService}.
 */
export interface ServerTimeSnapshot {
    /** Server time in milliseconds (parsed from the response header). */
    serverTimeMs: number;
    /** Local time in milliseconds recorded just before the HTTP request was sent. */
    requestStartTimeMs: number;
    /** Local time in milliseconds recorded just after the HTTP response was received. */
    responseReceivedTimeMs: number;
}

@Injectable({
    providedIn: 'root'
})
export class TimeSyncService {
    private _serverTimeSnapshot: ServerTimeSnapshot | null = null;

    /**
     * Updates the stored server time snapshot. Called by {@link ServerTimeHeaderInterceptor}
     * whenever a backend response containing a time header is received.
     *
     * @param snapshot - The captured server time snapshot.
     */
    updateServerTime(snapshot: ServerTimeSnapshot): void {
        this._serverTimeSnapshot = snapshot;
    }

    /**
     * Computes the time synchronisation status between the local clock and the server clock.
     * The server time is derived from the most recent HTTP response header captured by
     * {@link ServerTimeHeaderInterceptor} — no dedicated REST call is made.
     *
     * @param maxAllowedClockSkewInSec - The maximum allowed clock skew in seconds.
     * @returns An Observable that emits a {@link TimeSync} result, or errors when no server
     *          time snapshot is available yet.
     */
    checkTimeSync(maxAllowedClockSkewInSec: number): Observable<TimeSync> {
        if (!this._serverTimeSnapshot) {
            return throwError(() => new Error('No server time available. Ensure ServerTimeHeaderInterceptor is configured and a backend request has been made.'));
        }

        const { serverTimeMs, requestStartTimeMs, responseReceivedTimeMs } = this._serverTimeSnapshot;
        const roundTripTimeInMs = responseReceivedTimeMs - requestStartTimeMs;
        const adjustedServerTimeAtCaptureMs = serverTimeMs + roundTripTimeInMs / 2;

        return of(null).pipe(
            map(() => {
                const localNow = Date.now();
                const timeElapsedSinceCaptureMs = localNow - responseReceivedTimeMs;
                const estimatedCurrentServerTimeMs = adjustedServerTimeAtCaptureMs + timeElapsedSinceCaptureMs;
                const timeOffsetInMs = Math.abs(localNow - estimatedCurrentServerTimeMs);
                const maxAllowedClockSkewInMs = maxAllowedClockSkewInSec * 1000;
                const outOfSync = timeOffsetInMs > maxAllowedClockSkewInMs;

                this.debug(
                    `checkTimeSync: outOfSync=${outOfSync} ` +
                        `(local=${new Date(localTimeInMs).toISOString()}, server=${new Date(adjustedServerTimeInMs).toISOString()}, offset=${this.clockOffsetMs}ms)`
                );

                return {
                    outOfSync: timeOffsetInMs > maxAllowedClockSkewInMs,
                    timeOutOfSyncInSec: timeOffsetInMs / 1000,
                    localDateTimeISO: new Date(localNow).toISOString(),
                    serverDateTimeISO: new Date(estimatedCurrentServerTimeMs).toISOString()
                };
            })
        );
    }

    private getAdjustedServerTimeInMs(serverTimeResponse: number, startTime: number): number {
        let serverTimeInMs: number;
        const endTime = Date.now();
        const roundTripTimeInMs = endTime - startTime;

        const isServerTimeResponseInMs = serverTimeResponse.toString().length === 13;
        if (!isServerTimeResponseInMs) {
            serverTimeInMs = serverTimeResponse * 1000;
        } else {
            serverTimeInMs = serverTimeResponse;
        }

        return serverTimeInMs + roundTripTimeInMs / 2;
    }

    isEnabled(): boolean {
        const timeSync = this._appConfigService.get<boolean | string>(AppConfigValues.AUTH_TIME_SYNC_ENABLED, false);
        return timeSync === true || timeSync === 'true';
    }
}
