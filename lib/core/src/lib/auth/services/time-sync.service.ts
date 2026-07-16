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
import { defer, Observable, of } from 'rxjs';

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
     * When no server time snapshot is available yet (e.g. the interceptor has not captured
     * a response header), the method returns a soft-failure result with `outOfSync: false`
     * so that callers such as auth error-handling streams are not terminated by an unhandled
     * error. Once a snapshot is available the full clock-skew calculation is performed.
     *
     * @param maxAllowedClockSkewInSec - The maximum allowed clock skew in seconds.
     * @returns An Observable that emits a {@link TimeSync} result. When no snapshot is
     *          available, emits `{ outOfSync: false }` as a safe default.
     */
    checkTimeSync(maxAllowedClockSkewInSec: number): Observable<TimeSync> {
        if (!this._serverTimeSnapshot) {
            const nowISO = new Date().toISOString();
            return of({ outOfSync: false, localDateTimeISO: nowISO, serverDateTimeISO: nowISO });
        }

        const { serverTimeMs, requestStartTimeMs, responseReceivedTimeMs } = this._serverTimeSnapshot;
        const roundTripTimeInMs = responseReceivedTimeMs - requestStartTimeMs;
        const adjustedServerTimeAtCaptureMs = serverTimeMs + roundTripTimeInMs / 2;

        return defer(() => {
            const localNow = Date.now();
            const timeElapsedSinceCaptureMs = localNow - responseReceivedTimeMs;
            const estimatedCurrentServerTimeMs = adjustedServerTimeAtCaptureMs + timeElapsedSinceCaptureMs;
            const timeOffsetInMs = Math.abs(localNow - estimatedCurrentServerTimeMs);
            const maxAllowedClockSkewInMs = maxAllowedClockSkewInSec * 1000;

            return of({
                outOfSync: timeOffsetInMs > maxAllowedClockSkewInMs,
                timeOutOfSyncInSec: timeOffsetInMs / 1000,
                localDateTimeISO: new Date(localNow).toISOString(),
                serverDateTimeISO: new Date(estimatedCurrentServerTimeMs).toISOString()
            });
        });
    }

    isEnabled(): boolean {
        return true;
    }

    /**
     * Returns a clock-drift-corrected "now" timestamp in milliseconds.
     * If a server time snapshot is available, applies the estimated offset
     * to produce a value closer to the server's clock. Otherwise falls back
     * to the raw local `Date.now()`.
     *
     * Used by {@link TimeSyncDateTimeProvider} to feed corrected time into
     * the OAuth library's token validation.
     */
    getCorrectedNow(): number {
        if (!this._serverTimeSnapshot) {
            return Date.now();
        }

        const { serverTimeMs, requestStartTimeMs, responseReceivedTimeMs } = this._serverTimeSnapshot;
        const roundTripTimeInMs = responseReceivedTimeMs - requestStartTimeMs;
        const adjustedServerTimeAtCaptureMs = serverTimeMs + roundTripTimeInMs / 2;
        const localNow = Date.now();
        const timeElapsedSinceCaptureMs = localNow - responseReceivedTimeMs;
        return adjustedServerTimeAtCaptureMs + timeElapsedSinceCaptureMs;
    }

    /**
     * No-op in the header-based implementation. The clock offset is captured passively
     * by {@link ServerTimeHeaderInterceptor} from existing HTTP responses — no dedicated
     * sync call is needed. This method exists for backward compatibility with callers
     * that previously relied on a dedicated REST-based time sync.
     *
     * @returns An Observable that completes immediately.
     */
    syncClockOffset(): Observable<void> {
        return of(undefined);
    }
}
