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

import { SimpleChange, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { TaskAttachmentListComponent } from './task-attachment-list.component';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { mockEmittedTaskAttachments, mockTaskAttachments } from '../mock/task/task-attachments.mock';
import { ProcessContentService } from '../form/services/process-content.service';

describe('TaskAttachmentList', () => {

    let component: TaskAttachmentListComponent;
    let fixture: ComponentFixture<TaskAttachmentListComponent>;
    let service: ProcessContentService;
    let getTaskRelatedContentSpy: jasmine.Spy;
    let deleteContentSpy: jasmine.Spy;
    let getFileRawContentSpy: jasmine.Spy;
    let getContentPreviewSpy: jasmine.Spy;
    let disposableSuccess: any;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(TaskAttachmentListComponent);
        component = fixture.componentInstance;

        service = TestBed.inject(ProcessContentService);

        getTaskRelatedContentSpy = spyOn(service, 'getTaskRelatedContent').and.returnValue(of(mockTaskAttachments));

        deleteContentSpy = spyOn(service, 'deleteRelatedContent').and.returnValue(of({ successCode: true }));

        const blobObj = new Blob();

        getContentPreviewSpy = spyOn(service, 'getContentPreview').and.returnValue(of(blobObj));
        getFileRawContentSpy = spyOn(service, 'getFileRawContent').and.returnValue(of(blobObj));
    });

    afterEach(() => {
        const overlayContainers = window.document.querySelectorAll('.cdk-overlay-container');
        overlayContainers.forEach((overlayContainer) => {
            overlayContainer.innerHTML = '';
        });

        if (disposableSuccess) {
            disposableSuccess.unsubscribe();
        }
    });

    it('should load attachments when taskId specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        expect(getTaskRelatedContentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading attachments', () => {
        const emitSpy = spyOn(component.error, 'emit');
        getTaskRelatedContentSpy.and.returnValue(throwError({}));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit a success event when the attachments are loaded', () => {
        const change = new SimpleChange(null, '123', true);
        const spySuccessEmitter = spyOn(component.success, 'emit');
        component.ngOnChanges({ taskId: change });

        expect(spySuccessEmitter).toHaveBeenCalledWith(mockEmittedTaskAttachments);
    });

    it('should not attach when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should display attachments when the task has attachments', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.debugElement.queryAll(By.css('.adf-datatable-body > .adf-datatable-row')).length).toBe(2);
    });

    it('emit document when a user wants to view the document', () => {
        component.emitDocumentContent(mockTaskAttachments.data[1]);
        fixture.detectChanges();
        expect(getContentPreviewSpy).toHaveBeenCalled();
    });

    it('download document when a user wants to view the document', () => {
        component.downloadContent(mockTaskAttachments.data[1]);
        fixture.detectChanges();
        expect(getFileRawContentSpy).toHaveBeenCalled();
    });

    it('should show the empty default message when has no custom template', async () => {
        getTaskRelatedContentSpy.and.returnValue(of({
            size: 0,
            total: 0,
            start: 0,
            data: []
        }));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        component.hasCustomTemplate = false;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('.adf-custom-empty-template')).toBeNull();
        expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_TASK_LIST.ATTACHMENT.EMPTY.HEADER');
    });

    it('should display all actions if attachments are not read only', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        fixture.detectChanges();
        await fixture.whenStable();

        const actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();

        fixture.detectChanges();
        await fixture.whenStable();
        const actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
        expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
        expect(actionMenu).toBe(3);
    });

    it('should not display remove action if attachments are read only', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        component.disabled = true;
        fixture.detectChanges();
        await fixture.whenStable();

        const actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
        expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).toBeNull();
        expect(actionMenu).toBe(2);
    });

    it('should show the empty list component when the attachments list is empty', async () => {
        getTaskRelatedContentSpy.and.returnValue(of({
            size: 0,
            total: 0,
            start: 0,
            data: []
        }));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_TASK_LIST.ATTACHMENT.EMPTY.HEADER');
    });

    it('should show the empty list component when the attachments list is empty for completed task', async () => {
        getTaskRelatedContentSpy.and.returnValue(of({
            size: 0,
            total: 0,
            start: 0,
            data: []
        }));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_TASK_LIST.ATTACHMENT.EMPTY.HEADER');
        });
    });

    it('should not show the empty list component when the attachments list is not empty for completed task', async () => {
        getTaskRelatedContentSpy.and.returnValue(of(mockTaskAttachments));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ taskId: change });
        component.disabled = true;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]')).toBeNull();
    });

    it('loading should be false by default', () => {
        expect(component.isLoading).toBeFalsy();
    });

    describe('change detection', () => {

        let change: SimpleChange;
        let nullChange: SimpleChange;

        beforeEach(() => {
            change = new SimpleChange('123', '456', true);
            nullChange = new SimpleChange('123', null, true);
        });

        beforeEach(() => {
            component.taskId = '123';
            fixture.whenStable();
        });

        it('should fetch new attachments when taskId changed', async () => {
            fixture.detectChanges();
            await fixture.whenStable();
            const isRelatedContent = 'true';
            component.ngOnChanges({ taskId: change });
            expect(getTaskRelatedContentSpy).toHaveBeenCalledWith('456', { isRelatedContent });
        });

        it('should NOT fetch new attachments when empty change set made', () => {
            component.ngOnChanges({});
            expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new attachments when taskId changed to null', () => {
            component.ngOnChanges({ taskId: nullChange });
            expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('Delete attachments', () => {

        beforeEach(() => {
            component.taskId = '123';
            fixture.whenStable();
        });

        it('delete content by contentId', async () => {
            component.deleteAttachmentById(5);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(deleteContentSpy).toHaveBeenCalled();
        });
    });
});

@Component({
    template: `
        <adf-task-attachment-list>
            <adf-empty-list>
                <div adf-empty-list-header class="adf-empty-list-header">Custom header</div>
            </adf-empty-list>
        </adf-task-attachment-list>
    `
})
class CustomEmptyTemplateComponent {
}

describe('Custom CustomEmptyTemplateComponent', () => {
    let fixture: ComponentFixture<CustomEmptyTemplateComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [CustomEmptyTemplateComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomEmptyTemplateComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the custom template', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const title: any = fixture.debugElement.queryAll(By.css('[adf-empty-list-header]'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('Custom header');
    });
});
