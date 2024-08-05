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

import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { PeopleComponent } from './people.component';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { LightUserRepresentation } from '@alfresco/js-api';

declare let jasmine: any;

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
    const userArray = [fakeUser, fakeSecondUser];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProcessTestingModule, PeopleComponent]
        });
        fixture = TestBed.createComponent(PeopleComponent);
        peopleComponent = fixture.componentInstance;
        element = fixture.nativeElement;

        peopleComponent.people = [];
        peopleComponent.readOnly = true;
        fixture.detectChanges();
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
            peopleComponent.people.push(...userArray);
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
            peopleComponent.removeInvolvedUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const gatewayElement: any = element.querySelector('#assignment-people-list .adf-datatable-body');
                expect(gatewayElement).not.toBeNull();
                expect(gatewayElement.children.length).toBe(1);
            });
        }));

        it('should involve people', fakeAsync(() => {
            peopleComponent.involveUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const gatewayElement: any = element.querySelector('#assignment-people-list .adf-datatable-body');
                expect(gatewayElement).not.toBeNull();
                expect(gatewayElement.children.length).toBe(3);
            });
        }));

        it('should return an observable with user search results', (done) => {
            peopleComponent.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(2);
                expect(users[0].firstName).toBe('fake-test-1');
                expect(users[0].lastName).toBe('fake-last-1');
                expect(users[0].email).toBe('fake-test-1@test.com');
                expect(users[0].id).toBe(1);
                done();
            });
            peopleComponent.searchUser('fake-search-word');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    data: [
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
                    ]
                }
            });
        });

        it('should return an empty list for not valid search', (done) => {
            peopleComponent.peopleSearch$.subscribe((users) => {
                expect(users.length).toBe(0);
                done();
            });
            peopleComponent.searchUser('fake-search-word');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: { /* empty */ }
            });
        });
    });

    describe('when there are errors on service call', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            peopleComponent.people.push(...userArray);
            fixture.detectChanges();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should not remove user if remove involved user fail', async () => {
            peopleComponent.removeInvolvedUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
            await fixture.whenStable();
            const gatewayElement: any = element.querySelector('#assignment-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
        });

        it('should not involve user if involve user fail', async () => {
            peopleComponent.involveUser(fakeUser);
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
