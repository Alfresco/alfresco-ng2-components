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

    let properties: CardViewItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Tribe',
            value: 'Oseram',
            key: 'tribe'
        };
    });

    describe('isValid', () => {

        it('should be true when no validators are set', () => {
            const itemModel = new CarViewCustomItemModel(properties);

            const isValid = itemModel.isValid(null);

            expect(isValid).toBe(true);
        });

        it('should call the registered validators to validate', () => {
            const validator1: CardViewItemValidator = { isValid: () => true };
            const validator2: CardViewItemValidator = { isValid: () => true };
            spyOn(validator1, 'isValid');
            spyOn(validator2, 'isValid');
            properties.validators = [ validator1, validator2 ];
            const itemModel = new CarViewCustomItemModel(properties);

            itemModel.isValid('test-against-this');

            expect(validator1.isValid).toHaveBeenCalledWith('test-against-this');
            expect(validator2.isValid).toHaveBeenCalledWith('test-against-this');
        });

        it('should return the registered validators\' common decision (case true)', () => {
            const validator1: CardViewItemValidator = { isValid: () => true };
            const validator2: CardViewItemValidator = { isValid: () => true };
            properties.validators = [ validator1, validator2 ];
            const itemModel = new CarViewCustomItemModel(properties);

            const isValid = itemModel.isValid('test-against-this');

            expect(isValid).toBe(true);
        });

        it('should return the registered validators\' common decision (case false)', () => {
            const validator1: CardViewItemValidator = { isValid: () => true };
            const validator2: CardViewItemValidator = { isValid: () => false };
            properties.validators = [ validator1, validator2 ];
            const itemModel = new CarViewCustomItemModel(properties);

            const isValid = itemModel.isValid('test-against-this');

            expect(isValid).toBe(false);
        });
    });
});
