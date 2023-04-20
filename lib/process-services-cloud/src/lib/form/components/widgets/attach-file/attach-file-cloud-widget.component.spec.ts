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

import { ContentCloudNodeSelectorService } from '../../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../../services/process-cloud-content.service';
import { AttachFileCloudWidgetComponent } from './attach-file-cloud-widget.component';
import {
    setupTestBed,
    FormFieldModel,
    FormModel,
    FormFieldTypes,
    FormService,
    DownloadService,
    AppConfigService,
    UploadWidgetContentLinkModel,
    LocalizedDatePipe,
    NotificationService
} from '@alfresco/adf-core';
import {
    allSourceParams,
    contentSourceParam,
    fakeMinimalNode,
    mockNodeId,
    fakeLocalPngResponse,
    onlyLocalParams,
    allSourceWithWrongAliasParams,
    allSourceWithNoAliasParams,
    fakeNodeWithProperties,
    menuTestSourceParam,
    expectedValues,
    fakeLocalPngAnswer,
    allSourceWithStringTypeEmptyValue,
    mockNodeIdBasedOnStringVariableValue,
    mockAllFileSourceWithStringVariablePathType,
    mockAllFileSourceWithFolderVariablePathType,
    mockContentFileSource,
    mockAllFileSourceWithStaticPathType,
    formVariables,
    processVariables,
    mockAllFileSourceWithRenamedFolderVariablePathType,
    allSourceParamsWithRelativePath,
    fakeLocalPhysicalRecordResponse,
    displayableCMParams,
    fakeLocalPngHavingCMProperties,
    mockMyNodeId
} from '../../../mocks/attach-file-cloud-widget.mock';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentModule, ContentNodeSelectorPanelService, NewVersionUploaderDataAction, NewVersionUploaderService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { FormCloudModule } from '../../../form-cloud.module';
import { TranslateModule } from '@ngx-translate/core';

const mockNodeToBeVersioned: any = ({
    isFile: true,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: '2017-05-24T15:08:55.640Z',
    nodeType: 'cm:content',
    content: {
        mimeType: 'application/rtf',
        mimeTypeName: 'Rich Text Format',
        sizeInBytes: 14530,
        encoding: 'UTF-8'
    },
    parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
    createdAt: '2017-05-24T15:08:55.640Z',
    path: {
        name: '/Company Home/Guest Home',
        isComplete: true,
        elements: [{
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
        }, { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }]
    },
    isFolder: false,
    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
    name: 'b_txt_file.rtf',
    id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
    properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
    allowableOperations: ['delete', 'update']
});

describe('AttachFileCloudWidgetComponent', () => {
    let widget: AttachFileCloudWidgetComponent;
    let fixture: ComponentFixture<AttachFileCloudWidgetComponent>;
    let element: HTMLInputElement;
    let contentCloudNodeSelectorService: ContentCloudNodeSelectorService;
    let appConfigService: AppConfigService;
    let processCloudContentService: ProcessCloudContentService;
    let formService: FormService;
    let downloadService: DownloadService;
    let contentNodeSelectorPanelService: ContentNodeSelectorPanelService;
    let apiServiceSpy: jasmine.Spy;
    let contentModelFormFileHandlerSpy: jasmine.Spy;
    let updateFormSpy: jasmine.Spy;
    let contentClickedSpy: jasmine.Spy;
    let openUploadFileDialogSpy: jasmine.Spy;
    let localizedDataPipe: LocalizedDatePipe;
    let newVersionUploaderService: NewVersionUploaderService;
    let notificationService: NotificationService;

    const createUploadWidgetField = (form: FormModel, fieldId: string, value?: any, params?: any, multiple?: boolean, name?: string, readOnly?: boolean) => {
        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.UPLOAD,
            value,
            id: fieldId,
            readOnly,
            name,
            tooltip: 'attach file widget',
            params: { ...params, multiple }
        });
    };

    const clickOnAttachFileWidget = (id: string) => {
        const attachButton: HTMLButtonElement = element.querySelector(`#${id}`);
        attachButton.click();
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

    beforeEach(() => {
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
        contentNodeSelectorPanelService = TestBed.inject(ContentNodeSelectorPanelService);
        openUploadFileDialogSpy = spyOn(contentCloudNodeSelectorService, 'openUploadFileDialog').and.returnValue(of([fakeMinimalNode]));
        localizedDataPipe = new LocalizedDatePipe();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show up as simple upload when is configured for only local files', async () => {
        createUploadWidgetField(new FormModel(), 'simple-upload-button', [], allSourceParams);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#simple-upload-button')).not.toBeNull();
    });

    it('should show up as content upload when is configured with content', async () => {
        createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], contentSourceParam);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('.adf-attach-widget__menu-upload')).not.toBeNull();
    });

    it('should be able to attach files coming from content selector', async () => {
        createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], contentSourceParam);
        spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);
        fixture.detectChanges();
        await fixture.whenStable();
        clickOnAttachFileWidget('attach-file-alfresco');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const attachedFileName = fixture.debugElement.query(By.css('.adf-file'));
        const fileIcon = element.querySelector('#file-fake-icon');

        expect(attachedFileName.nativeElement.innerText).toEqual('fake-name');
        expect(fileIcon).not.toBeNull();
    });

    it('should be able to attach files coming from all files source', async () => {
        spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);
        createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceParams);
        fixture.detectChanges();
        await fixture.whenStable();
        clickOnAttachFileWidget('attach-file-alfresco');
        await fixture.whenStable();
        fixture.detectChanges();
        const attachedFileName = fixture.debugElement.query(By.css('.adf-file'));
        const fileIcon = element.querySelector('#file-fake-icon');

        expect(attachedFileName.nativeElement.innerText).toEqual('fake-name');
        expect(fileIcon).not.toBeNull();
    });

    it('should display file list when field has value', async () => {
        createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [fakeLocalPngResponse], onlyLocalParams);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#file-1155-icon')).not.toBeNull();
    });

    it('should be able to set label property for Attach File widget', async () => {
        createUploadWidgetField(new FormModel(), 'attach-file', [], onlyLocalParams, false, 'Label', true);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('label').innerText).toEqual('Label');
    });

    it('should reset the custom models when the component gets destroyed', () => {
        contentNodeSelectorPanelService.customModels = ['mock-value'];
        widget.ngOnDestroy();

        expect(contentNodeSelectorPanelService.customModels).toEqual([]);
    });

    describe('when is required', () => {

        it('should be able to display label with asterisk', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.UPLOAD,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });

    describe('Upload widget with displayable ContentModel properties', () => {

        it('should display CM Properties if the file contains value', async () => {
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [fakeLocalPngHavingCMProperties], displayableCMParams);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#file-1155-icon')).not.toBeNull();
            expect(element.querySelector('#fileProperty-1155-name').textContent).toBe('Alex');
            expect(element.querySelector('#fileProperty-1155-age').textContent).toBe('34');
        });

        it('should display defaultValue if the file does not contain value for respective displayableCMProperties', async () => {
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [fakeLocalPngResponse], displayableCMParams);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#fileProperty-1155-name').textContent).toBe('Bob');
            expect(element.querySelector('#fileProperty-1155-age').textContent).toBe('--');
        });

        it('should not display CM Properties in table if the field does not contain displayableCMProperties', async () => {
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [fakeLocalPngHavingCMProperties], allSourceParams);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#fileProperty-1155-name')).toBeNull();
            expect(element.querySelector('#fileProperty-1155-age')).toBeNull();
        });

        it('should display date property in converted form based on dataType', async () => {
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [fakeLocalPngHavingCMProperties], displayableCMParams);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#fileProperty-1155-dob').textContent).toBe(localizedDataPipe.transform(new Date()));
        });
    });

    describe('destinationFolderPath', () => {

        it('should be able to fetch nodeId if destinationFolderPath is defined', async () => {
            const getNodeIdFromPathSpy = spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);

            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceParams);
            fixture.detectChanges();
            await fixture.whenStable();

            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            const mockDestinationPath = { alias: '-root-', path: '/myfiles' };

            expect(getNodeIdFromPathSpy).toHaveBeenCalledWith(mockDestinationPath);
            expect(widget.field.params.fileSource.destinationFolderPath.value).toBe('-root-/myfiles');
            expect(widget.rootNodeId).toEqual('mock-node-id');
        });

        it('should be able to fetch relativePath nodeId if the given relative path is correct', async () => {
            const getNodeIdFromPathSpy = spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);

            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceParamsWithRelativePath);
            fixture.detectChanges();
            await fixture.whenStable();

            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            const mockDestinationPath = { alias: '-shared-', path: '/myfiles' };

            expect(getNodeIdFromPathSpy).toHaveBeenCalledWith(mockDestinationPath);
            expect(widget.rootNodeId).toEqual('mock-node-id');
        });

        it('should be able to use mapped string variable value if the destinationFolderPath set to string type variable', async () => {
            const getNodeIdFromPathSpy = spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeIdBasedOnStringVariableValue);

            const form = new FormModel({ formVariables, processVariables });
            createUploadWidgetField(form, 'attach-file-alfresco', [], mockAllFileSourceWithStringVariablePathType);
            fixture.detectChanges();
            await fixture.whenStable();
            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            const mockDestinationPath = { alias: '-root-', path: '/pathBasedOnStringvariablevalue' };

            expect(getNodeIdFromPathSpy).toHaveBeenCalledWith(mockDestinationPath);
            expect(widget.rootNodeId).toEqual('mock-string-value-node-id');
        });

        it('should be able to use default location if mapped string variable value is undefined/empty', async () => {
            const getNodeIdFromPathSpy = spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceWithStringTypeEmptyValue);
            fixture.detectChanges();
            await fixture.whenStable();

            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            const mockDestinationPath = { alias: '-my-', path: undefined };

            expect(getNodeIdFromPathSpy).toHaveBeenCalledWith(mockDestinationPath);
            expect(widget.rootNodeId).toEqual('mock-node-id');
        });

        it('should be able to use mapped folder variable value if destinationFolderPath set to folder type variable', async () => {
            const verifyFolderSpy = spyOn(contentCloudNodeSelectorService, 'getNodeIdFromFolderVariableValue').and.returnValue(mockNodeId);
            const form = new FormModel({ formVariables, processVariables });
            createUploadWidgetField(form, 'attach-file-alfresco', [], mockAllFileSourceWithFolderVariablePathType);
            fixture.detectChanges();
            await fixture.whenStable();
            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(verifyFolderSpy).toHaveBeenCalled();
            expect(widget.rootNodeId).toBe('mock-node-id');
        });

        it('Should set default user alias (-my-) as rootNodeId if destinationFolderPath contains wrong alias and single upload for Alfresco Content + Locale', async () => {
            spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockMyNodeId);
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceWithWrongAliasParams, false);
            fixture.detectChanges();
            await fixture.whenStable();
            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.rootNodeId).toEqual('-my-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'single', true, true);
        });

        it('Should set default user alias (-my-) as rootNodeId if destinationFolderPath contains wrong alias and multiple upload for Alfresco Content + Locale', async () => {
            spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockMyNodeId);
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceWithWrongAliasParams, true);
            fixture.detectChanges();
            await fixture.whenStable();
            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.rootNodeId).toEqual('-my-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'multiple', true, true);
        });

        it('Should set default user alias (-my-) as rootNodeId if destinationFolderPath does not have alias for Alfresco Content + Locale', async () => {
            spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockMyNodeId);
            createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceWithNoAliasParams, true);
            fixture.detectChanges();
            await fixture.whenStable();
            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.rootNodeId).toEqual('-my-');
            expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'multiple', true, true);
        });

        it('should return the application name in case -appname- placeholder is present', () => {
            appConfigService.config = Object.assign(appConfigService.config, {
                'alfresco-deployed-apps': [
                    {
                        name: 'fakeapp'
                    }
                ]
            });

            expect(widget.replaceAppNameAliasWithValue('/myfiles/-appname-/folder')).toBe('/myfiles/fakeapp/folder');
        });

        it('should return the same value in case -appname- placeholder is NOT present', () => {
            expect(widget.replaceAppNameAliasWithValue('/myfiles/fakepath/folder')).toBe('/myfiles/fakepath/folder');
        });

        describe('FilesSource', () => {
            it('Should be able to fetch nodeId of default user alias (-my-) if fileSource set only to Alfresco Content', async () => {
                const getNodeIdFromPathSpy = spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);
                createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], contentSourceParam, false);
                fixture.detectChanges();
                await fixture.whenStable();
                clickOnAttachFileWidget('attach-file-alfresco');
                fixture.detectChanges();
                await fixture.whenStable();

                const mockDestinationPath = { alias: '-my-', path: undefined };

                expect(getNodeIdFromPathSpy).toHaveBeenCalledWith(mockDestinationPath);
                expect(widget.rootNodeId).toEqual('mock-node-id');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('mock-node-id', 'single', false, true);
            });

            it('Should be able to fetch nodeId of default user alias (-my-) if fileSource set to multiple upload for Alfresco Content', async () => {
                const getNodeIdFromPathSpy = spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);

                createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], contentSourceParam, true);
                fixture.detectChanges();
                await fixture.whenStable();
                clickOnAttachFileWidget('attach-file-alfresco');
                fixture.detectChanges();
                await fixture.whenStable();

                const mockDestinationPath = { alias: '-my-', path: undefined };

                expect(getNodeIdFromPathSpy).toHaveBeenCalledWith(mockDestinationPath);
                expect(widget.rootNodeId).toEqual('mock-node-id');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('mock-node-id', 'multiple', false, true);
            });

            it('Should be able to set default user alias (-my-) as rootNodeId if the nodeId of the alias is not fetched from the api', async () => {
                spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockMyNodeId);
                createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], contentSourceParam, false);
                fixture.detectChanges();
                await fixture.whenStable();
                clickOnAttachFileWidget('attach-file-alfresco');
                fixture.detectChanges();
                await fixture.whenStable();

                expect(widget.rootNodeId).toEqual('-my-');
                expect(openUploadFileDialogSpy).toHaveBeenCalledWith('-my-', 'single', false, true);
            });
        });
    });

    describe('when is readonly', () => {

        it('should show empty list message when there are no file', async () => {
            createUploadWidgetField(new FormModel(), 'empty-test', [], onlyLocalParams, null, null, true);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#adf-attach-empty-list-empty-test')).not.toBeNull();
        });

        it('should not show empty list message when there are files', async () => {
            createUploadWidgetField(new FormModel(), 'fill-test', [fakeLocalPngResponse], onlyLocalParams, null, null, true);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('#adf-attach-empty-list-fill-test')).toBeNull();
        });

        it('should not show remove button when there are files attached', async () => {
            createUploadWidgetField(new FormModel(), 'fill-test', [fakeLocalPngResponse], onlyLocalParams, null, null, true);

            fixture.detectChanges();
            await fixture.whenStable();

            const menuButton = fixture.debugElement.query(By.css('#file-1155-option-menu')).nativeElement as HTMLButtonElement;
            menuButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#file-1155-remove'))).toBeNull();
        });

        it('should not show any action when the attached file is a physical record', async () => {
            createUploadWidgetField(new FormModel(), 'fill-test', [fakeLocalPhysicalRecordResponse], onlyLocalParams, null, null, true);

            fixture.detectChanges();
            await fixture.whenStable();

            const menuButton = fixture.debugElement.query(By.css('#file-1155-option-menu'));

            expect(menuButton).toBeNull();
        });
    });

    describe('when a file is uploaded', () => {
        beforeEach(async () => {
            apiServiceSpy = spyOn(widget['nodesApi'], 'getNode').and.returnValue(new Promise(resolve => resolve({ entry: fakeNodeWithProperties })));
            spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(new Promise(resolve => resolve('fake-properties')));
            openUploadFileDialogSpy.and.returnValue(of([fakeNodeWithProperties]));
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-alfresco';
            widget.field.params = menuTestSourceParam;

            fixture.detectChanges();
            await fixture.whenStable();

            clickOnAttachFileWidget('attach-file-alfresco');

            fixture.detectChanges();
            await fixture.whenStable();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should remove file when remove is clicked', async () => {
            fixture.detectChanges();
            const menuButton = fixture.debugElement.query(By.css('#file-fake-properties-option-menu')).nativeElement as HTMLButtonElement;
            menuButton.click();
            fixture.detectChanges();
            const removeOption = fixture.debugElement.query(By.css('#file-fake-properties-remove')).nativeElement as HTMLButtonElement;
            removeOption.click();
            fixture.detectChanges();
            await fixture.whenRenderingDone();
            expect(element.querySelector('#file-fake-properties-icon')).toBeNull();
        });

        it('should download file when download is clicked', (done) => {
            spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
            spyOn(processCloudContentService, 'getAuthTicket').and.returnValue(Promise.resolve('ticket'));
            spyOn(downloadService, 'downloadUrl').and.stub();

            fixture.detectChanges();

            const menuButton = fixture.debugElement.query(By.css('#file-fake-properties-option-menu')).nativeElement as HTMLButtonElement;
            menuButton.click();
            fixture.detectChanges();

            const downloadOption = fixture.debugElement.query(By.css('#file-fake-properties-download-file')).nativeElement as HTMLButtonElement;
            downloadOption.click();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(downloadService.downloadUrl).toHaveBeenCalled();
                done();
            });
        });

        it('should preview file when show is clicked', async () => {
            spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
            await formService.formContentClicked.subscribe(
                (fileClicked: any) => {
                    expect(fileClicked.nodeId).toBe('fake-properties');
                }
            );

            fixture.detectChanges();
            const menuButton = fixture.debugElement.query(By.css('#file-fake-properties-option-menu')).nativeElement as HTMLButtonElement;
            menuButton.click();
            fixture.detectChanges();
            const showOption = fixture.debugElement.query(By.css('#file-fake-properties-show-file')).nativeElement as HTMLButtonElement;
            showOption.click();
        });

        it('should request form to be updated with metadata when retrieve is clicked', async () => {
            updateFormSpy = spyOn(formService.updateFormValuesRequested, 'next');
            widget.field.value = [fakeNodeWithProperties];
            fixture.detectChanges();

            const menuButton = fixture.debugElement.query(By.css('#file-fake-properties-option-menu')).nativeElement as HTMLButtonElement;
            menuButton.click();
            fixture.detectChanges();

            const retrieveMetadataOption = fixture.debugElement.query(By.css('#file-fake-properties-retrieve-file-metadata')).nativeElement as HTMLButtonElement;
            retrieveMetadataOption.click();
            expect(apiServiceSpy).toHaveBeenCalledWith(fakeNodeWithProperties.id);

            fixture.detectChanges();
            await fixture.whenStable();
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
        });

        it('should display the default menu options if no options are provided', async () => {
            widget.field.params = onlyLocalParams;
            const inputDebugElement = fixture.debugElement.query(
                By.css('#attach-file-alfresco')
            );
            inputDebugElement.triggerEventHandler('change', {
                target: { files: [fakeLocalPngAnswer] }
            });
            fixture.detectChanges();
            await fixture.whenStable();

            const menuButton = fixture.debugElement.query(By.css('#file-fake-properties-option-menu')).nativeElement as HTMLButtonElement;
            menuButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            const showOption = fixture.debugElement.query(By.css('#file-fake-properties-show-file'));
            const downloadOption = fixture.debugElement.query(By.css('#file-fake-properties-download-file'));
            const retrieveMetadataOption = fixture.debugElement.query(By.css('#file-fake-properties-retrieve-file-metadata'));
            const removeOption = fixture.debugElement.query(By.css('#file-fake-properties-remove'));

            expect(showOption).not.toBeNull();
            expect(downloadOption).not.toBeNull();
            expect(retrieveMetadataOption).toBeNull();
            expect(removeOption).not.toBeNull();
        });
    });

    describe('contentModelFormFileHandler', () => {
        beforeEach(async () => {
            apiServiceSpy = spyOn(widget['nodesApi'], 'getNode').and.returnValue(new Promise(resolve => resolve({ entry: fakeNodeWithProperties })));
            contentModelFormFileHandlerSpy = spyOn(widget, 'contentModelFormFileHandler').and.callThrough();
            updateFormSpy = spyOn(formService.updateFormValuesRequested, 'next');
            contentClickedSpy = spyOn(formService.formContentClicked, 'next');
            openUploadFileDialogSpy.and.returnValue(of([fakeNodeWithProperties]));
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });

            widget.field.id = 'attach-file-alfresco';
            widget.field.params = menuTestSourceParam;
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should not be called onInit when widget has no value', async () => {
            widget.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();
            expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
        });

        it('should have been called onInit when widget only one file', async () => {
            widget.field.value = [fakeNodeWithProperties];
            widget.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
        });

        it('should not be called onInit when widget has more than one file', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];

            fixture.detectChanges();
            await fixture.whenStable();
            expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
        });

        it('should not be called on remove node if node removed is not the selected one', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeNodeWithProperties;

            fixture.detectChanges();

            widget.onRemoveAttachFile(fakeMinimalNode);

            await fixture.whenStable();
            expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
        });

        it('should have been called on remove node if node removed is the selected one', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeNodeWithProperties;
            fixture.detectChanges();

            widget.onRemoveAttachFile(fakeNodeWithProperties);

            await fixture.whenStable();
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalled();
            expect(updateFormSpy).not.toHaveBeenCalled();
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(undefined, widget.field.id));
        });

        it('should have been called on attach file when value was empty', async () => {
            spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);
            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
        });

        it('should not be called on attach file when has a file previously', async () => {
            spyOn(contentCloudNodeSelectorService, 'getNodeIdFromPath').and.returnValue(mockNodeId);
            widget.field.value = [fakeMinimalNode];

            clickOnAttachFileWidget('attach-file-alfresco');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(contentModelFormFileHandlerSpy).not.toHaveBeenCalled();
        });

        it('should be called when selecting a row if no previous row was selected', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = null;

            widget.onRowClicked(fakeNodeWithProperties);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.selectedNode).toEqual(fakeNodeWithProperties);
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
        });

        it('should be called when selecting a row and previous row was selected', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeMinimalNode;

            widget.onRowClicked(fakeNodeWithProperties);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.selectedNode).toEqual(fakeNodeWithProperties);
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
            expect(updateFormSpy).toHaveBeenCalledWith(expectedValues);
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(fakeNodeWithProperties, widget.field.id));
        });

        it('should be called when deselecting a row', async () => {
            widget.field.value = [fakeNodeWithProperties, fakeMinimalNode];
            widget.selectedNode = fakeNodeWithProperties;

            widget.onRowClicked(fakeNodeWithProperties);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(widget.selectedNode).toBeNull();
            expect(contentModelFormFileHandlerSpy).toHaveBeenCalled();
            expect(updateFormSpy).not.toHaveBeenCalled();
            expect(contentClickedSpy).toHaveBeenCalledWith(new UploadWidgetContentLinkModel(null, widget.field.id));
        });
    });

    describe('Upload widget with destination folder path params', () => {
        let form: FormModel;

        beforeEach(() => {
            form = new FormModel({
                formVariables,
                processVariables
            });
        });

        it('it should get a destination folder path value from a string variable', () => {
            createUploadWidgetField(form, 'attach-file-attach', [], mockAllFileSourceWithStringVariablePathType);
            fixture.detectChanges();

            expect(widget.field.params.fileSource.destinationFolderPath.type).toBe('string');
            expect(widget.field.params.fileSource.destinationFolderPath.value).toBe('-root-/pathBasedOnStringvariablevalue');
        });

        it('should be able to fetch the destinationFolderPath from the default value of a form variable', () => {
            form.processVariables = [];
            form.variables = formVariables;

            createUploadWidgetField(form, 'attach-file-attach', [], mockAllFileSourceWithStringVariablePathType);
            fixture.detectChanges();

            expect(widget.field.params.fileSource.destinationFolderPath.value).toBe('mock destination folder path');
        });

        it('it should get a destination folder path value from a folder variable', () => {
            createUploadWidgetField(form, 'attach-file-attach', [], mockAllFileSourceWithFolderVariablePathType);
            fixture.detectChanges();

            expect(widget.field.params.fileSource.destinationFolderPath.type).toBe('folder');
            expect(widget.field.params.fileSource.destinationFolderPath.value).toBe('mock-folder-id');
        });

        it('it should set destination folder path value to undefined if mapped variable deleted/renamed', () => {
            createUploadWidgetField(form, 'attach-file-attach', [], mockAllFileSourceWithRenamedFolderVariablePathType);
            fixture.detectChanges();

            expect(widget.field.params.fileSource.destinationFolderPath.type).toBe('folder');
            expect(widget.field.params.fileSource.destinationFolderPath.value).toBeUndefined();
        });

        it('it should not have destination folder path property if the file source set to content source', () => {
            createUploadWidgetField(form, 'attach-file-attach', [], mockContentFileSource);
            fixture.detectChanges();

            expect(widget.field.params.fileSource['destinationFolderPath']).toBeUndefined();
        });

        it('it should not call getProcessVariableValue if the file source set to content source', () => {
            createUploadWidgetField(form, 'attach-file-attach', [], mockContentFileSource);
            fixture.detectChanges();
            const getProcessVariableValueSpy = spyOn(widget.field.form, 'getProcessVariableValue');

            expect(getProcessVariableValueSpy).not.toHaveBeenCalled();
        });

        it('it should not call getProcessVariableValue if the destination folder path type set to static type', () => {
            createUploadWidgetField(form, 'attach-file-attach', [], mockAllFileSourceWithStaticPathType);
            fixture.detectChanges();
            const getProcessVariableValueSpy = spyOn(widget.field.form, 'getProcessVariableValue');

            expect(widget.field.params.fileSource.destinationFolderPath.type).toBe('value');
            expect(getProcessVariableValueSpy).not.toHaveBeenCalled();
        });
    });

    describe('onUploadNewFileVersion', () => {
        let spyOnOpenUploadNewVersionDialog: jasmine.Spy;
        let spyOnReplaceOldFileVersionWithNew: jasmine.Spy;
        let spyOnShowError: jasmine.Spy;

        beforeEach(() => {
            notificationService = TestBed.inject(NotificationService);
            newVersionUploaderService = TestBed.inject(NewVersionUploaderService);
            spyOnOpenUploadNewVersionDialog = spyOn(newVersionUploaderService, 'openUploadNewVersionDialog')
                .and.returnValue(of({ action: NewVersionUploaderDataAction.refresh }));
            spyOnReplaceOldFileVersionWithNew = spyOn(widget, 'replaceOldFileVersionWithNew');
            spyOnShowError = spyOn(notificationService, 'showError');
        });

        it('Should open new version uploader dialog', async () => {
            await fixture.whenStable();
            widget.onUploadNewFileVersion(mockNodeToBeVersioned);
            expect(spyOnOpenUploadNewVersionDialog).toHaveBeenCalledWith(mockNodeToBeVersioned);
        });

        it('Should not replace old file version with the new one if dialog returned action is not upload', async () => {
            await fixture.whenStable();
            widget.onUploadNewFileVersion(mockNodeToBeVersioned);
            expect(spyOnReplaceOldFileVersionWithNew).not.toHaveBeenCalled();
        });

        it('Should replace old file version with the new one if dialog returned action is upload', async () => {
            spyOnOpenUploadNewVersionDialog.and.returnValue(of({ action: NewVersionUploaderDataAction.upload }));
            await fixture.whenStable();
            widget.onUploadNewFileVersion(mockNodeToBeVersioned);
            expect(spyOnReplaceOldFileVersionWithNew).toHaveBeenCalledTimes(1);
        });

        it('Should show notification error if new version uploader dialog return error', async () => {
            const mockError = {value: 'Upload error'};
            spyOnOpenUploadNewVersionDialog.and.returnValue(throwError(mockError));
            await fixture.whenStable();
            widget.onUploadNewFileVersion(mockNodeToBeVersioned);
            expect(spyOnReplaceOldFileVersionWithNew).not.toHaveBeenCalled();
            expect(spyOnShowError).toHaveBeenCalledWith(mockError.value);
        });

    });

    describe('when tooltip is set', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.UPLOAD,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const attachButton = fixture.nativeElement.querySelector('button');
            attachButton.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip')).nativeElement;
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement.textContent.trim()).toBe('my custom tooltip');
          });

        it('should hide tooltip', async () => {
            const attachButton = fixture.nativeElement.querySelector('button');
            attachButton.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            attachButton.dispatchEvent(new Event('mouseleave'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip'));
            expect(tooltipElement).toBeFalsy();
        });
    });
});
