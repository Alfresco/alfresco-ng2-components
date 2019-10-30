/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, AppConfigService, IdentityUserService } from '@alfresco/adf-core';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { assignedTaskDetailsCloudMock } from '../mocks/task-details-cloud.mock';
import { TaskHeaderCloudModule } from '../task-header-cloud.module';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskCloudService } from '../../services/task-cloud.service';
import moment = require('moment');

describe('TaskHeaderCloudComponent', () => {
    let component: TaskHeaderCloudComponent;
    let fixture: ComponentFixture<TaskHeaderCloudComponent>;
    let service: TaskCloudService;
    let appConfigService: AppConfigService;
    let identityUserService: IdentityUserService;
    let getCandidateGroupsSpy: jasmine.Spy;
    let getCandidateUsersSpy: jasmine.Spy;

    const identityUserMock = {
        username: 'testuser',
        firstName: 'fake-identity-first-name',
        lastName: 'fake-identity-last-name',
        email: 'fakeIdentity@email.com'
    };
    const mockCandidateUsers = ['mockuser1', 'mockuser2', 'mockuser3'];
    const mockCandidateGroups = ['mockgroup1', 'mockgroup2', 'mockgroup3'];

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule,
            TaskHeaderCloudModule,
            RouterTestingModule
        ],
        providers: [IdentityUserService]
    });

    describe('Task Details', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(TaskHeaderCloudComponent);
            component = fixture.componentInstance;
            component.appName = 'myApp';
            component.taskId = assignedTaskDetailsCloudMock.id;
            service = TestBed.get(TaskCloudService);
            identityUserService = TestBed.get(IdentityUserService);
            appConfigService = TestBed.get(AppConfigService);
            spyOn(service, 'getTaskById').and.returnValue(of(assignedTaskDetailsCloudMock));
            getCandidateUsersSpy = spyOn(service, 'getCandidateUsers').and.returnValue(of(mockCandidateUsers));
            getCandidateGroupsSpy = spyOn(service, 'getCandidateGroups').and.returnValue(of(mockCandidateGroups));
            spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock);
        });

        it('should render empty component if no task details provided', async(() => {
            component.appName = undefined;
            component.taskId = undefined;
            fixture.detectChanges();
            expect(fixture.debugElement.children.length).toBe(2);
        }));

        it('should display assignee', async(() => {
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"] span'));
                expect(formNameEl.nativeElement.innerText).toBe('AssignedTaskUser');
            });
        }));

        it('should display placeholder if no assignee', async(() => {
            component.taskDetails.assignee = null;
            component.refreshData();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const valueEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"] span'));
                expect(valueEl.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE_DEFAULT');
            });

        }));

        it('should display priority', async(() => {
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-priority"]'));
                expect(formNameEl.nativeElement.innerText).toBe('5');
            });
        }));

        it('should display error if priority is not a number', async(() => {
            component.ngOnChanges();
            component.taskDetails.assignee = 'testuser';
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const edit = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-edit-icon-priority"]'));
                edit.nativeElement.click();
                fixture.detectChanges();

                const formPriorityEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-editinput-priority"]'));
                formPriorityEl.nativeElement.value = 'stringValue';
                formPriorityEl.nativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                const submitEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-update-priority"]'));
                submitEl.nativeElement.click();
                fixture.detectChanges();

                const errorMessageEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-error-priority"]'));
                expect(errorMessageEl).not.toBeNull();
            });
        }));

        it('should display due date', async(() => {
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
                expect(valueEl.nativeElement.innerText.trim()).toBe('Dec 18, 2018');
            });
        }));

        it('should display placeholder if no due date', async(() => {
            component.taskDetails.dueDate = null;
            component.refreshData();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
                expect(valueEl.nativeElement.innerText.trim()).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT');
            });
        }));

        it('should display the default parent value if is undefined', async(() => {
            component.ngOnChanges();
            component.taskDetails.processInstanceId = null;
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] .adf-property-value'));
                expect(valueEl.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT');
            });
        }));

        it('should display candidate user', async(() => {
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const candidateUser1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockuser1"] span');
                const candidateUser2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockuser2"] span');
                expect(getCandidateUsersSpy).toHaveBeenCalled();
                expect(candidateUser1.innerText).toBe('mockuser1');
                expect(candidateUser2.innerText).toBe('mockuser2');
            });
        }));

        it('should display placeholder if no candidate users', async(() => {
            getCandidateUsersSpy.and.returnValue(of([]));
            component.refreshData();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const labelValue = fixture.debugElement.query(By.css('[data-automation-id="card-array-label-candidateUsers"]'));
                const defaultElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-default"]'));
                expect(labelValue.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS');
                expect(defaultElement.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS_DEFAULT');
            });

        }));

        it('should display candidate groups', async(() => {
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const candidateGroup1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockgroup1"] span');
                const candidateGroup2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-mockgroup2"] span');
                expect(getCandidateGroupsSpy).toHaveBeenCalled();
                expect(candidateGroup1.innerText).toBe('mockgroup1');
                expect(candidateGroup2.innerText).toBe('mockgroup2');
            });
        }));

        it('should display placeholder if no candidate groups', async(() => {
            getCandidateGroupsSpy.and.returnValue(of([]));
            component.refreshData();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const labelValue = fixture.debugElement.query(By.css('[data-automation-id="card-array-label-candidateGroups"]'));
                const defaultElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-default"]'));
                expect(labelValue.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS');
                expect(defaultElement.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS_DEFAULT');
            });

        }));

        describe('Config Filtering', () => {

            it('should show only the properties from the configuration file', async(() => {
                spyOn(appConfigService, 'get').and.returnValue(['assignee', 'status']);
                component.ngOnChanges();
                fixture.detectChanges();
                const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));

                fixture.whenStable().then(() => {
                    expect(propertyList).toBeDefined();
                    expect(propertyList).not.toBeNull();
                    expect(propertyList.length).toBe(2);
                    expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE');
                    expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS');
                });
            }));

            it('should show all the default properties if there is no configuration', async(() => {
                spyOn(appConfigService, 'get').and.returnValue(null);
                component.ngOnChanges();
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));
                    expect(propertyList).toBeDefined();
                    expect(propertyList).not.toBeNull();
                    expect(propertyList.length).toBe(component.properties.length);
                    expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE');
                    expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS');
                });
            }));

        });

    });

    describe('Task Errors', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(TaskHeaderCloudComponent);
            component = fixture.componentInstance;
            service = TestBed.get(TaskCloudService);
            spyOn(service, 'getTaskById').and.returnValue(throwError('Task not found error'));
        });

        it('should emit an error when getTaskById returns an error', async(() => {
            const taskErrorSpy = spyOn(component.taskError, 'emit');
            component.loadTaskDetailsById(component.appName, component.taskId);
            fixture.detectChanges();
            expect(taskErrorSpy).toHaveBeenCalledWith('Task not found error');

        }));
    });
});
