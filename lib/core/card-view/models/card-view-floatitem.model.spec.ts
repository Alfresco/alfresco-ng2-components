/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { CardViewTextItemProperties } from './card-view-textitem.model';
import { CardViewFloatItemModel } from './card-view-floatitem.model';

describe('CardViewFloatItemModel', () => {

    let properties: CardViewTextItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Tribe',
            value: '42.42',
            key: 'tribe'
        };
    });

    describe('value', () => {

        it('should be parsed as float', () => {
            const file = new CardViewFloatItemModel(properties);

            expect(file.value).toBe(42.42);
        });
    });
});
