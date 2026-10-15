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

import { inject, InjectionToken, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isObservable, map, Observable } from 'rxjs';

/**
 * Reads an optional setting given either as a value or as an observable, as a signal. Call it in an injection context.
 *
 * @param token the setting's token
 * @param read turns the setting, `null` when not provided, into the value used
 * @returns the setting as a signal
 */
export const injectSetting = <T, R>(token: InjectionToken<Observable<T> | T>, read: (setting: T | null) => R): Signal<R> => {
    const setting = inject(token, { optional: true });
    return isObservable(setting) ? toSignal(setting.pipe(map(read)), { initialValue: read(null) }) : signal(read(setting)).asReadonly();
};
