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

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, NgZone, inject } from '@angular/core';
import { interval, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap, timeout } from 'rxjs/operators';
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
 * telemetry to detect misconfigured time sources or server-time tampering across the fleet.
 */
export interface ImplausibleClockOffsetEvent {
    measuredOffsetMs: number;
    maxAllowedOffsetMs: number;
}

export type ClockSyncStatus = 'disabled' | 'synced' | 'failed' | 'missing-server-time' | 'invalid-server-time' | 'implausible-offset';

export interface ClockSyncResult {
    status: ClockSyncStatus;
    appliedOffsetMs: number;
    previousOffsetMs: number;
    hasSuccessfulSync: boolean;
    lastSuccessfulSyncAtMs?: number;
}

/** Timestamps captured during a single server-time request and used to calculate clock offset. */
interface ClockSyncMeasurement {
    serverTimeInMs: number;
    startMonotonicTimeInMs: number;
    endTimeInMs: number;
}

/** Default interval for periodic clock re-sync (5 minutes). */
const DEFAULT_PERIODIC_SYNC_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Default upper bound, in milliseconds, for a clock offset that will be trusted (10 minutes).
 * Offsets larger than this are treated as implausible and ignored so that one time response
 * cannot arbitrarily extend client-side token validity. See `maxAllowedOffsetMs`.
 */
const DEFAULT_MAX_ALLOWED_OFFSET_MS = 10 * 60 * 1000;

/** Minimum delay between visibility-triggered re-syncs (30 seconds) to avoid request storms. */
const VISIBILITY_SYNC_DEBOUNCE_MS = 30 * 1000;

/** Timeout applied to the time-sync request (5 seconds). */
const SYNC_REQUEST_TIMEOUT_MS = 5000;

@Injectable({
    providedIn: 'root'
})
export class TimeSyncService {
    private readonly _http = inject(HttpClient);
    private readonly _ngZone = inject(NgZone);
    private readonly _logService = inject(LogService);
    private readonly _appConfig = inject(AppConfigService);

    /**
     * The signed offset in milliseconds between the adjusted server time and the local clock.
     * Positive means the local clock is behind the server; negative means it is ahead.
     * Defaults to 0 until `syncClockOffset` has successfully run.
     */
    clockOffsetMs = 0;

    /**
     * Maximum magnitude, in milliseconds, of a measured clock offset that will be trusted and
     * applied. Any measured offset whose absolute value exceeds this bound is treated as
     * implausible (a hostile / misconfigured server-time response or an unreliable measurement) and is
     * ignored, so a single response can never arbitrarily extend client-side token validity.
     * Defaults to 10 minutes.
     */
    maxAllowedOffsetMs = DEFAULT_MAX_ALLOWED_OFFSET_MS;

    private readonly _implausibleOffsetDetected = new Subject<ImplausibleClockOffsetEvent>();

    /**
     * Emits whenever a measured offset is rejected for exceeding `maxAllowedOffsetMs`.
     * Surface this to monitoring/telemetry to detect potential server-time tampering or a
     * misconfigured time source; the client console alone is not a reliable security signal.
     */
    readonly implausibleOffsetDetected$ = this._implausibleOffsetDetected.asObservable();

    private _periodicSyncSubscription: Subscription | null = null;
    private _visibilityChangeHandler: (() => void) | null = null;
    private _lastSyncAtMs = 0;
    private _lastSuccessfulSyncAtMs: number | null = null;
    private _inFlightSync$: Observable<ClockSyncResult> | null = null;

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
     * Synchronizes the local correction offset from `serverTimeUrl`.
     *
     * When `oauth2.timeSync` is false or missing, no request is made and callers keep using the raw
     * local clock. When it is true, `serverTimeUrl` must return a server-generated time string in
     * the response body. Any missing URL, failed request, missing/invalid body, or rejected offset
     * leaves the current offset unchanged; with no previous successful sync this is `0`, which is
     * the old raw-clock behavior.
     *
     * @returns Observable that completes after the offset decision has been made
     */
    syncClockOffset(): Observable<void> {
        return this.syncClockOffsetResult().pipe(map(() => void 0));
    }

    /**
     * Syncs the clock offset and reports whether the current offset came from a fresh successful
     * measurement, a previous trusted sync, or the old raw-clock path.
     *
     * @returns Observable that emits the sync outcome after the offset decision has been made
     */
    syncClockOffsetResult(): Observable<ClockSyncResult> {
        return new Observable<ClockSyncResult>((subscriber) => {
            const previousOffsetMs = this.clockOffsetMs;

            if (!this.isEnabled()) {
                subscriber.next(this.createClockSyncResult('disabled', 0, previousOffsetMs));
                subscriber.complete();
                return undefined;
            }

            if (!this._inFlightSync$) {
                this._inFlightSync$ = this.createClockSyncRequest(previousOffsetMs);
            }

            const subscription = this._inFlightSync$.subscribe(subscriber);
            return () => subscription.unsubscribe();
        });
    }

    /**
     * Checks the time synchronisation status using the stored clock offset.
     *
     * @param maxAllowedClockSkewInSec - The maximum allowed clock skew in seconds.
     * @returns An Observable that emits a TimeSync result.
     */
    checkTimeSync(maxAllowedClockSkewInSec: number): Observable<TimeSync> {
        const localCurrentTimeInMs = Date.now();
        const clockOffsetMs = this.isEnabled() ? this.clockOffsetMs : 0;
        const adjustedServerTimeInMs = localCurrentTimeInMs + clockOffsetMs;
        const timeOffsetInMs = Math.abs(clockOffsetMs);
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
                    // do not issue a burst of redundant time-sync requests when a session resumes.
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
     * Whether clock-skew correction is enabled. Controlled by the optional `oauth2.timeSync`
     * AppConfig flag so a consuming application can turn the feature on without code changes.
     * The feature is opt-in: it defaults to `false` when the flag is absent, so an application
     * behaves exactly as it did before clock-skew correction existed until it explicitly enables it.
     *
     * @returns true when the feature is enabled
     */
    private isEnabled(): boolean {
        return this._appConfig.oauth2.timeSync === true;
    }

    /**
     * Builds the one HTTP request used by all overlapping sync callers.
     * The request is shared until it completes, so multiple consumers waiting on the same sync do
     * not issue duplicate calls to `serverTimeUrl`.
     *
     * @param previousOffsetMs offset that was active before this sync attempt started
     * @returns shared sync result observable
     */
    private createClockSyncRequest(previousOffsetMs: number): Observable<ClockSyncResult> {
        const serverTimeUrl = this.getServerTimeUrl();

        if (!serverTimeUrl) {
            return this.createSharedResult(this.createClockSyncResult('failed', this.clockOffsetMs, previousOffsetMs));
        }

        const startTimeInMs = Date.now();
        const startMonotonicTimeInMs = this.getMonotonicNow();
        this._lastSyncAtMs = startTimeInMs;

        return this.requestServerTime(serverTimeUrl).pipe(
            timeout(SYNC_REQUEST_TIMEOUT_MS),
            map((response) => this.handleServerTimeResponse(response, startMonotonicTimeInMs, previousOffsetMs)),
            catchError((error) => this.handleClockSyncRequestError(error, previousOffsetMs)),
            finalize(() => (this._inFlightSync$ = null)),
            shareReplay({ bufferSize: 1, refCount: false })
        );
    }

    /**
     * Reads and validates `serverTimeUrl` from app.config.json.
     * Relative same-origin URLs and absolute HTTP(S) URLs are supported. Unsupported schemes are
     * ignored so configuration mistakes cannot trigger unexpected browser protocols.
     *
     * @returns configured server time URL, or null when time sync should fall back to raw clock
     */
    private getServerTimeUrl(): string | null {
        const serverTimeUrlValue = this._appConfig.get<unknown>(AppConfigValues.SERVER_TIME_URL);
        const serverTimeUrl = typeof serverTimeUrlValue === 'string' ? serverTimeUrlValue.trim() : '';

        if (!serverTimeUrl) {
            this._logService.debug('TimeSyncService: serverTimeUrl is not configured; keeping the current clock offset.');
            return null;
        }

        if (this.isSupportedServerTimeUrl(serverTimeUrl)) {
            return serverTimeUrl;
        }

        this._logService.warn(`TimeSyncService: ignoring unsupported serverTimeUrl "${this.sanitizeForLog(serverTimeUrl)}".`);
        return null;
    }

    /**
     * Allows relative same-origin URLs and absolute HTTP(S) URLs for `serverTimeUrl`.
     * Protocol-relative URLs and unsupported schemes are rejected to avoid surprising browser
     * behavior from configuration values.
     *
     * @param url configured server time URL
     * @returns true when the URL can be requested by the time-sync service
     */
    private isSupportedServerTimeUrl(url: string): boolean {
        return /^https?:\/\//i.test(url) || (!/^[a-z][a-z\d+.-]*:/i.test(url) && !url.startsWith('//'));
    }

    /**
     * Requests server time as plain text.
     * The endpoint is expected to return the server instant in the response body; no response
     * headers are required for the configured time-sync path.
     *
     * @param serverTimeUrl configured time source URL
     * @returns HTTP response containing a server time body
     */
    private requestServerTime(serverTimeUrl: string): Observable<HttpResponse<string>> {
        return this._http.get(serverTimeUrl, { observe: 'response', responseType: 'text' });
    }

    /**
     * Turns the server response into a sync result.
     * This method intentionally reads as a small pipeline: extract text, parse it, measure the
     * offset, then apply or reject the correction.
     *
     * @param response HTTP response from `serverTimeUrl`
     * @param startMonotonicTimeInMs monotonic timestamp captured before the request
     * @param previousOffsetMs offset active before this sync attempt
     * @returns sync result for the response
     */
    private handleServerTimeResponse(response: HttpResponse<string>, startMonotonicTimeInMs: number, previousOffsetMs: number): ClockSyncResult {
        const serverTime = this.extractServerTime(response);

        if (serverTime === null) {
            return this.createClockSyncResult('missing-server-time', this.clockOffsetMs, previousOffsetMs);
        }

        const serverTimeInMs = this.parseServerTime(serverTime);
        if (isNaN(serverTimeInMs)) {
            return this.createClockSyncResult('invalid-server-time', this.clockOffsetMs, previousOffsetMs);
        }

        return this.applyMeasuredOffset(
            {
                serverTimeInMs,
                startMonotonicTimeInMs,
                endTimeInMs: Date.now()
            },
            previousOffsetMs
        );
    }

    /**
     * Extracts the configured server-time value from the response body.
     * Empty bodies are treated as a failed sync and leave the current offset unchanged.
     *
     * @param response HTTP response from `serverTimeUrl`
     * @returns trimmed server time value, or null when the body is empty
     */
    private extractServerTime(response: HttpResponse<string>): string | null {
        const serverTime = response.body?.trim();

        if (!serverTime) {
            this._logService.debug('TimeSyncService: response has no server time value; keeping the current clock offset.');
            return null;
        }

        return serverTime;
    }

    /**
     * Applies a measured offset when it is within the configured trust bound.
     * The round-trip duration is measured with a monotonic clock so wall-clock jumps during the
     * request cannot distort the latency adjustment.
     *
     * @param measurement timestamps needed to calculate the offset
     * @param previousOffsetMs offset active before this sync attempt
     * @returns sync result after applying or rejecting the measured offset
     */
    private applyMeasuredOffset(measurement: ClockSyncMeasurement, previousOffsetMs: number): ClockSyncResult {
        const measuredOffsetMs = this.calculateOffsetMs(measurement);

        if (this.isImplausibleOffset(measuredOffsetMs)) {
            this.reportImplausibleOffset(measuredOffsetMs);
            return this.createClockSyncResult('implausible-offset', this.clockOffsetMs, previousOffsetMs);
        }

        this.clockOffsetMs = measuredOffsetMs;
        this._lastSuccessfulSyncAtMs = measurement.endTimeInMs;

        return this.createClockSyncResult('synced', measuredOffsetMs, previousOffsetMs);
    }

    /**
     * Calculates the signed difference between the local clock and adjusted server time.
     * Positive means the client is behind the server; negative means it is ahead.
     *
     * @param measurement timestamps from the sync attempt
     * @returns signed clock offset in milliseconds
     */
    private calculateOffsetMs(measurement: ClockSyncMeasurement): number {
        const roundTripTimeInMs = Math.max(0, this.getMonotonicNow() - measurement.startMonotonicTimeInMs);
        const adjustedServerTimeInMs = measurement.serverTimeInMs + roundTripTimeInMs / 2;

        return adjustedServerTimeInMs - measurement.endTimeInMs;
    }

    /**
     * Checks whether the measured offset is too large to trust.
     * Bounding the offset keeps a bad time source from extending client-side token validity by an
     * arbitrary amount. The server remains the final authority for token validity.
     *
     * @param offsetMs measured signed offset in milliseconds
     * @returns true when the offset must be rejected
     */
    private isImplausibleOffset(offsetMs: number): boolean {
        return Math.abs(offsetMs) > this.maxAllowedOffsetMs;
    }

    /**
     * Emits and logs a rejected offset measurement.
     * Consumers can subscribe to `implausibleOffsetDetected$` and forward the event to telemetry.
     *
     * @param offsetMs measured signed offset in milliseconds
     */
    private reportImplausibleOffset(offsetMs: number): void {
        const roundedOffsetMs = Math.round(offsetMs);

        this._logService.warn(
            `TimeSyncService: ignoring implausible clock offset of ${roundedOffsetMs} ms ` +
                `(exceeds the maximum allowed ${this.maxAllowedOffsetMs} ms). Keeping the current clock offset.`
        );
        this._implausibleOffsetDetected.next({
            measuredOffsetMs: roundedOffsetMs,
            maxAllowedOffsetMs: this.maxAllowedOffsetMs
        });
    }

    /**
     * Parses supported server time response formats.
     * Numeric values below `1_000_000_000_000` are treated as epoch seconds; larger numeric values
     * are treated as epoch milliseconds. Non-numeric values are parsed as date strings.
     *
     * @param serverTime raw server time response body
     * @returns parsed epoch milliseconds, or NaN when the value cannot be parsed
     */
    private parseServerTime(serverTime: string): number {
        const trimmedServerTime = serverTime.trim();
        const numericServerTime = Number(trimmedServerTime);

        if (trimmedServerTime && Number.isFinite(numericServerTime)) {
            return Math.abs(numericServerTime) < 1_000_000_000_000 ? numericServerTime * 1000 : numericServerTime;
        }

        const parsedServerTime = new Date(trimmedServerTime).getTime();

        if (isNaN(parsedServerTime)) {
            this._logService.debug(
                `TimeSyncService: unable to parse server time "${this.sanitizeForLog(serverTime)}"; keeping the current clock offset.`
            );
        }

        return parsedServerTime;
    }

    /**
     * Wraps an immediate result in the same shared/finalized shape as HTTP-backed sync requests.
     * This keeps `_inFlightSync$` lifecycle handling identical for missing configuration and real
     * network requests.
     *
     * @param result immediate sync result
     * @returns shared result observable
     */
    private createSharedResult(result: ClockSyncResult): Observable<ClockSyncResult> {
        return of(result).pipe(
            finalize(() => (this._inFlightSync$ = null)),
            shareReplay({ bufferSize: 1, refCount: false })
        );
    }

    /**
     * Converts network, timeout, and unexpected HTTP errors into a non-throwing sync result.
     * Failed syncs keep the current offset so the caller falls back to the internal clock when no
     * earlier successful sync exists.
     *
     * @param error request error to log
     * @param previousOffsetMs offset active before this sync attempt
     * @returns failed sync result observable
     */
    private handleClockSyncRequestError(error: unknown, previousOffsetMs: number): Observable<ClockSyncResult> {
        this._logService.debug('TimeSyncService: failed to synchronise the clock offset; keeping the current clock offset.', error);
        return of(this.createClockSyncResult('failed', this.clockOffsetMs, previousOffsetMs));
    }

    /**
     * Creates the normalized result object returned by sync callers.
     * `hasSuccessfulSync` and `lastSuccessfulSyncAtMs` describe whether the current offset has ever
     * come from a trusted server-time response.
     *
     * @param status outcome of this sync attempt
     * @param appliedOffsetMs offset kept or applied after this attempt
     * @param previousOffsetMs offset that was active before this attempt
     * @returns normalized sync result
     */
    private createClockSyncResult(status: ClockSyncStatus, appliedOffsetMs: number, previousOffsetMs: number): ClockSyncResult {
        return {
            status,
            appliedOffsetMs,
            previousOffsetMs,
            hasSuccessfulSync: this._lastSuccessfulSyncAtMs !== null,
            ...(this._lastSuccessfulSyncAtMs === null ? {} : { lastSuccessfulSyncAtMs: this._lastSuccessfulSyncAtMs })
        };
    }

    /**
     * Reads a monotonic timestamp for request round-trip measurement.
     * Falls back to `Date.now()` only in non-browser environments where `performance.now` is not
     * available.
     *
     * @returns monotonic timestamp in milliseconds
     */
    private getMonotonicNow(): number {
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            return performance.now();
        }
        return Date.now();
    }

    /**
     * Sanitizes an untrusted, configuration-controlled or server-controlled value before
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
