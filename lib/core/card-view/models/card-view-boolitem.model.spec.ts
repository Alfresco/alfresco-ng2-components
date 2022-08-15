/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { CardViewBoolItemModel } from './card-view-boolitem.model';
import { CardViewBoolItemProperties } from '../interfaces/card-view.interfaces';

describe('CardViewFloatItemModel', () => {

    let properties: CardViewBoolItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Tribe',
            value: undefined,
            key: 'tribe'
        };
    });

    it('true should be parsed as true', () => {
        properties.value = true;
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(true);
    });

    it('"true" should be parsed as true', () => {
        properties.value = 'true';
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(true);
    });

    it('1 should be parsed as true', () => {
        properties.value = 1;
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(true);
    });

    it('"1" should be parsed as true', () => {
        properties.value = '1';
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(true);
    });

    it('"false" should be parsed as false', () => {
        properties.value = 'false';
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(false);
    });

    it('false should be parsed as false', () => {
        properties.value = 'false';
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(false);
    });

    it('undefined should be parsed as false', () => {
        properties.value = undefined;
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(false);
    });

    it('null should be parsed as false', () => {
        properties.value = null;
        const itemModel = new CardViewBoolItemModel(properties);

        expect(itemModel.value).toBe(false);
    });
});
