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

import { CardViewItemProperties, CardViewItemValidator } from '../interfaces/card-view.interfaces';
import { CardViewBaseItemModel } from './card-view-baseitem.model';

class CarViewCustomItemModel extends CardViewBaseItemModel {}

describe('CardViewBaseItemModel', () => {
    let properties: CardViewItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Tribe',
            value: 'Oseram',
            key: 'tribe'
        };
    });

    describe('CardViewItemProperties', () => {
        it('data should be null if no data is set', () => {
            const itemModel = new CarViewCustomItemModel(properties);

            expect(itemModel.data).toBe(null);
        });

        it('data should be stored if one data is set', () => {
            properties.data = { name: 'ryuk', lifeform: 'shinigami' };
            const itemModel = new CarViewCustomItemModel(properties);

            expect(itemModel.data).toBe(properties.data);
        });

        it('should persist the params\' properties as own properties', () => {
            const allProperties = {
                ...properties,
                default: 'default-value',
                editable: true,
                clickable: true,
                icon: 'dummy-icon',
                hint: 'Some hint text',
                validators: [{} as unknown as CardViewItemValidator],
                multivalued: true
            };

            const itemModel = new CarViewCustomItemModel(allProperties);

            expect(itemModel.label).toBe(allProperties.label);
            expect(itemModel.value).toBe(allProperties.value);
            expect(itemModel.key).toBe(allProperties.key);
            expect(itemModel.default).toBe(allProperties.default);
            expect(itemModel.editable).toBe(allProperties.editable);
            expect(itemModel.clickable).toBe(allProperties.clickable);
            expect(itemModel.icon).toBe(allProperties.icon);
            expect(itemModel.hint).toBe(allProperties.hint);
            expect(itemModel.validators).toBe(allProperties.validators);
            expect(itemModel.multivalued).toBe(allProperties.multivalued);
        });
    });

    describe('isValid & Validation errors', () => {
        it('should be true when no validators are set', () => {
            const itemModel = new CarViewCustomItemModel(properties);

            const isValid = itemModel.isValid(null);

            expect(isValid).toBe(true);
        });

        it('should call the registered validators to validate', () => {
            const validator1: CardViewItemValidator = { isValid: () => true, message: 'validator 1' };
            const validator2: CardViewItemValidator = { isValid: () => true, message: 'validator 2' };
            spyOn(validator1, 'isValid');
            spyOn(validator2, 'isValid');
            properties.validators = [validator1, validator2];
            const itemModel = new CarViewCustomItemModel(properties);

            itemModel.isValid('test-against-this');

            expect(validator1.isValid).toHaveBeenCalledWith('test-against-this');
            expect(validator2.isValid).toHaveBeenCalledWith('test-against-this');
        });

        it('should return the registered validators common decision (case true)', () => {
            const validator1: CardViewItemValidator = { isValid: () => true, message: 'validator 1' };
            const validator2: CardViewItemValidator = { isValid: () => true, message: 'validator 2' };
            properties.validators = [validator1, validator2];
            const itemModel = new CarViewCustomItemModel(properties);

            const isValid = itemModel.isValid('test-against-this');

            expect(isValid).toBe(true);
            expect(itemModel.getValidationErrors('test-against-this')).toEqual([]);
        });

        it('should return the registered validators common decision (case false)', () => {
            const validator1: CardViewItemValidator = { isValid: () => false, message: 'validator 1' };
            const validator2: CardViewItemValidator = { isValid: () => true, message: 'validator 2' };
            const validator3: CardViewItemValidator = { isValid: () => false, message: 'validator 3' };
            properties.validators = [validator1, validator2, validator3];
            const itemModel = new CarViewCustomItemModel(properties);

            const isValid = itemModel.isValid('test-against-this');

            expect(isValid).toBe(false);
            expect(itemModel.getValidationErrors('test-against-this')).toEqual([validator1, validator3 ]);
        });
    });
});
