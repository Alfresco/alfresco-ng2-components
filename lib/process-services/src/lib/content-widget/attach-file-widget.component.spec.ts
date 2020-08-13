/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
    setupTestBed,
    DownloadService
} from '@alfresco/adf-core';
import { ContentNodeDialogService, ContentModule } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { Node } from '@alfresco/js-api';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

const fakeRepositoryListAnswer = [
    {
        'authorized': true,
        'serviceId': 'alfresco-9999-SHAREME',
        'metaDataAllowed': true,
        'name': 'SHAREME',
        'repositoryUrl': 'http://localhost:0000/SHAREME',
        'id': 1000
    },
    {
        'authorized': true,
        'serviceId': 'alfresco-0000-GOKUSHARE',
        'metaDataAllowed': true,
        'name': 'GOKUSHARE',
        'repositoryUrl': 'http://localhost:0000/GOKUSHARE'
    }];

const onlyLocalParams = {
    fileSource: {
        serviceId: 'local-file'
    }
};

const allSourceParams = {
    fileSource: {
        serviceId: 'all-file-sources'
    },
    link: false
};

const allSourceParamsWithLinkEnabled = {
    fileSource: {
        serviceId: 'all-file-sources'
    },
    link: true
};

const definedSourceParams = {
    fileSource: {
        serviceId: 'goku-sources',
        name: 'pippo-baudo',
        selectedFolder: {
            accountId: 'goku-share-account-id'
        }
    }
};

const fakeMinimalNode: Node = <Node> {
    id: 'fake',
    name: 'fake-name',
    content: {
        mimeType: 'application/pdf'
    }
};

const fakePngUpload = {
    'id': 1166,
    'name': 'fake-png.png',
    'created': '2017-07-25T17:17:37.099Z',
    'createdBy': { 'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin' },
    'relatedContent': false,
    'contentAvailable': true,
    'link': false,
    'isExternal': false,
    'mimeType': 'image/png',
    'simpleType': 'image',
    'previewStatus': 'queued',
    'thumbnailStatus': 'queued'
};

const fakePngAnswer = {
    'id': 1155,
    'name': 'a_png_file.png',
    'created': '2017-07-25T17:17:37.099Z',
    'createdBy': { 'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin' },
    'relatedContent': false,
    'contentAvailable': true,
    'isExternal': false,
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
    let downloadService: DownloadService;
    let formService: FormService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule,
            ContentModule.forRoot()
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(AttachFileWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        activitiContentService = TestBed.inject(ActivitiContentService);
        contentNodeDialogService = TestBed.inject(ContentNodeDialogService);
        processContentService = TestBed.inject(ProcessContentService);
        downloadService = TestBed.inject(DownloadService);
        formService = TestBed.inject(FormService);
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

    it('should show up all the repository option on menu list', async(done) => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> allSourceParams;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
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

        done();
    });

    it ('should show only remote repos when just link to files is true', async (done) => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> allSourceParamsWithLinkEnabled;
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
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

        done();
    });

    it('should isLink property of the selected node become true when the widget has link enabled', async (done) => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        const applyAlfrescoNodeSpy = spyOn(activitiContentService, 'applyAlfrescoNode');
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByDefaultLocation').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> allSourceParamsWithLinkEnabled;

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();
        expect(applyAlfrescoNodeSpy).toHaveBeenCalledWith({ ...fakeMinimalNode, isLink: true }, undefined, 'alfresco-1000-SHAREME');
        done();
    });

    it('should isLink property of the selected node become false when the widget has link disabled', async (done) => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        const applyAlfrescoNodeSpy = spyOn(activitiContentService, 'applyAlfrescoNode');
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByDefaultLocation').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> allSourceParams;

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
        expect(attachButton).not.toBeNull();
        attachButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();
        expect(applyAlfrescoNodeSpy).toHaveBeenCalledWith({ ...fakeMinimalNode, isLink: false }, undefined, 'alfresco-1000-SHAREME');
        done();
    });

    it('should be able to upload files coming from content node selector', async(() => {
        spyOn(activitiContentService, 'getAlfrescoRepositories').and.returnValue(of(fakeRepositoryListAnswer));
        spyOn(activitiContentService, 'applyAlfrescoNode').and.returnValue(of(fakePngAnswer));
        spyOn(contentNodeDialogService, 'openFileBrowseDialogByDefaultLocation').and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> allSourceParams;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
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

    it('should be able to upload more than one file from content node selector', async(() => {
        const clickAttachFile = () => {
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
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
        widget.field.params = <FormFieldMetadata> allSourceParams;
        widget.field.params.multiple = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            clickAttachFile();
            fixture.debugElement.query(By.css('#attach-SHAREME')).nativeElement.click();
            fixture.detectChanges();
            clickAttachFile();
            fixture.debugElement.query(By.css('#attach-GOKUSHARE')).nativeElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#file-1155')).not.toBeNull();
                expect(element.querySelector('#file-1166')).not.toBeNull();
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
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-attach');
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
            const inputDebugElement = fixture.debugElement.query(By.css('#attach-file-attach'));
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
                const inputDebugElement = fixture.debugElement.query(By.css('#attach-file-attach'));
                inputDebugElement.triggerEventHandler('change', { target: { files: [fakePngAnswer] } });
                fixture.detectChanges();
                expect(element.querySelector('#file-1155-icon')).not.toBeNull();
            });
        }));

        it('should show the action menu', async(() => {
            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
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
            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
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
            spyOn(downloadService, 'downloadBlob').and.stub();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            const downloadOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-download-file')).nativeElement;
            downloadOption.click();
            fixture.whenStable().then(() => {
                expect(downloadService.downloadBlob).toHaveBeenCalled();
            });
        }));

        it('should raise formContentClicked event when show file is clicked', async() => {
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));
            formService.formContentClicked.subscribe((file) => {
                expect(file).not.toBeNull();
                expect(file.id).toBe(1155);
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const showOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-show-file')).nativeElement;
            showOption.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should not display the show button file when is an external file', async() => {
            fakePngAnswer.isExternal = true;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const showOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-show-file')).nativeElement;
            expect(showOption.disabled).toBeTruthy();
        });

        it('should not display the download button file when is an external file', async() => {
            fakePngAnswer.isExternal = true;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const downloadOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-download-file')).nativeElement;
            expect(downloadOption.disabled).toBeTruthy();
        });

        it('should  display the download button file when is an internal file', async() => {
            fakePngAnswer.isExternal = false;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const downloadOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-download-file')).nativeElement;
            expect(downloadOption.disabled).toBeFalsy();

        });

        it('should not display the show button file when there is no contentAvailable', async() => {
            fakePngAnswer.contentAvailable = false;
            spyOn(processContentService, 'getFileRawContent').and.returnValue(of(fakePngAnswer));

            const menuButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#file-1155-option-menu');
            expect(menuButton).not.toBeNull();
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const showOption: HTMLButtonElement = <HTMLButtonElement> fixture.debugElement.query(By.css('#file-1155-show-file')).nativeElement;
            expect(showOption.disabled).toBeTruthy();
        });
   });
});
