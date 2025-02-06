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
import { AlfrescoApi, GroupsApi } from '../../src';
import { EcmAuthMock, GroupsMock } from '../mockObjects';

describe('Groups', () => {
    let authResponseMock: EcmAuthMock;
    let groupsMock: GroupsMock;
    let groupsApi: GroupsApi;

    beforeEach((done) => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        groupsMock = new GroupsMock(hostEcm);

        authResponseMock.get201Response();
        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        groupsApi = new GroupsApi(alfrescoJsApi);
    });

    it('get groups', (done) => {
        groupsMock.get200GetGroups();

        groupsApi.listGroups().then((data) => {
            assert.equal(data.list.pagination.count, 2);
            assert.equal(data.list.entries[0].entry.id, 'GROUP_alfalfa');
            assert.equal(data.list.entries[1].entry.id, 'GROUP_CallCenterAA');
            done();
        });
    });

    it('create group', (done) => {
        groupsMock.get200CreateGroupResponse();

        const groupBody = {
            id: 'SUB_TEST',
            displayName: 'SAMPLE'
        };

        groupsApi.createGroup(groupBody).then((data) => {
            assert.equal(data.entry.id, 'GROUP_TEST');
            done();
        });
    });

    it('delete group', (done) => {
        groupsMock.getDeleteGroupSuccessfulResponse('group_test');
        groupsApi.deleteGroup('group_test').then(() => {
            done();
        });
    });

    it('get single group', (done) => {
        groupsMock.get200GetSingleGroup();

        groupsApi.getGroup('GROUP_TEST').then((data) => {
            assert.equal(data.entry.id, 'GROUP_TEST');
            assert.equal(data.entry.displayName, 'SAMPLE');
            done();
        });
    });

    it('update group', (done) => {
        groupsMock.get200UpdateGroupResponse();

        const groupBody = {
            displayName: 'CHANGED'
        };

        groupsApi.updateGroup('GROUP_TEST', groupBody).then((data) => {
            assert.equal(data.entry.id, 'GROUP_TEST');
            assert.equal(data.entry.displayName, 'CHANGED');
            done();
        });
    });

    it('get group members', (done) => {
        groupsMock.get200GetGroupMemberships();

        groupsApi.listGroupMemberships('GROUP_TEST').then((data) => {
            assert.equal(data.list.pagination.count, 1);
            assert.equal(data.list.entries[0].entry.id, 'GROUP_SUB_TEST');
            assert.equal(data.list.entries[0].entry.displayName, 'SAMPLE');
            done();
        });
    });

    it('add group member', (done) => {
        groupsMock.get200AddGroupMembershipResponse();

        const groupBody = {
            id: 'GROUP_SUB_TEST',
            memberType: 'GROUP'
        };

        groupsApi.createGroupMembership('GROUP_TEST', groupBody).then((data) => {
            assert.equal(data.entry.id, 'GROUP_SUB_TEST');
            assert.equal(data.entry.displayName, 'SAMPLE');
            done();
        });
    });

    it('delete group member', (done) => {
        groupsMock.getDeleteMemberForGroupSuccessfulResponse('GROUP_TEST', 'GROUP_SUB_TEST');
        groupsApi.deleteGroupMembership('GROUP_TEST', 'GROUP_SUB_TEST').then(() => {
            done();
        });
    });
});
