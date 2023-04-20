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

import { SecurityMarkPaging, SecurityMarkEntry, SecurityMarkBody } from '@alfresco/js-api';

export const fakeMarksApiResponse: SecurityMarkPaging = {
    list: {
        pagination: {
            count: 1,
            hasMoreItems: false,
            totalItems: 1,
            skipCount: 0,
            maxItems: 10
        },
        entries: [
            {
                entry: {
                    groupId: 'eddf6269-ceba-42c6-b979-9ac445d29a94',
                    name: 'securityMark1',
                    id: 'ffBOeOJJ'
                }
            }
        ]
    }
};

export const fakeCreateMarksApiResponse: SecurityMarkEntry = {
    entry: {
        groupId: 'e7b83b84-bb48-46fc-8e64-4b6be910906c',
        name: 'securityMark1',
        id: 'ffBOeOJJ'
    }
};

export const createNewSecurityMarkMock: SecurityMarkBody[] = [{
    name: 'securityMark1'
}];
