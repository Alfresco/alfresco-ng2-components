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
import { ShareAttachWidgetComponent } from './share-attach-widget.component';
import {
    FormFieldModel,
    FormModel,
    FormFieldTypes,
    FormService,
    ProcessContentService,
    ActivitiContentService,
    AlfrescoApiService,
    LogService,
    ThumbnailService,
    SitesService,
    FormFieldMetadata
} from '@alfresco/adf-core';
import { ContentNodeDialogService, DocumentListService } from '@alfresco/adf-content-services';
import { MaterialModule } from '../../material.module';
import { Observable } from 'rxjs/Observable';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

const fakeRepositoryListAnswer = [
    {
        'authorized': true,
        'serviceId': 'alfresco-9999-SHAREME',
        'metaDataAllowed': true,
        'name': 'SHAREME'
    },
    {
        'authorized': true,
        'serviceId': 'alfresco-0000-GOKUSHARE',
        'metaDataAllowed': true,
        'name': 'GOKUSHARE'
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
    name: 'fake-name'
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

describe('ShareAttachWidgetComponent', () => {

    let widget: ShareAttachWidgetComponent;
    let fixture: ComponentFixture<ShareAttachWidgetComponent>;
    let element: HTMLInputElement;
    let activitiContentService: ActivitiContentService;
    let contentNodeDialogService: ContentNodeDialogService;
    let processContentService: ProcessContentService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ShareAttachWidgetComponent],
            providers: [
                        FormService,
                        ProcessContentService,
                        ThumbnailService,
                        ActivitiContentService,
                        AlfrescoApiService,
                        LogService,
                        SitesService,
                        DocumentListService,
                        ContentNodeDialogService
                    ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ShareAttachWidgetComponent);
            widget = fixture.componentInstance;
            element = fixture.nativeElement;
            activitiContentService = TestBed.get(ActivitiContentService);
            contentNodeDialogService = TestBed.get(ContentNodeDialogService);
            processContentService = TestBed.get(ProcessContentService);
        });
    }));

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to create the widget', () => {
        expect(widget).not.toBeNull();
    });

    it('should show up as simple upload when is configured for only local files', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'simple-upload-button';
        widget.field.params = <FormFieldMetadata> onlyLocalParams;
        fixture.detectChanges();
        expect(element.querySelector('#simple-upload-button')).not.toBeNull();
    });

    it('should show up all the repository option on menu list', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata>  allSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(Observable.of(fakeRepositoryListAnswer));
        fixture.detectChanges();

        let attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('#attach-local-file'))).not.toBeNull();
        expect(fixture.debugElement.queryAll(By.css('#attach-local-file'))).not.toBeUndefined();
        expect(fixture.debugElement.queryAll(By.css('#attach-SHAREME'))).not.toBeNull();
        expect(fixture.debugElement.queryAll(By.css('#attach-SHAREME'))).not.toBeUndefined();
        expect(fixture.debugElement.queryAll(By.css('#attach-GOKUSHARE'))).not.toBeNull();
        expect(fixture.debugElement.queryAll(By.css('#attach-GOKUSHARE'))).not.toBeUndefined();
    });

    it('should be able to upload files coming from content node selector', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata>  allSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(Observable.of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(Observable.of(fakePngAnswer));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogBySite').and.returnValue(Observable.of([fakeMinimalNode]));
        fixture.detectChanges();

        let attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();
        fixture.detectChanges();
        fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();
        fixture.detectChanges();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should be able to upload files when a defined folder is selected', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata>  definedSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(Observable.of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(Observable.of(fakePngAnswer));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByFolderId').and.returnValue(Observable.of([fakeMinimalNode]));
        fixture.detectChanges();

        let attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();
        fixture.detectChanges();
        fixture.debugElement.query(By.css('#attach-pippo-baudo')).nativeElement.click();
        fixture.detectChanges();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should be able to upload files from local source', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata>  onlyLocalParams;
        spyOn(processContentService, 'createTemporaryRawRelatedContent').and.returnValue(Observable.of(fakePngAnswer));
        fixture.detectChanges();

        let inputDebugElement = fixture.debugElement.query(By.css('#attach-file-attach'));
        inputDebugElement.triggerEventHandler('change', {target: {files: [fakePngAnswer]}});
        fixture.detectChanges();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should display file list when field has value', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: [fakePngAnswer]
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata>  onlyLocalParams;
        fixture.detectChanges();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

});
