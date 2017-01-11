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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { CoreModule, AlfrescoTranslateService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from '../services/activiti-tasklist.service';
import { ActivitiChecklist } from './activiti-checklist.component';
import { TaskDetailsModel } from '../models/task-details.model';

declare let jasmine: any;

const fakeTaskDetail = new TaskDetailsModel({
    id: 'fake-check-id',
    name: 'fake-check-name'
});

describe('ActivitiChecklist', () => {

    let checklistComponent: ActivitiChecklist;
    let fixture: ComponentFixture<ActivitiChecklist>;
    let element: HTMLElement;
    let showChecklistDialog, closeCheckDialogButton;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiChecklist
            ],
            providers: [
                ActivitiTaskListService
            ]
        }).compileComponents().then(() => {
            let translateService = TestBed.get(AlfrescoTranslateService);
            spyOn(translateService, 'addTranslationFolder').and.stub();
            spyOn(translateService, 'get').and.callFake((key) => {
                return Observable.of(key);
            });

            fixture = TestBed.createComponent(ActivitiChecklist);
            checklistComponent = fixture.componentInstance;
            element = fixture.nativeElement;

            fixture.detectChanges();
        });
    }));

    it('should show people component title', () => {
        expect(element.querySelector('#checklist-label')).toBeDefined();
        expect(element.querySelector('#checklist-label')).not.toBeNull();
    });

    it('should show no checklist message', () => {
        expect(element.querySelector('#checklist-none-message')).not.toBeNull();
        expect(element.querySelector('#checklist-none-message').textContent).toContain('TASK_DETAILS.CHECKLIST.NONE');
    });

    describe('when interact with people dialog', () => {

        beforeEach(() => {
            checklistComponent.taskId = 'fake-task-id';
            checklistComponent.checklist = [];
            fixture.detectChanges();
            showChecklistDialog = <HTMLElement> element.querySelector('#add-checklist');
            closeCheckDialogButton = <HTMLElement> element.querySelector('#close-check-dialog');
        });

        it('should show dialog when clicked on add', () => {
            expect(showChecklistDialog).not.toBeNull();
            showChecklistDialog.click();

            expect(element.querySelector('#checklist-dialog')).not.toBeNull();
            expect(element.querySelector('#add-checklist-title')).not.toBeNull();
            expect(element.querySelector('#add-checklist-title').textContent).toContain('New Check');
        });

        it('should close dialog when clicked on cancel', () => {
            showChecklistDialog.click();
            expect(element.querySelector('#checklist-dialog').getAttribute('open')).not.toBeNull();
            closeCheckDialogButton.click();
            expect(element.querySelector('#checklist-dialog').getAttribute('open')).toBeNull();
        });
    });

    describe('when there are task checklist', () => {

        beforeEach(() => {
            checklistComponent.taskId = 'fake-task-id';
            checklistComponent.checklist = [];
            fixture.detectChanges();
            showChecklistDialog = <HTMLElement> element.querySelector('#add-checklist');
        });

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should show task checklist', () => {
            checklistComponent.checklist.push(fakeTaskDetail);
            fixture.detectChanges();
            expect(element.querySelector('#check-fake-check-id')).not.toBeNull();
            expect(element.querySelector('#check-fake-check-id').textContent).toContain('fake-check-name');
        });

        it('should add checklist', async(() => {
            showChecklistDialog.click();
            let addButtonDialog = <HTMLElement> element.querySelector('#add-check');
            addButtonDialog.click();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: { id: 'fake-check-added-id', name: 'fake-check-added-name' }
            });
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#check-fake-check-added-id')).not.toBeNull();
                expect(element.querySelector('#check-fake-check-added-id').textContent).toContain('fake-check-added-name');
            });
        }));

        it('should show load task checklist on change', async(() => {
            checklistComponent.taskId = 'new-fake-task-id';
            checklistComponent.checklist.push(fakeTaskDetail);
            fixture.detectChanges();
            let change = new SimpleChange(null, 'new-fake-task-id');
            checklistComponent.ngOnChanges({
                taskId: change
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: { data: [{ id: 'fake-check-changed-id', name: 'fake-check-changed-name' }] }
            });
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#check-fake-check-changed-id')).not.toBeNull();
                expect(element.querySelector('#check-fake-check-changed-id').textContent).toContain('fake-check-changed-name');
            });
        }));

        it('should show empty checklist when task id is null', async(() => {
            checklistComponent.taskId = 'new-fake-task-id';
            checklistComponent.checklist.push(fakeTaskDetail);
            fixture.detectChanges();
            checklistComponent.taskId = null;
            let change = new SimpleChange(null, 'new-fake-task-id');
            checklistComponent.ngOnChanges({
                taskId: change
            });
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#checklist-none-message')).not.toBeNull();
                expect(element.querySelector('#checklist-none-message').textContent).toContain('TASK_DETAILS.CHECKLIST.NONE');
            });
        }));

        it('should emit checklist task created event when the checklist is successfully added', (done) => {
            checklistComponent.checklistTaskCreated.subscribe((taskAdded: TaskDetailsModel) => {
                fixture.detectChanges();
                expect(taskAdded.id).toEqual('fake-check-added-id');
                expect(taskAdded.name).toEqual('fake-check-added-name');
                expect(element.querySelector('#check-fake-check-added-id')).not.toBeNull();
                expect(element.querySelector('#check-fake-check-added-id').textContent).toContain('fake-check-added-name');
                done();
            });
            showChecklistDialog.click();
            let addButtonDialog = <HTMLElement> element.querySelector('#add-check');
            addButtonDialog.click();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: { id: 'fake-check-added-id', name: 'fake-check-added-name' }
            });
        });
    });

});
