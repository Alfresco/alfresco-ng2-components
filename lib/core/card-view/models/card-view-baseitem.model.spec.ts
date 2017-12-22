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

import { CardViewItemProperties } from '../interfaces/card-view.interfaces';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItemValidator } from '../interfaces/card-view.interfaces';

class CarViewCustomItemModel extends CardViewBaseItemModel {}

describe('CardViewBaseItemModel', () => {

    let properties: CardViewItemProperties,
        itemModel: CarViewCustomItemModel;

    beforeEach(() => {
        properties = {
            label: 'Tribe',
            value: 'Oseram',
            key: 'tribe'
        };
    });

    describe('isValid', () => {

        beforeEach(() => {
            itemModel = new CarViewCustomItemModel(properties);
        });

        it('should be true when no validators are set', () => {
            const isValid = itemModel.isValid(null);

            expect(isValid).toBe(true);
        });

        it('should call the registered validator to validate', () => {
            const validator: CardViewItemValidator = { isValid: () => true };
            spyOn(validator, 'isValid');
            properties.validators = [ validator ];

            itemModel.isValid(null);

            expect(validator.isValid).toHaveBeenCalled();
        });
    });
});
