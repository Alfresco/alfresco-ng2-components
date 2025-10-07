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

import assert from 'assert';
import { AlfrescoApi, UserFiltersApi } from '../../src';
import { BpmAuthMock, UserFiltersMock } from '../mockObjects';

describe('Activiti User Filter Api', () => {
    const hostBpm = 'https://127.0.0.1:9999';
    let authResponseBpmMock: BpmAuthMock;
    let filtersMock: UserFiltersMock;
    let userFiltersApi: UserFiltersApi;

    beforeEach(async () => {
        authResponseBpmMock = new BpmAuthMock(hostBpm);
        filtersMock = new UserFiltersMock(hostBpm);

        authResponseBpmMock.get200Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostBpm,
            provider: 'BPM'
        });

        userFiltersApi = new UserFiltersApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    it('get filter user', async () => {
        filtersMock.get200getUserTaskFilters();

        const opts = {
            appId: 1 // Integer | appId
        };

        const data = await userFiltersApi.getUserTaskFilters(opts);
        assert.equal(data.data[0].name, 'Involved Tasks');
    });
});
