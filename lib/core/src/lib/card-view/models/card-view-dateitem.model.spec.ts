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

import { DatePipe } from '@angular/common';
import { CardViewDateItemModel } from './card-view-dateitem.model';
import { CardViewDateItemProperties } from '../interfaces/card-view.interfaces';
import { DateFnsUtils } from '../../common/utils/date-fns-utils';

describe('CardViewDateItemModel', () => {
    let properties: CardViewDateItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Date label',
            value: new Date('2025-03-07T15:30:00.000Z'),
            key: 'dateKey'
        };
    });

    it('should initialize with date type and default allowManualInput', () => {
        const itemModel = new CardViewDateItemModel(properties);

        expect(itemModel.type).toBe('date');
        expect(itemModel.allowManualInput).toBeFalse();
    });

    it('should initialize format, locale and allowManualInput from properties', () => {
        const itemModel = new CardViewDateItemModel({
            ...properties,
            format: 'fullDate',
            locale: 'fr',
            allowManualInput: true
        });

        expect(itemModel.format).toBe('fullDate');
        expect(itemModel.locale).toBe('fr');
        expect(itemModel.allowManualInput).toBeTrue();
    });

    describe('displayValue', () => {
        it('should prepare and transform a single date value', () => {
            const itemModel = new CardViewDateItemModel(properties);
            const preparedDate = new Date('2025-03-07T00:00:00.000');

            spyOn(DateFnsUtils, 'forceLocal').and.returnValue(preparedDate);
            spyOn(itemModel, 'transformDate').and.returnValue('formatted-date');

            expect(itemModel.displayValue).toBe('formatted-date');
            expect(DateFnsUtils.forceLocal).toHaveBeenCalledOnceWith(properties.value as Date);
            expect(itemModel.transformDate).toHaveBeenCalledOnceWith(preparedDate);
        });

        it('should prepare and transform each value when multivalued', () => {
            const firstDate = new Date('2025-03-07T15:30:00.000Z');
            const secondDate = new Date('2025-03-08T15:30:00.000Z');
            const itemModel = new CardViewDateItemModel({
                ...properties,
                multivalued: true,
                value: [firstDate, secondDate]
            });

            spyOn(DateFnsUtils, 'forceLocal').and.callFake((date) => date as Date);
            spyOn(itemModel, 'transformDate').and.callFake((date) => `${(date as Date).toISOString()}-formatted`);

            expect(itemModel.displayValue).toEqual([`${firstDate.toISOString()}-formatted`, `${secondDate.toISOString()}-formatted`]);
            expect(DateFnsUtils.forceLocal).toHaveBeenCalledTimes(2);
        });

        it('should return the default value when the single value is not present', () => {
            const itemModel = new CardViewDateItemModel({
                ...properties,
                value: null,
                default: 'No date selected'
            });

            expect(itemModel.displayValue).toBe('No date selected');
        });

        it('should return the default value as an array when the multivalued value is not present', () => {
            const itemModel = new CardViewDateItemModel({
                ...properties,
                multivalued: true,
                value: null,
                default: 'No dates selected'
            });

            expect(itemModel.displayValue).toEqual(['No dates selected']);
        });

        it('should return an empty array when the multivalued value and default are not present', () => {
            const itemModel = new CardViewDateItemModel({
                ...properties,
                multivalued: true,
                value: null
            });

            expect(itemModel.displayValue).toEqual([]);
        });
    });

    describe('transformDate', () => {
        it('should use the provided format and locale', () => {
            const value = new Date('2025-03-07T15:30:00.000Z');
            const itemModel = new CardViewDateItemModel({
                ...properties,
                format: 'fullDate',
                locale: 'fr'
            });
            const expectedValue = new DatePipe('fr').transform(value, 'fullDate');

            expect(itemModel.transformDate(value)).toBe(expectedValue as string);
        });

        it('should use mediumDate and en-US when format and locale are not provided', () => {
            const value = new Date('2025-03-07T15:30:00.000Z');
            const itemModel = new CardViewDateItemModel(properties);
            const expectedValue = new DatePipe('en-US').transform(value, 'mediumDate');

            expect(itemModel.transformDate(value)).toBe(expectedValue as string);
        });
    });

    describe('formatChanges$', () => {
        it('should emit when format changes', () => {
            const itemModel = new CardViewDateItemModel({
                ...properties,
                format: 'dd/MM/yyyy'
            });
            const formatChangeSpy = jasmine.createSpy('formatChangeSpy');

            itemModel.formatChanges$.subscribe(formatChangeSpy);
            itemModel.format = 'yyyy-MM-dd';

            expect(formatChangeSpy).toHaveBeenCalledOnceWith('yyyy-MM-dd');
        });

        it('should not emit when the same format is assigned', () => {
            const itemModel = new CardViewDateItemModel({
                ...properties,
                format: 'dd/MM/yyyy'
            });
            const formatChangeSpy = jasmine.createSpy('formatChangeSpy');

            itemModel.formatChanges$.subscribe(formatChangeSpy);
            itemModel.format = 'dd/MM/yyyy';

            expect(formatChangeSpy).not.toHaveBeenCalled();
        });
    });
});
