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
import { AlfrescoApi, VersionsApi } from '../../src';
import { EcmAuthMock, VersionMock } from '../mockObjects';

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

    it('should list all node version renditions', (done) => {
        versionMock.get200ResponseVersionRenditions(nodeId, versionId);

        versionsApi.listVersionRenditions(nodeId, versionId).then((data) => {
            const entries = data.list.entries;
            assert.equal(entries.length, 6);
            assert.equal(data.list.entries[0].entry.id, 'avatar');
            done();
        });
    });

    it('should create rendition for a node versionId', (done) => {
        versionMock.create200VersionRendition(nodeId, versionId);

        versionsApi.createVersionRendition(nodeId, versionId, { id: 'pdf' }).then(() => {
            done();
        });
    });

    it('should get a node version rendition', (done) => {
        versionMock.get200VersionRendition(nodeId, versionId, renditionId);

        versionsApi.getVersionRendition(nodeId, versionId, renditionId).then((data) => {
            assert.equal(data.entry.id, 'pdf');
            done();
        });
    });

    it('should get version history', (done) => {
        versionMock.get200Response(nodeId);

        versionsApi.listVersionHistory(nodeId).then((data) => {
            const entries = data.list.entries;
            assert.equal(entries.length, 2);
            assert.equal(entries[0].entry.id, '2.0');
            assert.equal(entries[1].entry.id, '1.0');
            done();
        });
    });

    it('should revert a version', (done) => {
        versionMock.post201Response(nodeId, versionId);

        versionsApi.revertVersion(nodeId, versionId, { majorVersion: true, comment: '' }).then((data) => {
            assert.equal(data.entry.id, '3.0');
            done();
        });
    });
});
