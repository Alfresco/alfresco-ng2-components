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

import { expect } from 'chai';
import { AlfrescoApi } from '../../src/alfrescoApi';
import { UserProfileApi } from '../../src/api/activiti-rest-api/api/userProfile.api';
import { BpmAuthMock, ProfileMock } from '../mockObjects';

describe('Activiti Profile Api', () => {
    let profileApi: UserProfileApi;

    let profileMock: ProfileMock;
    let authResponseBpmMock: BpmAuthMock;

    beforeEach(async () => {
        const BPM_HOST = 'http://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        profileMock = new ProfileMock(BPM_HOST);

        authResponseBpmMock.get200Response();

        const alfrescoApi = new AlfrescoApi({
            hostBpm: BPM_HOST,
            provider: 'BPM'
        });

        profileApi = new UserProfileApi(alfrescoApi);

        await alfrescoApi.login('admin', 'admin');
    });

    it('get Profile Picture', async () => {
        profileMock.get200getProfilePicture();
        await profileApi.getProfilePicture();
    });

    it('get Profile url Picture', () => {
        expect(profileApi.getProfilePictureUrl()).equal('http://127.0.0.1:9999/activiti-app/app/rest/admin/profile-picture');
    });

    it('get Profile', async () => {
        profileMock.get200getProfile();
        const data = await profileApi.getProfile();
        expect(data.lastName).equal('Administrator');
        expect(data.groups[0].name).equal('analytics-users');
        expect(data.tenantName).equal('test');
    });
});
