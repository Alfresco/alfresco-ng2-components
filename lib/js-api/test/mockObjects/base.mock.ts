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

export class BaseMock {
    host: string;

    constructor(host?: string) {
        this.host = host || 'https://127.0.0.1:8080';
    }

    addCorsSupport() {
        nock(this.host).persist().options(/.*/).reply(200, '', {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control, X-CSRF-TOKEN',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400'
        });
    }

    getDefaultHeaders(): Record<string, string> {
        return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control, X-CSRF-TOKEN',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400'
        };
    }

    protected createNockWithCors(): nock.Scope {
        this.addCorsSupport();
        return nock(this.host, { encodedQueryParams: true }).defaultReplyHeaders(this.getDefaultHeaders());
    }

    put200GenericResponse(scriptSlug: string): void {
        nock(this.host).persist().options(/.*/).reply(200, '', {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control, X-CSRF-TOKEN, Cookie',
            'Access-Control-Allow-Credentials': 'true'
        });
        nock(this.host, { encodedQueryParams: true })
            .defaultReplyHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control, X-CSRF-TOKEN, Cookie',
                'Access-Control-Allow-Credentials': 'true'
            })
            .put(scriptSlug)
            .reply(200);
    }

    play(): void {
        nock.recorder.play();
    }

    cleanAll(): void {
        nock.cleanAll();
    }
}
