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

import { LayoutOrientedConfigService } from './layout-oriented-config.service';
import { LayoutOrientedConfig, Property, OrganisedPropertyGroup, PropertyGroupContainer } from '../../interfaces/content-metadata.interfaces';

describe('LayoutOrientedConfigService', () => {

    let configService: LayoutOrientedConfigService;

    function createConfigService(configObj: LayoutOrientedConfig) {
        return new LayoutOrientedConfigService(configObj);
    }

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
                config: [{ title: 'Deamons', items: [
                    { aspect: 'zestiria', properties: '*' }, { aspect: 'berseria', properties: '*' }
                ]}],
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

        const property1 = <Property> { name: 'property1' },
            property2 = <Property> { name: 'property2' },
            property3 = <Property> { name: 'property3' },
            property4 = <Property> { name: 'property4' };

        const propertyGroups: PropertyGroupContainer = {
            berseria: { title: 'Berseria', description: '', name: 'berseria', properties: { property1, property2 } },
            zestiria: { title: 'Zestiria', description: '', name: 'zestiria', properties: { property3, property4 } }
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
                    { title: 'First group', items: [
                        { aspect: 'berseria', properties: [ 'property1' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property1 ] }
                ]
            },
            {
                name: 'Second property of a group in one item',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'berseria', properties: [ 'property2' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property2 ] }
                ]
            },
            {
                name: 'More properties from one group in one item',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'berseria', properties: [ 'property2', 'property1' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property2, property1 ] }
                ]
            },
            {
                name: 'First property of the second group in one item',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'zestiria', properties: [ 'property4' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property4 ] }
                ]
            },
            {
                name: 'One-one properties from multiple groups in one item',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'zestiria', properties: [ 'property4' ] },
                        { aspect: 'berseria', properties: [ 'property1' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property4, property1 ] }
                ]
            },
            {
                name: 'Multiple properties mixed from multiple groups in multiple items',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'zestiria', properties: [ 'property4' ] },
                        { type: 'berseria', properties: [ 'property1' ] }
                    ]},
                    { title: 'Second group', items: [
                        { aspect: 'zestiria', properties: [ 'property3' ] },
                        { type: 'berseria', properties: [ 'property2', 'property1' ] },
                        { aspect: 'zestiria', properties: [ 'property4' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property4, property1 ] },
                    { title: 'Second group', properties: [ property3, property2, property1, property4 ] }
                ]
            },
            {
                name: 'Multiple properties mixed from multiple groups in multiple items with "*"',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'zestiria', properties: '*' },
                        { type: 'berseria', properties: [ 'property1' ] }
                    ]},
                    { title: 'Second group', items: [
                        { type: 'berseria', properties: [ 'property2', 'property1' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property3, property4, property1 ] },
                    { title: 'Second group', properties: [ property2, property1 ] }
                ]
            },
            {
                name: 'Not existing property',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'zestiria', properties: '*' },
                        { type: 'berseria', properties: [ 'not-existing-property' ] },
                        { type: 'berseria', properties: [ 'property2' ] }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property3, property4, property2 ] }
                ]
            },
            {
                name: 'Not existing group',
                config: [
                    { title: 'First group', items: [
                        { aspect: 'zestiria', properties: '*' },
                        { type: 'not-existing-group', properties: '*' },
                        { type: 'berseria', properties: [ 'property2' ] },
                        { type: 'not-existing-group', properties: 'not-existing-property' }
                    ]}
                ],
                expectations: [
                    { title: 'First group', properties: [ property3, property4, property2 ] }
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
});
