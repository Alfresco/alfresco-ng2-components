/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormOutcomeModel } from './form-outcome.model';
import { FormModel } from './form.model';

describe('FormOutcomeModel', () => {

    it('should setup with json config', () => {
        const json = {
            id: '<id>',
            name: '<name>',
            visibilityCondition: {
                leftType: 'field',
                leftValue: 'TextOne',
                operator: '==',
                rightValue: 'showTab',
                rightType: 'value',
                nextConditionOperator: '',
                nextCondition: null
            }
        };
        const model = new FormOutcomeModel(null, json);
        expect(model.id).toBe(json.id);
        expect(model.name).toBe(json.name);
        expect(model.visibilityCondition).toBeDefined();
    });

    it('should not setup with null json config', () => {
        const model = new FormOutcomeModel(null, null);
        expect(model.id).toBeUndefined();
        expect(model.name).toBeUndefined();
        expect(model.isVisible).toBeDefined();
        expect(model.isVisible).toBe(true);
        expect(model.visibilityCondition).toBeUndefined();
    });

    it('should store the form reference', () => {
        const form = new FormModel();
        const model = new FormOutcomeModel(form);
        expect(model.form).toBe(form);
    });

    it('should store original json', () => {
        const json = {};
        const model = new FormOutcomeModel(null, json);
        expect(model.json).toBe(json);
    });
});
