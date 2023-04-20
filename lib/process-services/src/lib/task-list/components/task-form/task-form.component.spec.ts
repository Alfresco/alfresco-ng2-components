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

import { TaskFormComponent } from './task-form.component';
import {
    FormModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    setupTestBed
} from '@alfresco/adf-core';
import { TaskListService } from '../../services/tasklist.service';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { of, throwError } from 'rxjs';
import {
    claimableTaskDetailsMock,
    claimedByGroupMemberMock,
    claimedTaskDetailsMock,
    completedProcessTaskWithoutForm,
    completedStandaloneTaskWithoutForm,
    completedTaskDetailsMock,
    completedTaskWithFormMock,
    fakeUser,
    initiatorCanCompleteTaskDetailsMock,
    initiatorWithCandidatesTaskDetailsMock,
    involvedGroupTaskForm,
    involvedUserTaskForm,
    standaloneTaskWithoutForm,
    taskDetailsMock,
    taskDetailsWithOutCandidateGroup,
    taskDetailsWithOutFormMock,
    taskFormMock
} from '../../../mock/task/task-details.mock';
import { TaskDetailsModel } from '../../models/task-details.model';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { TaskFormService } from '../../../form/services/task-form.service';
import { TaskService } from '../../../form/services/task.service';
import { PeopleProcessService } from '../../../common/services/people-process.service';

describe('TaskFormComponent', () => {
    let component: TaskFormComponent;
    let fixture: ComponentFixture<TaskFormComponent>;
    let taskService: TaskService;
    let taskFormService: TaskFormService;
    let taskListService: TaskListService;
    let getTaskDetailsSpy: jasmine.Spy;
    let completeTaskSpy: jasmine.Spy;
    let element: HTMLElement;
    let peopleProcessService: PeopleProcessService;
    let getBpmLoggedUserSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        taskListService = TestBed.inject(TaskListService);
        taskFormService = TestBed.inject(TaskFormService);
        taskService = TestBed.inject(TaskService);

        getTaskDetailsSpy = spyOn(taskListService, 'getTaskDetails').and.returnValue(of(taskDetailsMock));
        completeTaskSpy = spyOn(taskListService, 'completeTask').and.returnValue(of({}));
        spyOn(taskFormService, 'getTaskForm').and.returnValue(of(taskFormMock));
        taskDetailsMock.processDefinitionId = null;
        spyOn(taskService, 'getTask').and.returnValue(of(taskDetailsMock));
        peopleProcessService = TestBed.inject(PeopleProcessService);
        getBpmLoggedUserSpy = spyOn(peopleProcessService, 'getCurrentUserInfo').and.returnValue(of(<any>fakeUser));
    });

    afterEach(async () => {
        await fixture.whenStable();
        getTaskDetailsSpy.calls.reset();
        fixture.destroy();
    });

    describe('Task with form', () => {

        beforeEach(async () => {
            await fixture.whenStable();
            getTaskDetailsSpy.calls.reset();
        });

        it('Should be able to display task form', async () => {
            component.taskId = '123';
            taskDetailsMock.formKey = '4';
            component.currentLoggedUser = taskDetailsMock.assignee;
            getTaskDetailsSpy.and.returnValue(of(taskDetailsMock));
            fixture.detectChanges();
            await fixture.whenStable();
            const activitFormSelector = element.querySelector('adf-form');
            const inputFieldOne = fixture.debugElement.nativeElement.querySelector('#text1');
            const inputFieldTwo = fixture.debugElement.nativeElement.querySelector('#text2');
            const inputFieldThree = fixture.debugElement.nativeElement.querySelector('#text3');
            expect(activitFormSelector).toBeDefined();
            expect(inputFieldOne['disabled']).toEqual(false);
            expect(inputFieldTwo['disabled']).toEqual(false);
            expect(inputFieldThree['disabled']).toEqual(false);
        });

        it('Should be able to complete assigned task', async () => {
            getBpmLoggedUserSpy.and.returnValue(of({
                id: 1001,
                firstName: 'Wilbur',
                lastName: 'Adams',
                email: 'wilbur@app.activiti.com'
            }));
            getTaskDetailsSpy.and.returnValue(of(taskDetailsMock));
            const formCompletedSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            const completeTaskFormSpy = spyOn(taskFormService, 'completeTaskForm').and.returnValue(of({}));
            component.taskId = '123';
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');
            expect(completeButton['disabled']).toEqual(false);
            completeButton.click();
            expect(completeTaskFormSpy).toHaveBeenCalled();
            expect(formCompletedSpy).toHaveBeenCalled();
        });

        it('Should emit error event in case form complete service fails', async () => {
            const errorSpy: jasmine.Spy = spyOn(component.error, 'emit');
            const completeTaskFormSpy = spyOn(taskFormService, 'completeTaskForm').and.returnValue(throwError({message: 'servce failed'}));
            getTaskDetailsSpy.and.returnValue(of(initiatorCanCompleteTaskDetailsMock));
            component.taskId = '123';
            fixture.detectChanges();
            await fixture.whenStable();
            const activitFormSelector = element.querySelector('adf-form');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');
            expect(activitFormSelector).toBeDefined();
            expect(completeButton['disabled']).toEqual(false);
            completeButton.click();
            expect(completeTaskFormSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalled();
        });
    });

    describe('change detection', () => {

        beforeEach(async () => {
            component.taskId = '123';
            fixture.detectChanges();
            await fixture.whenStable();
            getTaskDetailsSpy.calls.reset();
        });

        it('should fetch new task details when taskId changed', () => {
            const change = new SimpleChange('123', '456', true);
            component.ngOnChanges({taskId: change});
            fixture.detectChanges();
            expect(getTaskDetailsSpy).toHaveBeenCalledWith('123');
        });

        it('should NOT fetch new task details when taskId changed to null', async () => {
            const nullChange = new SimpleChange('123', null, true);
            component.ngOnChanges({taskId: nullChange});
            fixture.detectChanges();
            await fixture.whenStable();
            expect(getTaskDetailsSpy).not.toHaveBeenCalled();
        });
    });

    describe('Task assigned to candidates', () => {

        beforeEach(async () => {
            component.taskId = '123';
            fixture.detectChanges();
            await fixture.whenStable();
            getTaskDetailsSpy.calls.reset();
        });

        it('Should be able to display form in readonly mode if the task assigned to candidates', async () => {
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsMock));
            fixture.detectChanges();
            await fixture.whenStable();
            const activitFormSelector = element.querySelector('adf-form');
            const inputFieldOne = fixture.debugElement.nativeElement.querySelector('#text1');
            const inputFieldTwo = fixture.debugElement.nativeElement.querySelector('#text2');
            const inputFieldThree = fixture.debugElement.nativeElement.querySelector('#text3');
            expect(activitFormSelector).toBeDefined();
            expect(inputFieldOne['disabled']).toEqual(true);
            expect(inputFieldTwo['disabled']).toEqual(true);
            expect(inputFieldThree['disabled']).toEqual(true);
        });
    });

    describe('Form events', () => {

        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        it('Should emit a save event when form saved', () => {
            const formSavedSpy: jasmine.Spy = spyOn(component.formSaved, 'emit');
            component.onFormSaved(new FormModel());
            expect(formSavedSpy).toHaveBeenCalled();
        });

        it('Should emit a outcome execution event when form outcome executed', () => {
            const executeOutcomeSpy: jasmine.Spy = spyOn(component.executeOutcome, 'emit');
            component.onFormExecuteOutcome(new FormOutcomeEvent(new FormOutcomeModel(new FormModel())));
            expect(executeOutcomeSpy).toHaveBeenCalled();
        });

        it('Should emit a complete event when form completed', () => {
            const formCompletedSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            component.onFormCompleted(new FormModel());
            expect(formCompletedSpy).toHaveBeenCalled();
        });

        it('Should call service to complete task when complete button clicked', () => {
            component.onCompleteTask();
            expect(completeTaskSpy).toHaveBeenCalled();
        });

        it('Should emit a complete event when complete button clicked and task completed', () => {
            const completeSpy: jasmine.Spy = spyOn(component.completed, 'emit');
            component.onCompleteTask();
            expect(completeSpy).toHaveBeenCalled();
        });

        it('Should emit a load event when form loaded', () => {
            const formLoadedSpy: jasmine.Spy = spyOn(component.formLoaded, 'emit');
            component.onFormLoaded(new FormModel());
            expect(formLoadedSpy).toHaveBeenCalled();
        });

        it('Should emit an error event when form error occurs', () => {
            const formErrorSpy: jasmine.Spy = spyOn(component.formError, 'emit');
            component.onFormError({});
            expect(formErrorSpy).toHaveBeenCalled();
        });

        it('Should emit an error event when form services fails', () => {
            const errorSpy: jasmine.Spy = spyOn(component.error, 'emit');
            component.onError({});
            expect(errorSpy).toHaveBeenCalled();
        });
    });

    describe('Completed Process Task', () => {

        beforeEach(async () => {
            component.taskId = '123';
            fixture.detectChanges();
            await fixture.whenStable();
            getTaskDetailsSpy.calls.reset();
        });

        it('Should be able to display form in readonly mode if the task completed', async () => {
            getTaskDetailsSpy.and.returnValue(of(completedTaskDetailsMock));
            fixture.detectChanges();
            await fixture.whenStable();
            const activitFormSelector = element.querySelector('adf-form');
            const inputFieldOne = fixture.debugElement.nativeElement.querySelector('#text1');
            const inputFieldTwo = fixture.debugElement.nativeElement.querySelector('#text2');
            const inputFieldThree = fixture.debugElement.nativeElement.querySelector('#text3');
            expect(activitFormSelector).toBeDefined();
            expect(inputFieldOne['disabled']).toEqual(true);
            expect(inputFieldTwo['disabled']).toEqual(true);
            expect(inputFieldThree['disabled']).toEqual(true);
        });

        it('Should be able to show completed message and cancel button for the completed task without form', async () => {
            completedTaskDetailsMock.formKey = null;
            component.taskDetails = new TaskDetailsModel(completedTaskDetailsMock);
            fixture.detectChanges();
            await fixture.whenStable();
            const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            const cancelButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-cancel-button');
            const completedFormMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__title');
            const subMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__subtitle');
            expect(completeButtonElement).toBeNull();
            expect(cancelButtonElement).not.toBeNull();
            expect(completedFormMessage.innerText).toContain('ADF_TASK_FORM.COMPLETED_TASK.TITLE');
            expect(subMessage.innerText).toContain('ADF_TASK_FORM.COMPLETED_TASK.SUBTITLE');
        });

        it('Should not display complete button to the completed task without form', async () => {
            completedTaskDetailsMock.formKey = null;
            component.taskDetails = new TaskDetailsModel(completedTaskDetailsMock);
            fixture.detectChanges();
            await fixture.whenStable();
            const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            expect(completeButtonElement).toBeNull();
        });
    });

    describe('Process Task with no form', () => {

        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        it('Should be able to show no form message if the task does not attached a form', async () => {
            component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
            fixture.detectChanges();
            await fixture.whenStable();
            const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            const cancelButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-cancel-button');
            const completedFormMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__title');
            const subMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__subtitle');
            expect(completeButtonElement).not.toBeNull();
            expect(cancelButtonElement).not.toBeNull();
            expect(completedFormMessage.innerText).toContain('ADF_TASK_LIST.STANDALONE_TASK.NO_FORM_MESSAGE');
            expect(subMessage.innerText).toContain('ADF_TASK_FORM.EMPTY_FORM.SUBTITLE');
        });

        it('Should be able display complete button to a task without form', async () => {
            component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
            fixture.detectChanges();
            await fixture.whenStable();
            const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            expect(completeButtonElement).not.toBeNull();
            expect(completeButtonElement['disabled']).toEqual(false);
        });

        it('Should be able to complete a task with no form when complete button is clicked', async () => {
            fixture.detectChanges();
            component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
            fixture.detectChanges();
            await fixture.whenStable();
            const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            completeButtonElement.click();
            expect(completeTaskSpy).toHaveBeenCalledWith('91');
        });

        it('Should emit error event in case complete task service fails', async () => {
            const errorSpy: jasmine.Spy = spyOn(component.error, 'emit');
            completeTaskSpy.and.returnValue(throwError({message: 'servce failed'}));
            component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
            fixture.detectChanges();
            await fixture.whenStable();
            const activitFormSelector = element.querySelector('adf-form');
            const completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            expect(activitFormSelector).toBeDefined();
            expect(completeButtonElement['disabled']).toEqual(false);
            completeButtonElement.click();
            expect(errorSpy).toHaveBeenCalled();
        });

        it('Should be able to emit cancel event on task with no-form when cancel button is clicked', async () => {
            const cancelSpy = spyOn(component.cancel, 'emit');
            getTaskDetailsSpy.and.returnValue(of(taskDetailsWithOutFormMock));
            component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
            fixture.detectChanges();
            await fixture.whenStable();
            const cancelButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-cancel-button');
            cancelButtonElement.click();
            expect(cancelSpy).toHaveBeenCalled();
        });

        it('Should display the template in a process task with no Form', async () => {
            component.taskDetails = new TaskDetailsModel(taskDetailsWithOutFormMock);
            fixture.detectChanges();
            await fixture.whenStable();
            let formMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__title');
            let subMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__subtitle');
            let completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            let cancelButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-cancel-button');
            expect(completeButtonElement['disabled']).toEqual(false);
            expect(cancelButton['disabled']).toEqual(false);
            expect(formMessage.innerText).toContain('ADF_TASK_LIST.STANDALONE_TASK.NO_FORM_MESSAGE');
            expect(subMessage.innerText).toContain('ADF_TASK_FORM.EMPTY_FORM.SUBTITLE');

            completeButtonElement.click();
            component.taskDetails = new TaskDetailsModel(completedProcessTaskWithoutForm);
            fixture.detectChanges();
            await fixture.whenStable();

            formMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__title');
            subMessage = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__subtitle');
            completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            cancelButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-cancel-button');
            expect(formMessage.innerText).toContain('ADF_TASK_FORM.COMPLETED_TASK.TITLE');
            expect(subMessage.innerText).toContain('ADF_TASK_FORM.COMPLETED_TASK.SUBTITLE');
            expect(cancelButton).not.toBeNull();
            expect(cancelButton['disabled']).toEqual(false, 'cancel button not visible for completed task');
            expect(completeButtonElement).toBeNull('complete button shown for completed task');
            expect(taskListService.completeTask).toHaveBeenCalled();
        });
    });

    describe('Standalone Task with no form', () => {

        beforeEach(() => {
            component.taskId = '123';
            fixture.detectChanges();
        });

        it('Should display empty template in case standalone task does not attached a form', async () => {
            component.taskDetails = new TaskDetailsModel(standaloneTaskWithoutForm);
            fixture.detectChanges();
            await fixture.whenStable();
            const taskStandAlone = element.querySelector('adf-task-standalone');
            const noFormMessage = fixture.debugElement.nativeElement.querySelector('#adf-no-form-message');
            expect(taskStandAlone).not.toBeNull();
            expect(noFormMessage.innerText).toContain('ADF_TASK_LIST.STANDALONE_TASK.NO_FORM_MESSAGE');
        });

        it('Should be able display attach form button for a standalone task without form', async () => {
            const showAttachFormSpy = spyOn(component.showAttachForm, 'emit');
            component.taskDetails = new TaskDetailsModel(standaloneTaskWithoutForm);
            fixture.detectChanges();
            await fixture.whenStable();
            const attacheFormButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-attach-form-button');
            expect(attacheFormButton).not.toBeNull();
            attacheFormButton.click();
            expect(showAttachFormSpy).toHaveBeenCalled();
        });

        it('Should display completed template if standalone task completed', async () => {
            component.taskDetails = completedStandaloneTaskWithoutForm;
            fixture.detectChanges();
            await fixture.whenStable();
            const taskStandAlone = element.querySelector('adf-task-standalone');
            const completedFormMessage = fixture.debugElement.nativeElement.querySelector('#adf-completed-form-message');
            const subMessage = fixture.debugElement.nativeElement.querySelector('.adf-no-form-submessage');
            expect(taskStandAlone).not.toBeNull();
            expect(completedFormMessage.innerText).toContain('ADF_TASK_LIST.STANDALONE_TASK.COMPLETE_TASK_MESSAGE');
            expect(subMessage.innerText).toContain('ADF_TASK_LIST.STANDALONE_TASK.COMPLETE_TASK_SUB_MESSAGE');
        });

        it('Should display the template in a standalone task with no Form', async () => {
            component.taskDetails = standaloneTaskWithoutForm;
            component.currentLoggedUser = standaloneTaskWithoutForm.assignee;
            fixture.detectChanges();
            await fixture.whenStable();
            let formMessage = fixture.debugElement.nativeElement.querySelector('.adf-no-form-message');
            let completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            let attacheFormButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-attach-form-button');
            expect(completeButtonElement['disabled']).toEqual(false);
            expect(attacheFormButton['disabled']).toEqual(false);
            expect(formMessage.innerText).toContain('ADF_TASK_LIST.STANDALONE_TASK.NO_FORM_MESSAGE');

            completeButtonElement.click();
            component.taskDetails = new TaskDetailsModel(completedStandaloneTaskWithoutForm);
            fixture.detectChanges();
            await fixture.whenStable();

            formMessage = fixture.debugElement.nativeElement.querySelector('.adf-no-form-message');
            completeButtonElement = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            attacheFormButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-attach-form-button');
            expect(formMessage.innerText).toContain('ADF_TASK_LIST.STANDALONE_TASK.COMPLETE_TASK_MESSAGE');
            expect(attacheFormButton).toBeNull('attach form button shown for completed task');
            expect(completeButtonElement).toBeNull('complete button shown for completed task');
            expect(taskListService.completeTask).toHaveBeenCalled();
        });
    });

    describe('Form with visibility', () => {

        beforeEach(async () => {
            component.taskId = '123';
            spyOn(taskFormService, 'completeTaskForm').and.returnValue(of({}));
            taskDetailsMock.formKey = '4';
            getTaskDetailsSpy.and.returnValue(of(taskDetailsMock));
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('[C312410] - Should be possible to complete a task that has an invisible field on a form with a value', async () => {
            component.formCompleted.subscribe((form: FormModel) => {
                expect(form.id).toBe(taskFormMock.id);
            });
            component.taskDetails.initiatorCanCompleteTask = true;

            fixture.detectChanges();
            await fixture.whenStable();
            const inputTextOne: HTMLInputElement = fixture.nativeElement.querySelector('#text1');
            expect(inputTextOne).toBeDefined();
            expect(inputTextOne).not.toBeNull();
            const inputTextTwo: HTMLInputElement = fixture.nativeElement.querySelector('#text2');
            expect(inputTextTwo).toBeDefined();
            expect(inputTextTwo).not.toBeNull();
            let inputTextThree: HTMLInputElement = fixture.nativeElement.querySelector('#text3');
            expect(inputTextThree).toBeDefined();
            expect(inputTextThree).not.toBeNull();

            inputTextOne.value = 'a';
            inputTextOne.dispatchEvent(new Event('input'));
            inputTextTwo.value = 'a';
            inputTextTwo.dispatchEvent(new Event('input'));
            inputTextThree.value = 'a';
            inputTextThree.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            inputTextThree = fixture.nativeElement.querySelector('#text3');
            expect(inputTextThree).toBeDefined();
            expect(inputTextThree).not.toBeNull();

            inputTextOne.value = 'b';
            inputTextOne.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            const inputThreeContainer = fixture.nativeElement.querySelector('#field-text3-container');
            expect(inputThreeContainer.style.visibility).toBe('hidden');
            const completeOutcomeButton: HTMLButtonElement = fixture.nativeElement.querySelector('#adf-form-complete');
            expect(completeOutcomeButton.style.visibility).not.toBe('hidden');
            completeOutcomeButton.click();
            fixture.detectChanges();
        });

        it('[C277278] - Should show if the form is valid via the validation icon', async () => {
            const numberInput: HTMLInputElement = fixture.nativeElement.querySelector('#numberField');
            let validationForm = fixture.nativeElement.querySelector('#adf-valid-form-icon');

            expect(numberInput).toBeDefined();
            expect(numberInput).not.toBeNull();
            expect(validationForm.textContent).toBe('check_circle');

            numberInput.value = 'a';
            numberInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            const invalidForm = fixture.nativeElement.querySelector('#adf-invalid-form-icon');
            expect(invalidForm).not.toBeNull();
            expect(invalidForm.textContent).toBe('error');

            numberInput.value = '4';
            numberInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            await fixture.whenStable();
            validationForm = fixture.nativeElement.querySelector('#adf-valid-form-icon');
            expect(validationForm.textContent).toBe('check_circle');
        });
    });

    describe('Complete task', () => {

        it('Should be able to complete the assigned task in case process initiator not allowed to complete the task', async () => {
            getBpmLoggedUserSpy.and.returnValue(of({
                id: 1002,
                firstName: 'Wilbur',
                lastName: 'Adams',
                email: 'wilbur@app.activiti.com'
            }));
            getTaskDetailsSpy.and.returnValue(of(taskDetailsMock));

            const formCompletedSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            const completeTaskFormSpy = spyOn(taskFormService, 'completeTaskForm').and.returnValue(of({}));
            component.taskId = '123';
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');

            expect(component.isProcessInitiator()).toEqual(false);
            expect(completeButton['disabled']).toEqual(false);

            completeButton.click();

            expect(completeTaskFormSpy).toHaveBeenCalled();
            expect(formCompletedSpy).toHaveBeenCalled();
        });

        it('Should be able to complete the task if process initiator allowed to complete the task', async () => {
            getBpmLoggedUserSpy.and.returnValue(of({
                id: 1001,
                firstName: 'Wilbur',
                lastName: 'Adams',
                email: 'wilbur@app.activiti.com'
            }));
            const formCompletedSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            const completeTaskFormSpy = spyOn(taskFormService, 'completeTaskForm').and.returnValue(of({}));
            getTaskDetailsSpy.and.returnValue(of(initiatorCanCompleteTaskDetailsMock));

            component.taskId = '123';
            fixture.detectChanges();
            await fixture.whenStable();

            const activitFormSelector = element.querySelector('adf-form');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');

            expect(activitFormSelector).toBeDefined();
            expect(completeButton['disabled']).toEqual(false);
            expect(component.isProcessInitiator()).toEqual(true);

            completeButton.click();

            expect(completeTaskFormSpy).toHaveBeenCalled();
            expect(formCompletedSpy).toHaveBeenCalled();
        });

        it('Should not be able to complete a task with candidates users if process initiator allowed to complete the task', async () => {
            getTaskDetailsSpy.and.returnValue(of(initiatorWithCandidatesTaskDetailsMock));

            component.taskId = '123';
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.canInitiatorComplete()).toEqual(true);
            expect(component.isProcessInitiator()).toEqual(true);
            expect(component.isCandidateMember()).toEqual(true);

            const activitFormSelector = element.querySelector('adf-form');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');

            expect(activitFormSelector).toBeDefined();
            expect(completeButton['disabled']).toEqual(true);
        });

        it('Should be able to complete a task with candidates users if process initiator not allowed to complete the task', async () => {
            const formCompletedSpy: jasmine.Spy = spyOn(component.formCompleted, 'emit');
            getBpmLoggedUserSpy.and.returnValue(of({
                id: 1001,
                firstName: 'Wilbur',
                lastName: 'Adams',
                email: 'wilbur@app.activiti.com'
            }));
            const completeTaskFormSpy = spyOn(taskFormService, 'completeTaskForm').and.returnValue(of({}));
            getTaskDetailsSpy.and.returnValue(of(claimedTaskDetailsMock));

            component.taskId = '123';
            fixture.detectChanges();
            await fixture.whenStable();

            const activitFormSelector = element.querySelector('adf-form');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');

            expect(activitFormSelector).toBeDefined();
            expect(component.canInitiatorComplete()).toEqual(false);
            expect(component.isProcessInitiator()).toEqual(false);
            expect(completeButton['disabled']).toEqual(false);

            completeButton.click();

            expect(completeTaskFormSpy).toHaveBeenCalled();
            expect(formCompletedSpy).toHaveBeenCalled();
        });
    });

    describe('Claim/Unclaim buttons', () => {

        it('should display the claim button if no assignee', async () => {
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsMock));

            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            expect(claimButton.nativeElement.innerText).toBe('ADF_TASK_FORM.EMPTY_FORM.BUTTONS.CLAIM');
        });

        it('should not display the claim/requeue button if the task is not claimable ', async () => {
            getTaskDetailsSpy.and.returnValue(of(taskDetailsWithOutCandidateGroup));

            component.taskId = 'mock-task-id';
            fixture.detectChanges();

            await fixture.whenStable();
            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(component.isTaskClaimable()).toBe(false);
            expect(component.isTaskClaimedByCandidateMember()).toBe(false);
            expect(unclaimButton).toBeNull();
            expect(claimButton).toBeNull();
        });

        it('should display the claim button if the task is claimable', async () => {
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsMock));

            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));

            expect(component.isTaskClaimable()).toBe(true);
            expect(claimButton.nativeElement.innerText).toBe('ADF_TASK_FORM.EMPTY_FORM.BUTTONS.CLAIM');
        });

        it('should display the release button if task is claimed by the current logged-in user', async () => {
            getBpmLoggedUserSpy.and.returnValue(of(claimedTaskDetailsMock.assignee));
            getTaskDetailsSpy.and.returnValue(of(claimedTaskDetailsMock));

            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(component.isTaskClaimedByCandidateMember()).toBe(true);
            expect(unclaimButton.nativeElement.innerText).toBe('ADF_TASK_FORM.EMPTY_FORM.BUTTONS.UNCLAIM');
        });

        it('should not display the release button to logged in user if task is claimed by other candidate member', async () => {
            getTaskDetailsSpy.and.returnValue(of(claimedByGroupMemberMock));

            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(component.isTaskClaimedByCandidateMember()).toBe(false);
            expect(unclaimButton).toBeNull();
        });

        it('should not display the release button if the task is completed', async () => {
            getTaskDetailsSpy.and.returnValue(of(completedTaskDetailsMock));

            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            const unclaimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(claimButton).toBeNull();
            expect(unclaimButton).toBeNull();
        });

        it('should emit taskClaimed when task is claimed', (done) => {
            spyOn(taskListService, 'claimTask').and.returnValue(of(null));
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsMock));

            component.taskId = 'mock-task-id';

            component.taskClaimed.subscribe((taskId: string) => {
                expect(taskId).toEqual(component.taskId);
                done();
            });

            component.ngOnInit();
            fixture.detectChanges();

            const claimBtn = fixture.debugElement.query(By.css('[adf-claim-task]'));
            claimBtn.nativeElement.click();
        });

        it('should emit error event in case claim task api fails', (done) => {
            const mockError = {message: 'Api Failed'};
            spyOn(taskListService, 'claimTask').and.returnValue(throwError(mockError));
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsMock));

            component.taskId = 'mock-task-id';

            component.error.subscribe((error: any) => {
                expect(error).toEqual(mockError);
                done();
            });

            component.ngOnInit();
            fixture.detectChanges();

            const claimBtn = fixture.debugElement.query(By.css('[adf-claim-task]'));
            claimBtn.nativeElement.click();
        });

        it('should emit taskUnClaimed when task is unclaimed', (done) => {
            spyOn(taskListService, 'unclaimTask').and.returnValue(of(null));
            getBpmLoggedUserSpy.and.returnValue(of(claimedTaskDetailsMock.assignee));
            getTaskDetailsSpy.and.returnValue(of(claimedTaskDetailsMock));

            component.taskId = 'mock-task-id';

            component.taskUnclaimed.subscribe((taskId: string) => {
                expect(taskId).toEqual(component.taskId);
                done();
            });

            component.ngOnInit();
            fixture.detectChanges();

            const unclaimBtn = fixture.debugElement.query(By.css('[adf-unclaim-task]'));
            unclaimBtn.nativeElement.click();
        });

        it('should emit error event in case unclaim task api fails', (done) => {
            const mockError = {message: 'Api Failed'};
            spyOn(taskListService, 'unclaimTask').and.returnValue(throwError(mockError));
            getBpmLoggedUserSpy.and.returnValue(of(claimedTaskDetailsMock.assignee));
            getTaskDetailsSpy.and.returnValue(of(claimedTaskDetailsMock));

            component.taskId = 'mock-task-id';

            component.error.subscribe((error: any) => {
                expect(error).toEqual(mockError);
                done();
            });

            component.ngOnInit();
            fixture.detectChanges();

            const unclaimBtn = fixture.debugElement.query(By.css('[adf-unclaim-task]'));
            unclaimBtn.nativeElement.click();
        });
    });

    describe('Involved user task', () => {

        beforeEach(() => {
            component.taskId = '20259';
            spyOn(taskFormService, 'saveTaskForm').and.returnValue(of({}));
        });

        it('[T14599423] Form in unassigned task is read-only', async () => {
            getTaskDetailsSpy.and.returnValue(of(involvedUserTaskForm));
            fixture.detectChanges();
            await fixture.whenStable();
            const activitFormSelector = element.querySelector('adf-form');
            const saveButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-save"]');
            const completeButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-complete"]');
            expect(activitFormSelector).toBeDefined();
            expect(saveButton.disabled).toEqual(false);
            expect(completeButton.disabled).toEqual(true);
        });

        it('Should be able to save a form for a involved user', async () => {
            getTaskDetailsSpy.and.returnValue(of(involvedUserTaskForm));
            fixture.detectChanges();
            await fixture.whenStable();
            const saveButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-save"]');
            saveButton.click();
            expect(taskFormService.saveTaskForm).toHaveBeenCalled();
        });

        it('Should be able to save a form for a involved group user', async () => {
            getTaskDetailsSpy.and.returnValue(of(involvedGroupTaskForm));
            fixture.detectChanges();
            await fixture.whenStable();
            const activitFormSelector = element.querySelector('adf-form');
            const saveButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-save"]');
            const completeButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-complete"]');
            expect(activitFormSelector).toBeDefined();
            expect(saveButton.disabled).toEqual(false);
            expect(completeButton.disabled).toEqual(true);
            saveButton.click();
            expect(taskFormService.saveTaskForm).toHaveBeenCalled();
        });
    });

    describe('Task Form Fields Visibility', () => {

        it('Should task form fields be disabled when the form is readonly', async () => {
            fixture.detectChanges();
            getTaskDetailsSpy.and.returnValue(of(taskDetailsMock));
            component.taskId = '456';
            component.readOnlyForm = true;
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const activitFormSelector = element.querySelector('adf-form');
            const inputFieldOne = fixture.debugElement.nativeElement.querySelector('#text1');
            const inputFieldTwo = fixture.debugElement.nativeElement.querySelector('#text2');
            const inputFieldThree = fixture.debugElement.nativeElement.querySelector('#text3');
            expect(activitFormSelector).toBeDefined();
            expect(inputFieldOne['disabled']).toEqual(true, 'Task Form field is enabled');
            expect(inputFieldTwo['disabled']).toEqual(true, 'Task Form field is enabled');
            expect(inputFieldThree['disabled']).toEqual(true, 'Task Form field is enabled');
        });

        it('Should task form fields be disabled when the task has not been claimed', async () => {
            fixture.detectChanges();
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsMock));
            component.taskId = '456';
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const activitFormSelector = element.querySelector('adf-form');
            const inputFieldOne = fixture.debugElement.nativeElement.querySelector('#text1');
            const inputFieldTwo = fixture.debugElement.nativeElement.querySelector('#text2');
            const inputFieldThree = fixture.debugElement.nativeElement.querySelector('#text3');
            expect(activitFormSelector).toBeDefined();
            expect(inputFieldOne['disabled']).toEqual(true, 'Task Form field is enabled');
            expect(inputFieldTwo['disabled']).toEqual(true, 'Task Form field is enabled');
            expect(inputFieldThree['disabled']).toEqual(true, 'Task Form field is enabled');
        });

        it('Should task form fields be disabled when the task is completed', async () => {
            fixture.detectChanges();
            getTaskDetailsSpy.and.returnValue(of(completedTaskWithFormMock));
            component.taskId = '456';
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const activitFormSelector = element.querySelector('adf-form');
            const inputFieldOne = fixture.debugElement.nativeElement.querySelector('#text1');
            const inputFieldTwo = fixture.debugElement.nativeElement.querySelector('#text2');
            const inputFieldThree = fixture.debugElement.nativeElement.querySelector('#text3');

            expect(activitFormSelector).toBeDefined();
            expect(inputFieldOne['disabled']).toEqual(true);
            expect(inputFieldTwo['disabled']).toEqual(true);
            expect(inputFieldThree['disabled']).toEqual(true);
        });

        it('Should task form fields be enabled when the task is claimed', async () => {
            fixture.detectChanges();
            getBpmLoggedUserSpy.and.returnValue(of(claimedTaskDetailsMock.assignee));
            getTaskDetailsSpy.and.returnValue(of(claimedTaskDetailsMock));
            component.taskId = '456';
            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const activitFormSelector = element.querySelector('adf-form');
            const inputFieldOne = fixture.debugElement.nativeElement.querySelector('#text1');
            const inputFieldTwo = fixture.debugElement.nativeElement.querySelector('#text2');
            const inputFieldThree = fixture.debugElement.nativeElement.querySelector('#text3');

            expect(activitFormSelector).toBeDefined();
            expect(inputFieldOne['disabled']).toEqual(false, 'Task Form field is disabled');
            expect(inputFieldTwo['disabled']).toEqual(false, 'Task Form field is disabled');
            expect(inputFieldThree['disabled']).toEqual(false, 'Task Form field is disabled');
        });
    });

    describe('Task form action buttons', () => {

        it('Should disable Complete button when candidate user is not have a access to the task claimed by another candidate user', async () => {
            getTaskDetailsSpy.and.returnValue(of(involvedUserTaskForm));
            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const saveButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-save"]');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');
            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            const releaseButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(saveButton).not.toBeNull();
            expect(saveButton['disabled']).toBe(false, 'Save button is disabled');
            expect(completeButton).not.toBeNull();
            expect(completeButton['disabled']).toBe(true, 'Complete button is disabled');
            expect(claimButton).toBeNull();
            expect(releaseButton).toBeNull();
        });

        it('Should show only the Claim button as enabled before claiming a task with form', async () => {
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsMock));
            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const saveButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-save"]');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');
            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            const releaseButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(saveButton).not.toBeNull();
            expect(saveButton['disabled']).toBe(true, 'Save button is enabled');
            expect(completeButton).not.toBeNull();
            expect(completeButton['disabled']).toBe(true, 'Complete button is enabled');
            expect(claimButton).not.toBeNull();
            expect(claimButton.nativeElement.disabled).toBe(false, 'Claim button is disabled');
            expect(releaseButton).toBeNull();
        });

        it('Should show only Save/Complete/Release buttons as enabled after claiming a task with form', async () => {
            getBpmLoggedUserSpy.and.returnValue(of(claimedTaskDetailsMock.assignee));
            getTaskDetailsSpy.and.returnValue(of(claimedTaskDetailsMock));
            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const saveButton = fixture.debugElement.nativeElement.querySelector('[id="adf-form-save"]');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-form-complete');
            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            const releaseButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(saveButton).not.toBeNull();
            expect(saveButton['disabled']).toBe(false, 'Save button is disabled');
            expect(completeButton).not.toBeNull();
            expect(completeButton['disabled']).toBe(false, 'Complete button is disabled');
            expect(releaseButton).not.toBeNull();
            expect(releaseButton.nativeElement.disabled).toBe(false, 'Release button is disabled');
            expect(claimButton).toBeNull();
        });

        it('Should show only the Claim button as enabled before claiming a task without form', async () => {
            const claimableTaskDetailsWithoutFormMock = {...claimableTaskDetailsMock, formKey: null};
            getTaskDetailsSpy.and.returnValue(of(claimableTaskDetailsWithoutFormMock));
            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const cancelButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-cancel-button');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            const releaseButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(cancelButton).not.toBeNull();
            expect(completeButton).not.toBeNull();
            expect(completeButton['disabled']).toEqual(true, 'Complete button is enabled');
            expect(claimButton).not.toBeNull();
            expect(claimButton.nativeElement.disabled).toBe(false, 'Claim button is disabled');
            expect(releaseButton).toBeNull();
        });

        it('Should show only Complete/Release buttons as enabled after claiming a task without form', async () => {
            const claimedTaskDetailsWithoutFormMock = {...claimedTaskDetailsMock, formKey: null};
            getBpmLoggedUserSpy.and.returnValue(of(claimedTaskDetailsWithoutFormMock.assignee));
            getTaskDetailsSpy.and.returnValue(of(claimedTaskDetailsWithoutFormMock));
            component.taskId = 'mock-task-id';
            fixture.detectChanges();
            await fixture.whenStable();

            const cancelButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-cancel-button');
            const completeButton = fixture.debugElement.nativeElement.querySelector('#adf-no-form-complete-button');
            const claimButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-claim-button"]'));
            const releaseButton = fixture.debugElement.query(By.css('[data-automation-id="adf-task-form-unclaim-button"]'));

            expect(cancelButton).not.toBeNull();
            expect(completeButton).not.toBeNull();
            expect(completeButton['disabled']).toEqual(false, 'Complete button is disabled');
            expect(releaseButton).not.toBeNull();
            expect(releaseButton.nativeElement.disabled).toBe(false, 'Release button is disabled');
            expect(claimButton).toBeNull();
        });
    });
});
