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

import nock from 'nock';
import { BaseMock } from '../base.mock';

export class BpmAuthMock extends BaseMock {
    username: string;
    password: string;

    constructor(host?: string, username?: string, password?: string) {
        super(host);
        this.username = username || 'admin';
        this.password = password || 'admin';
    }

    get200Response(): void {
        this.addCorsSupport();
        nock(this.host, { encodedQueryParams: true })
            .defaultReplyHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control, X-CSRF-TOKEN',
                'Access-Control-Allow-Credentials': 'true',
                'Set-Cookie': 'ACTIVITI_REMEMBER_ME=NjdOdGwvcUtFTkVEczQyMGh4WFp5QT09OmpUL1UwdFVBTC94QTJMTFFUVFgvdFE9PQ; Path=/; HttpOnly'
            })
            .post(
                '/activiti-app/app/authentication',
                'j_username=' + this.username + '&j_password=' + this.password + '&_spring_security_remember_me=true&submit=Login'
            )
            .reply(200);
    }

    get200ResponseLogout(): void {
        this.createNockWithCors().get('/activiti-app/app/logout').reply(200);
    }

    get401Response(): void {
        this.createNockWithCors()
            .post('/activiti-app/app/authentication', 'j_username=wrong&j_password=name&_spring_security_remember_me=true&submit=Login')
            .reply(401, {
                error: {
                    message: 'This request requires HTTP authentication.',
                    statusCode: 401
                }
            });
    }

    get403Response(): void {
        this.createNockWithCors()
            .post('/activiti-app/app/authentication', 'j_username=wrong&j_password=name&_spring_security_remember_me=true&submit=Login')
            .reply(403, {
                error: {
                    errorKey: 'Login failed',
                    statusCode: 403,
                    briefSummary: '05150009 Login failed',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }
}
