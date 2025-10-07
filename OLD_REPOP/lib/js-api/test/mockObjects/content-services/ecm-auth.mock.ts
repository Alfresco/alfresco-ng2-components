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

export class EcmAuthMock extends BaseMock {
    username: string;
    password: string;

    constructor(host?: string, username?: string, password?: string) {
        super(host);
        this.username = username || 'admin';
        this.password = password || 'admin';
    }

    get201Response(forceTicket?: string): void {
        const returnMockTicket = forceTicket || 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1';

        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/authentication/versions/1/tickets', {
                userId: this.username,
                password: this.password
            })
            .reply(201, { entry: { id: returnMockTicket, userId: 'admin' } });
    }

    get200ValidTicket(forceTicket?: string): void {
        const returnMockTicket = forceTicket || 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1';

        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/authentication/versions/1/tickets/-me-')
            .reply(200, { entry: { id: returnMockTicket } });
    }

    get401InvalidTicket(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/authentication/versions/1/tickets/-me-')
            .reply(401, {
                error: {
                    errorKey: 'framework.exception.ApiDefault',
                    statusCode: 401,
                    briefSummary: '05210059 Authentication failed for Web Script org/alfresco/api/ResourceWebScript.get',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get403Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/authentication/versions/1/tickets', {
                userId: 'wrong',
                password: 'name'
            })
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

    get400Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/authentication/versions/1/tickets', {
                userId: null,
                password: null
            })
            .reply(400, {
                error: {
                    errorKey: 'Invalid login details.',
                    statusCode: 400,
                    briefSummary: '05160045 Invalid login details.',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get401Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/authentication/versions/1/tickets', {
                userId: 'wrong',
                password: 'name'
            })
            .reply(401, {
                error: {
                    errorKey: 'framework.exception.ApiDefault',
                    statusCode: 401,
                    briefSummary: '05210059 Authentication failed for Web Script org/alfresco/api/ResourceWebScript.get',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get204ResponseLogout(): void {
        nock(this.host, { encodedQueryParams: true }).delete('/alfresco/api/-default-/public/authentication/versions/1/tickets/-me-').reply(204, '');
    }

    get404ResponseLogout(): void {
        nock(this.host, { encodedQueryParams: true }).delete('/alfresco/api/-default-/public/authentication/versions/1/tickets/-me-').reply(404, '');
    }
}
