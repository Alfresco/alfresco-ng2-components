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

import { async, TestBed } from '@angular/core/testing';
import { CardViewBaseItemModel } from '../models/card-view-baseitem.model';
import { CardViewUpdateService, transformKeyToObject } from './card-view-update.service';
import { setupTestBed } from '../../testing/setupTestBed';

describe('CardViewUpdateService', () => {

    describe('transformKeyToObject', () => {

        it('should return the proper constructed value object for "dotless" keys', () => {
            const valueObject = transformKeyToObject('property-key', 'property-value');

            expect(valueObject).toEqual({
                'property-key': 'property-value'
            });
        });

        it('should return the proper constructed value object for dot contained keys', () => {
            const valueObject = transformKeyToObject('level:0.level:1.level:2.level:3', 'property-value');

            expect(valueObject).toEqual({
                'level:0': {
                    'level:1': {
                        'level:2': {
                            'level:3': 'property-value'
                        }
                    }
                }
            });
        });
    });

    describe('Service', () => {

        let cardViewUpdateService: CardViewUpdateService;
        const property: CardViewBaseItemModel = <CardViewBaseItemModel> {
            label: 'property-label',
            value: 'property-value',
            key: 'property-key',
            default: 'property-default',
            editable: false,
            clickable: false
        };

        setupTestBed({
            providers: [
                CardViewUpdateService
            ]
        });

        beforeEach(() => {
            cardViewUpdateService = TestBed.get(CardViewUpdateService);
        });

        it('should send updated message with proper parameters', async(() => {

            cardViewUpdateService.itemUpdated$.subscribe(
                ( { target, changed } ) => {
                    expect(target).toBe(property);
                    expect(changed).toEqual({ 'property-key': 'changed-property-value' });
                }
            );
            cardViewUpdateService.update(property, 'changed-property-value');
        }));

        it('should send clicked message with proper parameters', async(() => {

            cardViewUpdateService.itemClicked$.subscribe(
                ( { target } ) => {
                    expect(target).toBe(property);
                }
            );
            cardViewUpdateService.clicked(property);
        }));
    });
});
