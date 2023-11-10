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
import { GroupsApi } from '../../src/api/content-rest-api';
import { EcmAuthMock, GroupsMock } from '../../test/mockObjects';

describe('Groups', () => {
    let authResponseMock: EcmAuthMock;
    let groupsMock: GroupsMock;
    let groupsApi: GroupsApi;

    beforeEach((done) => {
        const hostEcm = 'http://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        groupsMock = new GroupsMock();

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

        groupsApi.listGroups().then(
            (data) => {
                expect(data.list.pagination.count).to.be.equal(2);
                expect(data.list.entries[0].entry.id).to.be.equal('GROUP_alfalfa');
                expect(data.list.entries[1].entry.id).to.be.equal('GROUP_CallCenterAA');
                done();
            }
        );
    });

    it('create group', (done) => {
        groupsMock.get200CreateGroupResponse();

        const groupBody = {
            id: 'SUB_TEST',
            displayName: 'SAMPLE'
        };

        groupsApi.createGroup(groupBody).then((data) => {
            expect(data.entry.id).to.be.equal('GROUP_TEST');
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
            expect(data.entry.id).to.be.equal('GROUP_TEST');
            expect(data.entry.displayName).to.be.equal('SAMPLE');
            done();
        });
    });

    it('update group', (done) => {
        groupsMock.get200UpdateGroupResponse();

        const groupBody = {
            displayName: 'CHANGED'
        };

        groupsApi.updateGroup('GROUP_TEST', groupBody).then((data) => {
            expect(data.entry.id).to.be.equal('GROUP_TEST');
            expect(data.entry.displayName).to.be.equal('CHANGED');
            done();
        });
    });

    it('get group members', (done) => {
        groupsMock.get200GetGroupMemberships();

        groupsApi.listGroupMemberships('GROUP_TEST').then((data) => {
            expect(data.list.pagination.count).to.be.equal(1);
            expect(data.list.entries[0].entry.id).to.be.equal('GROUP_SUB_TEST');
            expect(data.list.entries[0].entry.displayName).to.be.equal('SAMPLE');
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
            expect(data.entry.id).to.be.equal('GROUP_SUB_TEST');
            expect(data.entry.displayName).to.be.equal('SAMPLE');
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
