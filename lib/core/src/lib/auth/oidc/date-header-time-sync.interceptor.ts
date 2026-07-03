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

import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TimeSyncService } from '../services/time-sync.service';

/**
 * HTTP interceptor that passively keeps the clock offset in `TimeSyncService` up-to-date
 * by reading the standard `Date` response header (RFC 7231) from every HTTP response.
 *
 * This removes the need for a dedicated `serverTimeUrl` endpoint: as long as HTTP responses
 * include a `Date` header (all well-behaved HTTP/1.1 and HTTP/2 servers do), the clock drift
 * correction will be applied transparently without an extra network round-trip.
 *
 * The interceptor is registered automatically when `provideCoreAuth()` is used.
 */
@Injectable()
export class DateHeaderTimeSyncInterceptor implements HttpInterceptor {
    private readonly _timeSyncService = inject(TimeSyncService);

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const requestStartTime = Date.now();
        return next.handle(request).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    const dateHeader = event.headers.get('date');
                    if (dateHeader) {
                        this._timeSyncService.updateClockOffsetFromDateHeader(dateHeader, requestStartTime);
                    }
                }
            })
        );
    }
}
