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

/* eslint-disable @typescript-eslint/naming-convention */

import { TestBed } from '@angular/core/testing';
import { PropertyGroupTranslatorService, RECOGNISED_ECM_TYPES } from './property-groups-translator.service';
import { Property, OrganisedPropertyGroup } from '../interfaces/content-metadata.interfaces';
import {
    CardViewTextItemModel,
    CardViewDateItemModel,
    CardViewIntItemModel,
    CardViewFloatItemModel,
    CardViewBoolItemModel,
    CardViewDatetimeItemModel,
    CardViewSelectItemModel,
    LogService,
    CardViewLongItemModel
} from '@alfresco/adf-core';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { Constraint, Definition, Property as PropertyBase } from '@alfresco/js-api';

describe('PropertyGroupTranslatorService', () => {
    let service: PropertyGroupTranslatorService;
    let propertyGroups: OrganisedPropertyGroup[];
    let propertyGroup: OrganisedPropertyGroup;
    let property: Property;
    let propertyValues: { [key: string]: any };
    let logService: LogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        logService = TestBed.inject(LogService);
        service = TestBed.inject(PropertyGroupTranslatorService);

        property = {
            name: 'FAS:PLAGUE',
            title: 'The Faro Plague',
            dataType: '',
            defaultValue: '',
            mandatory: false,
            multiValued: false
        };

        propertyGroup = {
            title: 'Faro Automated Solutions',
            properties: [property]
        };

        propertyGroups = [];
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    describe('General transformation', () => {
        it('should translate EVERY properties in ONE group properly', () => {
            propertyGroup.properties = [
                {
                    name: 'FAS:PLAGUE',
                    title: 'title',
                    dataType: 'd:text',
                    defaultValue: 'defaultValue',
                    mandatory: false,
                    multiValued: false,
                    editable: true
                },
                {
                    name: 'FAS:ALOY',
                    title: 'title',
                    dataType: 'd:text',
                    defaultValue: 'defaultValue',
                    mandatory: false,
                    multiValued: false
                }
            ];
            propertyGroups.push(propertyGroup);

            propertyValues = { 'FAS:PLAGUE': 'The Chariot Line' };

            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null)[0];
            expect(cardViewGroup.properties.length).toBe(2);
            expect(cardViewGroup.properties[0] instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewGroup.properties[1] instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewGroup.editable).toBeTrue();
        });

        it('should translate EVERY property in EVERY group properly', () => {
            propertyGroups.push(
                Object.assign({}, propertyGroup, {
                    properties: [
                        {
                            name: 'FAS:PLAGUE',
                            title: 'title',
                            dataType: 'd:text',
                            defaultValue: 'defaultvalue',
                            mandatory: false,
                            multiValued: false,
                            editable: false
                        }
                    ]
                }),
                Object.assign({}, propertyGroup, {
                    properties: [
                        {
                            name: 'FAS:ALOY',
                            title: 'title',
                            dataType: 'd:text',
                            defaultValue: 'defaultvalue',
                            mandatory: false,
                            multiValued: false,
                            editable: false
                        }
                    ]
                })
            );

            propertyValues = { 'FAS:PLAGUE': 'The Chariot Line' };

            const cardViewGroups = service.translateToCardViewGroups(propertyGroups, propertyValues, null);
            expect(cardViewGroups.length).toBe(2);
            const firstCardViewGroup = cardViewGroups[0];
            expect(firstCardViewGroup.properties[0] instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewGroups[1].properties[0] instanceof CardViewTextItemModel).toBeTruthy();
            expect(firstCardViewGroup.editable).toBeFalse();
        });

        it('should log an error if unrecognised type is found', () => {
            const logServiceError = spyOn(logService, 'error').and.stub();

            property.name = 'FAS:PLAGUE';
            property.title = 'The Faro Plague';
            property.dataType = 'daemonic:scorcher';
            property.defaultValue = 'Daemonic beast';

            propertyValues = { 'FAS:PLAGUE': 'The Chariot Line' };

            propertyGroups.push(Object.assign({}, propertyGroup));

            service.translateToCardViewGroups(propertyGroups, propertyValues, null);
            expect(logServiceError).toHaveBeenCalledWith('Unknown type for mapping: daemonic:scorcher');
        });

        it('should fall back to single-line property type if unrecognised type is found', () => {
            property.name = 'FAS:PLAGUE';
            property.title = 'The Faro Plague';
            property.dataType = 'daemonic:scorcher';
            property.defaultValue = 'Daemonic beast';
            propertyGroups.push({
                title: 'Faro Automated Solutions',
                properties: [property]
            });

            propertyValues = { 'FAS:PLAGUE': 'The Chariot Line' };

            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);
            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewTextItemModel).toBeTruthy();
        });

        it('should not edit the protected fields', () => {
            property.name = 'FAKE:NAME';
            property.title = 'Fake Title';
            property.dataType = 'd:text';
            property.defaultValue = 'Fake value';
            property.protected = true;
            propertyGroups.push({
                title: 'Fake Title',
                properties: [property]
            });

            propertyValues = { 'FAKE:NAME': 'API Fake response' };

            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);
            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewProperty.editable).toBe(false);
        });
    });

    describe('Different types attributes', () => {
        beforeEach(() => {
            propertyGroups.push(propertyGroup);
        });

        RECOGNISED_ECM_TYPES.forEach((dataType) => {
            it(`should translate properly the basic attributes of a property for ${dataType}`, () => {
                property.name = 'prefix:name';
                property.title = 'title';
                property.defaultValue = 'default value';
                property.dataType = dataType;

                propertyValues = { 'prefix:name': null };
                const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

                const cardViewProperty = cardViewGroup[0].properties[0];
                expect(cardViewProperty.label).toBe(property.title);
                expect(cardViewProperty.key).toBe('properties.prefix:name');
                expect(cardViewProperty.default).toBe(property.defaultValue);
                expect(cardViewProperty.editable).toBeTruthy();
            });
        });

        it('should translate properly the multiline and value attributes for d:text', () => {
            property.dataType = 'd:text';

            propertyValues = { 'FAS:PLAGUE': 'The Chariot Line' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe('The Chariot Line');
            expect((cardViewProperty as CardViewTextItemModel).multiline).toBeFalsy();
        });

        it('should translate properly the multiline and value attributes for d:mltext', () => {
            property.dataType = 'd:mltext';

            propertyValues = { 'FAS:PLAGUE': 'The Chariot Line' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe('The Chariot Line');
            expect((cardViewProperty as CardViewTextItemModel).multiline).toBeTruthy();
        });

        it('should translate properly the value attribute for d:date', () => {
            const expectedValue = new Date().toISOString();
            property.dataType = 'd:date';

            propertyValues = { 'FAS:PLAGUE': expectedValue };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewDateItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(expectedValue);
        });

        it('should translate properly the value attribute for d:datetime', () => {
            const expectedValue = new Date().toISOString();
            property.dataType = 'd:datetime';

            propertyValues = { 'FAS:PLAGUE': expectedValue };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewDatetimeItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(expectedValue);
        });

        it('should translate properly the value attribute for d:int', () => {
            property.dataType = 'd:int';

            propertyValues = { 'FAS:PLAGUE': '1024' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewIntItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(1024);
        });

        it('should translate properly the value attribute for d:int and value is 0', () => {
            property.dataType = 'd:int';

            propertyValues = { 'FAS:PLAGUE': 0 };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewIntItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(0);
        });

        it('should translate properly the value attribute for d:long', () => {
            property.dataType = 'd:long';

            propertyValues = { 'FAS:PLAGUE': '1024' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewLongItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(1024);
        });

        it('should translate properly the value attribute for d:float', () => {
            property.dataType = 'd:float';

            propertyValues = { 'FAS:PLAGUE': '1024.24' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewFloatItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(1024.24);
        });

        it('should translate properly the value attribute for d:float and value is 0', () => {
            property.dataType = 'd:float';

            propertyValues = { 'FAS:PLAGUE': 0 };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewFloatItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(0);
        });

        it('should translate properly the value attribute for d:double', () => {
            property.dataType = 'd:double';

            propertyValues = { 'FAS:PLAGUE': '1024.24' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewFloatItemModel).toBeTrue();
            expect(cardViewProperty.value).toBe(1024.24);
        });

        it('should translate properly the value attribute for d:boolean', () => {
            property.dataType = 'd:boolean';

            propertyValues = { 'FAS:PLAGUE': true };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewBoolItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(true);
        });

        it('should translate property for type LIST constraint', () => {
            const definition: Definition = {
                properties: [
                    {
                        id: 'FAS:PLAGUE',
                        constraints: [
                            {
                                type: 'LIST',
                                parameters: {
                                    allowedValues: ['one', 'two', 'three']
                                }
                            }
                        ]
                    } as Constraint
                ]
            };
            property.dataType = 'd:text';
            propertyValues = { 'FAS:PLAGUE': 'two' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, definition);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewSelectItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe('two');
        });

        it('should translate content type properties into card items', () => {
            const propertyBase = {
                id: 'fk:brendonstare',
                title: 'Brendon',
                description: 'is watching the dark emperor',
                dataType: 'd:text',
                isMultiValued: true,
                isMandatory: true,
                defaultValue: 'default',
                isMandatoryEnforced: true,
                isProtected: false
            } as PropertyBase;

            const cardViewProperty = service.translateProperty(propertyBase, 'Scary Brandon and the DuckTales', true);

            expect(cardViewProperty instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe('Scary Brandon and the DuckTales');
            expect(cardViewProperty.key).toBe('properties.fk:brendonstare');
        });

        it('should translate content type properties into card items with default value when no value is passed', () => {
            const propertyBase = {
                id: 'fk:brendonstare',
                title: 'Brendon',
                description: 'is watching the dark emperor',
                dataType: 'd:text',
                isMultiValued: true,
                isMandatory: true,
                defaultValue: 'default',
                isMandatoryEnforced: true,
                isProtected: false
            } as PropertyBase;

            const cardViewProperty = service.translateProperty(propertyBase, null, true);

            expect(cardViewProperty instanceof CardViewTextItemModel).toBeTruthy('Property should be instance of CardViewTextItemModel');
            expect(cardViewProperty.value).toBe('default');
            expect(cardViewProperty.key).toBe('properties.fk:brendonstare');
        });

        it('should not edit the protected fields', () => {
            const propertyBase = {
                id: 'fk:emperor',
                title: 'Emperor',
                description: 'is watching the dark emperor',
                dataType: 'd:text',
                isMultiValued: true,
                isMandatory: true,
                defaultValue: 'default',
                isMandatoryEnforced: true,
                isProtected: true
            } as PropertyBase;

            const cardViewProperty = service.translateProperty(propertyBase, null, true);

            expect(cardViewProperty instanceof CardViewTextItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe('default');
            expect(cardViewProperty.key).toBe('properties.fk:emperor');
            expect(cardViewProperty.editable).toBe(false);
        });

        it('should translate properly the value attribute for d:long', () => {
            property.dataType = 'd:long';

            propertyValues = { 'FAS:PLAGUE': '1024' };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewLongItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(1024);
        });

        it('should translate properly the value attribute for d:long and value is 0', () => {
            property.dataType = 'd:long';

            propertyValues = { 'FAS:PLAGUE': 0 };
            const cardViewGroup = service.translateToCardViewGroups(propertyGroups, propertyValues, null);

            const cardViewProperty = cardViewGroup[0].properties[0];
            expect(cardViewProperty instanceof CardViewLongItemModel).toBeTruthy();
            expect(cardViewProperty.value).toBe(0);
        });
    });
});
