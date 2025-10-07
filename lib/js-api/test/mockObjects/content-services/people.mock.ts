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

import nock from 'nock';
import { BaseMock } from '../base.mock';

export class PeopleMock extends BaseMock {
    get201Response(): void {
        this.createNockWithCors()
            .post('/alfresco/api/-default-/public/alfresco/versions/1/people')
            .reply(201, {
                entry: {
                    firstName: 'chewbacca',
                    lastName: 'Chewbe',
                    emailNotificationsEnabled: true,
                    company: {},
                    id: 'chewbe',
                    enabled: true,
                    email: 'chewbe@millenniumfalcon.com'
                }
            });
    }

    get200ResponsePersons(): void {
        this.createNockWithCors()
            .get('/alfresco/api/-default-/public/alfresco/versions/1/people')
            .reply(200, {
                list: {
                    pagination: {
                        count: 5,
                        hasMoreItems: true,
                        totalItems: 153,
                        skipCount: 0,
                        maxItems: 5
                    },
                    entries: [
                        {
                            entry: {
                                firstName: 'anSNSlXA',
                                lastName: '3PhtPlBO',
                                jobTitle: 'N/A',
                                emailNotificationsEnabled: true,
                                company: {},
                                id: '0jl2FBTc',
                                enabled: true,
                                email: 'owAwLISy'
                            }
                        },
                        {
                            entry: {
                                firstName: '84N1jji3',
                                lastName: '748zEwJV',
                                jobTitle: 'N/A',
                                emailNotificationsEnabled: true,
                                company: {},
                                id: '0kd3jA3b',
                                enabled: true,
                                email: 'm1ooPRIu'
                            }
                        },
                        {
                            entry: {
                                firstName: 'cPuvOYnb',
                                lastName: 'GZK6IenG',
                                jobTitle: 'N/A',
                                emailNotificationsEnabled: true,
                                company: {},
                                id: '1BJSWj5u',
                                enabled: true,
                                email: 'UtKzKjje'
                            }
                        },
                        {
                            entry: {
                                firstName: '87vRSHzf',
                                lastName: 'OiLjkq9z',
                                jobTitle: 'N/A',
                                emailNotificationsEnabled: true,
                                company: {},
                                id: '1pvBqbmT',
                                enabled: true,
                                email: '72GemSCB'
                            }
                        },
                        {
                            entry: {
                                firstName: 'QTxD4AWn',
                                lastName: 'IHb5JiaR',
                                jobTitle: 'N/A',
                                emailNotificationsEnabled: true,
                                company: {},
                                id: '2fOamhbL',
                                enabled: true,
                                email: 'hhhQHpmZ'
                            }
                        }
                    ]
                }
            });
    }
}
