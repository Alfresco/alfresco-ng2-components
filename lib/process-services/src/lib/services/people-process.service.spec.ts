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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PeopleProcessService } from './people-process.service';
import { LightUserRepresentation } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { of, throwError } from 'rxjs';

const firstInvolvedUser: LightUserRepresentation = {
    id: 1,
    email: 'fake-user1@fake.com',
    firstName: 'fakeName1',
    lastName: 'fakeLast1'
};

const secondInvolvedUser: LightUserRepresentation = {
    id: 2,
    email: 'fake-user2@fake.com',
    firstName: 'fakeName2',
    lastName: 'fakeLast2'
};

const fakeInvolveUserList: LightUserRepresentation[] = [firstInvolvedUser, secondInvolvedUser];

const errorResponse = { error: new Error('Unsuccessful HTTP response') };

describe('PeopleProcessService', () => {
    let service: PeopleProcessService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PeopleProcessService,
                {
                    provide: AlfrescoApiService,
                    useValue: {
                        getInstance: jasmine.createSpy('getInstance').and.returnValue({})
                    }
                }
            ]
        });
        service = TestBed.inject(PeopleProcessService);
    });

    describe('when user is logged in', () => {
        it('should be able to retrieve people to involve in the task', fakeAsync(() => {
            spyOn(service, 'getWorkflowUsers').and.returnValue(of(fakeInvolveUserList));

            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe((users) => {
                expect(users).toBeDefined();
                expect(users.length).toBe(2);
                expect(users[0].id).toEqual(1);
                expect(users[0].email).toEqual('fake-user1@fake.com');
                expect(users[0].firstName).toEqual('fakeName1');
                expect(users[0].lastName).toEqual('fakeLast1');
            });

            tick();
            expect(service.getWorkflowUsers).toHaveBeenCalledWith('fake-task-id', 'fake-filter');
        }));

        it('should be able to get people images for people retrieved', fakeAsync(() => {
            spyOn(service, 'getWorkflowUsers').and.returnValue(of(fakeInvolveUserList));

            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe((users) => {
                expect(users).toBeDefined();
                expect(users.length).toBe(2);
                expect(service.getUserImage(users[0].id.toString())).toContain('/users/' + users[0].id + '/picture');
                expect(service.getUserImage(users[1].id.toString())).toContain('/users/' + users[1].id + '/picture');
            });

            tick();
        }));

        it('should return user image url', () => {
            const url = service.getUserImage(firstInvolvedUser.id.toString());

            expect(url).toContain('/users/' + firstInvolvedUser.id + '/picture');
        });

        it('should return empty list when there are no users to involve', fakeAsync(() => {
            spyOn(service, 'getWorkflowUsers').and.returnValue(of([]));

            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe((users) => {
                expect(users).toBeDefined();
                expect(users.length).toBe(0);
            });

            tick();
        }));

        it('getWorkflowUsers catch errors call', fakeAsync(() => {
            spyOn(service, 'getWorkflowUsers').and.returnValue(throwError(errorResponse));

            service.getWorkflowUsers('fake-task-id', 'fake-filter').subscribe({
                next: () => fail('Should have thrown an error'),
                error: (error) => {
                    expect(error).toEqual(errorResponse);
                }
            });

            tick();
        }));

        it('should be able to involve people in the task', fakeAsync(() => {
            spyOn(service, 'involveUserWithTask').and.returnValue(of([]));

            service.involveUserWithTask('fake-task-id', 'fake-user-id').subscribe(() => {
                expect(service.involveUserWithTask).toHaveBeenCalledWith('fake-task-id', 'fake-user-id');
            });

            tick();
        }));

        it('involveUserWithTask catch errors call', fakeAsync(() => {
            spyOn(service, 'involveUserWithTask').and.returnValue(throwError(errorResponse));

            service.involveUserWithTask('fake-task-id', 'fake-user-id').subscribe({
                next: () => fail('Should have thrown an error'),
                error: (error) => {
                    expect(error).toEqual(errorResponse);
                }
            });

            tick();
        }));

        it('should be able to remove involved people from task', fakeAsync(() => {
            spyOn(service, 'removeInvolvedUser').and.returnValue(of([]));

            service.removeInvolvedUser('fake-task-id', 'fake-user-id').subscribe(() => {
                expect(service.removeInvolvedUser).toHaveBeenCalledWith('fake-task-id', 'fake-user-id');
            });

            tick();
        }));

        it('removeInvolvedUser catch errors call', fakeAsync(() => {
            spyOn(service, 'removeInvolvedUser').and.returnValue(throwError(errorResponse));

            service.removeInvolvedUser('fake-task-id', 'fake-user-id').subscribe({
                next: () => fail('Should have thrown an error'),
                error: (error) => {
                    expect(error).toEqual(errorResponse);
                }
            });

            tick();
        }));
    });
});
