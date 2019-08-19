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

import { ContentCloudNodeSelectorService } from '../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../services/process-cloud-content.service';
import { AttachFileCloudWidgetComponent } from './attach-file-cloud-widget.component';
import {
    setupTestBed,
    FormFieldModel,
    FormModel,
    FormFieldTypes,
    FormFieldMetadata,
    FormService
} from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentModule } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Node } from '@alfresco/js-api';
import { FormCloudModule } from '../../form-cloud.module';

describe('AttachFileCloudWidgetComponent', () => {
    let widget: AttachFileCloudWidgetComponent;
    let fixture: ComponentFixture<AttachFileCloudWidgetComponent>;
    let element: HTMLInputElement;
    let contentCloudNodeSelectorService: ContentCloudNodeSelectorService;
    let processCloudContentService: ProcessCloudContentService;
    let formService: FormService;

    const fakePngAnswer = {
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
        }
    };

    const fakeMinimalNode: Node = <Node> {
        id: 'fake',
        name: 'fake-name',
        content: {
            mimeType: 'application/pdf'
        }
    };

    const fakeLocalPngAnswer = {
        id: 1155,
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
            ProcessServiceCloudTestingModule,
            FormCloudModule,
            ContentModule.forRoot()
        ],
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(AttachFileCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        processCloudContentService = TestBed.get(ProcessCloudContentService);
        contentCloudNodeSelectorService = TestBed.get(
            ContentCloudNodeSelectorService
        );
        formService = TestBed.get(FormService);
    }));

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to create the widget', () => {
        expect(widget).not.toBeNull();
    });

    it('should show up as simple upload when is configured for only local files', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'simple-upload-button';
        widget.field.params = <FormFieldMetadata> onlyLocalParams;
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

    it('should be able to attach files coming from content selector', async(() => {
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
        fixture.whenStable().then(() => {
            const attachButton: HTMLButtonElement = element.querySelector(
                '#attach-file-alfresco'
            );
            expect(attachButton).not.toBeNull();
            attachButton.click();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                fixture.debugElement
                    .query(By.css('#attach-mock-alf-content'))
                    .nativeElement.click();
                fixture.detectChanges();
                expect(element.querySelector('#file-fake-icon')).not.toBeNull();
            });
        });
    }));

    it('should be able to upload files from local source', async(() => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: []
        });
        widget.field.id = 'attach-file-local';
        widget.field.params = <FormFieldMetadata> onlyLocalParams;
        spyOn(
            processCloudContentService,
            'createTemporaryRawRelatedContent'
        ).and.returnValue(of(fakeLocalPngAnswer));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const inputDebugElement = fixture.debugElement.query(
                By.css('#attach-file-local')
            );
            inputDebugElement.triggerEventHandler('change', {
                target: { files: [fakeLocalPngAnswer] }
            });
            fixture.detectChanges();
            expect(element.querySelector('#file-1155-icon')).not.toBeNull();
        });
    }));

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

    describe('when a file is uploaded', () => {
        beforeEach(async(() => {
            widget.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: []
            });
            widget.field.id = 'attach-file-attach';
            widget.field.params = <FormFieldMetadata> onlyLocalParams;
            spyOn(
                processCloudContentService,
                'createTemporaryRawRelatedContent'
            ).and.returnValue(of(fakeLocalPngAnswer));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const inputDebugElement = fixture.debugElement.query(
                    By.css('#attach-file-attach')
                );
                inputDebugElement.triggerEventHandler('change', {
                    target: { files: [fakeLocalPngAnswer] }
                });
                fixture.detectChanges();
                expect(element.querySelector('#file-1155-icon')).not.toBeNull();
            });
        }));

        it('should remove file when remove is clicked', (done) => {
            fixture.detectChanges();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-1155-option-menu'))
                    .nativeElement
            );
            menuButton.click();
            fixture.detectChanges();
            const removeOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-1155-remove'))
                    .nativeElement
            );
            removeOption.click();
            fixture.detectChanges();
            fixture.whenRenderingDone().then(() => {
                expect(element.querySelector('#file-1155-icon')).toBeNull();
                done();
            });
        });

        it('should download file when download is clicked', (done) => {
            spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
            spyOn(processCloudContentService, 'downloadNodeContent').and.stub();
            fixture.detectChanges();
            const menuButton: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-1155-option-menu'))
                    .nativeElement
            );
            menuButton.click();
            fixture.detectChanges();
            const downloadOption: HTMLButtonElement = <HTMLButtonElement> (
                fixture.debugElement.query(By.css('#file-1155-download-file'))
                    .nativeElement
            );
            downloadOption.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(processCloudContentService.downloadNodeContent).toHaveBeenCalled();
                done();
            });
        });

        it('should preview file when show is clicked', (done) => {
            spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
            formService.formContentClicked.subscribe(
                (fileClicked: any) => {
                    expect(fileClicked.nodeId).toBe(1155);
                    done();
                }
            );

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
            showOption.click();
        });
    });
});
