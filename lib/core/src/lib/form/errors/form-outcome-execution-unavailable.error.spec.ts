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

import { FormModel, FormOutcomeModel } from '../components/widgets';
import { FormResetResult, FormWriteContext } from '../models/form-state.model';
import { FormOutcomeExecutionError, FormOutcomeExecutionUnavailableError } from './form-outcome-execution-unavailable.error';

describe('FormOutcomeExecutionError', () => {
    it('should expose the outcome, the reset result and its status when created from a partial result', () => {
        const form = new FormModel();
        const outcome = new FormOutcomeModel(form, { id: 'clear', name: 'Clear', executionMode: 'rules-only' });
        const context: FormWriteContext = {
            form,
            renderer: {},
            generation: {},
            invocation: {},
            documentVersion: '1',
            outcomeId: 'clear',
            isCurrent: () => true
        };
        const result: FormResetResult = { context, status: 'partial', items: [] };

        const error = new FormOutcomeExecutionError(outcome, result);

        expect(error.name).toBe('FormOutcomeExecutionError');
        expect(error.message).toBe('Form outcome with id "clear" returned partial.');
        expect(error.outcome).toBe(outcome);
        expect(error.result).toBe(result);
        expect(error.status).toBe('partial');
    });
});

describe('FormOutcomeExecutionUnavailableError', () => {
    it('should report an unavailable status and the reason when created', () => {
        const outcome = new FormOutcomeModel(new FormModel(), { id: 'clear', name: 'Clear', executionMode: 'rules-only' });

        const error = new FormOutcomeExecutionUnavailableError(outcome, 'execution-unavailable');

        expect(error.name).toBe('FormOutcomeExecutionUnavailableError');
        expect(error.message).toBe('Form outcome with id "clear" cannot execute: execution-unavailable.');
        expect(error.status).toBe('unavailable');
        expect(error.reason).toBe('execution-unavailable');
        expect(error.result).toBeUndefined();
    });
});
