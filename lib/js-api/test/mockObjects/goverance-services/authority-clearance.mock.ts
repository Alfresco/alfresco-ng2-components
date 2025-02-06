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

import { BaseMock } from '../base.mock';
import nock from 'nock';

export class AuthorityClearanceMock extends BaseMock {
    get200AuthorityClearanceForAuthority(authorityId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/gs/versions/1/cleared-authorities/' + authorityId + '/clearing-marks?skipCount=0&maxItems=100')
            .reply(200, {
                list: {
                    pagination: {
                        count: 2,
                        hasMoreItems: false,
                        totalItems: 2,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                id: 'securityGroupFruits',
                                displayLabel: 'Security Group FRUITS',
                                systemGroup: false,
                                type: 'USER_REQUIRES_ALL',
                                marks: [
                                    {
                                        id: 'fruitMarkId1',
                                        displayLabel: 'APPLES',
                                        applied: true,
                                        inherited: false
                                    },
                                    {
                                        id: 'fruitMarkId2',
                                        displayLabel: 'BANANAS',
                                        applied: false,
                                        inherited: false
                                    },
                                    {
                                        id: 'fruitMarkId3',
                                        displayLabel: 'MANGOES',
                                        applied: false,
                                        inherited: true
                                    }
                                ]
                            }
                        },
                        {
                            entry: {
                                id: 'securityGroupAnimals',
                                displayLabel: 'Security Group ANIMALS',
                                systemGroup: false,
                                type: 'USER_REQUIRES_ANY',
                                marks: [
                                    {
                                        id: 'animalMarkId1',
                                        displayLabel: 'LION',
                                        applied: true,
                                        inherited: false
                                    },
                                    {
                                        id: 'animalMarkId1',
                                        displayLabel: 'TIGER',
                                        applied: true,
                                        inherited: false
                                    },
                                    {
                                        id: 'animalMarkId1',
                                        displayLabel: 'ZEBRA',
                                        applied: true,
                                        inherited: false
                                    }
                                ]
                            }
                        }
                    ]
                }
            });
    }

    post200AuthorityClearanceWithSingleItem(authorityId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/gs/versions/1/cleared-authorities/' + authorityId + '/clearing-marks')
            .reply(200, {
                entry: {
                    id: 'fruitMarkId1',
                    name: 'APPLES',
                    groupId: 'securityGroupFruits'
                }
            });
    }

    post200AuthorityClearanceWithList(authorityId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/gs/versions/1/cleared-authorities/' + authorityId + '/clearing-marks')
            .reply(200, {
                list: {
                    pagination: {
                        count: 2,
                        hasMoreItems: false,
                        totalItems: 2,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                id: 'fruitMarkId1',
                                name: 'APPLES',
                                groupId: 'securityGroupFruits'
                            }
                        },
                        {
                            entry: {
                                id: 'fruitMarkId2',
                                name: 'BANANAS',
                                groupId: 'securityGroupFruits'
                            }
                        }
                    ]
                }
            });
    }
}
