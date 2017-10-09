/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { TestBed } from '@angular/core/testing';
import { AppConfigServiceMock } from '../assets/app-config.service.mock';
import { LightUserRepresentation } from '../models/user-process.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { AppConfigService } from './app-config.service';
import { LogService } from './log.service';
import { PeopleProcessService } from './people-process.service';
import { StorageService } from './storage.service';

declare let jasmine: any;

const firstInvolvedUser: LightUserRepresentation = new LightUserRepresentation({
    id: '1',
    email: 'fake-user1@fake.com',
    firstName: 'fakeName1',
    lastName: 'fakeLast1'
});

const secondInvolvedUser: LightUserRepresentation = new LightUserRepresentation({
    id: '2',
    email: 'fake-user2@fake.com',
    firstName: 'fakeName2',
    lastName: 'fakeLast2'
});

const fakeInvolveUserList: LightUserRepresentation[] = [firstInvolvedUser, secondInvolvedUser];

describe('PeopleProcessService', () => {

    let service: PeopleProcessService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PeopleProcessService,
                AlfrescoApiService,
                StorageService,
                LogService,
                { provide: AppConfigService, useClass: AppConfigServiceMock }
            ]
        });
        service = TestBed.get(PeopleProcessService);
    });

    describe('when user is logged in', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should be able to retrieve people to involve in the task', (done) => {
            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe(
                (users: LightUserRepresentation[]) => {
                    expect(users).toBeDefined();
                    expect(users.length).toBe(2);
                    expect(users[0].id).toEqual('1');
                    expect(users[0].email).toEqual('fake-user1@fake.com');
                    expect(users[0].firstName).toEqual('fakeName1');
                    expect(users[0].lastName).toEqual('fakeLast1');
                    done();
                });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {data: fakeInvolveUserList}
            });
        });

        it('should be able to get people images for people retrieved', (done) => {
            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe(
                (users: LightUserRepresentation[]) => {
                    expect(users).toBeDefined();
                    expect(users.length).toBe(2);
                    expect(service.getUserImage(users[0])).toContain('/users/' + users[0].id + '/picture');
                    expect(service.getUserImage(users[1])).toContain('/users/' + users[1].id + '/picture');
                    done();
                });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {data: fakeInvolveUserList}
            });
        });

        it('should return user image url', () => {
            let url = service.getUserImage(firstInvolvedUser);

            expect(url).toContain('/users/' + firstInvolvedUser.id + '/picture');
        });

        it('should return empty list when there are no users to involve', (done) => {
            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe(
                (users: LightUserRepresentation[]) => {
                    expect(users).toBeDefined();
                    expect(users.length).toBe(0);
                    done();
                });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {}
            });
        });

        it('getWorkflowUsers catch errors call', (done) => {
            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });

        it('should be able to involve people in the task', (done) => {
            service.involveUserWithTask('fake-task-id', 'fake-user-id').subscribe(
                () => {
                    expect(jasmine.Ajax.requests.mostRecent().method).toBe('PUT');
                    expect(jasmine.Ajax.requests.mostRecent().url).toContain('tasks/fake-task-id/action/involve');
                    done();
                });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('involveUserWithTask catch errors call', (done) => {
            service.involveUserWithTask('fake-task-id', 'fake-user-id').subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });

        it('should be able to remove involved people from task', (done) => {
            service.removeInvolvedUser('fake-task-id', 'fake-user-id').subscribe(
                () => {
                    expect(jasmine.Ajax.requests.mostRecent().method).toBe('PUT');
                    expect(jasmine.Ajax.requests.mostRecent().url).toContain('tasks/fake-task-id/action/remove-involved');
                    done();
                });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
        });

        it('removeInvolvedUser catch errors call', (done) => {
            service.removeInvolvedUser('fake-task-id', 'fake-user-id').subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });
    });
});
