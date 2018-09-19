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
import { AttachFileWidgetComponent } from './attach-file-widget.component';
import {
    FormFieldModel,
    FormModel,
    FormFieldTypes,
    FormService,
    ProcessContentService,
    ActivitiContentService,
    FormFieldMetadata,
    ContentService,
    setupTestBed
} from '@alfresco/adf-core';
import { ContentNodeDialogService, ContentModule } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ProcessTestingModule } from '../testing/process.testing.module';

const fakeRepositoryListAnswer = [
    {
        'authorized': true,
        'serviceId': 'alfresco-9999-SHAREME',
        'metaDataAllowed': true,
        'name': 'SHAREME',
        'repositoryUrl' : 'http://localhost:0000/SHAREME'
    },
    {
        'authorized': true,
        'serviceId': 'alfresco-0000-GOKUSHARE',
        'metaDataAllowed': true,
        'name': 'GOKUSHARE',
        'repositoryUrl' : 'http://localhost:0000/GOKUSHARE'
    }];

const onlyLocalParams = {
    fileSource : {
        serviceId: 'local-file'
    }
};

const allSourceParams = {
    fileSource : {
        serviceId: 'all-file-sources'
    }
};

const definedSourceParams = {
    fileSource : {
        serviceId: 'goku-sources',
        name: 'pippo-baudo',
        selectedFolder: {
            accountId: 'goku-share-account-id'
        }
    }
};

const fakeMinimalNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
    id: 'fake',
    name: 'fake-name',
    content: {
        mimeType: 'application/pdf'
    }
};

const fakePngAnswer = {
    'id': 1155,
    'name': 'a_png_file.png',
    'created': '2017-07-25T17:17:37.099Z',
    'createdBy': {'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin'},
    'relatedContent': false,
    'contentAvailable': true,
    'link': false,
    'mimeType': 'image/png',
    'simpleType': 'image',
    'previewStatus': 'queued',
    'thumbnailStatus': 'queued'
};

describe('AttachFileWidgetComponent', () => {

    let widget: AttachFileWidgetComponent;
    let fixture: ComponentFixture<AttachFileWidgetComponent>;
    let element: HTMLInputElement;
    let activitiContentService: ActivitiContentService;
    let contentNodeDialogService: ContentNodeDialogService;
    let processContentService: ProcessContentService;
    let contentService: ContentService;
    let formService: FormService;

    setupTestBed({
        imports: [
            ProcessTestingModule,
            ContentModule.forRoot()
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(AttachFileWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        activitiContentService = TestBed.get(ActivitiContentService);
        contentNodeDialogService = TestBed.get(ContentNodeDialogService);
        processContentService = TestBed.get(ProcessContentService);
        contentService = TestBed.get(ContentService);
        formService = TestBed.get(FormService);
    }));

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to create the widget', () => {
        expect(widget).not.toBeNull();
    });

    it('should show up as simple upload when is configured for only local files', async(() => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'simple-upload-button';
        widget.field.params = <FormFieldMetadata> onlyLocalParams;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#simple-upload-button')).not.toBeNull();
        });
    }));

    it('should show up all the repository option on menu list', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> allSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            let attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
            expect(attachButton).not.toBeNull();
            attachButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(fixture.debugElement.queryAll(By.css('#attach-local-file'))).not.toBeNull();
                expect(fixture.debugElement.queryAll(By.css('#attach-local-file'))).not.toBeUndefined();
                expect(fixture.debugElement.queryAll(By.css('#attach-SHAREME'))).not.toBeNull();
                expect(fixture.debugElement.queryAll(By.css('#attach-SHAREME'))).not.toBeUndefined();
                expect(fixture.debugElement.queryAll(By.css('#attach-GOKUSHARE'))).not.toBeNull();
                expect(fixture.debugElement.queryAll(By.css('#attach-GOKUSHARE'))).not.toBeUndefined();
            });
        });
    }));

    it('should be able to upload files coming from content node selector', async(() => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of(fakePngAnswer));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogBySite').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> allSourceParams;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
            expect(attachButton).not.toBeNull();
            attachButton.click();
            fixture.detectChanges();
            fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#file-1155-icon')).not.toBeNull();
            });
        });
    }));

    it('should be able to upload files when a defined folder is selected', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> definedSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of(fakePngAnswer));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByFolderId').and.returnValue(of([fakeMinimalNode]));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
            expect(attachButton).not.toBeNull();
            attachButton.click();
            fixture.detectChanges();
            fixture.debugElement.query(By.css('#attach-pippo-baudo')).nativeElement.click();
            fixture.detectChanges();

            expect(element.querySelector('#file-1155-icon')).not.toBeNull();
        });
    }));

    it('should be able to upload files from local source', async(() => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> onlyLocalParams;
        spyOn(processContentService, 'createTemporaryRawRelatedContent').and.returnValue(of(fakePngAnswer));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let inputDebugElement = fixture.debugElement.query(By.css('#attach-file-attach'));
            inputDebugElement.triggerEventHandler('change', { target: { files: [fakePngAnswer] } });
            fixture.detectChanges();

            expect(element.querySelector('#file-1155-icon')).not.toBeNull();
        });
    }));

    it('should display file list when field has value', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: [fakePngAnswer]
        });
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> onlyLocalParams;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#file-1155-icon')).not.toBeNull();
        });
    }));

    describe('when a file is uploaded', () => {

        beforeEach(async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-attach';
            widget.field.params = <FormFieldMetadata>  onlyLocalParams;
            spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
            spyOn(processContentService, 'createTemporaryRawRelatedContent').and.returnValue(of(fakePngAnswer));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let inputDebugElement = fixture.debugElement.query(By.css('#attach-file-attach'));
                inputDebugElement.triggerEventHandler('change', {target: {files: [fakePngAnswer]}});
                fixture.detectChanges();
                expect(element.querySelector('#file-1155-icon')).not.toBeNull();
            });
        }));

        it('should show the action menu', async(() => {
            let menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(fixture.debugElement.query(By.css('#file-1155-show-file'))).not.toBeNull();
                expect(fixture.debugElement.query(By.css('#file-1155-download-file'))).not.toBeNull();
                expect(fixture.debugElement.query(By.css('#file-1155-remove'))).not.toBeNull();
            });
        }));

        it('should remove file when remove is clicked', async(() => {
            let menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            const removeOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-remove')).nativeElement;
            removeOption.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#file-1155')).toBeNull();
            });
        }));

        it('should download file when download is clicked', async(() => {
            spyOn(contentService, 'downloadBlob').and.stub();
            let menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            const downloadOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-download-file')).nativeElement;
            downloadOption.click();
            fixture.whenStable().then(() => {
                expect(contentService.downloadBlob).toHaveBeenCalled();
            });
        }));

        it('should raise formContentClicked event when show file is clicked', async(() => {
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));
            formService.formContentClicked.subscribe((file) => {
                expect(file).not.toBeNull();
                expect(file.id).toBe(1155);
            });
            let menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            const showOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-show-file')).nativeElement;
            showOption.click();
        }));

    });

});
