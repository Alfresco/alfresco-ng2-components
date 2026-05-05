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

import { CardViewDatetimeItemModel } from './card-view-datetimeitem.model';
import { CardViewDateItemProperties } from '../interfaces/card-view.interfaces';
import { DateFnsUtils } from '../../common/utils/date-fns-utils';

describe('CardViewDatetimeItemModel', () => {
    let properties: CardViewDateItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Datetime label',
            value: new Date('2025-03-07T15:30:00.000Z'),
            key: 'datetimeKey'
        };
    });

    it('should initialize with datetime type and default datetime format', () => {
        const itemModel = new CardViewDatetimeItemModel(properties);

        expect(itemModel.type).toBe('datetime');
        expect(itemModel.format).toBe('MMM d, y, H:mm');
    });

    it('should preserve the provided format', () => {
        const itemModel = new CardViewDatetimeItemModel({
            ...properties,
            format: 'yyyy-MM-dd HH:mm'
        });

        expect(itemModel.format).toBe('yyyy-MM-dd HH:mm');
    });

    it('should transform the original date value without forcing it to local midnight', () => {
        const itemModel = new CardViewDatetimeItemModel(properties);

        spyOn(DateFnsUtils, 'forceLocal');
        spyOn(itemModel, 'transformDate').and.returnValue('formatted-datetime');

        expect(itemModel.displayValue).toBe('formatted-datetime');
        expect(DateFnsUtils.forceLocal).not.toHaveBeenCalled();
        expect(itemModel.transformDate).toHaveBeenCalledOnceWith(properties.value as Date);
    });
});
