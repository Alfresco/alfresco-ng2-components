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

import { FormOutcomeModel } from '../widgets';
import { isOutcomeButtonVisible } from './buttons-visibility';

describe('isOutcomeButtonVisible', () => {
    const defaultProps = {
        isFormReadOnly: false,
        showCompleteButton: true,
        showSaveButton: true
    };

    const outcome = (overrides: Partial<FormOutcomeModel>): FormOutcomeModel => ({ name: '', isSelected: false, ...overrides }) as FormOutcomeModel;

    it('should return false when outcome has no name', () => {
        expect(isOutcomeButtonVisible(outcome({ name: '' }), defaultProps)).toBe(false);
    });

    it('should respect showCompleteButton for COMPLETE action', () => {
        const o = outcome({ name: FormOutcomeModel.COMPLETE_ACTION });
        expect(isOutcomeButtonVisible(o, { ...defaultProps, showCompleteButton: false })).toBe(false);
        expect(isOutcomeButtonVisible(o, { ...defaultProps, showCompleteButton: true })).toBe(true);
    });

    it('should always hide START_PROCESS action regardless of readOnly state', () => {
        const o = outcome({ name: FormOutcomeModel.START_PROCESS_ACTION });
        expect(isOutcomeButtonVisible(o, { ...defaultProps, isFormReadOnly: false })).toBe(false);
        expect(isOutcomeButtonVisible(o, { ...defaultProps, isFormReadOnly: true })).toBe(false);
    });

    it('should show only selected outcome when form is read-only', () => {
        const selected = outcome({ name: 'custom-1', isSelected: true });
        const notSelected = outcome({ name: 'custom-2', isSelected: false });
        expect(isOutcomeButtonVisible(selected, { ...defaultProps, isFormReadOnly: true })).toBe(true);
        expect(isOutcomeButtonVisible(notSelected, { ...defaultProps, isFormReadOnly: true })).toBe(false);
    });

    it('should respect showSaveButton for SAVE action on writable forms', () => {
        const o = outcome({ name: FormOutcomeModel.SAVE_ACTION });
        expect(isOutcomeButtonVisible(o, { ...defaultProps, showSaveButton: true })).toBe(true);
        expect(isOutcomeButtonVisible(o, { ...defaultProps, showSaveButton: false })).toBe(false);
    });

    it('should show custom outcomes on writable forms', () => {
        const o = outcome({ name: 'custom-outcome' });
        expect(isOutcomeButtonVisible(o, defaultProps)).toBe(true);
    });
});
