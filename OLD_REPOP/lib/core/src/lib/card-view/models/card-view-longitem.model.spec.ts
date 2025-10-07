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

import { CardViewLongItemModel } from './card-view-longitem.model';
import { CardViewTextItemProperties } from '../interfaces/card-view.interfaces';

describe('CardViewLongItemModel', () => {
    let properties: CardViewTextItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Long Number',
            value: '21',
            key: 'long'
        };
    });

    it('value should be parsed as a long integer', () => {
        const itemModel = new CardViewLongItemModel(properties);

        expect(itemModel.value).toBe(21);
    });

    it('value should be parsed as a long integer only if there is a value', () => {
        properties.value = undefined;
        const itemModel = new CardViewLongItemModel(properties);

        expect(itemModel.value).toBe(undefined);
    });

    it('isValid should return the validators value', () => {
        const itemModel = new CardViewLongItemModel(properties);

        expect(itemModel.isValid(21)).toBe(true, 'For 21 it should be true');
        expect(itemModel.isValid(21.0)).toBe(true, 'For 21.0 it should be true');
        expect(itemModel.isValid('21')).toBe(true, 'For "21" it should be true');
        expect(itemModel.isValid('21.0')).toBe(true, 'For "21.0" it should be true');
        expect(itemModel.isValid('2e1')).toBe(true, 'For "2e1" it should be true');
        expect(itemModel.isValid('2g1')).toBe(false, 'For "2g1" it should be false');
        expect(itemModel.isValid(21.3)).toBe(false, 'For 21.3 it should be false');
        expect(itemModel.isValid('21.3')).toBe(false, 'For "21.3" it should be false');
        expect(itemModel.isValid('text')).toBe(false, 'For "text" it should be false');
    });

    it('should validate based on defined constraints', () => {
        const constrainedProperties = {
            label: 'Some Number',
            value: '21',
            key: 'number',
            dataType: 'd:float',
            constraints: [
                {
                    id: 'constraint-id',
                    type: 'MINMAX',
                    parameters: { minValue: 10, maxValue: 15 }
                }
            ]
        };

        const itemModel = new CardViewLongItemModel(constrainedProperties);
        expect(itemModel.isValid(itemModel.value)).toBe(false, '21 is bigger than maximum allowed');

        itemModel.value = '5';
        expect(itemModel.isValid(itemModel.value)).toBe(false, '5 is less than minimum allowed');

        itemModel.value = '13';
        expect(itemModel.isValid(itemModel.value)).toBe(true, '13 is within the allowed range');
    });
});
