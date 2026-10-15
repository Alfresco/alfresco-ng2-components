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

import type { OutcomeDefinition } from '../../definition/form-definition.model';
import type { FieldValues } from '../../submission/submission-values';

/**
 * Emitted when the user executes an outcome, with the values the form would submit. A listener can call
 * `preventDefault()` to stop the host from running the outcome's default action.
 */
export class SignalFormOutcomeEvent {
    private prevented = false;

    constructor(
        readonly outcome: OutcomeDefinition,
        readonly values: FieldValues
    ) {}

    get defaultPrevented(): boolean {
        return this.prevented;
    }

    preventDefault(): void {
        this.prevented = true;
    }
}
