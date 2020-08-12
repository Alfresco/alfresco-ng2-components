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

import { ContentCloudNodeSelectorService } from '../../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../../services/process-cloud-content.service';
import { AttachFileCloudWidgetComponent } from './attach-file-cloud-widget.component';
import {
    setupTestBed,
    FormFieldModel,
    FormModel,
    FormFieldTypes,
    FormFieldMetadata,
    FormService,
    DownloadService
} from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentModule } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Node } from '@alfresco/js-api';
import { FormCloudModule } from '../../../form-cloud.module';
import { TranslateModule } from '@ngx-translate/core';

describe('AttachFileCloudWidgetComponent', () => {
    let widget: AttachFileCloudWidgetComponent;
    let fixture: ComponentFixture<AttachFileCloudWidgetComponent>;
    let element: HTMLInputElement;
    let contentCloudNodeSelectorService: ContentCloudNodeSelectorService;
    let processCloudContentService: ProcessCloudContentService;
    let formService: FormService;
    let downloadService: DownloadService;

    const fakePngAnswer = {
        id: 1155,
        nodeId: 1155,
        name: 'a_png_file.png',
        created: '2017-07-25T17:17:37.099Z',
        createdBy: {
            id: 1001,
            firstName: 'Admin',
            lastName: 'admin',
            email: 'admin'
        },
        relatedContent: false,
        contentAvailable: true,
        link: false,
        mimeType: 'image/png',
        simpleType: 'image',
        previewStatus: 'queued',
        thumbnailStatus: 'queued'
    };

    const onlyLocalParams = {
        fileSource: {
            serviceId: 'local-file'
        }
    };

    const contentSourceParam = {
        fileSource: {
            name: 'mock-alf-content',
            serviceId: 'alfresco-content'
        },
        menuOptions: {
            show: true,
            download: true,
            retrieveMetadata: true,
            remove: true
        }
    };

    const allSourceParams = {
        fileSource: {
            name: 'all file sources',
            serviceId: 'all-file-sources',
            destinationFolderPath: '-root-/myfiles'
        }
    };

    const allSourceWithRootParams = {
        fileSource: {
            name: 'all file sources',
            serviceId: 'all-file-sources',
            destinationFolderPath: '-root-'
        }
    };

    const allSourceWithWrongAliasParams = {
        fileSource: {
            name: 'all file sources',
            serviceId: 'all-file-sources',
            destinationFolderPath: '-wrongAlias-'
        }
    };

    const allSourceWithNoAliasParams = {
        fileSource: {
            name: 'all file sources',
            serviceId: 'all-file-sources',
            destinationFolderPath: '/noalias/createdFolder'
        }
    };

    const fakeMinimalNode: Node = <Node> {
        id: 'fake',
        name: 'fake-name',
        content: {
            mimeType: 'application/pdf'
        },
        properties: {
            'pfx:property_one': 'testValue',
            'pfx:property_two': true
        }
    };

    const mockNodeId = new Promise(function (resolve) {
        resolve('mock-node-id');
    });

    const fakeLocalPngAnswer = {
        id: 1155,
        nodeId: 1155,
        name: 'a_png_file.png',
        created: '2017-07-25T17:17:37.099Z',
        createdBy: {
            id: 1001,
            firstName: 'Admin',
            lastName: 'admin',
            email: 'admin'
        },
        relatedContent: false,
        contentAvailable: true,
        link: false,
        mimeType: 'image/png',
        simpleType: 'image',
        previewStatus: 'queued',
        thumbnailStatus: 'queued'
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            FormCloudModule,
            ContentModule.forRoot()
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(async(() => {
        downloadService = TestBed.inject(DownloadService);
        fixture = TestBed.createComponent(AttachFileCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        processCloudContentService = TestBed.inject(ProcessCloudContentService);
        contentCloudNodeSelectorService = TestBed.inject(
            ContentCloudNodeSelectorService
        );
        formService = TestBed.inject(FormService);
    }));

    afterEach(() => {
        fixture.destroy();
    });

    it('should show up as simple upload when is configured for only local files', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'simple-upload-button';
        widget.field.params = <FormFieldMetadata> allSourceParams;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(
                element.querySelector('#simple-upload-button')
            ).not.toBeNull();
        });
    }));

    it('should show up as content upload when is configured with content', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-alfresco';
        widget.field.params = <FormFieldMetadata> contentSourceParam;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(
                element.querySelector('.adf-attach-widget__menu-upload')
            ).not.toBeNull();
        });
    }));

    it('should be able to attach files coming from content selector', async() => {
        spyOn(
            contentCloudNodeSelectorService,
            'openUploadFileDialog'
        ).and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-alfresco';
        widget.field.params = <FormFieldMetadata> contentSourceParam;
        fixture.detectChanges();
        await fixture.whenStable();
        const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

        expect(attachButton).not.toBeNull();

        attachButton.click();
        await fixture.whenStable();
        fixture.detectChanges();
        const attachedFileName = fixture.debugElement.query(By.css('.adf-file'));
        const fileIcon = element.querySelector('#file-fake-icon');

        expect(attachedFileName.nativeElement.innerText).toEqual('fake-name');
        expect(fileIcon).not.toBeNull();
    });

    it('should be able to attach files coming from all files source', async() => {
        spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(mockNodeId);
        spyOn(
            contentCloudNodeSelectorService,
            'openUploadFileDialog'
        ).and.returnValue(of([fakeMinimalNode]));
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-alfresco';
        widget.field.params = <FormFieldMetadata> allSourceParams;
        fixture.detectChanges();
        await fixture.whenStable();
        const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

        expect(attachButton).not.toBeNull();

        attachButton.click();
        await fixture.whenStable();
        fixture.detectChanges();
        const attachedFileName = fixture.debugElement.query(By.css('.adf-file'));
        const fileIcon = element.querySelector('#file-fake-icon');

        expect(attachedFileName.nativeElement.innerText).toEqual('fake-name');
        expect(fileIcon).not.toBeNull();
    });

    it('should display file list when field has value', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: [fakePngAnswer]
        });
        widget.field.id = 'attach-file-attach';
        widget.field.params = <FormFieldMetadata> onlyLocalParams;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#file-1155-icon')).not.toBeNull();
        });
    }));

    it('should be able to set label property for Attach File widget', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            readOnly: true,
            id: 'attach-file',
            name: 'Label',
            params: onlyLocalParams
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('label').innerText).toEqual('Label');
        });
    });

    describe('destinationFolderPath', () => {
        let openUploadFileDialogSpy: jasmine.Spy;

        beforeEach(async(() => {
            openUploadFileDialogSpy = spyOn(contentCloudNodeSelectorService, 'openUploadFileDialog').and.returnValue(of([fakeMinimalNode]));
        }));

        it('should be able to fetch nodeId if destinationFolderPath is defined', async() => {
            const fetchNodeIdFromRelativePathSpy = spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(mockNodeId);
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceParams;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            const alias = '-root-';
            const opt = { relativePath: '/myfiles' };
            expect(fetchNodeIdFromRelativePathSpy).toHaveBeenCalledWith(alias, opt);
            expect(widget.field.params.fileSource.destinationFolderPath).toBe('-root-/myfiles');
            expect(widget.rootNodeId).toEqual('mock-node-id');
        });

        it('Should be able to set given alias as rootNodeId if the nodeId of the alias is not fetched from the api', async() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceWithRootParams;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(widget.rootNodeId).toEqual('-root-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-root-', 'single', true);
        });

        it('Should be able to set default alias as rootNodeId if destinationFolderPath contains wrong alias', async() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceWithWrongAliasParams;
            widget.field.params.multiple = true;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(widget.rootNodeId).toEqual('-root-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-root-', 'multiple', true);
        });

        it('Should be able to set default alias as rootNodeId if destinationFolderPath does not have alias', async() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceWithNoAliasParams;
            widget.field.params.multiple = true;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(widget.rootNodeId).toEqual('-root-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-root-', 'multiple', true);
        });

        describe('FilesSource', () => {

            it('should be able to set myFiles folderId as rootNodeId if fileSource set only to content', async() => {
                widget.field = new FormFieldModel(new FormModel(), {
                    type: FormFieldTypes.UPLOAD,
                    value: []
                });
                widget.field.id = 'attach-file-alfresco';
                widget.field.params = <FormFieldMetadata> contentSourceParam;
                fixture.detectChanges();
                await fixture.whenStable();
                const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

                expect(attachButton).not.toBeNull();

                attachButton.click();
                await fixture.whenStable();
                fixture.detectChanges();

                expect(widget.rootNodeId).toEqual('-my-');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'single', false);
            });

            it('should be able to set root folderId as rootNodeId if fileSource set to content and local', async() => {
                widget.field = new FormFieldModel(new FormModel(), {
                    type: FormFieldTypes.UPLOAD,
                    value: []
                });
                widget.field.id = 'attach-file-alfresco';
                widget.field.params = <FormFieldMetadata> allSourceWithWrongAliasParams;
                widget.field.params.multiple = false;
                fixture.detectChanges();
                await fixture.whenStable();
                const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

                expect(attachButton).not.toBeNull();

                attachButton.click();
                await fixture.whenStable();
                fixture.detectChanges();

                expect(widget.rootNodeId).toEqual('-root-');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-root-', 'single', true);
            });
        });
    });

    describe('when is readonly', () => {

        it('should show empty list message when there are no file', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                readOnly: true,
                value: []
            });
            widget.field.id = 'empty-test';
            widget.field.params = <FormFieldMetadata> onlyLocalParams;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#adf-attach-empty-list-empty-test')).not.toBeNull();
            });
        }));

        it('should not show empty list message when there are files', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                readOnly: true,
                value: [fakePngAnswer]
            });
            widget.field.id = 'fill-test';
            widget.field.params = <FormFieldMetadata> onlyLocalParams;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#adf-attach-empty-list-fill-test')).toBeNull();
            });
        }));

        it('should not show remove button when there are files attached', async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                readOnly: true,
                value: [fakePngAnswer]
            });
            widget.field.id = 'fill-test';
            widget.field.params = <FormFieldMetadata> onlyLocalParams;

            fixture.detectChanges();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-1155-option-menu'))
                    .nativeElement
            );
            menuButton.click();
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('#file-1155-remove'))).toBeNull();
        }));
    });

    describe('when a file is uploaded', () => {
        beforeEach(async() => {
            spyOn(
                contentCloudNodeSelectorService,
                'openUploadFileDialog'
            ).and.returnValue(of([fakeMinimalNode]));
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> contentSourceParam;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should remove file when remove is clicked', (done) => {
            fixture.detectChanges();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-option-menu'))
                    .nativeElement
            );
            menuButton.click();
            fixture.detectChanges();
            const removeOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-remove'))
                    .nativeElement
            );
            removeOption.click();
            fixture.detectChanges();
            fixture.whenRenderingDone().then(() => {
                expect(element.querySelector('#file-fake-icon')).toBeNull();
                done();
            });
        });

        it('should download file when download is clicked', (done) => {
            spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
            spyOn(processCloudContentService, 'getAuthTicket').and.returnValue(Promise.resolve('ticket'));
            spyOn(downloadService, 'downloadUrl').and.stub();

            fixture.detectChanges();

            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-option-menu'))
                    .nativeElement
            );

            menuButton.click();
            fixture.detectChanges();

            const downloadOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-download-file'))
                    .nativeElement
            );

            downloadOption.click();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(downloadService.downloadUrl).toHaveBeenCalled();
                done();
            });
        });

        it('should preview file when show is clicked', (done) => {
            spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
            formService.formContentClicked.subscribe(
                (fileClicked: any) => {
                    expect(fileClicked.nodeId).toBe('fake');
                    done();
                }
            );

            fixture.detectChanges();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(
                    By.css('#file-fake-option-menu')
                ).nativeElement
            );
            menuButton.click();
            fixture.detectChanges();
            const showOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(
                    By.css('#file-fake-show-file')
                ).nativeElement
            );
            showOption.click();
        });

        it('should request form to be updated with metadata when retrieve is clicked', (done) => {
            const updateFormSpy = spyOn(formService.updateFormValuesRequested, 'next');
            const expectedValues = { pfx_property_one: 'testValue', pfx_property_two: true};

            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-option-menu'))
                    .nativeElement
            );

            menuButton.click();
            fixture.detectChanges();

            const retrieveMetadataOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-retrieve-file-metadata'))
                    .nativeElement
            );

            retrieveMetadataOption.click();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
                done();
            });
        });

        it('should display the default menu options if no options are provided', () => {
            widget.field.params = <FormFieldMetadata> onlyLocalParams;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const inputDebugElement = fixture.debugElement.query(
                    By.css('#attach-file-attach')
                );
                inputDebugElement.triggerEventHandler('change', {
                    target: { files: [fakeLocalPngAnswer] }
                });
                fixture.detectChanges();
                const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                    fixture.debugElement.query(
                        By.css('#file-1155-option-menu')
                    ).nativeElement
                );
                menuButton.click();
                fixture.detectChanges();
                const showOption: HTMLButtonElement = <HTMLButtonElement> (
                    fixture.debugElement.query(
                        By.css('#file-1155-show-file')
                    ).nativeElement
                );
                const downloadOption: HTMLButtonElement = <HTMLButtonElement> (
                    fixture.debugElement.query(By.css('#file-1155-download-file'))
                        .nativeElement
                );
                const retrieveMetadataOption: HTMLButtonElement = <HTMLButtonElement> (
                    fixture.debugElement.query(By.css('#file-1155-retrieve-file-metadata'))
                        .nativeElement
                );
                const removeOption: HTMLButtonElement = <HTMLButtonElement> (
                    fixture.debugElement.query(By.css('#file-1155-remove'))
                        .nativeElement
                );

                expect(showOption).not.toBeNull();
                expect(downloadOption).not.toBeNull();
                expect(retrieveMetadataOption).toBeNull();
                expect(removeOption).not.toBeNull();
            });
        });
    });
});
