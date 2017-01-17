/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Observable } from 'rxjs/Rx';

// TODO: should be extending AlfrescoAuthenticationService
export class AuthenticationMock /*extends AlfrescoAuthenticationService*/ {

    // TODO: real auth service returns Observable<string>
    login(username: string, password: string): Observable<boolean> {
        if (username === 'fake-username' && password === 'fake-password') {
            return Observable.of(true);
        }

        if (username === 'fake-username-CORS-error' && password === 'fake-password') {
            return Observable.throw({
                error: {
                    crossDomain: true,
                    message: 'ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin'
                }
            });
        }

        if (username === 'fake-username-CSRF-error' && password === 'fake-password') {
            return Observable.throw({message: 'ERROR: Invalid CSRF-token', status: 403});
        }

        return Observable.throw('Fake server error');

    }
}
