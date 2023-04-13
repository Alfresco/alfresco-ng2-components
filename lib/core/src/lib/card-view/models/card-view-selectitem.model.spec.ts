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

import { fakeAsync } from '@angular/core/testing';
import { CardViewSelectItemModel } from './card-view-selectitem.model';
import { CardViewSelectItemProperties } from '../interfaces/card-view.interfaces';
import { of } from 'rxjs';

describe('CardViewSelectItemModel', () => {
    let properties: CardViewSelectItemProperties<string>;
    const mockData = [{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }, { key: 'three', label: 'Three' }];

    beforeEach(() => {
        properties = {
            label: 'Select box label',
            value: 'two',
            options$: of(mockData),
            key: 'key',
            editable: true
        };
    });

    describe('displayValue', () => {
        it('should return the value if it is present', fakeAsync(() => {
            const itemModel = new CardViewSelectItemModel(properties);

            itemModel.displayValue.subscribe((value) => {
                expect(value).toBe(mockData[1].label);
                expect(itemModel.displayNoneOption).toBe(true);
            });
        }));

        it('should set true for none option when passed through the properties', fakeAsync(() => {
            properties.displayNoneOption = true;
            const itemModel = new CardViewSelectItemModel(properties);

            expect(itemModel.displayNoneOption).toBe(true);
        }));

        it('should set false for none option when passed through the properties', fakeAsync(() => {
            properties.displayNoneOption = false;
            const itemModel = new CardViewSelectItemModel(properties);

            expect(itemModel.displayNoneOption).toBe(false);
        }));
    });
});
