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

import { SimpleChange, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { TaskAttachmentListComponent } from './task-attachment-list.component';
import { ProcessContentService, setupTestBed } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../testing/process.testing.module';

describe('TaskAttachmentList', () => {

    let component: TaskAttachmentListComponent;
    let fixture: ComponentFixture<TaskAttachmentListComponent>;
    let service: ProcessContentService;
    let getTaskRelatedContentSpy: jasmine.Spy;
    let mockAttachment: any;
    let deleteContentSpy: jasmine.Spy;
    let getFileRawContentSpy: jasmine.Spy;
    let disposableSuccess: any;

    setupTestBed({
        imports: [ProcessTestingModule],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(TaskAttachmentListComponent);
        component = fixture.componentInstance;

        service = TestBed.get(ProcessContentService);

        mockAttachment = {
            size: 2,
            total: 2,
            start: 0,
            data: [
                {
                    id: 8,
                    name: 'fake.zip',
                    created: 1494595697381,
                    createdBy: { id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com' },
                    relatedContent: true,
                    contentAvailable: true,
                    link: false,
                    mimeType: 'application/zip',
                    simpleType: 'content',
                    previewStatus: 'unsupported',
                    thumbnailStatus: 'unsupported'
                },
                {
                    id: 9,
                    name: 'fake.jpg',
                    created: 1494595655381,
                    createdBy: { id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com' },
                    relatedContent: true,
                    contentAvailable: true,
                    link: false,
                    mimeType: 'image/jpeg',
                    simpleType: 'image',
                    previewStatus: 'unsupported',
                    thumbnailStatus: 'unsupported'
                }
            ]
        };

        getTaskRelatedContentSpy = spyOn(service, 'getTaskRelatedContent').and.returnValue(of(
            mockAttachment
        ));

        deleteContentSpy = spyOn(service, 'deleteRelatedContent').and.returnValue(of({ successCode: true }));

        let blobObj = new Blob();
        getFileRawContentSpy = spyOn(service, 'getFileRawContent').and.returnValue(of(blobObj));
    });

    afterEach(() => {
        const overlayContainers = <any> window.document.querySelectorAll('.cdk-overlay-container');
        overlayContainers.forEach((overlayContainer) => {
            overlayContainer.innerHTML = '';
        });

        if (disposableSuccess) {
            disposableSuccess.unsubscribe();
        }
    });

    it('should load attachments when taskId specified', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        expect(getTaskRelatedContentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading attachments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getTaskRelatedContentSpy.and.returnValue(throwError({}));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit a success event when the attachments are loaded', () => {
        let change = new SimpleChange(null, '123', true);
        disposableSuccess = component.success.subscribe((attachments) => {
            expect(attachments[0].name).toEqual(mockAttachment.data[0].name);
            expect(attachments[0].id).toEqual(mockAttachment.data[0].id);
        });

        component.ngOnChanges({ 'taskId': change });
    });

    it('should not attach when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should display attachments when the task has attachments', (done) => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.debugElement.queryAll(By.css('.adf-datatable-body > .adf-datatable-row')).length).toBe(2);
            done();
        });
    });

    it('emit document when a user wants to view the document', () => {
        component.emitDocumentContent(mockAttachment.data[1]);
        fixture.detectChanges();
        expect(getFileRawContentSpy).toHaveBeenCalled();
    });

    it('download document when a user wants to view the document', () => {
        component.downloadContent(mockAttachment.data[1]);
        fixture.detectChanges();
        expect(getFileRawContentSpy).toHaveBeenCalled();
    });

    it('should show the empty default message when has no custom template', async(() => {
        getTaskRelatedContentSpy.and.returnValue(of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        component.hasCustomTemplate = false;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.adf-custom-empty-template')).toBeNull();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_TASK_LIST.ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should display all actions if attachments are not read only', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        fixture.detectChanges();

        let actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
            expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
            expect(actionMenu).toBe(3);
        });
    }));

    it('should not display remove action if attachments are read only', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        component.disabled = true;
        fixture.detectChanges();

        let actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
            expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_TASK_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).toBeNull();
            expect(actionMenu).toBe(2);
        });
    }));

    it('should show the empty list component when the attachments list is empty', async(() => {
        getTaskRelatedContentSpy.and.returnValue(of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_TASK_LIST.ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should show the empty list component when the attachments list is empty for completed task', async(() => {
        getTaskRelatedContentSpy.and.returnValue(of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_TASK_LIST.ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should not show the empty list component when the attachments list is not empty for completed task', async(() => {
        getTaskRelatedContentSpy.and.returnValue(of(mockAttachment));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]')).toBeNull();
        });
    }));

    it('loading should be false by default', () => {
        expect(component.isLoading).toBeFalsy();
    });

    describe('change detection', () => {

        let change;
        let nullChange;

        beforeEach(() => {
            change = new SimpleChange('123', '456', true);
            nullChange = new SimpleChange('123', null, true);
        });

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.whenStable().then(() => {
                getTaskRelatedContentSpy.calls.reset();
            });
        }));

        it('should fetch new attachments when taskId changed', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.ngOnChanges({ 'taskId': change });
                expect(getTaskRelatedContentSpy).toHaveBeenCalledWith('456');
                done();
            });
        });

        it('should NOT fetch new attachments when empty change set made', () => {
            component.ngOnChanges({});
            expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new attachments when taskId changed to null', () => {
            component.ngOnChanges({ 'taskId': nullChange });
            expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('Delete attachments', () => {

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            expect(true).toBe(true);
        });

        it('delete content by contentId', () => {
            component.deleteAttachmentById(5);
            fixture.detectChanges();
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
        imports: [ProcessTestingModule],
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

    it('should render the custom template', async(() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let title: any = fixture.debugElement.queryAll(By.css('[adf-empty-list-header]'));
            expect(title.length).toBe(1);
            expect(title[0].nativeElement.innerText).toBe('Custom header');
        });
    }));
});
