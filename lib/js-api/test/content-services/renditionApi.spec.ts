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
import { RenditionsApi } from '../../src/api/content-rest-api';
import { EcmAuthMock, RenditionMock } from '../../test/mockObjects';

describe('Rendition', () => {
    let authResponseMock: EcmAuthMock;
    let renditionMock: RenditionMock;
    let renditionsApi: RenditionsApi;

    beforeEach((done) => {
        const hostEcm = 'http://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        renditionMock = new RenditionMock();

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        renditionsApi = new RenditionsApi(alfrescoJsApi);
    });

    it('Get Rendition', (done) => {
        renditionMock.get200RenditionResponse();

        renditionsApi.getRendition('97a29e9c-1e4f-4d9d-bb02-1ec920dda045', 'pdf').then(
            (data) => {
                expect(data.entry.id).to.be.equal('pdf');
                done();
            }
        );
    });

    it('Create Rendition', (done) => {
        renditionMock.createRendition200();

        renditionsApi.createRendition('97a29e9c-1e4f-4d9d-bb02-1ec920dda045', {id: 'pdf'}).then(
            () => {
                done();
            }
        );
    });

    it('Get Renditions list for node id', (done) => {
        renditionMock.get200RenditionList();

        renditionsApi.listRenditions('97a29e9c-1e4f-4d9d-bb02-1ec920dda045').then(
            (data) => {
                expect(data.list.pagination.count).to.be.equal(6);
                expect(data.list.entries[0].entry.id).to.be.equal('avatar');
                done();
            }
        );
    });
});
