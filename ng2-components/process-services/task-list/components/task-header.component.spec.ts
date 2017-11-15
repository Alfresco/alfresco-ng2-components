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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService, CardViewUpdateService, CoreModule, TranslationService, UserProcessModel } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { AppConfigServiceMock } from '../assets/app-config.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';

import { TaskDetailsModel } from '../models/task-details.model';
import { taskDetailsMock } from './../assets/task-details.mock';
import { TaskListService } from './../services/tasklist.service';
import { TaskHeaderComponent } from './task-header.component';

describe('TaskHeaderComponent', () => {

    let service: TaskListService;
    let component: TaskHeaderComponent;
    let fixture: ComponentFixture<TaskHeaderComponent>;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                TaskHeaderComponent
            ],
            providers: [
                TaskListService,
                CardViewUpdateService,
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskHeaderComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TaskListService);
        debugElement = fixture.debugElement;

        component.taskDetails = new TaskDetailsModel(taskDetailsMock);
    });

    it('should render empty component if no task details provided', () => {
        component.taskDetails = undefined;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(0);
    });

    it('should display assignee', () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        let formNameEl = fixture.debugElement.query(By.css('[data-automation-id="header-assignee"] .adf-property-value'));
        expect(formNameEl.nativeElement.innerText).toBe('Wilbur Adams');
    });

    it('should display placeholder if no assignee', () => {
        component.taskDetails.assignee = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-assignee"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText).toBe('ADF_TASK_LIST.PROPERTIES.ASSIGNEE_DEFAULT');
    });

    it('should display created-by', () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        let formNameEl = fixture.debugElement.query(By.css('[data-automation-id="header-created-by"] .adf-property-value'));
        expect(formNameEl.nativeElement.innerText).toBe('Wilbur Adams');
    });

    it('should set editable to false if the task has already completed', () => {
        component.taskDetails.endDate = new Date('05/05/2002');
        component.ngOnChanges({});
        fixture.detectChanges();

        let datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-dueDate"]`));
        expect(datePicker).toBeNull('Datepicker should NOT be in DOM');
    });

    it('should set editable to true if the task has not completed yet', () => {
        component.taskDetails.endDate = undefined;
        component.ngOnChanges({});
        fixture.detectChanges();

        let datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-dueDate"]`));
        expect(datePicker).not.toBeNull('Datepicker should be in DOM');
    });

    describe('Claiming', () => {

        it('should display the claim button if no assignee', () => {
            component.taskDetails.assignee = null;

            component.ngOnChanges({});
            fixture.detectChanges();

            let claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
            expect(claimButton.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.BUTTON.CLAIM');
        });
    });

    describe('Unclaim', () => {

        const batman = new UserProcessModel({ id : 1, email: 'bruce.wayne@gotham.com', firstName: 'Bruce', lastName: 'Wayne', userImage: 'batman.jpg' });
        let taskListService;

        beforeEach(() => {
            taskListService = TestBed.get(TaskListService);
            component.taskDetails.assignee = batman;
            component.taskDetails.id = 'repair-batmobile';
            fixture.detectChanges();
        });

        it('should display the requeue button if there is assignee', () => {
            let unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="header-unclaim-button"]'));
            expect(unclaimButton.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.BUTTON.UNCLAIM');
        });

        it('should call the service\'s unclaim method on unclaiming' , () => {
            spyOn(taskListService, 'unclaimTask');

            let unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="header-unclaim-button"]'));
            unclaimButton.triggerEventHandler('click', {});

            expect(taskListService.unclaimTask).toHaveBeenCalledWith('repair-batmobile');
        });

        it('should trigger the unclaim event on successfull unclaiming', () => {
            let unclaimed: boolean = false;
            component.unclaim.subscribe(() => { unclaimed = true; });
            spyOn(taskListService, 'unclaimTask').and.returnValue(Observable.of(true));

            let unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="header-unclaim-button"]'));
            unclaimButton.triggerEventHandler('click', {});

            expect(unclaimed).toBeTruthy();
        });
    });

    it('should display due date', () => {
        component.taskDetails.dueDate = new Date('2016-11-03');
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toBe('Nov 03 2016');
    });

    it('should display placeholder if no due date', () => {
        component.taskDetails.dueDate = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toBe('ADF_TASK_LIST.PROPERTIES.DUE_DATE_DEFAULT');
    });

    it('should display form name', () => {
        component.formName = 'test form';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText).toBe('test form');
    });

    it('should display the default parent value if is undefined', () => {
        component.taskDetails.processInstanceId = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toEqual('ADF_TASK_LIST.PROPERTIES.PARENT_NAME_DEFAULT');
    });

    it('should display the Parent name value', () => {
        component.taskDetails.processInstanceId = '1';
        component.taskDetails.processDefinitionName = 'Parent Name';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toEqual('Parent Name');
    });

    it('should not display form name if no form name provided', () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText).toBe('ADF_TASK_LIST.PROPERTIES.FORM_NAME_DEFAULT');
    });

});
