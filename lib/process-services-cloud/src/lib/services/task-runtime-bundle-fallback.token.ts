/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { isObservable, Observable, of } from 'rxjs';

/**
 * Controls whether task details are read from the Runtime Bundle first, falling back to the
 * Query Service on a 404. The Runtime Bundle is always up to date, whereas the Query Service is
 * eventually consistent.
 *
 * When it resolves to a falsy value (the default when not provided), task details are read from
 * the Query Service only, preserving the historical behavior for every consumer that does not
 * override it. Host applications can wire it to a feature flag, e.g. an `Observable<boolean>`.
 */
export const ADF_TASK_RUNTIME_BUNDLE_FALLBACK_ENABLED = new InjectionToken<Observable<boolean> | boolean>('ADF_TASK_RUNTIME_BUNDLE_FALLBACK_ENABLED');

/**
 * Normalizes the injected {@link ADF_TASK_RUNTIME_BUNDLE_FALLBACK_ENABLED} value to an
 * `Observable<boolean>`, defaulting to `false` when it is not provided.
 *
 * @param token the injected token value (observable, boolean, or null when not provided)
 * @returns an observable emitting whether the Runtime Bundle fallback is enabled
 */
export const resolveTaskRuntimeBundleFallback$ = (token: Observable<boolean> | boolean | null): Observable<boolean> =>
    isObservable(token) ? token : of(token ?? false);
