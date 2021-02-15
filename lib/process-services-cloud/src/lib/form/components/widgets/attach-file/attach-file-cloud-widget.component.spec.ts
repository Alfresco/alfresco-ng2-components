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
    DownloadService,
    AppConfigService,
    AlfrescoApiService,
    UploadWidgetContentLinkModel
} from '@alfresco/adf-core';
import {
    allSourceParams,
    contentSourceParam,
    fakeMinimalNode,
    mockNodeId,
    fakePngAnswer,
    onlyLocalParams,
    allSourceWithRootParams,
    allSourceWithWrongAliasParams,
    allSourceWithNoAliasParams,
    allSourceWithoutDestinationFolderPath,
    allSourceWithoutValueProperty,
    fakeNodeWithProperties,
    menuTestSourceParam,
    expectedValues,
    fakeLocalPngAnswer,
    allSourceWithFolderTypeDestinationPath,
    allSourceWithStringTypeDestinationPath,
    allSourceWithStringTypeEmptyValue,
    allSourceWithFolderTypeEmptyValue,
    mockNodeIdBasedOnStringVariableValue
} from '../../../mocks/attach-file-cloud-widget.mock';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentModule, ContentNodeSelectorPanelService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormCloudModule } from '../../../form-cloud.module';
import { TranslateModule } from '@ngx-translate/core';

describe('AttachFileCloudWidgetComponent', () => {
    let widget: AttachFileCloudWidgetComponent;
    let fixture: ComponentFixture<AttachFileCloudWidgetComponent>;
    let element: HTMLInputElement;
    let contentCloudNodeSelectorService: ContentCloudNodeSelectorService;
    let appConfigService: AppConfigService;
    let processCloudContentService: ProcessCloudContentService;
    let formService: FormService;
    let downloadService: DownloadService;
    let alfrescoApiService: AlfrescoApiService;
    let contentNodeSelectorPanelService: ContentNodeSelectorPanelService;
    let apiServiceSpy: jasmine.Spy;
    let contentModelFormFileHandlerSpy: jasmine.Spy;
    let updateFormSpy: jasmine.Spy;
    let contentClickedSpy: jasmine.Spy;

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
        appConfigService = TestBed.inject(
            AppConfigService
        );
        formService = TestBed.inject(FormService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        contentNodeSelectorPanelService = TestBed.inject(ContentNodeSelectorPanelService);
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

    it('should be able to attach files coming from content selector', async () => {
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

    it('should be able to attach files coming from all files source', async () => {
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

    it('should reset the custom models when the component gets destroyed', () => {
        contentNodeSelectorPanelService.customModels = ['mock-value'];
        widget.ngOnDestroy();

        expect(contentNodeSelectorPanelService.customModels).toEqual([]);
    });

    describe('destinationFolderPath', () => {
        let openUploadFileDialogSpy: jasmine.Spy;

        beforeEach(async(() => {
            openUploadFileDialogSpy = spyOn(contentCloudNodeSelectorService, 'openUploadFileDialog').and.returnValue(of([fakeMinimalNode]));
        }));

        it('should be able to fetch nodeId if destinationFolderPath is defined', async () => {
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
            expect(widget.field.params.fileSource.destinationFolderPath.value).toBe('-root-/myfiles');
            expect(widget.rootNodeId).toEqual('mock-node-id');
        });

        it('should be able to use mapped string variable value if the destinationFolderPath set to string type variable', async () => {
            const fetchNodeIdFromRelativePathSpy = spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(mockNodeIdBasedOnStringVariableValue);
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceWithStringTypeDestinationPath;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            const alias = '-root-';
            const opt = { relativePath: '/pathBasedOnStringvariablevalue' };
            expect(fetchNodeIdFromRelativePathSpy).toHaveBeenCalledWith(alias, opt);
            expect(widget.rootNodeId).toEqual('mock-string-value-node-id');
        });

        it('should be able to use default location if mapped string variable value is undefined/empty', async () => {
            const fetchNodeIdFromRelativePathSpy = spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(mockNodeId);
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceWithStringTypeEmptyValue;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            const alias = '-my-';
            const opt = { relativePath: '' };
            expect(fetchNodeIdFromRelativePathSpy).toHaveBeenCalledWith(alias, opt);
            expect(widget.rootNodeId).toEqual('mock-node-id');
        });

        it('should be able to use mapped folder variable value if destinationFolderPath set to folder type variable', async () => {
            const fetchNodeIdFromRelativePathSpy = spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath');
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceWithFolderTypeDestinationPath;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(fetchNodeIdFromRelativePathSpy).not.toHaveBeenCalled();
            expect(widget.rootNodeId).toBe('mockNodeIdBasedOnFolderVariableValue');
        });

        it('should be able to use default location if the mapped folder variable value is undefined/empty', async () => {
            const fetchNodeIdFromRelativePathSpy = spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(mockNodeId);
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> allSourceWithFolderTypeEmptyValue;
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            expect(attachButton).not.toBeNull();

            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            const alias = '-my-';
            const opt = { relativePath: '' };
            expect(fetchNodeIdFromRelativePathSpy).toHaveBeenCalledWith(alias, opt);
            expect(widget.rootNodeId).toBe('mock-node-id');
        });

        it('Should be able to set given alias as rootNodeId if the nodeId of the alias is not fetched from the api', async () => {
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
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-root-', 'single', true, true);
        });

        it('Should set default user alias (-my-) as rootNodeId if destinationFolderPath contains wrong alias and single upload for Alfresco Content + Locale', async () => {
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

            expect(widget.rootNodeId).toEqual('-my-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'single', true, true);
        });

        it('Should set default user alias (-my-) as rootNodeId if destinationFolderPath contains wrong alias and multiple upload for Alfresco Content + Locale', async () => {
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

            expect(widget.rootNodeId).toEqual('-my-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'multiple', true, true);
        });

        it('Should set default user alias (-my-) as rootNodeId if destinationFolderPath does not have alias for Alfresco Content + Locale', async () => {
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

            expect(widget.rootNodeId).toEqual('-my-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'multiple', true, true);
        });

        it('Should set default user alias (-my-) as rootNodeId if destinationFolderPath is not defined', async () => {
            const getAliasAndPathSpy = spyOn(widget, 'getAliasAndRelativePathFromDestinationFolderPath').and.callThrough();
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: [],
                id: 'attach-file-alfresco',
                params: <any> allSourceWithoutDestinationFolderPath
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            attachButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getAliasAndPathSpy).not.toHaveBeenCalled();
            expect(widget.rootNodeId).toEqual('-my-');
        });

        it('Should set default user alias (-my-) as rootNodeId if value property missing from destinationFolderPath', async () => {
            const getAliasAndPathSpy = spyOn(widget, 'getAliasAndRelativePathFromDestinationFolderPath').and.callThrough();
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: [],
                id: 'attach-file-alfresco',
                params: <any> allSourceWithoutValueProperty
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

            attachButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getAliasAndPathSpy).not.toHaveBeenCalled();
            expect(widget.rootNodeId).toEqual('-my-');
        });

        it('should return the application name in case -appname- placeholder is present', async() => {
            appConfigService.config = Object.assign(appConfigService.config, {
                'alfresco-deployed-apps': [
                    {
                      'name': 'fakeapp'
                    }
                  ]
            });
            expect(widget.replaceAppNameAliasWithValue('/myfiles/-appname-/folder')).toBe('/myfiles/fakeapp/folder');
        });

        it('should return the same value in case -appname- placeholder is NOT present', async() => {
            expect(widget.replaceAppNameAliasWithValue('/myfiles/fakepath/folder')).toBe('/myfiles/fakepath/folder');
        });

        describe('FilesSource', () => {
            it('Should be able to fetch nodeId of default user alias (-my-) if fileSource set only to Alfresco Content', async () => {
                const fetchNodeIdFromRelativePathSpy = spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(mockNodeId);
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

                const alias = '-my-';
                const opt = { relativePath: '' };

                expect(fetchNodeIdFromRelativePathSpy).toHaveBeenCalledWith(alias, opt);
                expect(widget.rootNodeId).toEqual('mock-node-id');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('mock-node-id', 'single', false, true);
            });

            it('Should be able to fetch nodeId of default user alias (-my-) if fileSource set to multiple upload for Alfresco Content', async () => {
                const fetchNodeIdFromRelativePathSpy = spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(mockNodeId);
                widget.field = new FormFieldModel(new FormModel(), {
                    type: FormFieldTypes.UPLOAD,
                    value: []
                });
                widget.field.id = 'attach-file-alfresco';
                widget.field.params = <FormFieldMetadata> contentSourceParam;
                widget.field.params.multiple = true;
                fixture.detectChanges();
                await fixture.whenStable();
                const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

                expect(attachButton).not.toBeNull();

                attachButton.click();
                await fixture.whenStable();
                fixture.detectChanges();

                const alias = '-my-';
                const opt = { relativePath: '' };

                expect(fetchNodeIdFromRelativePathSpy).toHaveBeenCalledWith(alias, opt);
                expect(widget.rootNodeId).toEqual('mock-node-id');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('mock-node-id', 'multiple', false, true);
            });

            it('Should be able to set default user alias (-my-) as rootNodeId if the nodeId of the alias is not fetched from the api', async () => {
                widget.field = new FormFieldModel(new FormModel(), {
                    type: FormFieldTypes.UPLOAD,
                    value: []
                });
                widget.field.id = 'attach-file-alfresco';
                widget.field.params = <FormFieldMetadata> contentSourceParam;
                widget.field.params.multiple = false;
                fixture.detectChanges();
                await fixture.whenStable();
                const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');

                expect(attachButton).not.toBeNull();

                attachButton.click();
                await fixture.whenStable();
                fixture.detectChanges();

                expect(widget.rootNodeId).toEqual('-my-');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'single', false, true);
            });

            it('should display tooltip when tooltip is set', async(() => {
                widget.field = new FormFieldModel(new FormModel(), {
                    id: 'attach-file-attach',
                    type: FormFieldTypes.UPLOAD,
                    value: [],
                    tooltip: 'attach file widget'
                });

                fixture.detectChanges();
                const attachElement: any = element.querySelector('#attach-file-attach');
                const tooltip = attachElement.getAttribute('ng-reflect-message');

                expect(tooltip).toEqual(widget.field.tooltip);
            }));
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
        beforeEach(async () => {
            apiServiceSpy = spyOn(alfrescoApiService.getInstance().node, 'getNode').and.returnValue(new Promise(resolve => resolve({entry: fakeNodeWithProperties})));
            spyOn(contentCloudNodeSelectorService, 'fetchNodeIdFromRelativePath').and.returnValue(new Promise(resolve => resolve('fake-properties')));
            spyOn(
                contentCloudNodeSelectorService,
                'openUploadFileDialog'
            ).and.returnValue(of([fakeNodeWithProperties]));
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> menuTestSourceParam;
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
                fixture.debugElement.query(By.css('#file-fake-properties-option-menu'))
                    .nativeElement
            );
            menuButton.click();
            fixture.detectChanges();
            const removeOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-properties-remove'))
                    .nativeElement
            );
            removeOption.click();
            fixture.detectChanges();
            fixture.whenRenderingDone().then(() => {
                expect(element.querySelector('#file-fake-properties-icon')).toBeNull();
                done();
            });
        });

        it('should download file when download is clicked', (done) => {
            spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
            spyOn(processCloudContentService, 'getAuthTicket').and.returnValue(Promise.resolve('ticket'));
            spyOn(downloadService, 'downloadUrl').and.stub();

            fixture.detectChanges();

            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-properties-option-menu'))
                    .nativeElement
            );

            menuButton.click();
            fixture.detectChanges();

            const downloadOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-properties-download-file'))
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
                    expect(fileClicked.nodeId).toBe('fake-properties');
                    done();
                }
            );

            fixture.detectChanges();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(
                    By.css('#file-fake-properties-option-menu')
                ).nativeElement
            );
            menuButton.click();
            fixture.detectChanges();
            const showOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(
                    By.css('#file-fake-properties-show-file')
                ).nativeElement
            );
            showOption.click();
        });

        it('should request form to be updated with metadata when retrieve is clicked', (done) => {
            updateFormSpy = spyOn(formService.updateFormValuesRequested, 'next');
            widget.field.value = [fakeNodeWithProperties];
            fixture.detectChanges();

            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-properties-option-menu'))
                    .nativeElement
            );

            menuButton.click();
            fixture.detectChanges();

            const retrieveMetadataOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-fake-properties-retrieve-file-metadata'))
                    .nativeElement
            );

            retrieveMetadataOption.click();
            expect(apiServiceSpy).toHaveBeenCalledWith(fakeNodeWithProperties.id);

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

    describe('contentModelFormFileHandler', () => {
        beforeEach(async () => {
            apiServiceSpy = spyOn(alfrescoApiService.getInstance().node, 'getNode').and.returnValue(new Promise(resolve => resolve({ entry: fakeNodeWithProperties })));
            contentModelFormFileHandlerSpy = spyOn(widget, 'contentModelFormFileHandler').and.callThrough();
            updateFormSpy = spyOn(formService.updateFormValuesRequested, 'next');
            contentClickedSpy = spyOn(formService.formContentClicked, 'next');

            spyOn(
                contentCloudNodeSelectorService,
                'openUploadFileDialog'
            ).and.returnValue(of([fakeNodeWithProperties]));
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });

            widget.field.id = 'attach-file-alfresco';
            widget.field.params = <FormFieldMetadata> menuTestSourceParam;
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should not be called onInit when widget has no value', (done) => {
            widget.ngOnInit();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should have been called onInit when widget only one file', (done) => {
            widget.field.value = [fakeNodeWithProperties];
            widget.ngOnInit();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
                expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
                expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
                done();
            });
        });

        it('should not be called onInit when widget has more than one file', (done) => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.ngOnInit();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should not be called on remove node if node removed is not the selected one', (done) => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeNodeWithProperties;
            widget.ngOnInit();
            fixture.detectChanges();

            widget.onRemoveAttachFile(fakeMinimalNode);

            fixture.whenStable().then(() => {
                expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should have been called on remove node if node removed is the selected one', (done) => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeNodeWithProperties;
            widget.ngOnInit();
            fixture.detectChanges();

            widget.onRemoveAttachFile(fakeNodeWithProperties);

            fixture.whenStable().then(() => {
                expect(contentModelFormFileHandlerSpy).toHaveBeenCalled();
                expect(updateFormSpy).not.toHaveBeenCalled();
                expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(undefined, widget.field.id));
                done();
            });
        });

        it('should have been called on attach file when value was empty', async () => {
            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');
            expect(attachButton).not.toBeNull();
            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
        });

        it('should not be called on attach file when has a file previously', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.field.params['multiple'] = true;
            widget.ngOnInit();
            await fixture.whenStable();
            fixture.detectChanges();

            const attachButton: HTMLButtonElement = element.querySelector('#attach-file-alfresco');
            expect(attachButton).not.toBeNull();
            attachButton.click();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
        });

        it('should be called when selecting a row if no previous row was selected', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = null;
            widget.ngOnInit();
            await fixture.whenStable();
            fixture.detectChanges();

            widget.onRowClicked(fakeNodeWithProperties);

            await fixture.whenStable();

            expect(widget.selectedNode).toEqual(fakeNodeWithProperties);
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
        });

        it('should be called when selecting a row and previous row was selected', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeMinimalNode;
            widget.ngOnInit();
            await fixture.whenStable();
            fixture.detectChanges();

            widget.onRowClicked(fakeNodeWithProperties);

            await fixture.whenStable();

            expect(widget.selectedNode).toEqual(fakeNodeWithProperties);
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
        });

        it('should be called when deselecting a row', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeNodeWithProperties;
            widget.ngOnInit();
            await fixture.whenStable();
            fixture.detectChanges();

            widget.onRowClicked(fakeNodeWithProperties);

            await fixture.whenStable();

            expect(widget.selectedNode).toBeNull();
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalled();
            expect(updateFormSpy).not.toHaveBeenCalled();
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(null, widget.field.id));
        });
    });
});
