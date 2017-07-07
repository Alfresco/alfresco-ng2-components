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
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

import { TaskDetailsModel } from '../models/task-details.model';
import { taskDetailsMock } from './../assets/task-details.mock';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { ActivitiTaskHeaderComponent } from './activiti-task-header.component';

describe('ActivitiTaskHeaderComponent', () => {

    let service: ActivitiTaskListService;
    let componentHandler: any;
    let component: ActivitiTaskHeaderComponent;
    let fixture: ComponentFixture<ActivitiTaskHeaderComponent>;
    let debugElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiTaskHeaderComponent
            ],
            providers: [
                ActivitiTaskListService
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService.translate, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivitiTaskHeaderComponent);
        component = fixture.componentInstance;
        service = TestBed.get(ActivitiTaskListService);
        debugElement = fixture.debugElement;

        component.taskDetails = new TaskDetailsModel(taskDetailsMock);

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    describe('Editable mode', () => {

        beforeEach(() => {
            component.ngOnChanges({});
            fixture.detectChanges();
        });

        it('should switch the component to editable mode when clicking on the "Edit" button', () => {
            let editButton = fixture.debugElement.query(By.css('[data-automation-id="switch-to-edit-mode"]'));
            expect(editButton).not.toBeNull();

            editButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            editButton = debugElement.query(By.css('[data-automation-id="switch-to-edit-mode"]'));
            const saveButton = debugElement.query(By.css('[data-automation-id="save-edit-mode"]'));
            const cancelButton = debugElement.query(By.css('[data-automation-id="cancel-edit-mode"]'));
            expect(editButton).toBeNull('Edit button should disappear');
            expect(saveButton).not.toBeNull('Save button should be shown');
            expect(cancelButton).not.toBeNull('Cancel button should be shown');
        });

        it('should switch the component to readonly mode when clicking on the "Cancel" button', () => {
            component.inEdit = true;
            fixture.detectChanges();
            let cancelButton = debugElement.query(By.css('[data-automation-id="cancel-edit-mode"]'));

            cancelButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            let editButton = debugElement.query(By.css('[data-automation-id="switch-to-edit-mode"]'));
            cancelButton = debugElement.query(By.css('[data-automation-id="cancel-edit-mode"]'));
            expect(editButton).not.toBeNull('Edit button should be shown');
            expect(cancelButton).toBeNull('Cancel button should disappear');
        });

        it('should switch the component to readonly mode when clicking on the "Save" button', () => {
            component.inEdit = true;
            fixture.detectChanges();
            let saveButton = debugElement.query(By.css('[data-automation-id="save-edit-mode"]'));

            saveButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            let editButton = debugElement.query(By.css('[data-automation-id="switch-to-edit-mode"]'));
            saveButton = debugElement.query(By.css('[data-automation-id="save-edit-mode"]'));
            expect(editButton).not.toBeNull('Edit button should be shown');
            expect(saveButton).toBeNull('Save button should disappear');
        });
    });

    it('should render empty component if no task details provided', () => {
        component.taskDetails = undefined;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(0);
    });

    it('should display assignee', () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        let formNameEl = fixture.debugElement.query(By.css('[data-automation-id="header-assignee"] .adf-header__value'));
        expect(formNameEl.nativeElement.innerText).toBe('Wilbur Adams');
    });

    it('should display placeholder if no assignee', () => {
        component.taskDetails.assignee = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-assignee"] .adf-header__value'));
        expect(valueEl.nativeElement.innerText).toBe('No assignee');
    });

    it('should display created-by', () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        let formNameEl = fixture.debugElement.query(By.css('[data-automation-id="header-created-by"] .adf-header__value'));
        expect(formNameEl.nativeElement.innerText).toBe('Wilbur Adams');
    });

    it('should display placeholder if no created-by', () => {
        component.taskDetails.assignee = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-created-by"] .adf-header__value'));
        expect(valueEl.nativeElement.innerText).toBe('No assignee');
    });

    it('should display the claim button if no assignee', () => {
        component.taskDetails.assignee = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-claim-button"]'));
        expect(valueEl.nativeElement.innerText).toBe('TASK_DETAILS.BUTTON.CLAIM');
    });

    it('should display due date', () => {
        component.taskDetails.dueDate = '2016-11-03';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-header__value'));
        expect(valueEl.nativeElement.innerText).toBe('Nov 03 2016');
    });

    it('should display placeholder if no due date', () => {
        component.taskDetails.dueDate = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-dueDate"] .adf-header__value'));
        expect(valueEl.nativeElement.innerText).toBe('No date');
    });

    it('should display form name', () => {
        component.formName = 'test form';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] .adf-header__value'));
        expect(valueEl.nativeElement.innerText).toBe('test form');
    });

    it('should not display form name if no form name provided', () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-formName"] .adf-header__value'));
        expect(valueEl.nativeElement.innerText).toBe('No form');
    });

});
