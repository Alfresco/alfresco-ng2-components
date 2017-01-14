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
import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';
import { ActivitiStartTaskButton } from './activiti-start-task.component';

declare let jasmine: any;

describe('ActivitiStartTaskButton', () => {

    let activitiStartTaskButton: ActivitiStartTaskButton;
    let fixture: ComponentFixture<ActivitiStartTaskButton>;
    let service: ActivitiTaskListService;
    let element: HTMLElement;
    let startTaskButton: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiStartTaskButton
            ],
            providers: [
                ActivitiTaskListService
            ]
        }).compileComponents().then(() => {
            let translateService = TestBed.get(AlfrescoTranslationService);
            spyOn(translateService, 'addTranslationFolder').and.stub();
            spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });

            fixture = TestBed.createComponent(ActivitiStartTaskButton);
            activitiStartTaskButton = fixture.componentInstance;
            element = fixture.nativeElement;
            fixture.detectChanges();
            startTaskButton = <HTMLElement> element.querySelector('#start-task-button');
        });
    }));

    beforeEach(() => {
        jasmine.Ajax.install();
        service = fixture.debugElement.injector.get(ActivitiTaskListService);
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should show start task button', () => {
        expect(element.querySelector('#start-task-button')).toBeDefined();
        expect(element.querySelector('#start-task-button')).not.toBeNull();
        expect(element.querySelector('#start-task-button').textContent).toContain('START_TASK.BUTTON');
    });

    it('should show start dialog on press button', () => {
        startTaskButton.click();
        expect(element.querySelector('#start-task-dialog')).not.toBeNull();
        expect(element.querySelector('#start-task-dialog').getAttribute('open')).not.toBeNull();
        expect(element.querySelector('#start-task-dialog-title')).not.toBeNull();
        expect(element.querySelector('#start-task-dialog-title').textContent).toContain('START_TASK.DIALOG.TITLE');
    });

    it('should close start dialog on cancel button', () => {
        startTaskButton.click();
        expect(element.querySelector('#start-task-dialog')).not.toBeNull();
        expect(element.querySelector('#start-task-dialog').getAttribute('open')).not.toBeNull();
        let cancelButton = <HTMLElement> element.querySelector('#button-cancel');
        cancelButton.click();
        expect(element.querySelector('#start-task-dialog').getAttribute('open')).toBeNull();
    });

    it('should attach a task when a form id slected', () => {
        let attachFormToATask = spyOn(service, 'attachFormToATask').and.returnValue(Observable.of());
        spyOn(service, 'createNewTask').and.callFake(
            function() {
                return Observable.create(observer => {
                    observer.next({ id: 'task-id'});
                    observer.complete();
                });
            });

        let createTaskButton = <HTMLElement> element.querySelector('#button-start');

        activitiStartTaskButton.name = 'fake-name';
        activitiStartTaskButton.formId = '123';
        startTaskButton.click();
        createTaskButton.click();
        expect(attachFormToATask).toHaveBeenCalled();
    });

    it('should not attach a task when a form id is not slected', () => {
        let attachFormToATask = spyOn(service, 'attachFormToATask').and.returnValue(Observable.of());
        spyOn(service, 'createNewTask').and.callFake(
            function() {
                return Observable.create(observer => {
                    observer.next({ id: 'task-id'});
                    observer.complete();
                });
            });

        let createTaskButton = <HTMLElement> element.querySelector('#button-start');

        activitiStartTaskButton.name = 'fake-name';
        startTaskButton.click();
        createTaskButton.click();
        expect(attachFormToATask).not.toHaveBeenCalled();
    });

    it('should load form when dialogs open', () => {
        let loadForms = spyOn(service, 'getFormList').and.returnValue(Observable.of());
        startTaskButton.click();
        expect(loadForms).toHaveBeenCalled();
    });

    it('should create new task when start is clicked', () => {
        activitiStartTaskButton.onSuccess.subscribe(() => {
            expect(element.querySelector('#start-task-dialog').getAttribute('open')).toBeNull();
        });
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        startTaskButton.click();
        activitiStartTaskButton.name = 'fake-name';
        createTaskButton.click();
        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200
        });
    });

    it('alert message is showed on start error', () => {
        spyOn(window, 'alert');
        activitiStartTaskButton.onSuccess.subscribe(() => {
            expect(window.alert).toHaveBeenCalledWith('An error occurred while trying to add the task');
        });
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        startTaskButton.click();
        activitiStartTaskButton.name = 'fake-name';
        createTaskButton.click();
        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 403
        });
    });

    it('should send on success event when the task is started', () => {
        activitiStartTaskButton.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
        });
        let createTaskButton = <HTMLElement> element.querySelector('#button-start');
        startTaskButton.click();
        activitiStartTaskButton.name = 'fake-name';
        createTaskButton.click();
        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'json',
            responseText: {}
        });
    });
});
