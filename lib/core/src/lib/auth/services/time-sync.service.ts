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
import { Injectable, inject } from '@angular/core';
import { OAuthLogger } from 'angular-oauth2-oidc';
import { Observable, ReplaySubject, defer, of, throwError, timer } from 'rxjs';
import { catchError, map, share, timeout } from 'rxjs/operators';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';

const SERVER_TIME_CACHE_BYPASS_QUERY_PARAM_NAME = 'adf-time-sync';
const SERVER_TIME_CACHE_WINDOW_IN_MS = 2000;

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
    private readonly _http = inject(HttpClient);
    private readonly _appConfigService = inject(AppConfigService);
    private readonly _oauthLogger = inject(OAuthLogger, { optional: true });

    /**
     * Shared, self-expiring server-time request.
     *
     * OAuth-event-driven callers ask for the server time in quick succession, which
     * previously fired one HTTP request per caller. `share` collapses concurrent
     * subscribers onto a single in-flight request and replays the resolved value to
     * any caller for the next {@link SERVER_TIME_CACHE_WINDOW_IN_MS}; after the window
     * elapses the next subscriber triggers a fresh request. `defer` rebuilds the
     * request options (including a new cache-busting timestamp) for every genuinely
     * new request. Errors are never cached, so the next caller retries immediately.
     */
    private readonly serverTime$: Observable<number> = defer(() => this.requestServerTime()).pipe(
        share({
            connector: () => new ReplaySubject<number>(1),
            resetOnError: true,
            resetOnComplete: () => timer(SERVER_TIME_CACHE_WINDOW_IN_MS),
            resetOnRefCountZero: false
        })
    );

    private clockOffsetMs = 0;

    getCorrectedNow(): number {
        if (!this.isEnabled()) {
            return Date.now();
        }

        return Date.now() + this.clockOffsetMs;
    }

    syncClockOffset(): Observable<void> {
        if (!this.isEnabled()) {
            return of(void 0);
        }

        const startTime = Date.now();
        let serverTime$: Observable<number>;

        try {
            serverTime$ = this.getServerTime();
        } catch {
            this.clockOffsetMs = 0;
            return of(void 0);
        }

        return serverTime$.pipe(
            map((serverTimeResponse: number) => {
                const localCurrentTimeInMs = Date.now();
                const adjustedServerTimeInMs = this.getAdjustedServerTimeInMs(serverTimeResponse, startTime);

                this.clockOffsetMs = adjustedServerTimeInMs - localCurrentTimeInMs;
                this.debug(
                    `syncClockOffset: offset set to ${this.clockOffsetMs}ms ` +
                        `(server=${new Date(adjustedServerTimeInMs).toISOString()}, local=${new Date(localCurrentTimeInMs).toISOString()})`
                );
            }),
            catchError(() => {
                this.clockOffsetMs = 0;
                this.debug('syncClockOffset: failed to reach server, offset reset to 0');
                return of(void 0);
            })
        );
    }

    checkTimeSync(maxAllowedClockSkewInSec: number): Observable<TimeSync> {
        const startTime = Date.now();

        return this.getServerTime().pipe(
            map((serverTimeResponse: number) => {
                const localCurrentTimeInMs = Date.now();
                const adjustedServerTimeInMs = this.getAdjustedServerTimeInMs(serverTimeResponse, startTime);
                let localTimeInMs = localCurrentTimeInMs;

                if (this.isEnabled()) {
                    this.clockOffsetMs = adjustedServerTimeInMs - localCurrentTimeInMs;
                    localTimeInMs = localCurrentTimeInMs + this.clockOffsetMs;
                }

                const timeOffsetInMs = Math.abs(localTimeInMs - adjustedServerTimeInMs);
                const maxAllowedClockSkewInMs = maxAllowedClockSkewInSec * 1000;
                const outOfSync = timeOffsetInMs > maxAllowedClockSkewInMs;

                this.debug(
                    `checkTimeSync: outOfSync=${outOfSync} ` +
                        `(local=${new Date(localTimeInMs).toISOString()}, server=${new Date(adjustedServerTimeInMs).toISOString()}, offset=${this.clockOffsetMs}ms)`
                );

                return {
                    outOfSync,
                    timeOffsetInSec: timeOffsetInMs / 1000,
                    localDateTimeISO: new Date(localTimeInMs).toISOString(),
                    serverDateTimeISO: new Date(adjustedServerTimeInMs).toISOString()
                };
            }),
            catchError((error) => throwError(() => new Error(error)))
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

    private getServerTime(): Observable<number> {
        return this.serverTime$;
    }

    private requestServerTime(): Observable<number> {
        const requestOptions = {
            observe: 'response' as const,
            responseType: 'text' as const,
            ...(this.isEnabled() && {
                headers: {
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache'
                },
                params: {
                    [SERVER_TIME_CACHE_BYPASS_QUERY_PARAM_NAME]: Date.now().toString()
                }
            })
        };

        return this._http.get(this.getAppRootUrl(), requestOptions).pipe(
            map((response: HttpResponse<string>) => this.getServerTimeFromDateHeader(response)),
            timeout(5000),
            catchError(() => throwError(() => new Error('Failed to get server time')))
        );
    }

    private getServerTimeFromDateHeader(response: HttpResponse<string>): number {
        const dateHeader = response.headers.get('date');
        if (!dateHeader) {
            throw new Error('Date header is not available.');
        }

        return new Date(dateHeader).getTime();
    }

    private getAppRootUrl(): string {
        if (typeof window !== 'undefined') {
            return window.location.href.split('?')[0].split('#')[0];
        }

        return '/';
    }

    private get showDebugInformation(): boolean {
        const enableDebugInformation = this._appConfigService.get<boolean | string>(AppConfigValues.AUTH_SHOW_DEBUG_INFORMATION, false);
        return enableDebugInformation === true || enableDebugInformation === 'true';
    }

    private debug(message: string): void {
        if (this.showDebugInformation) {
            this._oauthLogger?.info(`[TimeSync] ${message}`);
        }
    }
}
