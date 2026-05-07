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

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, jsdoc/require-jsdoc */
import { TextEncoder, TextDecoder } from 'util';

const { TestEnvironment } = require('jest-environment-jsdom');

const nodeGlobals = [
    'TextEncoder',
    'TextDecoder',
    'ReadableStream',
    'WritableStream',
    'TransformStream',
    'structuredClone',
    'BroadcastChannel',
    'MessagePort',
    'MessageChannel',
    'Blob',
    'File',
    'FormData',
    'EventTarget',
    'Event',
    'AbortController',
    'AbortSignal'
];

class JSDOMFetchEnvironment extends TestEnvironment {
    constructor(config: any, context: any) {
        super(config, context);

        if (!this.global.TextEncoder) {
            this.global.TextEncoder = TextEncoder;
        }
        if (!this.global.TextDecoder) {
            this.global.TextDecoder = TextDecoder as any;
        }

        try {
            const streams = require('stream/web');
            for (const name of ['ReadableStream', 'WritableStream', 'TransformStream']) {
                if (!this.global[name] && streams[name]) {
                    this.global[name] = streams[name];
                }
            }
        } catch {
            /* stream/web not available */
        }

        for (const name of nodeGlobals) {
            if (!this.global[name] && (globalThis as any)[name]) {
                this.global[name] = (globalThis as any)[name];
            }
        }
    }
}

module.exports = JSDOMFetchEnvironment;
