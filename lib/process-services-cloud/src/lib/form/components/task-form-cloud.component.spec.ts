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

import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { FormCloudModule } from '../form-cloud.module';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TaskFormCloudComponent } from './task-form-cloud.component';
import { setupTestBed, IdentityUserService } from '@alfresco/adf-core';
import { TaskCloudService, TaskDetailsCloudModel } from '../../task/public-api';
import { of } from 'rxjs';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

const taskDetails = {
    appName: 'simple-app',
    assignee: 'admin.adf',
    completedDate: null,
    createdDate: 1555419255340,
    description: null,
    formKey: null,
    id: 'bd6b1741-6046-11e9-80f0-0a586460040d',
    name: 'Task1',
    owner: 'admin.adf',
    standAlone: true,
    status: 'ASSIGNED'
};

describe('TaskFormCloudComponent', () => {

    let taskCloudService: TaskCloudService;
    let identityUserService: IdentityUserService;

    let getTaskSpy: jasmine.Spy;
    let getCurrentUserSpy: jasmine.Spy;
    let debugElement: DebugElement;

    let component: TaskFormCloudComponent;
    let fixture: ComponentFixture<TaskFormCloudComponent>;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, FormCloudModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        taskDetails.status = 'ASSIGNED';
        identityUserService = TestBed.get(IdentityUserService);
        getCurrentUserSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({username: 'admin.adf'});
        taskCloudService = TestBed.get(TaskCloudService);
        getTaskSpy = spyOn(taskCloudService, 'getTaskById').and.returnValue(of(new TaskDetailsCloudModel(taskDetails)));

        fixture = TestBed.createComponent(TaskFormCloudComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;

    });

    it('should create TaskFormCloudComponent ', () => {
        expect(component instanceof TaskFormCloudComponent).toBe(true);
    });

    describe('Complete button', () => {
        it('should show complete button when status is ASSIGNED', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
                expect(completeBtn.nativeElement).toBeDefined();
            });
        }));

        it('should not show complete button when status is ASSIGNED but assigned to a different person', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';

            getCurrentUserSpy.and.returnValue({});

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
                expect(completeBtn).toBeNull();
            });
        }));

        it('should not show complete button when showCompleteButton=false', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showCompleteButton = false;

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
                expect(completeBtn).toBeNull();
            });
        }));
    });

    describe('Claim/Unclaim buttons', () => {
        it('should show unclaim button when status is ASSIGNED', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
                expect(unclaimBtn.nativeElement).toBeDefined();
            });
        }));

        it('should not show unclaim button when status is ASSIGNED but assigned to different person', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';

            getCurrentUserSpy.and.returnValue({});

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
                expect(unclaimBtn).toBeNull();
            });
        }));

        it('should not show unclaim button when status is not ASSIGNED', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';
            taskDetails.status = '';
            getTaskSpy.and.returnValue(of(new TaskDetailsCloudModel(taskDetails)));

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
                expect(unclaimBtn).toBeNull();
            });
        }));

        it('should show claim button when status is CREATED', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';
            taskDetails.status = 'CREATED';
            getTaskSpy.and.returnValue(of(new TaskDetailsCloudModel(taskDetails)));

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
                expect(claimBtn.nativeElement).toBeDefined();
            });
        }));

        it('should not show claim button when status is not CREATED', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';
            taskDetails.status = '';
            getTaskSpy.and.returnValue(of(new TaskDetailsCloudModel(taskDetails)));

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
                expect(claimBtn).toBeNull();
            });
        }));
    });

    describe('Cancel button', () => {
        it('should show cancel button by default', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
                expect(cancelBtn.nativeElement).toBeDefined();
            });
        }));

        it('should not show cancel button when showCancelButton=false', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showCancelButton = false;

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
                expect(cancelBtn).toBeNull();
            });
        }));
    });

    describe('Inputs', () => {
        it('should not show complete/claim/unclaim buttons when readOnly=true', async(() => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.readOnly = true;

            component.loadTask();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
                expect(completeBtn).toBeNull();

                const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
                expect(claimBtn).toBeNull();

                const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
                expect(unclaimBtn).toBeNull();

                const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
                expect(cancelBtn.nativeElement).toBeDefined();
            });
        }));

        it('should load data when appName changes', () => {
            component.taskId = 'task1';
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            expect(getTaskSpy).toHaveBeenCalled();
        });

        it('should load data when taskId changes', () => {
            component.appName = 'app1';
            component.ngOnChanges({ taskId: new SimpleChange(null, 'task1', false) });
            expect(getTaskSpy).toHaveBeenCalled();
        });

        it('should not load data when appName changes and taskId is not defined', () => {
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            expect(getTaskSpy).not.toHaveBeenCalled();
        });

        it('should not load data when taskId changes and appName is not defined', () => {
            component.ngOnChanges({ taskId: new SimpleChange(null, 'task1', false) });
            expect(getTaskSpy).not.toHaveBeenCalled();
        });
    });

    describe('Events', () => {
        it('should emit cancelClick when cancel button is clicked', (done) => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.cancelClick.subscribe(() => {
                done();
            });

            component.loadTask();
            fixture.detectChanges();
            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));

            cancelBtn.nativeElement.click();
        });

        it('should emit taskCompleted when task is completed', (done) => {

            spyOn(taskCloudService, 'completeTask').and.returnValue(of({}));

            component.appName = 'app1';
            component.taskId = 'task1';

            component.taskCompleted.subscribe(() => {
                done();
            });

            component.loadTask();
            fixture.detectChanges();
            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));

            completeBtn.nativeElement.click();
        });

        it('should emit taskClaimed when task is claimed', (done) => {
            spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
            taskDetails.status = 'CREATED';
            getTaskSpy.and.returnValue(of(new TaskDetailsCloudModel(taskDetails)));

            component.appName = 'app1';
            component.taskId = 'task1';

            component.taskClaimed.subscribe(() => {
                done();
            });

            component.loadTask();
            fixture.detectChanges();
            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));

            claimBtn.nativeElement.click();
        });

        it('should emit taskUnclaimed when task is unclaimed', (done) => {
            spyOn(taskCloudService, 'unclaimTask').and.returnValue(of({}));
            taskDetails.status = 'ASSIGNED';
            getTaskSpy.and.returnValue(of(new TaskDetailsCloudModel(taskDetails)));

            component.appName = 'app1';
            component.taskId = 'task1';

            component.taskUnclaimed.subscribe(() => {
                done();
            });

            component.loadTask();
            fixture.detectChanges();
            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));

            unclaimBtn.nativeElement.click();
        });

        it('should emit error when error occurs', (done) => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.error.subscribe(() => {
                done();
            });

            component.onError({});
        });

    });

});
