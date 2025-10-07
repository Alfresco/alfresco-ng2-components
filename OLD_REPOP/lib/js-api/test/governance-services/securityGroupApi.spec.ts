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

import { AlfrescoApi, SecurityGroupsApi, SecurityGroupBody } from '../../src';
import assert from 'assert';
import { EcmAuthMock, SecurityGroupApiMock } from '../mockObjects';

describe('Security Group API test', () => {
    let authResponseMock: EcmAuthMock;
    let securityGroupMock: SecurityGroupApiMock;
    let securityGroupApi: SecurityGroupsApi;
    const securityGroupBody: SecurityGroupBody = {
        groupName: 'Alfresco',
        groupType: 'HIERARCHICAL'
    };
    let securityGroupId: string;

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';
        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();
        securityGroupMock = new SecurityGroupApiMock(hostEcm);
        const alfrescoApi = new AlfrescoApi({
            hostEcm
        });
        securityGroupApi = new SecurityGroupsApi(alfrescoApi);
        await alfrescoApi.login('admin', 'admin');
    });

    it('create Security Group', async () => {
        securityGroupMock.createSecurityGroup200Response();
        await securityGroupApi.createSecurityGroup(securityGroupBody).then((data) => {
            securityGroupId = data.entry.id;
            assert.notEqual(data.entry.id, null);
            assert.equal(data.entry.groupName, 'Alfresco');
            assert.equal(data.entry.groupType, 'HIERARCHICAL');
        });
    });

    it('get All Security Groups', async () => {
        securityGroupMock.getSecurityGroups200Response();
        await securityGroupApi.getSecurityGroups().then((data) => {
            assert.equal(data.list.entries.length > 0, true);
        });
    });

    it('get Security Group Information', async () => {
        securityGroupMock.getSecurityGroupInfo200Response(securityGroupId);
        await securityGroupApi.getSecurityGroupInfo(securityGroupId).then((data) => {
            assert.notEqual(data.entry.id, null);
            assert.equal(data.entry.groupName, 'Alfresco');
            assert.equal(data.entry.groupType, 'HIERARCHICAL');
        });
    });

    it('update Security Group', async () => {
        securityGroupMock.updateSecurityGroup200Response(securityGroupId);
        const updatedSecurityGroupBody: SecurityGroupBody = {
            groupName: 'Nasa'
        };
        await securityGroupApi.updateSecurityGroup(securityGroupId, updatedSecurityGroupBody).then((data) => {
            assert.notEqual(data.entry.id, null);
            assert.equal(data.entry.groupName, 'Nasa');
            assert.equal(data.entry.groupType, 'HIERARCHICAL');
        });
    });

    it('delete Security Group', async () => {
        securityGroupMock.deleteSecurityGroup200Response(securityGroupId);
        await securityGroupApi
            .deleteSecurityGroup(securityGroupId)
            .then((data) => {
                Promise.resolve(data);
            })
            .catch((err) => {
                Promise.reject(err);
            });
    });
});
