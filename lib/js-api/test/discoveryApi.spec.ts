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
import { AlfrescoApi, DiscoveryApi } from '../src';
import { DiscoveryMock, EcmAuthMock } from './mockObjects';

describe('Discovery', () => {
    let authResponseMock: EcmAuthMock;
    let discoveryMock: DiscoveryMock;
    let discoveryApi: DiscoveryApi;

    beforeEach((done) => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();

        discoveryMock = new DiscoveryMock(hostEcm);

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        discoveryApi = new DiscoveryApi(alfrescoJsApi);
    });

    it('should getRepositoryInformation works', (done) => {
        discoveryMock.get200Response();

        discoveryApi.getRepositoryInformation().then((data) => {
            assert.equal(data.entry.repository.edition, 'Enterprise');
            done();
        });
    });
});
