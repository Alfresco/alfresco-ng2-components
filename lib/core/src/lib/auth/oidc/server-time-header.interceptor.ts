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
import { OAuthService } from 'angular-oauth2-oidc';
import { AppConfigService } from '../../app-config/app-config.service';
import { TimeSyncService } from '../services/time-sync.service';

/**
 * The default HTTP response header used to read the server time.
 *
 * RFC 7231 §7.1.1.2 mandates that the HTTP `Date` header MUST be expressed in
 * Greenwich Mean Time (GMT / UTC), e.g.:
 *   `Date: Mon, 14 Oct 2024 13:14:00 GMT`
 *
 * When a custom header is configured via `serverTimeHeader`, it must also carry
 * an explicit UTC offset (GMT, UTC, or ±HH:MM) so that the value can be
 * unambiguously parsed. Values without a timezone indicator are rejected to
 * prevent silent clock-skew miscalculations caused by local-time misinterpretation.
 */
export const DEFAULT_SERVER_TIME_HEADER = 'Date';

/**
 * Regex that matches an explicit UTC timezone indicator inside a date string:
 * - `GMT` or `UTC` (case-insensitive)
 * - ISO-8601 `Z` suffix
 * - Numeric offset `+00:00` / `-05:30` etc.
 */
const UTC_TIMEZONE_PATTERN = /(?:GMT|UTC|Z|[+-]\d{2}:\d{2})$/i;

/**
 * `ServerTimeHeaderInterceptor` intercepts HTTP requests sent to the OIDC issuer
 * (the identity provider configured as `oauth2.host`) and extracts the server time
 * from a response header (default: `Date`, RFC 7231). The captured snapshot is
 * forwarded to {@link TimeSyncService} so that clock-skew checks can be performed
 * without making dedicated REST calls to a separate time endpoint.
 *
 * Only responses from the OIDC issuer are processed. This deliberately targets
 * authentication-related traffic — discovery-document fetches, token exchanges and
 * token refreshes — because it is the identity provider's clock that signs JWT tokens
 * and whose time is most relevant to the clock-skew check.
 *
 * Register this interceptor in your application providers, for example:
 * ```typescript
 * { provide: HTTP_INTERCEPTORS, useClass: ServerTimeHeaderInterceptor, multi: true }
 * ```
 *
 * The response header name can be overridden via `app.config.json`:
 * ```json
 * { "serverTimeHeader": "X-Server-Time" }
 * ```
 */
@Injectable()
export class ServerTimeHeaderInterceptor implements HttpInterceptor {
    private readonly _timeSyncService = inject(TimeSyncService);
    private readonly _appConfigService = inject(AppConfigService);
    private readonly _oauthService = inject(OAuthService);

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!this.isAuthRelatedRequest(request.url)) {
            return next.handle(request);
        }

        const requestStartTimeMs = Date.now();

        return next.handle(request).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    this.captureServerTime(event, requestStartTimeMs);
                }
            })
        );
    }

    /**
     * Returns `true` when the request URL targets the configured OIDC issuer.
     * This covers all auth-related calls: discovery document, token endpoint,
     * token refresh, and userinfo endpoint.
     *
     * Returns `false` — and skips header capture — when the issuer is not yet
     * configured (i.e. before the OAuth service has been initialised).
     */
    private isAuthRelatedRequest(url: string): boolean {
        const issuer = this._oauthService.issuer;
        return !!issuer && url.startsWith(issuer);
    }

    private captureServerTime(response: HttpResponse<unknown>, requestStartTimeMs: number): void {
        const headerName = this._appConfigService.get<string>('serverTimeHeader', DEFAULT_SERVER_TIME_HEADER);
        const headerValue = response.headers.get(headerName);

        if (!headerValue) {
            return;
        }

        // Reject values that do not carry an explicit UTC timezone indicator.
        // RFC 7231 guarantees this for the standard `Date` header, but a custom
        // header from a misconfigured backend could omit it, causing new Date()
        // to silently interpret the timestamp as local time on the client.
        if (!UTC_TIMEZONE_PATTERN.test(headerValue.trim())) {
            return;
        }

        const serverTimeEpoch = new Date(headerValue).getTime();

        if (isNaN(serverTimeEpoch)) {
            return;
        }

        this._timeSyncService.updateServerTime({
            serverTimeMs: serverTimeEpoch,
            requestStartTimeMs,
            responseReceivedTimeMs: Date.now()
        });
    }
}


