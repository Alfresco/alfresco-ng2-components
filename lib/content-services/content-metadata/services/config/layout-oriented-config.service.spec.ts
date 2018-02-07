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
import { LayoutOrientedConfig } from '../../interfaces/content-metadata.interfaces';

describe('ContentMetadataConfigFactory', () => {

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

    describe('isPropertyAllowed', () => {

        const testCases = [
            {
                config: [],
                expectation: false,
                groupNameToQuery: 'berseria',
                propertyNameToQuery: 'velvet'
            },
            {
                config: [{ title: 'Deamons', items: [{ aspect: 'berseria', properties: '*' }] }],
                expectation: true,
                groupNameToQuery: 'berseria',
                propertyNameToQuery: 'velvet'
            },
            {
                config: [{ title: 'Deamons', items: [{ type: 'berseria', properties: ['velvet'] }] }],
                expectation: true,
                groupNameToQuery: 'berseria',
                propertyNameToQuery: 'velvet'
            },
            {
                config: [{ title: 'Deamons', items: [{ aspect: 'berseria', properties: ['magilou'] }] }],
                expectation: false,
                groupNameToQuery: 'berseria',
                propertyNameToQuery: 'velvet'
            },
            {
                config: [{ title: 'Deamons', items: [
                    { aspect: 'berseria', properties: 'magilou' },
                    { aspect: 'berseria', properties: 'laphicet' },
                    { aspect: 'berseria', properties: 'velvet' }
                ]}],
                expectation: true,
                groupNameToQuery: 'berseria',
                propertyNameToQuery: 'velvet'
            },
            {
                config: [
                    { title: 'Deamons', items: [{ aspect: 'berseria', properties: 'rokurou' }] },
                    { title: 'Malakhims', items: [{ aspect: 'berseria', properties: 'velvet' }] }
                ],
                expectation: true,
                groupNameToQuery: 'berseria',
                propertyNameToQuery: 'velvet'
            },
            {
                config: [
                    { title: 'Deamons', items: [{ aspect: 'berseria', properties: 'laphicet' }] },
                    { title: 'Malakhims', items: [{ type: 'berseria', properties: 'rokurou' }] }
                ],
                expectation: false,
                groupNameToQuery: 'berseria',
                propertyNameToQuery: 'velvet'
            }
        ];

        testCases.forEach((testCase, index) => {
            it(`should return ${testCase.expectation.toString()} for test case index #${index}`, () => {
                configService = createConfigService(testCase.config);

                const isAllowed = configService.isPropertyAllowed(testCase.groupNameToQuery, testCase.propertyNameToQuery);

                expect(isAllowed).toBe(testCase.expectation);
            });
        });
    });
});
