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
import { GsSitesApi } from '../../src/api/gs-core-rest-api';
import { EcmAuthMock, GsSitesApiMock } from '../../test/mockObjects';

describe('Governance API test', () => {
    let authResponseMock: EcmAuthMock;
    let gsSitesApiMock: GsSitesApiMock;
    let gsSitesApi: GsSitesApi;

    beforeEach(() => {
        const hostEcm = 'http://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();

        gsSitesApiMock = new GsSitesApiMock(hostEcm);

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        gsSitesApi = new GsSitesApi(alfrescoJsApi);
    });

    it('should getRMSite return the RM site', (done) => {
        gsSitesApiMock.get200Response();

        gsSitesApi.getRMSite().then((data) => {
            expect(data.entry.description).to.be.equal('Records Management Description Test');
            done();
        });
    });
});
