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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { CoreModule, AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { ActivitiPeopleService } from '../services/activiti-people.service';
import { ActivitiPeople } from './activiti-people.component';
import { ActivitiPeopleSearch } from './activiti-people-search.component';
import { User } from '../models/user.model';

declare let jasmine: any;

const fakeUser: User = new User({
    id: 'fake-id',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

const fakeUserToInvolve: User = new User({
    id: 'fake-involve-id',
    firstName: 'fake-involve-name',
    lastName: 'fake-involve-last',
    email: 'fake-involve@mail.com'
});

describe('ActivitiPeople', () => {

    let activitiPeopleComponent: ActivitiPeople;
    let fixture: ComponentFixture<ActivitiPeople>;
    let element: HTMLElement;
    let componentHandler;
    let logService: LogService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiPeople,
                ActivitiPeopleSearch
            ],
            providers: [
                ActivitiPeopleService
            ]
        }).compileComponents().then(() => {
            logService = TestBed.get(LogService);

            let translateService = TestBed.get(AlfrescoTranslationService);
            spyOn(translateService, 'addTranslationFolder').and.stub();
            spyOn(translateService.translate, 'get').and.callFake((key) => { return Observable.of(key); });

            fixture = TestBed.createComponent(ActivitiPeople);
            activitiPeopleComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            componentHandler = jasmine.createSpyObj('componentHandler', [
                'upgradeAllRegistered'
            ]);

            window['componentHandler'] = componentHandler;
        });
    }));

    it('should show people component title', () => {
        expect(element.querySelector('#people-title')).toBeDefined();
        expect(element.querySelector('#people-title')).not.toBeNull();
    });

    it('should show no people involved message', () => {
        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                expect(element.querySelector('#no-people-label')).not.toBeNull();
                expect(element.querySelector('#no-people-label').textContent).toContain('TASK_DETAILS.PEOPLE.NONE');
            });
    });

    describe('when there are involved people', () => {

        beforeEach(() => {
            activitiPeopleComponent.taskId = 'fake-task-id';
            activitiPeopleComponent.people.push(fakeUser);
            fixture.detectChanges();
        });

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should show people involved', () => {
            expect(element.querySelector('#user-fake-id')).not.toBeNull();
            expect(element.querySelector('#user-fake-id').textContent).toContain('fake-name');
            expect(element.querySelector('#user-fake-id').textContent).toContain('fake-last');
        });

        it('should remove pepole involved', async(() => {
            activitiPeopleComponent.removeInvolvedUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#user-fake-id')).toBeNull();
                });
        }));

        it('should involve pepole', async(() => {
            activitiPeopleComponent.involveUser(fakeUserToInvolve);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200
            });
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#user-fake-involve-id')).not.toBeNull();
                    expect(element.querySelector('#user-fake-involve-id').textContent)
                        .toBe('fake-involve-name fake-involve-last');
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
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should log error message when search fails', async(() => {
            activitiPeopleComponent.peopleSearch$.subscribe(() => {
                expect(logService.error).toHaveBeenCalledWith('Could not load users');
            });
            activitiPeopleComponent.searchUser('fake-search');
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        }));

        it('should not remove user if remove involved user fail', async(() => {
            activitiPeopleComponent.people.push(fakeUser);
            fixture.detectChanges();
            activitiPeopleComponent.removeInvolvedUser(fakeUser);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#user-fake-id')).not.toBeNull();
                    expect(element.querySelector('#user-fake-id').textContent)
                        .toBe('fake-name fake-last');
                });
        }));

        it('should not involve user if involve user fail', async(() => {
            activitiPeopleComponent.involveUser(fakeUserToInvolve);
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#user-fake-id')).toBeNull();
                    expect(element.querySelector('#no-people-label').textContent).toContain('TASK_DETAILS.PEOPLE.NONE');
                });
        }));
    });
});
