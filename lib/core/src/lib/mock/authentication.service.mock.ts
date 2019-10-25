/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Observable, of, throwError } from 'rxjs';
import { RedirectionModel } from '../models/redirection.model';

// TODO: should be extending AuthenticationService
export class AuthenticationMock /*extends AuthenticationService*/ {
    private redirectUrl: RedirectionModel = null;

    setRedirectUrl(url: RedirectionModel) {
        this.redirectUrl = url;
    }

    getRedirectUrl(): string|null {
        return this.redirectUrl ? this.redirectUrl.url : null;
    }

    // TODO: real auth service returns Observable<string>
    login(username: string, password: string): Observable<{ type: string, ticket: any }> {
        if (username === 'fake-username' && password === 'fake-password') {
            return of({ type: 'type', ticket: 'ticket'});
        }

        if (username === 'fake-username-CORS-error' && password === 'fake-password') {
            return throwError({
                error: {
                    crossDomain: true,
                    message: 'ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin'
                }
            });
        }

        if (username === 'fake-username-CSRF-error' && password === 'fake-password') {
            return throwError({message: 'ERROR: Invalid CSRF-token', status: 403});
        }

        if (username === 'fake-username-ECM-access-error' && password === 'fake-password') {
            return throwError({message: 'ERROR: 00170728 Access Denied.  The system is currently in read-only mode', status: 403});
        }

        return throwError('Fake server error');
    }
}
