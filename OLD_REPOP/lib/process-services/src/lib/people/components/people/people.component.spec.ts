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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleComponent } from './people.component';
import { LightUserRepresentation } from '@alfresco/js-api';
import { of, throwError } from 'rxjs';
import { PeopleProcessService } from '../../../services/people-process.service';

const fakeUser: LightUserRepresentation = {
    id: 0,
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
};

const fakeSecondUser: LightUserRepresentation = {
    id: 1,
    firstName: 'fake-involve-name',
    lastName: 'fake-involve-last',
    email: 'fake-involve@mail.com'
};

describe('PeopleComponent', () => {
    let peopleComponent: PeopleComponent;
    let fixture: ComponentFixture<PeopleComponent>;
    let element: HTMLElement;
    let peopleProcessService: PeopleProcessService;
    let userArray: LightUserRepresentation[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PeopleComponent]
        });
        fixture = TestBed.createComponent(PeopleComponent);
        peopleProcessService = fixture.debugElement.injector.get(PeopleProcessService);

        peopleComponent = fixture.componentInstance;
        element = fixture.nativeElement;

        peopleComponent.people = [];
        peopleComponent.readOnly = true;
        fixture.detectChanges();

        userArray = [fakeUser, fakeSecondUser];
    });

    afterEach(() => fixture.destroy());

    it('should show people component title', async () => {
        peopleComponent.people = [...userArray];

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
            peopleComponent.taskId = 'fake-task-id';
            peopleComponent.people = [...userArray];
            fixture.detectChanges();
        });

        it('should show people involved', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const gatewayElement = element.querySelector('#assignment-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
        });

        it('should remove involved user successfully', () => {
            spyOn(peopleProcessService, 'removeInvolvedUser').and.returnValue(of(null));
            peopleComponent.people = [...userArray];

            peopleComponent.removeInvolvedUser(fakeUser);

            fixture.detectChanges();

            expect(peopleComponent.people.length).toBe(1);
            expect(peopleComponent.people.find((user) => user.id === fakeUser.id)).toBeUndefined();
        });

        it('should emit error when removing involved user fails', () => {
            spyOn(peopleProcessService, 'removeInvolvedUser').and.returnValue(throwError(() => new Error('error')));
            spyOn(peopleComponent.error, 'emit');
            peopleComponent.people = [...userArray];

            peopleComponent.removeInvolvedUser(fakeUser);

            fixture.detectChanges();

            expect(peopleComponent.people.length).toBe(2);
            expect(peopleComponent.error.emit).toHaveBeenCalledWith('Impossible to remove involved user from task');
        });

        it('should involve user successfully', () => {
            spyOn(peopleProcessService, 'involveUserWithTask').and.returnValue(of(null));
            peopleComponent.people = [...userArray];

            peopleComponent.involveUser(fakeUser);

            fixture.detectChanges();

            expect(peopleComponent.people.length).toBe(3);
            expect(peopleComponent.people.find((user) => user.id === fakeUser.id)).toBeDefined();
        });

        it('should emit error when involving user fails', () => {
            spyOn(peopleProcessService, 'involveUserWithTask').and.returnValue(throwError(() => new Error('error')));
            spyOn(peopleComponent.error, 'emit');
            peopleComponent.people = [...userArray];

            peopleComponent.involveUser(fakeUser);

            fixture.detectChanges();

            expect(peopleComponent.people.length).toBe(2);
            expect(peopleComponent.error.emit).toHaveBeenCalledWith('Impossible to involve user with task');
        });

        it('should return an observable with user search results', (done) => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(
                of([
                    {
                        id: 1,
                        firstName: 'fake-test-1',
                        lastName: 'fake-last-1',
                        email: 'fake-test-1@test.com'
                    },
                    {
                        id: 2,
                        firstName: 'fake-test-2',
                        lastName: 'fake-last-2',
                        email: 'fake-test-2@test.com'
                    }
                ])
            );
            peopleComponent.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(2);
                expect(users[0].firstName).toBe('fake-test-1');
                expect(users[0].lastName).toBe('fake-last-1');
                expect(users[0].email).toBe('fake-test-1@test.com');
                expect(users[0].id).toBe(1);
                done();
            });
            peopleComponent.searchUser('fake-search-word');
        });

        it('should return an empty list for not valid search', (done) => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of([]));
            peopleComponent.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(0);
                done();
            });
            peopleComponent.searchUser('fake-search-word');
        });
    });

    describe('when there are errors on service call', () => {
        beforeEach(() => {
            peopleComponent.people.push(...userArray);
            fixture.detectChanges();
        });

        it('should not remove user if remove involved user fail', async () => {
            spyOn(peopleProcessService, 'removeInvolvedUser').and.returnValue(throwError(() => new Error('error')));
            peopleComponent.removeInvolvedUser(fakeUser);

            fixture.detectChanges();
            await fixture.whenStable();

            const gatewayElement = element.querySelector('#assignment-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
        });

        it('should not involve user if involve user fail', async () => {
            spyOn(peopleProcessService, 'involveUserWithTask').and.returnValue(throwError(() => new Error('error')));
            peopleComponent.involveUser(fakeUser);

            fixture.detectChanges();
            await fixture.whenStable();

            const gatewayElement = element.querySelector('#assignment-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
        });
    });
});
