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

import { SimpleChange, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { ProcessAttachmentListComponent } from './process-attachment-list.component';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { mockEmittedProcessAttachments, mockProcessAttachments } from '../mock/process/process-attachments.mock';
import { ProcessContentService } from '../form/services/process-content.service';

describe('ProcessAttachmentListComponent', () => {

    let service: ProcessContentService;
    let component: ProcessAttachmentListComponent;
    let fixture: ComponentFixture<ProcessAttachmentListComponent>;
    let getProcessRelatedContentSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessAttachmentListComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ProcessContentService);

        getProcessRelatedContentSpy = spyOn(service, 'getProcessRelatedContent').and.returnValue(of(mockProcessAttachments));
        spyOn(service, 'deleteRelatedContent').and.returnValue(of({ successCode: true }));

        const blobObj = new Blob();
        spyOn(service, 'getFileRawContent').and.returnValue(of(blobObj));
    });

    afterEach(() => {
        fixture.destroy();
        const overlayContainers = window.document.querySelectorAll('.cdk-overlay-container');

        overlayContainers.forEach((overlayContainer) => {
            overlayContainer.innerHTML = '';
        });
    });

    it('should load attachments when processInstanceId specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        expect(getProcessRelatedContentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading attachments', () => {
        const emitSpy = spyOn(component.error, 'emit');
        getProcessRelatedContentSpy.and.returnValue(throwError({}));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit a success event when the attachments are loaded', () => {
        const change = new SimpleChange(null, '123', true);
        const spySuccessEmitter = spyOn(component.success, 'emit');
        component.ngOnChanges({ processInstanceId: change });

        expect(spySuccessEmitter).toHaveBeenCalledWith(mockEmittedProcessAttachments);
    });

    it('should not attach when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should display attachments when the process has attachments', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.debugElement.queryAll(By.css('.adf-datatable-body > .adf-datatable-row')).length).toBe(2);
    });

    it('should display all actions if attachments are not read only', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });

        fixture.detectChanges();
        await fixture.whenStable();

        const actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
        expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
        expect(actionMenu).toBe(3);
    });

    it('should not display remove action if attachments are read only', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        component.disabled = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();
        fixture.detectChanges();
        await fixture.whenStable();

        const actionMenu = window.document.querySelectorAll('button.mat-menu-item').length;
        expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.VIEW_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT"]')).not.toBeNull();
        expect(window.document.querySelector('[data-automation-id="ADF_PROCESS_LIST.MENU_ACTIONS.REMOVE_CONTENT"]')).toBeNull();
        expect(actionMenu).toBe(2);
    });

    it('should show the empty list component when the attachments list is empty', async () => {
        getProcessRelatedContentSpy.and.returnValue(of({
            size: 0,
            total: 0,
            start: 0,
            data: []
        }));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.HEADER');
    });

    it('should not show the empty list drag and drop component when is disabled', async () => {
        getProcessRelatedContentSpy.and.returnValue(of({
            size: 0,
            total: 0,
            start: 0,
            data: []
        }));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        component.disabled = true;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelector('adf-empty-list .adf-empty-list-drag_drop')).toBeNull();
        expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim()).toEqual('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.HEADER');
    });

    it('should show the empty list component when the attachments list is empty for completed process', async () => {
        getProcessRelatedContentSpy.and.returnValue(of({
            size: 0,
            total: 0,
            start: 0,
            data: []
        }));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        component.disabled = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]').innerText.trim())
            .toEqual('ADF_PROCESS_LIST.PROCESS-ATTACHMENT.EMPTY.HEADER');
    });

    it('should not show the empty list component when the attachments list is not empty for completed process', async () => {
        getProcessRelatedContentSpy.and.returnValue(of(mockProcessAttachments));
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });
        component.disabled = true;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelector('div[adf-empty-list-header]')).toBeNull();
    });

    it('should call getProcessRelatedContent with opt isRelatedContent=true', () => {
        getProcessRelatedContentSpy.and.returnValue(of(mockProcessAttachments));
        const change = new SimpleChange(null, '123', true);
        const isRelatedContent = 'true';
        component.ngOnChanges({ processInstanceId: change });
        expect(getProcessRelatedContentSpy).toHaveBeenCalled();
        expect(getProcessRelatedContentSpy).toHaveBeenCalledWith('123', { isRelatedContent });
    });

    describe('change detection', () => {

        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(async () => {
            component.processInstanceId = '123';
            await fixture.whenStable();
            getProcessRelatedContentSpy.calls.reset();
        });

        it('should fetch new attachments when processInstanceId changed', () => {
            component.ngOnChanges({ processInstanceId: change });
            const isRelatedContent = 'true';
            expect(getProcessRelatedContentSpy).toHaveBeenCalledWith('456', { isRelatedContent });
        });

        it('should NOT fetch new attachments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new attachments when processInstanceId changed to null', () => {
            component.ngOnChanges({ processInstanceId: nullChange });
            expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
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
