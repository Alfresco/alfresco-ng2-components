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

import { AspectOrientedConfigService } from './aspect-oriented-config.service';
import { AspectOrientedConfig, Property, OrganisedPropertyGroup, PropertyGroupContainer } from '../../interfaces/content-metadata.interfaces';

describe('AspectOrientedConfigService', () => {

    let configService: AspectOrientedConfigService;

    const createConfigService = (configObj: AspectOrientedConfig) => new AspectOrientedConfigService(configObj);

    describe('reorganiseByConfig', () => {

        interface TestCase {
            name: string;
            config: AspectOrientedConfig;
            expectations: OrganisedPropertyGroup[];
        }

        const property1 = { name: 'property1' } as Property;
        const property2 = { name: 'property2' } as Property;
        const property3 = { name: 'property3' } as Property;
        const property4 = { name: 'property4' } as Property;

        const propertyGroups: PropertyGroupContainer = {
            berseria: { title: 'Berseria', description: '', name: 'berseria', properties: { property1, property2 } },
            zestiria: { title: 'Zestiria', description: '', name: 'zestiria', properties: { property3, property4 } }
        };

        const testCases: TestCase[] = [
            {
                name: 'Empty config',
                config: {},
                expectations: []
            },
            {
                name: 'One property from One group',
                config: {
                    berseria: [ 'property1' ]
                },
                expectations: [{
                    title: 'Berseria',
                    properties: [ property1 ]
                }]
            },
            {
                name: 'More properties from One group',
                config: {
                    berseria: [ 'property1', 'property2' ]
                },
                expectations: [{
                    title: 'Berseria',
                    properties: [ property1, property2 ]
                }]
            },
            {
                name: 'One-one properties from More group',
                config: {
                    berseria: [ 'property1' ],
                    zestiria: [ 'property3' ]
                },
                expectations: [
                    {
                        title: 'Berseria',
                        properties: [ property1 ]
                    },
                    {
                        title: 'Zestiria',
                        properties: [ property3 ]
                    }
                ]
            },
            {
                name: 'More properties from More groups',
                config: {
                    zestiria: [ 'property4', 'property3' ],
                    berseria: [ 'property2', 'property1' ]
                },
                expectations: [
                    {
                        title: 'Zestiria',
                        properties: [ property4, property3 ]
                    },
                    {
                        title: 'Berseria',
                        properties: [ property2, property1 ]
                    }
                ]
            },
            {
                name: 'Wildcard',
                config: {
                    berseria: '*',
                    zestiria: [ 'property4' ]
                },
                expectations: [
                    {
                        title: 'Berseria',
                        properties: [ property1, property2 ]
                    },
                    {
                        title: 'Zestiria',
                        properties: [ property4 ]
                    }
                ]
            },
            {
                name: 'Not existing group',
                config: {
                    berseria: '*',
                    'not-existing-group': '*',
                    zestiria: [ 'property4' ]
                },
                expectations: [
                    {
                        title: 'Berseria',
                        properties: [ property1, property2 ]
                    },
                    {
                        title: 'Zestiria',
                        properties: [ property4 ]
                    }
                ]
            },
            {
                name: 'Not existing property',
                config: {
                    berseria: [ 'not-existing-property' ],
                    zestiria: [ 'property4' ]
                },
                expectations: [
                    {
                        title: 'Zestiria',
                        properties: [ property4 ]
                    }
                ]
            }
        ];

        testCases.forEach((testCase) => {
            it(`should pass for: ${testCase.name}`, () => {
                configService = createConfigService(testCase.config);

                const organisedPropertyGroups = configService.reorganiseByConfig(propertyGroups);

                expect(organisedPropertyGroups.length).toBe(testCase.expectations.length, 'Group count should match');
                testCase.expectations.forEach((expectation, i) => {
                    expect(organisedPropertyGroups[i].title).toBe(expectation.title, 'Group\'s title should match' );
                    expect(organisedPropertyGroups[i].properties.length).toBe(
                        expectation.properties.length,
                        `Property count for "${organisedPropertyGroups[i].title}" group should match.`
                    );

                    expectation.properties.forEach((property, j) => {
                        expect(organisedPropertyGroups[i].properties[j]).toBe(property, `Property should match ${property.name}`);
                    });
                });
            });
        });
    });

    describe('appendAllPreset', () => {
        const property1 = { name: 'property1' } as Property;
        const property2 = { name: 'property2' } as Property;
        const property3 = { name: 'property3' } as Property;
        const property4 = { name: 'property4' } as Property;

        const propertyGroups: PropertyGroupContainer = {
            berseria: { title: 'Berseria', description: '', name: 'berseria', properties: { property1, property2 } },
            zestiria: { title: 'Zestiria', description: '', name: 'zestiria', properties: { property3, property4 } }
        };

        it(`should return all the propertyGorups`, () => {
            const testCase = {
                name: 'Not existing property',
                config: {
                    includeAll: true
                },
                expectations: [
                    {
                        title: 'Berseria',
                        properties: [ property1, property2 ]
                    },
                    {
                        title: 'Zestiria',
                        properties: [ property3, property4 ]
                    }
                ]
            };
            configService = createConfigService(testCase.config);

            const organisedPropertyGroups = configService.appendAllPreset(propertyGroups);

            expect(organisedPropertyGroups.length).toBe(testCase.expectations.length, 'Group count should match');
            testCase.expectations.forEach((expectation, i) => {
                expect(organisedPropertyGroups[i].title).toBe(expectation.title, 'Group\'s title should match' );
                expect(organisedPropertyGroups[i].properties.length).toBe(
                    expectation.properties.length,
                    `Property count for "${organisedPropertyGroups[i].title}" group should match.`
                );

                expectation.properties.forEach((property, j) => {
                    expect(organisedPropertyGroups[i].properties[j]).toBe(property, `Property should match ${property.name}`);
                });
            });
        });

        it(`should set as readOnly the properties defined in the config inside readOnlyAspects`, () => {
            const testCase = {
                name: 'Not existing property',
                config: {
                    includeAll: true,
                    readOnlyAspects: ['berseria'],
                    readOnlyProperties: ['property3']
                },
                expectations: [
                    {
                        title: 'Berseria',
                        properties: [ property1, property2 ]
                    },
                    {
                        title: 'Zestiria',
                        properties: [ property3, property4 ]
                    }
                ]
            };
            configService = createConfigService(testCase.config);

            const organisedPropertyGroups = configService.appendAllPreset(propertyGroups);

            expect(organisedPropertyGroups.length).toBe(testCase.expectations.length, 'Group count should match');
            expect(organisedPropertyGroups[0].properties[0].editable).toBe(false);
            expect(organisedPropertyGroups[0].properties[1].editable).toBe(false);
            expect(organisedPropertyGroups[1].properties[0].editable).toBe(false);
            expect(organisedPropertyGroups[1].properties[1].editable).toBe(undefined);
        });
    });
});
