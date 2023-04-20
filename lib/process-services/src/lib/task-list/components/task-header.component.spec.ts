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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import {
    completedTaskDetailsMock,
    taskDetailsMock,
    claimableTaskDetailsMock,
    claimedTaskDetailsMock,
    claimedByGroupMemberMock,
    taskDetailsWithOutCandidateGroup
} from '../../mock';

import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';
import { TaskHeaderComponent } from './task-header.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PeopleProcessService } from '../../common/services/people-process.service';
import { BpmUserModel } from '../../common/models/bpm-user.model';

describe('TaskHeaderComponent', () => {

    let service: TaskListService;
    let component: TaskHeaderComponent;
    let fixture: ComponentFixture<TaskHeaderComponent>;
    let peopleProcessService: PeopleProcessService;
    let appConfigService: AppConfigService;

    const fakeBpmAssignedUser = new BpmUserModel({
        id: 1001,
        apps: [],
        capabilities: 'fake-capability',
        company: 'fake-company',
        created: 'fake-create-date',
        email: 'wilbur@app.activiti.com',
        externalId: 'fake-external-id',
        firstName: 'Wilbur',
        lastName: 'Adams',
        fullname: 'Wilbur Adams',
        groups: []
    });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskHeaderComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(TaskListService);
        peopleProcessService = TestBed.inject(PeopleProcessService);
        spyOn(peopleProcessService, 'getCurrentUserInfo').and.returnValue(of(fakeBpmAssignedUser));
        component.taskDetails = new TaskDetailsModel(taskDetailsMock);
        appConfigService = TestBed.inject(AppConfigService);
    });

    it('should render empty component if no task details provided', async () => {
        component.taskDetails = undefined;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.debugElement.children.length).toBe(0);
    });

    it('should display assignee', async () => {
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="header-assignee"] .adf-textitem-clickable-value'));
        expect(formNameEl.nativeElement.value).toBe('Wilbur Adams');
    });

    it('should display placeholder if no assignee', async () => {
        component.taskDetails.assignee = null;
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-assignee"] .adf-textitem-clickable-value'));
        expect(valueEl.nativeElement.value).toBe('ADF_TASK_LIST.PROPERTIES.ASSIGNEE_DEFAULT');
    });

    it('should display priority', async () => {
        component.taskDetails.priority = 27;
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-priority"]'));
        expect(formNameEl.nativeElement.value).toBe('27');
    });

    it('should set editable to false if the task has already completed', async () => {
        component.taskDetails.endDate = new Date('05/05/2002');
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-dueDate"]`));
        expect(datePicker).toBeNull('Datepicker should NOT be in DOM');
    });

    it('should set editable to true if the task has not completed yet', async () => {
        component.taskDetails.endDate = undefined;
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-dueDate"]`));
        expect(datePicker).not.toBeNull('Datepicker should be in DOM');
    });

    describe('Claiming', () => {

        it('should be able display the claim/release button if showClaimRelease set to true', async () => {
            component.taskDetails = new TaskDetailsModel(claimableTaskDetailsMock);
            component.showClaimRelease = true;
            component.refreshData();

            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
            expect(claimButton.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.BUTTON.CLAIM');
        });

        it('should not be able display the claim/release button if showClaimRelease set to false', async () => {
            component.taskDetails = new TaskDetailsModel(claimableTaskDetailsMock);
            component.showClaimRelease = false;
            component.refreshData();

            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
            expect(claimButton).toBeNull();
        });

        it('should display the claim button if no assignee', async () => {
            component.taskDetails = new TaskDetailsModel(claimableTaskDetailsMock);

            component.refreshData();

            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
            expect(claimButton.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.BUTTON.CLAIM');
        });

        it('should display the claim button if the task is claimable', async () => {
            component.taskDetails = new TaskDetailsModel(claimableTaskDetailsMock);
            component.refreshData();

            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
            expect(component.isTaskClaimable()).toBeTruthy();
            expect(claimButton.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.BUTTON.CLAIM');
        });

        it('should not display the claim/requeue button if the task is not claimable ', async () => {
            component.taskDetails = new TaskDetailsModel(taskDetailsWithOutCandidateGroup);
            component.refreshData();

            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
            const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="header-unclaim-button"]'));
            expect(component.isTaskClaimable()).toBeFalsy();
            expect(component.isTaskClaimedByCandidateMember()).toBeFalsy();
            expect(unclaimButton).toBeNull();
            expect(claimButton).toBeNull();
        });
    });

    it('should display the requeue button if task is claimed by the current logged-in user', async () => {
        component.taskDetails = new TaskDetailsModel(claimedTaskDetailsMock);
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="header-unclaim-button"]'));
        expect(component.isTaskClaimedByCandidateMember()).toBeTruthy();
        expect(unclaimButton.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.BUTTON.UNCLAIM');
    });

    it('should not display the requeue button to logged in user if task is claimed by other candidate member', async () => {
        component.taskDetails = new TaskDetailsModel(claimedByGroupMemberMock);
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="header-unclaim-button"]'));
        expect(component.isTaskClaimedByCandidateMember()).toBeFalsy();
        expect(unclaimButton).toBeNull();
    });

    it('should display the claim button if the task is claimable by candidates members', async () => {
        component.taskDetails = new TaskDetailsModel(claimableTaskDetailsMock);
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
        expect(component.isTaskClaimable()).toBeTruthy();
        expect(component.isTaskClaimedByCandidateMember()).toBeFalsy();
        expect(claimButton.nativeElement.innerText).toBe('ADF_TASK_LIST.DETAILS.BUTTON.CLAIM');
    });

    it('should not display the requeue button if the task is completed', async () => {
        component.taskDetails = new TaskDetailsModel(completedTaskDetailsMock);
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const claimButton = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
        const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="header-unclaim-button"]'));
        expect(claimButton).toBeNull();
        expect(unclaimButton).toBeNull();
    });

    it('should emit claim event when task is claimed', (done) => {
        spyOn(service, 'claimTask').and.returnValue(of(null));
        component.taskDetails = claimableTaskDetailsMock;

        component.claim.subscribe((taskId) => {
            expect(taskId).toEqual(component.taskDetails.id);
            done();
        });

        component.ngOnInit();
        fixture.detectChanges();

        const claimBtn = fixture.debugElement.query(By.css('[adf-claim-task]'));
        claimBtn.nativeElement.click();
    });

    it('should emit unclaim event when task is unclaimed', (done) => {
        spyOn(service, 'unclaimTask').and.returnValue(of(null));
        component.taskDetails = claimedTaskDetailsMock;

        component.unclaim.subscribe((taskId: string) => {
            expect(taskId).toEqual(component.taskDetails.id);
            done();
        });

        component.ngOnInit();
        fixture.detectChanges();

        const unclaimBtn = fixture.debugElement.query(By.css('[adf-unclaim-task]'));
        unclaimBtn.nativeElement.click();
    });

    it('should display due date', async () => {
        component.taskDetails.dueDate = new Date('2016-11-03');
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toBe('Nov 3, 2016');
    });

    it('should display placeholder if no due date', async () => {
        component.taskDetails.dueDate = null;
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toBe('ADF_TASK_LIST.PROPERTIES.DUE_DATE_DEFAULT');
    });

    it('should display form name', async () => {
        component.formName = 'test form';
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] .adf-textitem-clickable-value'));
        expect(valueEl.nativeElement.value).toBe('test form');
    });

    it('should set clickable to false if the task has already completed', async () => {
        component.taskDetails.endDate = new Date('05/05/2002');
        component.formName = 'test form';
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const clickableForm = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] .adf-textitem-clickable-value'));
        expect(clickableForm).toBeNull();

        const readOnlyForm = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] input'));
        expect(readOnlyForm.nativeElement.value).toBe('test form');
    });

    it('should display the default parent value if is undefined', async () => {
        component.taskDetails.processInstanceId = null;
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toEqual('ADF_TASK_LIST.PROPERTIES.PARENT_NAME_DEFAULT');
    });

    it('should display the Parent name value', async () => {
        component.taskDetails.processInstanceId = '1';
        component.taskDetails.processDefinitionName = 'Parent Name';
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-parentName"] .adf-property-value'));
        expect(valueEl.nativeElement.innerText.trim()).toEqual('Parent Name');
    });

    it('should not display form name if no form name provided', async () => {
        component.refreshData();

        fixture.detectChanges();
        await fixture.whenStable();

        const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] .adf-property-value'));
        expect(valueEl.nativeElement.value).toBe('ADF_TASK_LIST.PROPERTIES.FORM_NAME_DEFAULT');
    });

    describe('Config Filtering', () => {

        it('should show only the properties from the configuration file', async () => {
            spyOn(appConfigService, 'get').and.returnValue(['assignee', 'status']);
            component.taskDetails.processInstanceId = '1';
            component.taskDetails.processDefinitionName = 'Parent Name';
            component.refreshData();

            fixture.detectChanges();
            await fixture.whenStable();

            const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));

            expect(propertyList).toBeDefined();
            expect(propertyList).not.toBeNull();
            expect(propertyList.length).toBe(2);
            expect(propertyList[0].nativeElement.textContent).toContain('ADF_TASK_LIST.PROPERTIES.ASSIGNEE');
            expect(propertyList[1].nativeElement.textContent).toContain('ADF_TASK_LIST.PROPERTIES.STATUS');
        });

        it('should show all the default properties if there is no configuration', async () => {
            spyOn(appConfigService, 'get').and.returnValue(null);
            component.taskDetails.processInstanceId = '1';
            component.taskDetails.processDefinitionName = 'Parent Name';
            component.refreshData();

            fixture.detectChanges();
            await fixture.whenStable();

            const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));
            expect(propertyList).toBeDefined();
            expect(propertyList).not.toBeNull();
            expect(propertyList.length).toBe(component.properties.length);
            expect(propertyList[0].nativeElement.textContent).toContain('ADF_TASK_LIST.PROPERTIES.ASSIGNEE');
            expect(propertyList[1].nativeElement.textContent).toContain('ADF_TASK_LIST.PROPERTIES.STATUS');
        });
    });
});
