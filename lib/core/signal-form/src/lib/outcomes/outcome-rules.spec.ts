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

import type { OutcomeDefinition } from '../definition/form-definition.interface';
import { SystemOutcomeName } from '../definition/form-field-types';
import { isOutcomeEnabled, isOutcomeShown, OutcomeHostOptions } from './outcome-rules';

describe('outcome rules', () => {
    const outcome = (overrides: Partial<OutcomeDefinition> = {}): OutcomeDefinition => ({
        id: 'approve',
        name: 'Approve',
        skipValidation: false,
        isSelected: false,
        ...overrides
    });
    const host = (overrides: Partial<OutcomeHostOptions> = {}): OutcomeHostOptions => ({
        readOnly: false,
        showSaveButton: true,
        showCompleteButton: true,
        ...overrides
    });

    describe('isOutcomeShown', () => {
        it('should hide an outcome without a name', () => {
            expect(isOutcomeShown(outcome({ name: '' }), host())).toBeFalse();
        });

        it('should show the Complete outcome only when the host shows its complete button', () => {
            const complete = outcome({ name: SystemOutcomeName.Complete });

            expect(isOutcomeShown(complete, host())).toBeTrue();
            expect(isOutcomeShown(complete, host({ showCompleteButton: false }))).toBeFalse();
            expect(isOutcomeShown(complete, host({ readOnly: true })))
                .withContext('read-only does not hide Complete')
                .toBeTrue();
        });

        it('should never show the Start process outcome', () => {
            expect(isOutcomeShown(outcome({ name: SystemOutcomeName.StartProcess }), host())).toBeFalse();
        });

        it('should show only the selected outcome on a read-only form', () => {
            expect(isOutcomeShown(outcome({ isSelected: true }), host({ readOnly: true }))).toBeTrue();
            expect(isOutcomeShown(outcome(), host({ readOnly: true }))).toBeFalse();
        });

        it('should show the Save outcome only when the host shows its save button', () => {
            const save = outcome({ name: SystemOutcomeName.Save });

            expect(isOutcomeShown(save, host())).toBeTrue();
            expect(isOutcomeShown(save, host({ showSaveButton: false }))).toBeFalse();
        });

        it('should show any other outcome', () => {
            expect(isOutcomeShown(outcome(), host({ showSaveButton: false, showCompleteButton: false }))).toBeTrue();
        });
    });

    describe('isOutcomeEnabled', () => {
        it('should disable every outcome on a read-only form', () => {
            expect(isOutcomeEnabled(outcome({ name: SystemOutcomeName.Save }), true, host({ readOnly: true }))).toBeFalse();
            expect(isOutcomeEnabled(outcome({ skipValidation: true }), true, host({ readOnly: true }))).toBeFalse();
        });

        it('should enable Save on an invalid form', () => {
            expect(isOutcomeEnabled(outcome({ name: SystemOutcomeName.Save }), false, host())).toBeTrue();
        });

        it('should enable an outcome that skips validation on an invalid form', () => {
            expect(isOutcomeEnabled(outcome({ skipValidation: true }), false, host())).toBeTrue();
        });

        it('should enable any other outcome only on a valid form', () => {
            expect(isOutcomeEnabled(outcome(), true, host())).toBeTrue();
            expect(isOutcomeEnabled(outcome(), false, host())).toBeFalse();
        });
    });
});
