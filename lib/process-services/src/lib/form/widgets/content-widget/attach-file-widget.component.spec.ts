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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AttachFileWidgetComponent } from './attach-file-widget.component';
import {
    FormFieldModel,
    FormModel,
    FormFieldTypes,
    FormService,
    FormFieldMetadata,
    setupTestBed,
    DownloadService
} from '@alfresco/adf-core';
import { ContentNodeDialogService, ContentModule } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { Node } from '@alfresco/js-api';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AttachFileWidgetDialogService } from './attach-file-widget-dialog.service';
import { ActivitiContentService } from '../../services/activiti-alfresco.service';
import { ProcessContentService } from '../../services/process-content.service';

const fakeRepositoryListAnswer = [
    {
        authorized: true,
        serviceId: 'alfresco-9999-SHAREME',
        metaDataAllowed: true,
        name: 'SHAREME',
        repositoryUrl: 'http://localhost:0000/SHAREME',
        id: 1000
    },
    {
        authorized: true,
        serviceId: 'alfresco-0000-GOKUSHARE',
        metaDataAllowed: true,
        name: 'GOKUSHARE',
        repositoryUrl: 'http://localhost:0000/GOKUSHARE'
    },
    {
        authorized: true,
        serviceId: 'alfresco-2000-external',
        metaDataAllowed: true,
        name: 'external',
        repositoryUrl: 'http://externalhost.com/alfresco',
        id: 2000
    }
];

const onlyLocalParams = {
    fileSource: {
        serviceId: 'local-file'
    }
} as FormFieldMetadata;

const allSourceParams = {
    fileSource: {
        serviceId: 'all-file-sources'
    },
    link: false
} as FormFieldMetadata;

const allSourceParamsWithLinkEnabled = {
    fileSource: {
        serviceId: 'all-file-sources'
    },
    link: true
} as FormFieldMetadata;

const definedSourceParams = {
    fileSource: {
        serviceId: 'goku-sources',
        name: 'pippo-baudo',
        selectedFolder: {
            accountId: 'goku-share-account-id'
        }
    }
} as FormFieldMetadata;

const externalDefinedSourceParams = {
    fileSource: {
        serviceId: 'external-sources',
        name: 'external',
        selectedFolder: {
            accountId: 'external-account-id'
        }
    }
} as FormFieldMetadata;

const fakeMinimalNode: Node = {
    id: 'fake',
    name: 'fake-name',
    content: {
        mimeType: 'application/pdf'
    }
} as Node;

const fakePngUpload: any = {
    id: 1166,
    name: 'fake-png.png',
    created: '2017-07-25T17:17:37.099Z',
    createdBy: { id: 1001, firstName: 'Admin', lastName: 'admin', email: 'admin' },
    relatedContent: false,
    contentAvailable: true,
    link: false,
    isExternal: false,
    mimeType: 'image/png',
    simpleType: 'image',
    previewStatus: 'queued',
    thumbnailStatus: 'queued'
};

const fakePngAnswer: any = {
    id: 1155,
    name: 'a_png_file.png',
    created: '2017-07-25T17:17:37.099Z',
    createdBy: { id: 1001, firstName: 'Admin', lastName: 'admin', email: 'admin' },
    relatedContent: false,
    contentAvailable: true,
    isExternal: false,
    link: false,
    mimeType: 'image/png',
    simpleType: 'image',
    previewStatus: 'queued',
    thumbnailStatus: 'queued'
};

describe('AttachFileWidgetComponent', () => {

    let widget: AttachFileWidgetComponent;
    let fixture: ComponentFixture<AttachFileWidgetComponent>;
    let element: HTMLInputElement;
    let activitiContentService: ActivitiContentService;
    let contentNodeDialogService: ContentNodeDialogService;
    let processContentService: ProcessContentService;
    let downloadService: DownloadService;
    let formService: FormService;
    let attachFileWidgetDialogService: AttachFileWidgetDialogService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule,
            ContentModule.forRoot()
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AttachFileWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        activitiContentService = TestBed.inject(ActivitiContentService);
        contentNodeDialogService = TestBed.inject(ContentNodeDialogService);
        processContentService = TestBed.inject(ProcessContentService);
        downloadService = TestBed.inject(DownloadService);
        formService = TestBed.inject(FormService);
        attachFileWidgetDialogService = TestBed.inject(AttachFileWidgetDialogService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show up as simple upload when is configured for only local files', async () => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'simple-upload-button';
        widget.field.params = onlyLocalParams;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(element.querySelector('#simple-upload-button')).not.toBeNull();
    });

    it('should show up all the repository option on menu list', async () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = allSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton = element.querySelector<HTMLButtonElement>('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();
        fixture.detectChanges();
        await fixture.whenStable();

        const localFileOption = fixture.debugElement.queryAll(By.css('#attach-local-file'));
        const fakeRepoOption1 = fixture.debugElement.queryAll(By.css('#attach-SHAREME'));
        const fakeRepoOption2 = fixture.debugElement.queryAll(By.css('#attach-GOKUSHARE'));

        expect(localFileOption.length).toEqual(1);
        expect(localFileOption[0]).not.toBeNull();

        expect(fakeRepoOption1.length).toEqual(1);
        expect(fakeRepoOption1[0]).not.toBeNull();

        expect(fakeRepoOption2.length).toEqual(1);
        expect(fakeRepoOption2[0]).not.toBeNull();
    });

    it ('should show only remote repos when just link to files is true', async () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = allSourceParamsWithLinkEnabled;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton = element.querySelector<HTMLButtonElement>('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const localFileOption = fixture.debugElement.queryAll(By.css('#attach-local-file'));
        const fakeRepoOption1 = fixture.debugElement.queryAll(By.css('#attach-SHAREME'));
        const fakeRepoOption2 = fixture.debugElement.queryAll(By.css('#attach-GOKUSHARE'));

        expect(localFileOption.length).toEqual(0);

        expect(fakeRepoOption1.length).toEqual(1);
        expect(fakeRepoOption1[0]).not.toBeNull();

        expect(fakeRepoOption2.length).toEqual(1);
        expect(fakeRepoOption2[0]).not.toBeNull();
    });

    it('should isLink property of the selected node become true when the widget has link enabled', async () => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        const applyAlfrescoNodeSpy = spyOn(activitiContentService, 'applyAlfrescoNode');
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByDefaultLocation').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = allSourceParamsWithLinkEnabled;

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();
        expect(applyAlfrescoNodeSpy).toHaveBeenCalledWith({ ...fakeMinimalNode, isLink: true }, undefined, 'alfresco-1000-SHAREME');
    });

    it('should isLink property of the selected node become false when the widget has link disabled', async () => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        const applyAlfrescoNodeSpy = spyOn(activitiContentService, 'applyAlfrescoNode');
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByDefaultLocation').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = allSourceParams;

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton = element.querySelector<HTMLButtonElement>('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();
        expect(applyAlfrescoNodeSpy).toHaveBeenCalledWith({ ...fakeMinimalNode, isLink: false }, undefined, 'alfresco-1000-SHAREME');
    });

    it('should be able to upload files coming from content node selector', async () => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of(fakePngAnswer));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByDefaultLocation').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = allSourceParams;

        fixture.detectChanges();
        await fixture.whenStable();

        const attachButton = element.querySelector<HTMLButtonElement>('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should be able to upload more than one file from content node selector', async () => {
        const clickAttachFile = () => {
            const attachButton = element.querySelector<HTMLButtonElement>('#attach-file-attach');
            expect(attachButton).not.toBeNull();
            attachButton.click();
            fixture.detectChanges();
        };
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValues(of(fakePngAnswer), of(fakePngUpload));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByDefaultLocation').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = allSourceParams;
        widget.field.params.multiple = true;

        fixture.detectChanges();
        await fixture.whenStable();

        clickAttachFile();
        fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        clickAttachFile();
        fixture.debugElement.query(By.css('#attach-GOKUSHARE')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#file-1155')).not.toBeNull();
        expect(element.querySelector('#file-1166')).not.toBeNull();
    });

    it('should be able to upload files when a defined folder is selected', async () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = definedSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of(fakePngAnswer));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByFolderId').and.returnValue(of([fakeMinimalNode]));

        fixture.detectChanges();
        await fixture.whenStable();

        const attachButton = element.querySelector<HTMLButtonElement>('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-pippo-baudo')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should be able to upload files from local source', async () => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = onlyLocalParams;
        spyOn(processContentService, 'createTemporaryRawRelatedContent').and.returnValue(of(fakePngAnswer));

        fixture.detectChanges();
        await fixture.whenStable();

        const inputDebugElement = fixture.debugElement.query(By.css('#attach-file-attach'));
        inputDebugElement.triggerEventHandler('change', { target: { files: [fakePngAnswer] } });
        fixture.detectChanges();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should display file list when field has value', async () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: [fakePngAnswer]
        });
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
        widget.field.id = 'attach-file-attach';
        widget.field.params = onlyLocalParams;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    describe('when a file is uploaded', () => {

        beforeEach(async () => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-attach';
            widget.field.params = onlyLocalParams;
            spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(null));
            spyOn(processContentService, 'createTemporaryRawRelatedContent').and.returnValue(of(fakePngAnswer));

            fixture.detectChanges();
            await fixture.whenStable();

            const inputDebugElement = fixture.debugElement.query(By.css('#attach-file-attach'));
            inputDebugElement.triggerEventHandler('change', { target: { files: [fakePngAnswer] } });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#file-1155-icon')).not.toBeNull();
        });

        it('should show the action menu', async () => {
            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#file-1155-show-file'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#file-1155-download-file'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#file-1155-remove'))).not.toBeNull();
        });

        it('should remove file when remove is clicked', async () => {
            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const removeOption = fixture.debugElement.query(By.css('#file-1155-remove')).nativeElement as HTMLButtonElement;
            removeOption.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#file-1155')).toBeNull();
        });

        it('should download file when download is clicked', async () => {
            spyOn(downloadService, 'downloadBlob').and.stub();
            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const downloadOption = fixture.debugElement.query(By.css('#file-1155-download-file')).nativeElement as HTMLButtonElement;
            downloadOption.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(downloadService.downloadBlob).toHaveBeenCalled();
        });

        it('should raise formContentClicked event when show file is clicked', async () => {
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));
            formService.formContentClicked.subscribe((file) => {
                expect(file).not.toBeNull();
                expect(file.id).toBe(1155);
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const showOption = fixture.debugElement.query(By.css('#file-1155-show-file')).nativeElement as HTMLButtonElement;
            showOption.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should not display the show button file when is an external file', async () => {
            fakePngAnswer.isExternal = true;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const showOption = fixture.debugElement.query(By.css('#file-1155-show-file')).nativeElement as HTMLButtonElement;
            expect(showOption.disabled).toBeTruthy();
        });

        it('should not display the download button file when is an external file', async () => {
            fakePngAnswer.isExternal = true;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const downloadOption = fixture.debugElement.query(By.css('#file-1155-download-file')).nativeElement as HTMLButtonElement;
            expect(downloadOption.disabled).toBeTruthy();
        });

        it('should  display the download button file when is an internal file', async () => {
            fakePngAnswer.isExternal = false;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const downloadOption = fixture.debugElement.query(By.css('#file-1155-download-file')).nativeElement as HTMLButtonElement;
            expect(downloadOption.disabled).toBeFalsy();

        });

        it('should not display the show button file when there is no contentAvailable', async () => {
            fakePngAnswer.contentAvailable = false;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton = element.querySelector<HTMLButtonElement>('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const showOption = fixture.debugElement.query(By.css('#file-1155-show-file')).nativeElement as HTMLButtonElement;
            expect(showOption.disabled).toBeTruthy();
        });
   });

    it('should be able to upload files when a defined folder from external content service', async () => {
        widget.field = new FormFieldModel(new FormModel(), { type: FormFieldTypes.UPLOAD, value: [] });
        widget.field.id = 'attach-external-file-attach';
        widget.field.params = externalDefinedSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of(fakePngAnswer));
        spyOn(attachFileWidgetDialogService, 'openLogin').and.returnValue(of([fakeMinimalNode]));

        fixture.detectChanges();
        await fixture.whenStable();

        const attachButton = element.querySelector<HTMLButtonElement>('#attach-external-file-attach');
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-external')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should pass a valid repository id to open the external login', async () => {
        widget.field = new FormFieldModel(new FormModel(), { type: FormFieldTypes.UPLOAD, value: [] });
        widget.field.id = 'attach-external-file-attach';
        widget.field.params = externalDefinedSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of(fakePngAnswer));
        const openLoginSpy = spyOn(attachFileWidgetDialogService, 'openLogin').and.returnValue(of([fakeMinimalNode]));

        fixture.detectChanges();
        await fixture.whenStable();

        const attachButton = element.querySelector<HTMLButtonElement>('#attach-external-file-attach');
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-external')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(openLoginSpy).toHaveBeenCalledWith(fakeRepositoryListAnswer[2], undefined, 'alfresco-2000-external');
    });
});
