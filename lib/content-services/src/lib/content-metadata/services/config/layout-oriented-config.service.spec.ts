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

import { LayoutOrientedConfigService } from './layout-oriented-config.service';
import {
    LayoutOrientedConfig,
    Property,
    OrganisedPropertyGroup,
    PropertyGroupContainer
} from '../../interfaces/content-metadata.interfaces';

describe('LayoutOrientedConfigService', () => {

    let configService: LayoutOrientedConfigService;

    const createConfigService = (configObj: LayoutOrientedConfig) => new LayoutOrientedConfigService(configObj);

    describe('isGroupAllowed', () => {

        const testCases = [
            {
                config: [],
                expectation: false,
                groupNameToQuery: 'berseria'
            },
            {
                config: [{ title: 'Deamons', items: [{ aspect: 'berseria', properties: '*' }] }],
                expectation: true,
                groupNameToQuery: 'berseria'
            },
            {
                config: [{ title: 'Deamons', items: [{ type: 'berseria', properties: '*' }] }],
                expectation: true,
                groupNameToQuery: 'berseria'
            },
            {
                config: [{
                    title: 'Deamons', items: [
                        { aspect: 'zestiria', properties: '*' }, { aspect: 'berseria', properties: '*' }
                    ]
                }],
                expectation: true,
                groupNameToQuery: 'berseria'
            },
            {
                config: [
                    { title: 'Deamons', items: [{ aspect: 'zestiria', properties: '*' }] },
                    { title: 'Malakhims', items: [{ aspect: 'berseria', properties: '*' }] }
                ],
                expectation: true,
                groupNameToQuery: 'berseria'
            },
            {
                config: [
                    { title: 'Deamons', items: [{ aspect: 'zestiria', properties: '*' }] },
                    { title: 'Malakhims', items: [{ type: 'berseria', properties: '*' }] }
                ],
                expectation: false,
                groupNameToQuery: 'phantasia'
            },
            {
                config: [
                    { title: 'Deamons', includeAll: true, items: [{ aspect: 'zestiria', properties: '*' }] }
                ],
                expectation: true,
                groupNameToQuery: 'phantasia'
            }
        ];

        testCases.forEach((testCase, index) => {
            it(`should return ${testCase.expectation.toString()} for test case index #${index}`, () => {
                configService = createConfigService(testCase.config);

                const isAllowed = configService.isGroupAllowed(testCase.groupNameToQuery);

                expect(isAllowed).toBe(testCase.expectation);
            });
        });
    });

    describe('reorganiseByConfig', () => {

        interface TestCase {
            name: string;
            config: LayoutOrientedConfig;
            expectations: OrganisedPropertyGroup[];
        }

        const property1 = { name: 'property1' } as Property;
        const property2 = { name: 'property2' } as Property;
        const property3 = { name: 'property3' } as Property;
        const property4 = { name: 'property4' } as Property;
        const property5 = { name: 'property5' } as Property;
        const property6 = { name: 'property6' } as Property;

        const propertyGroups: PropertyGroupContainer = {
            berseria: { title: 'Berseria', description: '', name: 'berseria', properties: { property1, property2 } },
            zestiria: { title: 'Zestiria', description: '', name: 'zestiria', properties: { property3, property4 } },
            otherTales: { title: 'Other tales', description: '', name: 'otherTales', properties: { property5, property6 } }
        };

        const testCases: TestCase[] = [
            {
                name: 'Empty config',
                config: [],
                expectations: []
            },
            {
                name: 'First property of a group in one item',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'berseria', properties: ['property1'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property1] }
                ]
            },
            {
                name: 'Second property of a group in one item',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'berseria', properties: ['property2'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property2] }
                ]
            },
            {
                name: 'Properties with editable flag',
                config: [
                    {
                        title: 'Editable property', items: [
                            { aspect: 'otherTales', properties: ['property5'], editable: true },
                            { aspect: 'otherTales', properties: ['property6'], editable: false }

                        ]
                    }
                ],
                expectations: [
                    { title: 'Editable property', properties: [property5, property6] }
                ]
            },
            {
                name: 'More properties from one group in one item',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'berseria', properties: ['property2', 'property1'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property2, property1] }
                ]
            },
            {
                name: 'First property of the second group in one item',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'zestiria', properties: ['property4'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property4] }
                ]
            },
            {
                name: 'One-one properties from multiple groups in one item',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'zestiria', properties: ['property4'] },
                            { aspect: 'berseria', properties: ['property1'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property4, property1] }
                ]
            },
            {
                name: 'Multiple properties mixed from multiple groups in multiple items',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'zestiria', properties: ['property4'] },
                            { type: 'berseria', properties: ['property1'] }
                        ]
                    },
                    {
                        title: 'Second group', items: [
                            { aspect: 'zestiria', properties: ['property3'] },
                            { type: 'berseria', properties: ['property2', 'property1'] },
                            { aspect: 'zestiria', properties: ['property4'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property4, property1] },
                    { title: 'Second group', properties: [property3, property2, property1, property4] }
                ]
            },
            {
                name: 'Multiple properties mixed from multiple groups in multiple items with "*"',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'zestiria', properties: '*' },
                            { type: 'berseria', properties: ['property1'] }
                        ]
                    },
                    {
                        title: 'Second group', items: [
                            { type: 'berseria', properties: ['property2', 'property1'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property3, property4, property1] },
                    { title: 'Second group', properties: [property2, property1] }
                ]
            },
            {
                name: 'Not existing property',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'zestiria', properties: '*' },
                            { type: 'berseria', properties: ['not-existing-property'] },
                            { type: 'berseria', properties: ['property2'] }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property3, property4, property2] }
                ]
            },
            {
                name: 'Not existing group',
                config: [
                    {
                        title: 'First group', items: [
                            { aspect: 'zestiria', properties: '*' },
                            { type: 'not-existing-group', properties: '*' },
                            { type: 'berseria', properties: ['property2'] },
                            { type: 'not-existing-group', properties: 'not-existing-property' }
                        ]
                    }
                ],
                expectations: [
                    { title: 'First group', properties: [property3, property4, property2] }
                ]
            },
            {
                name: 'Custom Title',
                config: [
                    {
                        title: 'First group',
                        items: [
                            { aspect: 'zestiria', properties: 'property3' },
                            { type: 'berseria', properties: ['property2', { title: 'Custom title', name: 'property1' } as any] },
                            { type: 'otherTales', properties: [{ title: 'Custom title', name: 'property5' } as any] }
                        ]
                    }
                ],
                expectations: [
                    {
                        title: 'First group',
                        properties: [
                            property3,
                            property2,
                            { name: 'property1', title: 'Custom title', editable: true } as Property,
                            { name: 'property5', title: 'Custom title', editable: true } as Property
                        ]
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
                    expect(organisedPropertyGroups[i].title).toBe(expectation.title, 'Group\'s title should match');
                    expect(organisedPropertyGroups[i].properties.length).toBe(
                        expectation.properties.length,
                        `Property count for "${organisedPropertyGroups[i].title}" group should match.`
                    );

                    expectation.properties.forEach((property, j) => {
                        expect(organisedPropertyGroups[i].properties[j]).toEqual(property, `Property should match ${property.name}`);
                    });
                });
            });
        });
    });
});
