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

import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { LogService, setupTestBed } from '@alfresco/adf-core';
import { PeopleComponent } from './people.component';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { UserProcessModel } from '../../../common/models/user-process.model';
import { PeopleProcessService } from '../../../common/services/people-process.service';

declare let jasmine: any;

const fakeUser = new UserProcessModel({
    id: 'fake-id',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

const fakeSecondUser = new UserProcessModel({
    id: 'fake-involve-id',
    firstName: 'fake-involve-name',
    lastName: 'fake-involve-last',
    email: 'fake-involve@mail.com'
});

describe('PeopleComponent', () => {

    let activitiPeopleComponent: PeopleComponent;
    let fixture: ComponentFixture<PeopleComponent>;
    let element: HTMLElement;
    const userArray = [fakeUser, fakeSecondUser];
    let logService: LogService;
    let peopleProcessService: PeopleProcessService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        logService = TestBed.inject(LogService);
        peopleProcessService = TestBed.inject(PeopleProcessService);
        fixture = TestBed.createComponent(PeopleComponent);
        activitiPeopleComponent = fixture.componentInstance;
        element = fixture.nativeElement;

        activitiPeopleComponent.people = [];
        activitiPeopleComponent.readOnly = true;
        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should show people component title', async () => {
        activitiPeopleComponent.people = [...userArray];

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#people-title')).toBeDefined();
        expect(element.querySelector('#people-title')).not.toBeNull();
    });

    it('should show no people involved message', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#no-people-label')).not.toBeNull();
        expect(element.querySelector('#no-people-label').textContent).toContain('ADF_TASK_LIST.DETAILS.PEOPLE.NONE');
    });

    describe('when there are involved people', () => {

        beforeEach(() => {
            activitiPeopleComponent.taskId = 'fake-task-id';
            activitiPeopleComponent.people.push(...userArray);
            fixture.detectChanges();
        });

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should show people involved', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const gatewayElement = element.querySelector('#assignment-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
        });

        it('should remove people involved', fakeAsync(() => {
            activitiPeopleComponent.removeInvolvedUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    const gatewayElement: any = element.querySelector('#assignment-people-list .adf-datatable-body');
                    expect(gatewayElement).not.toBeNull();
                    expect(gatewayElement.children.length).toBe(1);
                });
        }));

        it('should involve people', fakeAsync(() => {
            activitiPeopleComponent.involveUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    const gatewayElement: any = element.querySelector('#assignment-people-list .adf-datatable-body');
                    expect(gatewayElement).not.toBeNull();
                    expect(gatewayElement.children.length).toBe(3);
                });
        }));

        it('should return an observable with user search results', (done) => {
            activitiPeopleComponent.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(2);
                expect(users[0].firstName).toBe('fake-test-1');
                expect(users[0].lastName).toBe('fake-last-1');
                expect(users[0].email).toBe('fake-test-1@test.com');
                expect(users[0].id).toBe(1);
                done();
            });
            activitiPeopleComponent.searchUser('fake-search-word');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    data: [{
                        id: 1,
                        firstName: 'fake-test-1',
                        lastName: 'fake-last-1',
                        email: 'fake-test-1@test.com'
                    }, {
                        id: 2,
                        firstName: 'fake-test-2',
                        lastName: 'fake-last-2',
                        email: 'fake-test-2@test.com'
                    }]
                }
            });
        });

        it('should return an empty list for not valid search', (done) => {
            activitiPeopleComponent.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(0);
                done();
            });
            activitiPeopleComponent.searchUser('fake-search-word');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {}
            });
        });
    });

    describe('when there are errors on service call', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
            activitiPeopleComponent.people.push(...userArray);
            fixture.detectChanges();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should log error message when search fails', async () => {
            const logServiceErrorSpy = spyOn(logService, 'error');
            const mockThrownError = { error: 'Could not load users'};

            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(throwError(mockThrownError));
            activitiPeopleComponent.searchUser('fake-search');

            expect(logServiceErrorSpy).toHaveBeenCalledWith(mockThrownError);
        });

        it('should not remove user if remove involved user fail', async () => {
            activitiPeopleComponent.removeInvolvedUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
            await fixture.whenStable();
            const gatewayElement: any = element.querySelector('#assignment-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
        });

        it('should not involve user if involve user fail', async () => {
            activitiPeopleComponent.involveUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
            await fixture.whenStable();
            const gatewayElement: any = element.querySelector('#assignment-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
        });
    });
});
