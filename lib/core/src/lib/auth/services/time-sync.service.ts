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
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { AppConfigService } from '../../app-config/app-config.service';

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
            }),
            catchError(() => {
                this.clockOffsetMs = 0;
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

    private isEnabled(): boolean {
        return this._appConfigService.oauth2.timeSync === true;
    }

    private getServerTime(): Observable<number> {
        return this._http.get<number>(this.getServerTimeUrl()).pipe(
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
