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
import { VersionsApi } from '../../src/api/content-rest-api';
import { EcmAuthMock, VersionMock } from '../../test/mockObjects';

describe('Versions', () => {
    const nodeId = '74cd8a96-8a21-47e5-9b3b-a1b3e296787d';
    const versionId = '1.0';
    const renditionId = 'pdf';

    let authResponseMock: EcmAuthMock;
    let versionMock: VersionMock;
    let versionsApi: VersionsApi;

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        versionMock = new VersionMock(hostEcm);
        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({ hostEcm });
        await alfrescoJsApi.login('admin', 'admin');

        versionsApi = new VersionsApi(alfrescoJsApi);
    });

    it('should list all node\'s version renditions', (done) => {
        versionMock.get200ResponseVersionRenditions(nodeId, versionId);

        versionsApi.listVersionRenditions(nodeId, versionId).then((data) => {
            const entries = data.list.entries;
            expect(entries.length).to.be.equal(6);
            expect(data.list.entries[0].entry.id).to.be.equal('avatar');
            done();
        });
    });

    it('should create rendition for a node\'s versionId', (done) => {
        versionMock.create200VersionRendition(nodeId, versionId);

        versionsApi.createVersionRendition(nodeId, versionId, { id: 'pdf' }).then(() => {
            done();
        });
    });

    it('should get a node\'s version rendition', (done) => {
        versionMock.get200VersionRendition(nodeId, versionId, renditionId);

        versionsApi.getVersionRendition(nodeId, versionId, renditionId).then((data) => {
            expect(data.entry.id).to.be.equal('pdf');
            done();
        });
    });

    it('should get version history', (done) => {
        versionMock.get200Response(nodeId);

        versionsApi.listVersionHistory(nodeId).then((data) => {
            const entries = data.list.entries;
            expect(entries.length).to.be.equal(2);
            expect(entries[0].entry.id).to.be.equal('2.0');
            expect(entries[1].entry.id).to.be.equal('1.0');
            done();
        });
    });

    it('should revert a version', (done) => {
        versionMock.post201Response(nodeId, versionId);

        versionsApi.revertVersion(nodeId, versionId, { majorVersion: true, comment: '' }).then((data) => {
            expect(data.entry.id).to.be.equal('3.0');
            done();
        });
    });
});
