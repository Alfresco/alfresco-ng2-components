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
import { AlfrescoApi, SecurityGroupBody, SecurityGroupsApi, SecurityMarkBody, SecurityMarksApi, SecurityMarksBody } from '../../src';
import { EcmAuthMock, SecurityGroupApiMock, SecurityMarkApiMock } from '../mockObjects';

describe('Security Mark API test', () => {
    let authResponseMock: EcmAuthMock;
    let securityMarkApiMock: SecurityMarkApiMock;
    let securityGroupMock: SecurityGroupApiMock;
    let securityGroupApi: SecurityGroupsApi;
    let securityMarksApi: SecurityMarksApi;
    let securityGroupId = 'a0a7b107-84ba-4c3d-b0b7-a8509e8c1c33';
    let securityMarkId = 'Sh1G8vTQ';
    const securityMarksBodySingle: SecurityMarksBody = [
        {
            name: 'SecurityMarkTest'
        }
    ];
    const securityGroupBody: SecurityGroupBody = {
        groupName: 'Alfresco',
        groupType: 'HIERARCHICAL'
    };
    const securityMarksBody: SecurityMarksBody = [
        {
            name: 'SecurityMark3'
        },
        {
            name: 'SecurityMark4'
        }
    ];

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';
        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();
        securityGroupMock = new SecurityGroupApiMock(hostEcm);
        securityMarkApiMock = new SecurityMarkApiMock(hostEcm);
        const alfrescoApi = new AlfrescoApi({
            hostEcm
        });
        securityGroupApi = new SecurityGroupsApi(alfrescoApi);
        securityMarksApi = new SecurityMarksApi(alfrescoApi);
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

    it('create Security Mark', async () => {
        securityMarkApiMock.createSecurityMark200Response(securityGroupId);
        await securityMarksApi.createSecurityMarks(securityGroupId, securityMarksBodySingle).then((data: any) => {
            securityMarkId = data.entry.id;
            assert.notEqual(data.entry.id, null);
            assert.equal(data.entry.name, 'SecurityMarkTest');
            assert.equal(data.entry.groupId, securityGroupId);
        });
    });

    it('create multiple Security Mark', async () => {
        securityMarkApiMock.createSecurityMarks200Response(securityGroupId);
        await securityMarksApi.createSecurityMarks(securityGroupId, securityMarksBody).then((data: any) => {
            assert.notEqual(data.list.entries[0].entry.id, null);
            assert.equal(data.list.entries[0].entry.name, 'SecurityMark3');
            assert.equal(data.list.entries[0].entry.groupId, securityGroupId);
        });
    });

    it('get All Security Marks', async () => {
        securityMarkApiMock.get200GetSecurityMark(securityGroupId);
        await securityMarksApi.getSecurityMarks(securityGroupId).then((data) => {
            assert.equal(data.list.entries.length > 0, true);
        });
    });

    it('get Security Mark Information', async () => {
        securityMarkApiMock.get200GetSingleSecurityMark(securityGroupId, securityMarkId);
        await securityMarksApi.getSecurityMark(securityGroupId, securityMarkId).then((data) => {
            assert.notEqual(data.entry.id, null);
            assert.equal(data.entry.name, 'SecurityMarkTest');
            assert.equal(data.entry.groupId, securityGroupId);
        });
    });

    it('update Security Mark', async () => {
        const updatedSecurityMarkBody: SecurityMarkBody = {
            name: 'AlfrescoSecurityMark'
        };
        securityMarkApiMock.put200UpdateSecurityMarkResponse(securityGroupId, securityMarkId);
        await securityMarksApi.updateSecurityMark(securityGroupId, securityMarkId, updatedSecurityMarkBody).then((data) => {
            assert.notEqual(data.entry.id, null);
            assert.equal(data.entry.name, 'AlfrescoSecurityMark');
            assert.equal(data.entry.groupId, securityGroupId);
        });
    });

    it('delete Security Mark', async () => {
        securityMarkApiMock.getDeleteSecurityMarkSuccessfulResponse(securityGroupId, securityMarkId);
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
