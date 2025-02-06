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
import { AlfrescoApi, NodeSecurityMarkBody, SecurityMarkEntry, SecurityMarkPaging, AuthorityClearanceApi } from '../../src';
import { AuthorityClearanceMock, EcmAuthMock } from '../mockObjects';

const DEFAULT_OPTS = {
    skipCount: 0,
    maxItems: 100
};

describe('Authority Clearance API test', () => {
    let authResponseMock: EcmAuthMock;
    let authorityClearanceMock: AuthorityClearanceMock;
    let authorityClearanceApi: AuthorityClearanceApi;
    const nodeSecurityMarkBodyList: Array<NodeSecurityMarkBody> = [
        {
            groupId: 'securityGroupFruits',
            op: 'ADD',
            id: 'fruitMarkId1'
        },
        {
            groupId: 'securityGroupFruits',
            op: 'ADD',
            id: 'fruitMarkId1'
        }
    ];
    const nodeSecurityMarkBodySingle: Array<NodeSecurityMarkBody> = [
        {
            groupId: 'securityGroupFruits',
            op: 'ADD',
            id: 'fruitMarkId1'
        }
    ];

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';
        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();
        authorityClearanceMock = new AuthorityClearanceMock(hostEcm);
        const alfrescoApi = new AlfrescoApi({
            hostEcm
        });
        authorityClearanceApi = new AuthorityClearanceApi(alfrescoApi);
        await alfrescoApi.login('admin', 'admin');
    });

    it('get authority clearances for an authority', async () => {
        const nodeId = 'testAuthorityId';
        authorityClearanceMock.get200AuthorityClearanceForAuthority(nodeId);
        await authorityClearanceApi.getAuthorityClearanceForAuthority(nodeId, DEFAULT_OPTS).then((response) => {
            assert.equal(response.list.entries[0].entry.id, 'securityGroupFruits');
            assert.equal(response.list.entries[0].entry.displayLabel, 'Security Group FRUITS');
            assert.equal(response.list.entries[0].entry.type, 'USER_REQUIRES_ALL');
            assert.equal(response.list.entries[0].entry.marks.length, 3);
        });
    });

    it('add single security marks to an authority', async () => {
        const nodeId = 'testAuthorityId';
        authorityClearanceMock.post200AuthorityClearanceWithSingleItem(nodeId);
        await authorityClearanceApi.updateAuthorityClearance(nodeId, nodeSecurityMarkBodySingle).then((data) => {
            const response = data as SecurityMarkEntry;
            assert.equal(response.entry.id, 'fruitMarkId1');
            assert.equal(response.entry.name, 'APPLES');
            assert.equal(response.entry.groupId, 'securityGroupFruits');
        });
    });

    it('add multiple security marks on an authority', async () => {
        const nodeId = 'testAuthorityId';
        authorityClearanceMock.post200AuthorityClearanceWithList(nodeId);
        await authorityClearanceApi.updateAuthorityClearance(nodeId, nodeSecurityMarkBodyList).then((data) => {
            const response = data as SecurityMarkPaging;
            assert.equal(response.list.entries[0].entry.id, 'fruitMarkId1');
            assert.equal(response.list.entries[0].entry.name, 'APPLES');
            assert.equal(response.list.entries[0].entry.groupId, 'securityGroupFruits');
        });
    });
});
