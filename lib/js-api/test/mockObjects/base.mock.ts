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

/* eslint-disable no-underscore-dangle, jsdoc/require-jsdoc */
import { MockAgent, Interceptable, fetch as undiciFetch } from 'undici';

export function getGlobalMockAgent(): MockAgent {
    if (!(global as any).__mockAgent__) {
        const agent = new MockAgent();
        agent.disableNetConnect();
        (global as any).__mockAgent__ = agent;
    }
    const agent: MockAgent = (global as any).__mockAgent__;
    (process as any).__test_fetch__ = (input: any, init?: any) => undiciFetch(input, { ...init, dispatcher: agent });
    return agent;
}

export function resetGlobalMockAgent(): void {
    const agent = (global as any).__mockAgent__;
    if (agent) {
        agent.close();
        (global as any).__mockAgent__ = undefined;
    }
    delete (process as any).__test_fetch__;
}

interface MockReplyChain {
    reply(statusCode: number, body?: any, headers?: Record<string, string>): void;
}

interface MockQueryable {
    query(params: Record<string, string>): MockReplyChain;
    reply(statusCode: number, body?: any, headers?: Record<string, string>): void;
}

interface MockInterceptor {
    get(path: string, body?: any): MockQueryable;
    post(path: string, body?: any): MockQueryable;
    put(path: string, body?: any): MockQueryable;
    delete(path: string, body?: any): MockQueryable;
}

function buildQueryString(params: Record<string, string>): string {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        sp.append(key, value);
    }
    return sp.toString();
}

// cspell:ignore Interceptable
function createInterceptor(pool: Interceptable): MockInterceptor {
    const doIntercept = (method: string, path: string, body?: any): MockReplyChain => ({
        reply(statusCode: number, responseBody?: any, headers?: Record<string, string>) {
            const interceptOpts: any = { path, method };
            if (body && method !== 'GET' && method !== 'DELETE') {
                interceptOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
            }
            const responseHeaders = { 'content-type': 'application/json', ...headers };
            const replyBody =
                responseBody === undefined || responseBody === ''
                    ? ''
                    : typeof responseBody === 'string'
                      ? responseBody
                      : JSON.stringify(responseBody);
            pool.intercept(interceptOpts).reply(statusCode, replyBody, { headers: responseHeaders });
        }
    });

    const makeChain = (method: string, path: string, body?: any): MockQueryable => ({
        query(params: Record<string, string>): MockReplyChain {
            const qs = buildQueryString(params);
            const separator = path.includes('?') ? '&' : '?';
            return doIntercept(method, `${path}${separator}${qs}`, body);
        },
        reply(statusCode: number, responseBody?: any, headers?: Record<string, string>) {
            doIntercept(method, path, body).reply(statusCode, responseBody, headers);
        }
    });

    return {
        get: (path: string) => makeChain('GET', path),
        post: (path: string, body?: any) => makeChain('POST', path, body),
        put: (path: string, body?: any) => makeChain('PUT', path, body),
        delete: (path: string, body?: any) => makeChain('DELETE', path, body)
    };
}

export function mockHost(host: string): MockInterceptor {
    const agent = getGlobalMockAgent();
    const pool = agent.get(host);
    return createInterceptor(pool);
}

export class BaseMock {
    host: string;

    constructor(host?: string) {
        this.host = host || 'https://127.0.0.1:8080';
    }

    protected mock(): MockInterceptor {
        return mockHost(this.host);
    }

    put200GenericResponse(scriptSlug: string): void {
        this.mock().put(scriptSlug).reply(200);
    }

    cleanAll(): void {
        const agent = getGlobalMockAgent();
        const pool = agent.get(this.host) as Interceptable;
        pool.cleanMocks();
    }
}
