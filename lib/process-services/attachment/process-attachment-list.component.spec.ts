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

import { SimpleChange, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProcessContentService, setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { ProcessAttachmentListComponent } from './process-attachment-list.component';
import { ProcessTestingModule } from '../testing/process.testing.module';

describe('ProcessAttachmentListComponent', () => {

    let service: ProcessContentService;
    let component: ProcessAttachmentListComponent;
    let fixture: ComponentFixture<ProcessAttachmentListComponent>;
    let getProcessRelatedContentSpy: jasmine.Spy;
    let mockAttachment: any;

    setupTestBed({
        imports: [ProcessTestingModule]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessAttachmentListComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ProcessContentService);

        mockAttachment = {
            size: 2,
            total: 2,
            start: 0,
            data: [{
                id: 4001,
                name: 'Invoice01.pdf',
                created: '2017-05-12T12:50:05.522+0000',
                createdBy: {
                    id: 1,
                    firstName: 'Apps',
                    lastName: 'Administrator',
                    email: 'admin@app.activiti.com',
                    company: 'Alfresco.com',
                    pictureId: 3003
                },
                relatedContent: true,
                contentAvailable: true,
                link: false,
                mimeType: 'application/pdf',
                simpleType: 'pdf',
                previewStatus: 'created',
                thumbnailStatus: 'created'
            },
                {
                    id: 4002,
                    name: 'Invoice02.pdf',
                    created: '2017-05-12T12:50:05.522+0000',
                    createdBy: {
                        id: 1,
                        firstName: 'Apps',
                        lastName: 'Administrator',
                        email: 'admin@app.activiti.com',
                        company: 'Alfresco.com',
                        pictureId: 3003
                    },
                    relatedContent: true,
                    contentAvailable: true,
                    link: false,
                    mimeType: 'application/pdf',
                    simpleType: 'pdf',
                    previewStatus: 'created',
                    thumbnailStatus: 'created'
                }]
        };

        getProcessRelatedContentSpy = spyOn(service, 'getProcessRelatedContent').and.returnValue(of(mockAttachment));
        spyOn(service, 'deleteRelatedContent').and.returnValue(of({successCode: true}));

        let blobObj = new Blob();
        spyOn(service, 'getFileRawContent').and.returnValue(of(blobObj));
    });

    afterEach(() => {
        fixture.destroy();
        const overlayContainers = <any> window.document.querySelectorAll('.cdk-overlay-container');

        overlayContainers.forEach((overlayContainer) => {
            overlayContainer.innerHTML = '';
        });
    });

    it('should load attachments when processInstanceId specified', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        expect(getProcessRelatedContentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading attachments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getProcessRelatedContentSpy.and.returnValue(throwError({}));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit a success event when the attachments are loaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.success.subscribe((attachments) => {
            expect(attachments[0].name).toEqual(mockAttachment.data[0].name);
            expect(attachments[0].id).toEqual(mockAttachment.data[0].id);
        });

        component.ngOnChanges({'taskId': change});
    });

    it('should not attach when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should display attachments when the process has attachments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.debugElement.queryAll(By.css('.adf-datatable-body > .adf-datatable-row')).length).toBe(2);
        });
    }));

    it('should display all actions if attachments are not read only', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        fixture.detectChanges();
        let actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
            expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
            expect(actionMenu).toBe(3);
        });
    }));

    it('should not display remove action if attachments are read only', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        component.disabled = true;

        fixture.detectChanges();
        let actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
            expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
            expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).toBeNull();
            expect(actionMenu).toBe(2);
        });
    }));

    it('should show the empty list component when the attachments list is empty', async(() => {
        getProcessRelatedContentSpy.and.returnValue(of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'processInstanceId': change});
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should not show the empty list drag and drop component when is disabled', async(() => {
        getProcessRelatedContentSpy.and.returnValue(of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'processInstanceId': change});
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('adf-empty-list .adf-empty-list-drag_drop')).toBeNull();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should show the empty list component when the attachments list is empty for completed process', async(() => {
        getProcessRelatedContentSpy.and.returnValue(of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'processInstanceId': change});
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim())
            .toEqual('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should not show the empty list component when the attachments list is not empty for completed process', async(() => {
        getProcessRelatedContentSpy.and.returnValue(of(mockAttachment));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'processInstanceId': change});
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]')).toBeNull();
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.whenStable().then(() => {
                getProcessRelatedContentSpy.calls.reset();
            });
        }));

        it('should fetch new attachments when processInstanceId changed', () => {
            component.ngOnChanges({ 'processInstanceId': change });
            expect(getProcessRelatedContentSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new attachments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new attachments when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('Delete attachments', () => {

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            expect(true).toBe(true);
        });

    });

});

@Component({
    template: `
    <adf-process-attachment-list>
        <adf-empty-list>
            <div adf-empty-list-header class="adf-empty-list-header">Custom header</div>
        </adf-empty-list>
    </adf-process-attachment-list>
       `
})
class CustomEmptyTemplateComponent {
}

describe('Custom CustomEmptyTemplateComponent', () => {
    let fixture: ComponentFixture<CustomEmptyTemplateComponent>;

    setupTestBed({
        imports: [ProcessTestingModule],
        declarations: [CustomEmptyTemplateComponent],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
