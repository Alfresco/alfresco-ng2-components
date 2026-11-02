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

import type { FormModel } from '../components/widgets/core/form.model';

const silentConstruction = new WeakSet<FormModel>();

/**
 * Checks whether nested field constructors belong to a silent state commit.
 *
 * @param form Exact model
 * @returns Whether constructor notifications must remain silent
 */
export function isFormStateConstructionSilent(form: FormModel): boolean {
    return silentConstruction.has(form);
}

/**
 * Runs a state write while nested field constructors stay silent, restoring any enclosing silent scope afterwards.
 *
 * @param form Exact model
 * @param write Synchronous state write
 */
export function withSilentFormConstruction(form: FormModel, write: () => void): void {
    const alreadySilent = silentConstruction.has(form);
    silentConstruction.add(form);
    try {
        write();
    } finally {
        if (!alreadySilent) {
            silentConstruction.delete(form);
        }
    }
}
