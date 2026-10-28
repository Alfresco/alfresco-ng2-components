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

import type { FormOutcomeModel } from '../components/widgets/core/form-outcome.model';
import type { FormResetResult } from '../models/form-state.model';

export class FormOutcomeExecutionError extends Error {
    constructor(
        public readonly outcome: FormOutcomeModel,
        public readonly result: FormResetResult
    ) {
        super(`Form outcome with id "${outcome.id}" returned ${result.status}.`);
        this.name = 'FormOutcomeExecutionError';
    }

    get status(): FormResetResult['status'] {
        return this.result.status;
    }
}

export class FormOutcomeExecutionUnavailableError extends Error {
    readonly status = 'unavailable';

    constructor(
        public readonly outcome: FormOutcomeModel,
        public readonly reason: 'unsupported-mode' | 'execution-unavailable',
        public readonly result?: FormResetResult
    ) {
        super(`Form outcome with id "${outcome.id}" cannot execute: ${reason}.`);
        this.name = 'FormOutcomeExecutionUnavailableError';
    }
}
