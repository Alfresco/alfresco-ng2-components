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
import { taskDetailsCloudMock } from '../mocks/task-details-cloud.mock';
import { TaskHeaderCloudModule } from '../task-header-cloud.module';
import { By } from '@angular/platform-browser';
import { TaskHeaderCloudService } from '../services/task-header-cloud.service';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('TaskHeaderComponent', () => {
    let component: TaskHeaderCloudComponent;
    let fixture: ComponentFixture<TaskHeaderCloudComponent>;
    let service: TaskHeaderCloudService;
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
        component.taskId = taskDetailsCloudMock.id;
        service = TestBed.get(TaskHeaderCloudService);
        appConfigService = TestBed.get(AppConfigService);
        spyOn(service, 'getTaskById').and.returnValue(of(taskDetailsCloudMock));
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
            let formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"] span'));
            expect(formNameEl.nativeElement.innerText).toBe('Wilbur Adams');
        });
    }));

    it('should display placeholder if no assignee', async(() => {
        component.ngOnInit();
        component.taskDetails.assignee = null;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let valueEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-assignee"] span'));
            expect(valueEl.nativeElement.innerText).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE_DEFAULT');
        });

    }));

    it('should display priority', async(() => {
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-priority"]'));
            expect(formNameEl.nativeElement.innerText).toBe('5');
        });
    }));

    it('should display due date', async(() => {
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toBe('Dec 18 2018');
        });
    }));

    it('should display placeholder if no due date', async(() => {
        component.ngOnInit();
        component.taskDetails.dueDate = null;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toBe('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT');
        });
    }));

    it('should display the default parent value if is undefined', async(() => {
        component.ngOnInit();
        component.taskDetails.processInstanceId = null;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toEqual('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT');
        });
    }));

    describe('Config Filtering', () => {

        it('should show only the properties from the configuration file', async(() => {
            spyOn(appConfigService, 'get').and.returnValue(['assignee', 'status']);
            component.ngOnInit();
            fixture.detectChanges();
            let propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));

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
                let propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));
                expect(propertyList).toBeDefined();
                expect(propertyList).not.toBeNull();
                expect(propertyList.length).toBe(component.properties.length);
                expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE');
                expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS');
            });
        }));
    });
});
