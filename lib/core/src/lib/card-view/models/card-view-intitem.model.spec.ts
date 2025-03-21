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

import { CardViewIntItemModel } from './card-view-intitem.model';
import { CardViewTextItemProperties } from '../interfaces/card-view.interfaces';

describe('CardViewIntItemModel', () => {
    let properties: CardViewTextItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Tribe',
            value: '42',
            key: 'tribe'
        };
    });

    it('value should be parsed as integer', () => {
        const itemModel = new CardViewIntItemModel(properties);

        expect(itemModel.value).toBe(42);
    });

    it('value should be parsed as integer only if there is a value', () => {
        properties.value = undefined;
        const itemModel = new CardViewIntItemModel(properties);

        expect(itemModel.value).toBe(undefined);
    });

    it("isValid should return the validator's value", () => {
        const itemModel = new CardViewIntItemModel(properties);

        expect(itemModel.isValid(42)).toBe(true, 'For 42 it should be true');
        expect(itemModel.isValid(42.0)).toBe(true, 'For 42.0 it should be true');
        expect(itemModel.isValid('42')).toBe(true, 'For "42" it should be true');
        expect(itemModel.isValid('42.0')).toBe(true, 'For "42.0" it should be true');
        expect(itemModel.isValid('4e2')).toBe(true, 'For "4e2" it should be true');
        expect(itemModel.isValid('4g2')).toBe(false, 'For "4g2" it should be false');
        expect(itemModel.isValid(42.3)).toBe(false, 'For 42.3 it should be false');
        expect(itemModel.isValid('42.3')).toBe(false, 'For "42.3" it should be false');
        expect(itemModel.isValid('test')).toBe(false, 'For "test" it should be false');
    });

    it('should validate based on defined constraints', () => {
        const constrainedProperties = {
            label: 'Tribe',
            value: '20',
            key: 'tribe',
            dataType: 'd:float',
            constraints: [
                {
                    id: 'constraint-id',
                    type: 'MINMAX',
                    parameters: { minValue: 10, maxValue: 15 }
                }
            ]
        };

        const itemModel = new CardViewIntItemModel(constrainedProperties);
        expect(itemModel.isValid(itemModel.value)).toBe(false, '20 is bigger than maximum allowed');

        itemModel.value = '5';
        expect(itemModel.isValid(itemModel.value)).toBe(false, '5 is less than minimum allowed');
    });
});
