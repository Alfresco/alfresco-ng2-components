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
import { interval, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';
import { LogService } from '../../common/services/log.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';

export interface TimeSync {
    outOfSync: boolean;
    timeOutOfSyncInSec?: number;
    localDateTimeISO: string;
    serverDateTimeISO: string;
}

/**
 * Emitted when a measured clock offset is rejected for exceeding `maxAllowedOffsetMs`.
 * Consumers can subscribe to `implausibleOffsetDetected$` and forward this to central
 * telemetry to detect misconfigured proxies or `Date`-header tampering across the fleet.
 */
export interface ImplausibleClockOffsetEvent {
    measuredOffsetMs: number;
    maxAllowedOffsetMs: number;
}

/** Default interval for periodic clock re-sync (5 minutes). */
const DEFAULT_PERIODIC_SYNC_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Default upper bound, in milliseconds, for a clock offset that will be trusted (10 minutes).
 * Offsets larger than this are treated as implausible and ignored so that a single unsigned
 * `Date` header cannot arbitrarily extend client-side token validity. See `maxAllowedOffsetMs`.
 */
const DEFAULT_MAX_ALLOWED_OFFSET_MS = 10 * 60 * 1000;

/** Minimum delay between visibility-triggered re-syncs (30 seconds) to avoid request storms. */
const VISIBILITY_SYNC_DEBOUNCE_MS = 30 * 1000;

/** Timeout applied to the time-sync HEAD request (5 seconds). */
const SYNC_REQUEST_TIMEOUT_MS = 5000;

@Injectable({
    providedIn: 'root'
})
export class TimeSyncService {
    private readonly _injector = inject(Injector);
    private readonly _ngZone = inject(NgZone);
    private readonly _logService = inject(LogService);
    private readonly _appConfig = inject(AppConfigService);

    private readonly _http: HttpClient;

    /**
     * The signed offset in milliseconds between the adjusted server time and the local clock.
     * Positive means the local clock is behind the server; negative means it is ahead.
     * Defaults to 0 until `syncClockOffset` has successfully run.
     */
    clockOffsetMs = 0;

    /**
     * Maximum magnitude, in milliseconds, of a measured clock offset that will be trusted and
     * applied. Any measured offset whose absolute value exceeds this bound is treated as
     * implausible (a hostile / misconfigured `Date` header or an unreliable measurement) and is
     * ignored, so a single response can never arbitrarily extend client-side token validity.
     * Defaults to 10 minutes.
     */
    maxAllowedOffsetMs = DEFAULT_MAX_ALLOWED_OFFSET_MS;

    private readonly _implausibleOffsetDetected = new Subject<ImplausibleClockOffsetEvent>();

    /**
     * Emits whenever a measured offset is rejected for exceeding `maxAllowedOffsetMs`.
     * Surface this to monitoring/telemetry to detect potential `Date`-header tampering or a
     * misconfigured time source; the client console alone is not a reliable security signal.
     */
    readonly implausibleOffsetDetected$ = this._implausibleOffsetDetected.asObservable();

    private _periodicSyncSubscription: Subscription | null = null;
    private _visibilityChangeHandler: (() => void) | null = null;
    private _lastSyncAtMs = 0;

    constructor() {
        this._http = this._injector.get(HttpClient);
    }

    /**
     * Returns the current local time corrected by the last measured clock offset.
     * Use this instead of `Date.now()` when evaluating token expiration to avoid
     * false positives caused by VM / Citrix clock drift.
     *
     * When the feature is disabled via AppConfig, this returns the raw local time so the
     * consuming application behaves exactly as it did before clock-skew correction existed.
     *
     * @returns corrected timestamp in milliseconds
     */
    getCorrectedNow(): number {
        if (!this.isEnabled()) {
            return Date.now();
        }
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
     * Trust model: the `Date` header is unsigned metadata, so it is treated as a best-effort
     * hint only. The measured offset is bounded by `maxAllowedOffsetMs` (see the security guard
     * below) and client-side expiry is only ever a convenience check — the server remains the
     * sole authority on token validity and enforces `exp` against its own clock on every call.
     *
     * @returns Observable that completes after the offset has been stored (or silently on error)
     */
    syncClockOffset(): Observable<void> {
        if (!this.isEnabled()) {
            return of(void 0);
        }

        const appRootUrl = this.getAppRootUrl();

        try {
            const startTime = Date.now();
            this._lastSyncAtMs = startTime;
            return this._http.head(appRootUrl, { observe: 'response', responseType: 'text' }).pipe(
                timeout(SYNC_REQUEST_TIMEOUT_MS),
                map((response) => {
                    const endTime = Date.now();
                    const dateHeader = response.headers.get('date');

                    if (!dateHeader) {
                        this._logService.debug('TimeSyncService: response has no Date header; keeping the current clock offset.');
                        return;
                    }

                    // The HTTP `Date` header is always expressed in GMT (RFC 7231), and both
                    // `new Date(...).getTime()` and `Date.now()` return absolute epoch
                    // milliseconds in UTC. The offset math below is therefore independent of the
                    // browser's local time zone or daylight-saving settings.
                    const serverTimeInMs = new Date(dateHeader).getTime();
                    if (isNaN(serverTimeInMs)) {
                        this._logService.debug(
                            `TimeSyncService: unable to parse Date header "${this.sanitizeForLog(dateHeader)}"; keeping the current clock offset.`
                        );
                        return;
                    }

                    const roundTripTimeInMs = endTime - startTime;
                    const adjustedServerTimeInMs = serverTimeInMs + roundTripTimeInMs / 2;
                    const newOffset = adjustedServerTimeInMs - endTime;

                    // Security guard: never trust an implausibly large correction. The `Date`
                    // header is unsigned, so a hostile / misconfigured proxy could try to push the
                    // corrected clock backwards to keep expired tokens looking valid on the client
                    // (a negative offset extends client-side token lifetime). Bounding the
                    // magnitude caps the worst-case client-side exposure window to
                    // `maxAllowedOffsetMs`; beyond that we ignore the measurement and fall back to
                    // the raw local clock.
                    if (Math.abs(newOffset) > this.maxAllowedOffsetMs) {
                        this._logService.warn(
                            `TimeSyncService: ignoring implausible clock offset of ${Math.round(newOffset)} ms ` +
                                `(exceeds the maximum allowed ${this.maxAllowedOffsetMs} ms). Falling back to the local clock.`
                        );
                        this._implausibleOffsetDetected.next({
                            measuredOffsetMs: Math.round(newOffset),
                            maxAllowedOffsetMs: this.maxAllowedOffsetMs
                        });
                        return;
                    }

                    this.clockOffsetMs = newOffset;
                }),
                catchError((error) => {
                    this._logService.debug('TimeSyncService: failed to synchronise the clock offset; falling back to the local clock.', error);
                    return of(void 0);
                })
            );
        } catch (error) {
            this._logService.debug('TimeSyncService: unexpected error while synchronising the clock offset; falling back to the local clock.', error);
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
     */
    startPeriodicSync(intervalMs: number = DEFAULT_PERIODIC_SYNC_INTERVAL_MS): void {
        if (!this.isEnabled()) {
            return;
        }

        this.stopPeriodicSync();

        this._ngZone.runOutsideAngular(() => {
            this._periodicSyncSubscription = interval(intervalMs)
                .pipe(switchMap(() => this.syncClockOffset()))
                .subscribe();

            this._visibilityChangeHandler = () => {
                if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                    // Debounce rapid visibility toggles (and multiple resumes across tabs) so we
                    // do not issue a burst of redundant HEAD requests when a session resumes.
                    if (Date.now() - this._lastSyncAtMs < VISIBILITY_SYNC_DEBOUNCE_MS) {
                        return;
                    }
                    this.syncClockOffset().subscribe();
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
     *
     * @returns the application root URL used for time-sync HEAD requests
     */
    private getAppRootUrl(): string {
        if (typeof window !== 'undefined') {
            return window.location.href.split('?')[0].split('#')[0];
        }
        return '/';
    }

    /**
     * Whether clock-skew correction is enabled. Controlled by the `auth.timeSync.enabled`
     * AppConfig flag so a consuming application can turn the feature on without code changes.
     * The feature is opt-in: it defaults to `false` when the flag is absent, so an application
     * behaves exactly as it did before clock-skew correction existed until it explicitly enables it.
     *
     * @returns true when the feature is enabled
     */
    private isEnabled(): boolean {
        return this._appConfig.get<boolean>(AppConfigValues.AUTH_TIME_SYNC_ENABLED, false);
    }

    /**
     * Sanitizes an untrusted, in-path-controllable value (e.g. the server `Date` header) before
     * it is written to a log. Strips control characters (including CR/LF) to prevent log forging
     * if the log bus is ever forwarded to a backend store, and caps the length to bound noise.
     *
     * @param value raw value to sanitize
     * @returns a log-safe representation of the value
     */
    private sanitizeForLog(value: string): string {
        // eslint-disable-next-line no-control-regex
        return value.replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, 100);
    }
}
