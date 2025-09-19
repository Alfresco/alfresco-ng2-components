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
import { SEARCH_LANGUAGE } from '@alfresco/js-api';

export class SearchMock extends BaseMock {
    get200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/search/versions/1/search', {
                query: {
                    query: 'select * from cmis:folder',
                    language: SEARCH_LANGUAGE.CMIS
                }
            })
            .reply(200, {
                list: {
                    pagination: { count: 100, hasMoreItems: true, skipCount: 0, maxItems: 100 },
                    entries: [
                        {
                            entry: {
                                createdAt: '2017-04-10T10:52:30.868+0000',
                                isFolder: true,
                                search: { score: 1 },
                                isFile: false,
                                createdByUser: { id: 'admin', displayName: 'Administrator' },
                                modifiedAt: '2017-04-10T10:52:30.868+0000',
                                modifiedByUser: { id: 'admin', displayName: 'Administrator' },
                                name: 'user',
                                id: '224e30f4-a7b3-4192-b6e6-dc27d95e26ef',
                                nodeType: 'cm:folder',
                                parentId: '83551834-75d6-4e07-a318-46d5d176738a'
                            }
                        }
                    ]
                }
            });
    }
}
