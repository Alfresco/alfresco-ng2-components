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

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
    FormService,
    FormFieldTypes,
    FormModel,
    FormFieldModel,
    setupTestBed,
    CoreTestingModule
} from '@alfresco/adf-core';
import { UploadWidgetComponent } from './upload.widget';
import { TranslateModule } from '@ngx-translate/core';
import { RelatedContentRepresentation } from '@alfresco/js-api';
import { ProcessContentService } from '../../services/process-content.service';

const fakePngAnswer = new RelatedContentRepresentation({
    id: 1155,
    name: 'a_png_file.png',
    created: '2017-07-25T17:17:37.099Z',
    createdBy: {id: 1001, firstName: 'Admin', lastName: 'admin', email: 'admin'},
    relatedContent: false,
    contentAvailable: true,
    link: false,
    mimeType: 'image/png',
    simpleType: 'image',
    previewStatus: 'queued',
    thumbnailStatus: 'queued'
});

const fakeJpgAnswer = {
    id: 1156,
    name: 'a_jpg_file.jpg',
    created: '2017-07-25T17:17:37.118Z',
    createdBy: {id: 1001, firstName: 'Admin', lastName: 'admin', email: 'admin'},
    relatedContent: false,
    contentAvailable: true,
    link: false,
    mimeType: 'image/jpeg',
    simpleType: 'image',
    previewStatus: 'queued',
    thumbnailStatus: 'queued'
};

describe('UploadWidgetComponent', () => {

    const fakeCreationFile = (name: string, id: string | number) => ({
        id,
        name,
        created: '2017-07-25T17:17:37.118Z',
        createdBy: {id: 1001, firstName: 'Admin', lastName: 'admin', email: 'admin'},
        relatedContent: false,
        contentAvailable: true,
        link: false,
        mimeType: 'image/jpeg',
        simpleType: 'image',
        previewStatus: 'queued',
        thumbnailStatus: 'queued'
    });

    let contentService: ProcessContentService;

    const filePngFake = new File(['fakePng'], 'file-fake.png', {type: 'image/png'});
    const filJpgFake = new File(['fakeJpg'], 'file-fake.jpg', {type: 'image/jpg'});

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    describe('when template is ready', () => {
        let uploadWidgetComponent: UploadWidgetComponent;
        let fixture: ComponentFixture<UploadWidgetComponent>;
        let element: HTMLInputElement;
        let debugElement: DebugElement;
        let inputElement: HTMLInputElement;
        let formServiceInstance: FormService;

        beforeEach(() => {
            fixture = TestBed.createComponent(UploadWidgetComponent);
            uploadWidgetComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            debugElement = fixture.debugElement;
            contentService = TestBed.inject(ProcessContentService);
        });

        it('should setup with field data', () => {
            const fileName = 'hello world';
            const encodedFileName = encodeURI(fileName);

            uploadWidgetComponent.field = new FormFieldModel(null, {
                type: FormFieldTypes.UPLOAD,
                value: [
                    {name: encodedFileName}
                ]
            });

            uploadWidgetComponent.ngOnInit();
            expect(uploadWidgetComponent.hasFile).toBeTruthy();
        });

        it('should require form field to setup', () => {
            uploadWidgetComponent.field = null;
            uploadWidgetComponent.ngOnInit();

            expect(uploadWidgetComponent.hasFile).toBeFalsy();
        });

        it('should reset field value', () => {
            uploadWidgetComponent.field = new FormFieldModel(new FormModel(), {
                type: FormFieldTypes.UPLOAD,
                value: [
                    {name: 'filename'}
                ]
            });

            uploadWidgetComponent.removeFile(uploadWidgetComponent.field.value[0]);
            expect(uploadWidgetComponent.field.value).toBeNull();
            expect(uploadWidgetComponent.field.json.value).toBeNull();
            expect(uploadWidgetComponent.hasFile).toBeFalsy();
        });

        beforeEach(() => {
            uploadWidgetComponent.field = new FormFieldModel(new FormModel({taskId: 'fake-upload-id'}), {
                id: 'upload-id',
                name: 'upload-name',
                value: '',
                type: FormFieldTypes.UPLOAD,
                readOnly: false
            });
            formServiceInstance = TestBed.inject(FormService);
            uploadWidgetComponent.field.value = [];
        });

        it('should be not present in readonly forms', async () => {
            uploadWidgetComponent.field.form.readOnly = true;
            fixture.detectChanges();
            inputElement = element.querySelector<HTMLInputElement>('#upload-id');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(inputElement).toBeNull();
        });

        it('should have the multiple attribute when is selected in parameters', async () => {
            uploadWidgetComponent.field.params.multiple = true;
            fixture.detectChanges();
            inputElement = element.querySelector<HTMLInputElement>('#upload-id');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(inputElement).toBeDefined();
            expect(inputElement).not.toBeNull();
            expect(inputElement.getAttributeNode('multiple')).toBeTruthy();
        });

        it('should not have the multiple attribute if multiple is false', async () => {
            uploadWidgetComponent.field.params.multiple = false;
            fixture.detectChanges();
            inputElement = element.querySelector<HTMLInputElement>('#upload-id');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(inputElement).toBeDefined();
            expect(inputElement).not.toBeNull();
            expect(inputElement.getAttributeNode('multiple')).toBeFalsy();
        });

        it('should show the list file after upload a new content', async () => {
            spyOn(contentService, 'createTemporaryRawRelatedContent').and.returnValue(of(fakePngAnswer));

            uploadWidgetComponent.field.params.multiple = false;

            fixture.detectChanges();
            await fixture.whenStable();

            const inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', {target: {files: [filJpgFake]}});

            const filesList = fixture.debugElement.query(By.css('#file-1156'));
            expect(filesList).toBeDefined();

        });

        it('should update the form after deleted a file', async () => {
            spyOn(contentService, 'createTemporaryRawRelatedContent').and.callFake((file: any) => {
                if (file.name === 'file-fake.png') {
                    return of(fakePngAnswer);
                }

                if (file.name === 'file-fake.jpg') {
                    return of(fakeJpgAnswer);
                }

                return of(null);
            });

            uploadWidgetComponent.field.params.multiple = true;

            spyOn(uploadWidgetComponent.field, 'updateForm');

            fixture.detectChanges();
            await fixture.whenStable();

            const inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', {target: {files: [filePngFake, filJpgFake]}});

            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton = element.querySelector<HTMLInputElement>('#file-1155-remove');
            deleteButton.click();

            expect(uploadWidgetComponent.field.updateForm).toHaveBeenCalled();
        });

        it('should set has field value all the files uploaded', async () => {
            spyOn(contentService, 'createTemporaryRawRelatedContent').and.callFake((file: any) => {
                if (file.name === 'file-fake.png') {
                    return of(fakePngAnswer);
                }

                if (file.name === 'file-fake.jpg') {
                    return of(fakeJpgAnswer);
                }

                return of(null);
            });

            uploadWidgetComponent.field.params.multiple = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', {target: {files: [filePngFake, filJpgFake]}});

            fixture.detectChanges();
            await fixture.whenStable();

            inputElement = element.querySelector<HTMLInputElement>('#upload-id');
            expect(inputElement).toBeDefined();
            expect(inputElement).not.toBeNull();
            expect(uploadWidgetComponent.field.value).not.toBeNull();
            expect(uploadWidgetComponent.field.value.length).toBe(2);
            expect(uploadWidgetComponent.field.value[0].id).toBe(1155);
            expect(uploadWidgetComponent.field.value[1].id).toBe(1156);
            expect(uploadWidgetComponent.field.json.value.length).toBe(2);
        });

        it('should show all the file uploaded on multiple field', async () => {
            uploadWidgetComponent.field.params.multiple = true;
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-1156');
            const pngElement = element.querySelector('#file-1155');
            expect(jpegElement).not.toBeNull();
            expect(pngElement).not.toBeNull();
            expect(jpegElement.textContent).toBe('a_jpg_file.jpg');
            expect(pngElement.textContent).toBe('a_png_file.png');
        });

        it('should show correctly the file name when is formed with special characters', async () => {
            uploadWidgetComponent.field.value.push(fakeCreationFile('±!@#$%^&*()_+{}:”|<>?§™£-=[];’\\,./.jpg', 10));

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-10');
            expect(jpegElement).not.toBeNull();
            expect(jpegElement.textContent).toBe(`±!@#$%^&*()_+{}:”|<>?§™£-=[];’\\,./.jpg`);
        });

        it('should show correctly the file name when is formed with Arabic characters', async () => {
            const name = 'غ ظ	ض	ذ	خ	ث	ت	ش	ر	ق	ص	ف	ع	س	ن	م	ل	ك	ي	ط	ح	ز	و	ه	د	ج	ب	ا.jpg';
            uploadWidgetComponent.field.value.push(fakeCreationFile(name, 11));

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-11');
            expect(jpegElement).not.toBeNull();
            expect(jpegElement.textContent).toBe('غ ظ	ض	ذ	خ	ث	ت	ش	ر	ق	ص	ف	ع	س	ن	م	ل	ك	ي	ط	ح	ز	و	ه	د	ج	ب	ا.jpg');
        });

        it('should show correctly the file name when is formed with French characters', async () => {
            // cspell: disable-next
            uploadWidgetComponent.field.value.push(fakeCreationFile('Àâæçéèêëïîôœùûüÿ.jpg', 12));

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-12');
            expect(jpegElement).not.toBeNull();
            // cspell: disable-next
            expect(jpegElement.textContent).toBe('Àâæçéèêëïîôœùûüÿ.jpg');
        });

        it('should show correctly the file name when is formed with Greek characters', async () => {
            // cspell: disable-next
            uploadWidgetComponent.field.value.push(fakeCreationFile('άέήίϊϊΐόύϋΰώθωερτψυιοπασδφγηςκλζχξωβνμ.jpg', 13));

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-13');
            expect(jpegElement).not.toBeNull();
            // cspell: disable-next
            expect(jpegElement.textContent).toBe('άέήίϊϊΐόύϋΰώθωερτψυιοπασδφγηςκλζχξωβνμ.jpg');
        });

        it('should show correctly the file name when is formed with Polish accented characters', async () => {
            uploadWidgetComponent.field.value.push(fakeCreationFile('Ą	Ć	Ę	Ł	Ń	Ó	Ś	Ź	Żą	ć	ę	ł	ń	ó	ś	ź	ż.jpg', 14));

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-14');
            expect(jpegElement).not.toBeNull();
            expect(jpegElement.textContent).toBe('Ą	Ć	Ę	Ł	Ń	Ó	Ś	Ź	Żą	ć	ę	ł	ń	ó	ś	ź	ż.jpg');
        });

        it('should show correctly the file name when is formed with Spanish accented characters', async () => {
            uploadWidgetComponent.field.value.push(fakeCreationFile('á, é, í, ó, ú, ñ, Ñ, ü, Ü, ¿, ¡. Á, É, Í, Ó, Ú.jpg', 15));

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-15');
            expect(jpegElement).not.toBeNull();
            expect(jpegElement.textContent).toBe('á, é, í, ó, ú, ñ, Ñ, ü, Ü, ¿, ¡. Á, É, Í, Ó, Ú.jpg');
        });

        it('should show correctly the file name when is formed with Swedish characters', async () => {
            // cspell: disable-next
            uploadWidgetComponent.field.value.push(fakeCreationFile('Äåéö.jpg', 16));

            fixture.detectChanges();
            await fixture.whenStable();

            const jpegElement = element.querySelector('#file-16');
            expect(jpegElement).not.toBeNull();
            // cspell: disable-next
            expect(jpegElement.textContent).toBe('Äåéö.jpg');
        });

        it('should remove file from field value', async () => {
            uploadWidgetComponent.field.params.multiple = true;
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);

            fixture.detectChanges();
            await fixture.whenStable();

            const buttonElement = element.querySelector<HTMLButtonElement>('#file-1156-remove');
            buttonElement.click();
            fixture.detectChanges();
            const jpegElement = element.querySelector('#file-1156');
            expect(jpegElement).toBeNull();
            expect(uploadWidgetComponent.field.value.length).toBe(1);
        });

        it('should emit form content clicked event on icon click', (done) => {
            spyOn(contentService, 'getContentPreview').and.returnValue(of(new Blob()));
            spyOn(contentService, 'getFileRawContent').and.returnValue(of(new Blob()));

            formServiceInstance.formContentClicked.subscribe((content: any) => {
                expect(content.name).toBe(fakeJpgAnswer.name);
                expect(content.id).toBe(fakeJpgAnswer.id);
                expect(content.contentBlob).not.toBeNull();
                done();
            });

            uploadWidgetComponent.field.params.multiple = true;
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const fileJpegIcon = debugElement.query(By.css('#file-1156-icon'));
                fileJpegIcon.nativeElement.dispatchEvent(new MouseEvent('click'));
            });

        });
    });
});
