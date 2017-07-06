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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

import { TaskDetailsModel } from '../models/task-details.model';
import { taskDetailsMock } from './../assets/task-details.mock';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { ActivitiTaskHeader } from './activiti-task-header.component';

describe('ActivitiTaskHeader', () => {

    let service: ActivitiTaskListService;
    let componentHandler: any;
    let component: ActivitiTaskHeader;
    let fixture: ComponentFixture<ActivitiTaskHeader>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiTaskHeader
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
        fixture = TestBed.createComponent(ActivitiTaskHeader);
        component = fixture.componentInstance;
        service = TestBed.get(ActivitiTaskListService);

        component.taskDetails = new TaskDetailsModel(taskDetailsMock);

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
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
