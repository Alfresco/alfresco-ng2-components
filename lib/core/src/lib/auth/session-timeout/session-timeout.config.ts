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

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const SESSION_TIMEOUT_CONFIG_KEY = 'sessionTimeout';

export interface SessionTimeoutOptions {
    enabled?: boolean | string;
    idleTimeoutMs?: number | string;
    dialogTimeoutMs?: number | string;
    startWhen?: () => Observable<boolean>;
}

export interface NormalizedSessionTimeoutOptions {
    enabled: boolean;
    idleTimeoutMs: number;
    dialogTimeoutMs: number;
}

export const DEFAULT_SESSION_TIMEOUT_OPTIONS: NormalizedSessionTimeoutOptions = {
    enabled: true,
    idleTimeoutMs: 5 * 60 * 1000,
    dialogTimeoutMs: 60 * 1000
};

export const SESSION_TIMEOUT_OPTIONS = new InjectionToken<SessionTimeoutOptions>('SESSION_TIMEOUT_OPTIONS');

const toBoolean = (value: boolean | string | undefined): boolean => value === true || value === 'true';

const toPositiveNumber = (value: number | string | undefined, fallback: number): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Coerces raw session timeout options (which may arrive as strings from app config) into validated values.
 *
 * @param merged - Raw options merged from defaults, app config and provider input
 * @returns Normalized options with a boolean `enabled` flag and positive numeric timeouts
 */
export function normalizeSessionTimeoutOptions(merged: SessionTimeoutOptions): NormalizedSessionTimeoutOptions {
    return {
        enabled: toBoolean(merged.enabled),
        idleTimeoutMs: toPositiveNumber(merged.idleTimeoutMs, DEFAULT_SESSION_TIMEOUT_OPTIONS.idleTimeoutMs),
        dialogTimeoutMs: toPositiveNumber(merged.dialogTimeoutMs, DEFAULT_SESSION_TIMEOUT_OPTIONS.dialogTimeoutMs)
    };
}
