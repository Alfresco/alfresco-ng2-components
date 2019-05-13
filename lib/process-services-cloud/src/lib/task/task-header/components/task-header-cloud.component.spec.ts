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
import { setupTestBed, AppConfigService } from '@alfresco/adf-core';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { assignedTaskDetailsCloudMock } from '../mocks/task-details-cloud.mock';
import { TaskHeaderCloudModule } from '../task-header-cloud.module';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskCloudService } from '../../services/task-cloud.service';

describe('TaskHeaderCloudComponent', () => {
    let component: TaskHeaderCloudComponent;
    let fixture: ComponentFixture<TaskHeaderCloudComponent>;
    let service: TaskCloudService;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            ProcessServiceCloudTestingModule,
            TaskHeaderCloudModule,
            RouterTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskHeaderCloudComponent);
        component = fixture.componentInstance;
        component.appName = 'myApp';
        component.taskId = assignedTaskDetailsCloudMock.id;
        service = TestBed.get(TaskCloudService);
        appConfigService = TestBed.get(AppConfigService);
        spyOn(service, 'getTaskById').and.returnValue(of(assignedTaskDetailsCloudMock));
    });

    it('should render empty component if no task details provided', async(() => {
        component.appName = undefined;
        component.taskId = undefined;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(2);
    }));

    it('should display assignee', async(() => {
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"] span'));
            expect(formNameEl.nativeElement.innerText).toBe('AssignedTaskUser');
        });
    }));

    it('should display placeholder if no assignee', async(() => {
        component.ngOnInit();
        component.taskDetails.assignee = null;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"] span'));
            expect(valueEl.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE_DEFAULT');
        });

    }));

    it('should display priority', async(() => {
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-priority"]'));
            expect(formNameEl.nativeElement.innerText).toBe('5');
        });
    }));

    it('should display error if priority is not a number', async(() => {
        component.ngOnInit();
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
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toBe('18-12-2018');
        });
    }));

    it('should display placeholder if no due date', async(() => {
        component.ngOnInit();
        component.taskDetails.dueDate = null;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT');
        });
    }));

    it('should display the default parent value if is undefined', async(() => {
        component.ngOnInit();
        component.taskDetails.processInstanceId = null;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT');
        });
    }));

    describe('Config Filtering', () => {

        it('should show only the properties from the configuration file', async(() => {
            spyOn(appConfigService, 'get').and.returnValue(['assignee', 'status']);
            component.ngOnInit();
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
            component.ngOnInit();
            fixture.detectChanges();
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
