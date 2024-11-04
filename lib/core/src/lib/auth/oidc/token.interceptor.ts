/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';

@Injectable()
/**
 * TokenInterceptor is an HTTP interceptor that processes HTTP requests and responses
 * to handle the id_token. It checks if the request URL matches the token endpoint
 * and processes the response to store the `id_token` in the OAuth storage if it is
 * not already set.
 * The purpose of this interceptor is to fix the missing `id_token_hint` required by the Idp to complete the logout.
 * `id_token_hint` is set by the `angular-oauth2-oidc` library only when the `id_token` is set in the storage.
 * https://github.com/manfredsteyer/angular-oauth2-oidc/blob/15.0.0/projects/lib/src/oauth-service.ts#L2555
 *
 * See the related issue: https://github.com/manfredsteyer/angular-oauth2-oidc/issues/1443
 * @function intercept
 * @param {HttpRequest<unknown>} request - The outgoing HTTP request.
 * @param {HttpHandler} next - The next handler in the HTTP request chain.
 * @returns {Observable<HttpEvent<unknown>>} An observable of the HTTP event.
 */
export class TokenInterceptor implements HttpInterceptor {
    private readonly _oauthStorage = inject(OAuthStorage);
    private readonly _oauthService = inject(OAuthService);

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const tokenEndpoint = this._oauthService.tokenEndpoint;
        if (tokenEndpoint && request.url === tokenEndpoint) {
            return next.handle(request).pipe(
                tap((event) => {
                    if (event instanceof HttpResponse) {
                        if (!this._oauthService.getIdToken() && event?.body?.id_token) {
                            this._oauthStorage.setItem('id_token', event.body.id_token);
                        }
                    }
                })
            );
        }
        return next.handle(request);
    }
}
