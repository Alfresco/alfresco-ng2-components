/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AlfrescoApi, NodeSecurityMarksApi, NodeSecurityMarkBody } from '../../src';
import { EcmAuthMock, NodeSecurityMarksApiMock } from '../mockObjects';

describe('Node Security Mark API test', () => {
    let authResponseMock: EcmAuthMock;
    let nodeSecurityMarksMock: NodeSecurityMarksApiMock;
    let nodeSecurityMarksApi: NodeSecurityMarksApi;
    const nodeSecurityMarkBody: Array<NodeSecurityMarkBody> = [
        {
            groupId: 'securityGroupId1',
            op: 'ADD',
            id: 'Sh1G8vTQ'
        },
        {
            groupId: 'securityGroupId2',
            op: 'ADD',
            id: 'Sh1G8vTR'
        }
    ];

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';
        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();
        nodeSecurityMarksMock = new NodeSecurityMarksApiMock(hostEcm);
        const alfrescoApi = new AlfrescoApi({
            hostEcm
        });
        nodeSecurityMarksApi = new NodeSecurityMarksApi(alfrescoApi);
        await alfrescoApi.login('admin', 'admin');
    });

    it('add or remove security marks on a node', async () => {
        const nodeId = 'h3bdk2knw2kn';
        nodeSecurityMarksMock.post200manageSecurityMarkOnNode(nodeId);
        await nodeSecurityMarksApi.manageSecurityMarksOnNode(nodeId, nodeSecurityMarkBody).then((data) => {
            assert.equal(data.list.entries[0].entry.groupId, 'securityGroupId1');
            assert.equal(data.list.entries[0].entry.id, 'Sh1G8vTQ');
            assert.equal(data.list.entries[0].entry.name, 'SecurityMarkTest1');
        });
    });

    it('get security marks on a node', async () => {
        const nodeId = 'h3bdk2knw2kn';
        nodeSecurityMarksMock.get200SecurityMarkOnNode(nodeId);
        await nodeSecurityMarksApi.getSecurityMarksOnNode(nodeId).then((data) => {
            assert.equal(data.list.entries[1].entry.groupId, 'securityGroupId2');
            assert.equal(data.list.entries[1].entry.id, 'Sh1G8vTR');
            assert.equal(data.list.entries[1].entry.name, 'SecurityMarkTest2');
        });
    });
});
