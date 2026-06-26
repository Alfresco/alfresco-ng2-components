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

import { normalizeSessionTimeoutOptions, DEFAULT_SESSION_TIMEOUT_OPTIONS } from './session-timeout.config';

describe('normalizeSessionTimeoutOptions', () => {
    it('coerces string "true" to boolean enabled', () => {
        expect(normalizeSessionTimeoutOptions({ enabled: 'true' }).enabled).toBe(true);
    });

    it('treats non-"true" strings and missing as disabled', () => {
        expect(normalizeSessionTimeoutOptions({ enabled: 'false' }).enabled).toBe(false);
        expect(normalizeSessionTimeoutOptions({}).enabled).toBe(false);
    });

    it('parses numeric strings for timeouts', () => {
        const result = normalizeSessionTimeoutOptions({ idleTimeoutMs: '1000', dialogTimeoutMs: '2000' });
        expect(result.idleTimeoutMs).toBe(1000);
        expect(result.dialogTimeoutMs).toBe(2000);
    });

    it('falls back to defaults for non-positive or invalid numbers', () => {
        const result = normalizeSessionTimeoutOptions({ idleTimeoutMs: 0, dialogTimeoutMs: 'abc' });
        expect(result.idleTimeoutMs).toBe(DEFAULT_SESSION_TIMEOUT_OPTIONS.idleTimeoutMs);
        expect(result.dialogTimeoutMs).toBe(DEFAULT_SESSION_TIMEOUT_OPTIONS.dialogTimeoutMs);
    });
});
