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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { ProcessContentService } from '../../../services/process-content.service';
import { FormFieldTypes } from '../core/form-field-types';
import { FormModel } from '../core/form.model';
import { FormFieldModel } from './../core/form-field.model';
import { UploadWidgetComponent } from './upload.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const fakePngAnswer = {
    'id': 1155,
    'name': 'a_png_file.png',
    'created': '2017-07-25T17:17:37.099Z',
    'createdBy': { 'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin' },
    'relatedContent': false,
    'contentAvailable': true,
    'link': false,
    'mimeType': 'image/png',
    'simpleType': 'image',
    'previewStatus': 'queued',
    'thumbnailStatus': 'queued'
};

const fakeJpgAnswer = {
    'id': 1156,
    'name': 'a_jpg_file.jpg',
    'created': '2017-07-25T17:17:37.118Z',
    'createdBy': { 'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin' },
    'relatedContent': false,
    'contentAvailable': true,
    'link': false,
    'mimeType': 'image/jpeg',
    'simpleType': 'image',
    'previewStatus': 'queued',
    'thumbnailStatus': 'queued'
};

describe('UploadWidgetComponent', () => {

    function  fakeCreationFile  (name, id) {
        return {
            'id': id,
            'name': name,
            'created': '2017-07-25T17:17:37.118Z',
            'createdBy': { 'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin' },
            'relatedContent': false,
            'contentAvailable': true,
            'link': false,
            'mimeType': 'image/jpeg',
            'simpleType': 'image',
            'previewStatus': 'queued',
            'thumbnailStatus': 'queued'
        };
    }

    let contentService: ProcessContentService;

    const filePngFake = new File(['fakePng'], 'file-fake.png', { type: 'image/png' });
    const filJpgFake = new File(['fakeJpg'], 'file-fake.jpg', { type: 'image/jpg' });

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    describe('when template is ready', () => {
        let uploadWidgetComponent: UploadWidgetComponent;
        let fixture: ComponentFixture<UploadWidgetComponent>;
        let element: HTMLInputElement;
        let debugElement: DebugElement;
        let inputElement: HTMLInputElement;
        let formServiceInstance: FormService;

        beforeEach(async(() => {
            fixture = TestBed.createComponent(UploadWidgetComponent);
            uploadWidgetComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            debugElement = fixture.debugElement;
            contentService = TestBed.get(ProcessContentService);
        }));

        it('should setup with field data', () => {
            const fileName = 'hello world';
            const encodedFileName = encodeURI(fileName);

            uploadWidgetComponent.field = new FormFieldModel(null, {
                type: FormFieldTypes.UPLOAD,
                value: [
                    { name: encodedFileName }
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
                    { name: 'filename' }
                ]
            });

            uploadWidgetComponent.removeFile(uploadWidgetComponent.field.value[0]);
            expect(uploadWidgetComponent.field.value.length).toBe(0);
            expect(uploadWidgetComponent.field.json.value.length).toBe(0);
            expect(uploadWidgetComponent.hasFile).toBeFalsy();
        });

        beforeEach(() => {
            uploadWidgetComponent.field = new FormFieldModel(new FormModel({ taskId: 'fake-upload-id' }), {
                id: 'upload-id',
                name: 'upload-name',
                value: '',
                type: FormFieldTypes.UPLOAD,
                readOnly: false
            });
            formServiceInstance = TestBed.get(FormService);
            uploadWidgetComponent.field.value = [];
        });

        it('should be not present in readonly forms', async(() => {
            uploadWidgetComponent.field.form.readOnly = true;
            fixture.detectChanges();
            inputElement = <HTMLInputElement> element.querySelector('#upload-id');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(inputElement).toBeNull();
            });
        }));

        it('should have the multiple attribute when is selected in parameters', async(() => {
            uploadWidgetComponent.field.params.multiple = true;
            fixture.detectChanges();
            inputElement = <HTMLInputElement> element.querySelector('#upload-id');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(inputElement.getAttributeNode('multiple')).toBeTruthy();
            });
        }));

        it('should not have the multiple attribute if multiple is false', async(() => {
            uploadWidgetComponent.field.params.multiple = false;
            fixture.detectChanges();
            inputElement = <HTMLInputElement> element.querySelector('#upload-id');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(inputElement.getAttributeNode('multiple')).toBeFalsy();
            });
        }));

        it('should show the list file after upload a new content', async(() => {
            spyOn(contentService, 'createTemporaryRawRelatedContent').and.returnValue(of(fakePngAnswer));

            uploadWidgetComponent.field.params.multiple = false;
            fixture.detectChanges();
            const inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', { target: { files: [filJpgFake] } });

            const filesList = fixture.debugElement.query(By.css('#file-1156'));
            expect(filesList).toBeDefined();

        }));

        it('should update the form after deleted a file', async(() => {
            spyOn(contentService, 'createTemporaryRawRelatedContent').and.callFake((file: any) => {
                if (file.name === 'file-fake.png') {
                    return of(fakePngAnswer);
                }

                if (file.name === 'file-fake.jpg') {
                    return of(fakeJpgAnswer);
                }

                return of();
            });

            uploadWidgetComponent.field.params.multiple = true;

            spyOn(uploadWidgetComponent.field, 'updateForm');
            fixture.detectChanges();
            const inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', { target: { files: [filePngFake, filJpgFake] } });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const deleteButton = <HTMLInputElement> element.querySelector('#file-1155-remove');
                deleteButton.click();

                expect(uploadWidgetComponent.field.updateForm).toHaveBeenCalled();
            });

        }));

        it('should set has field value all the files uploaded', async(() => {
            spyOn(contentService, 'createTemporaryRawRelatedContent').and.callFake((file: any) => {
                if (file.name === 'file-fake.png') {
                    return of(fakePngAnswer);
                }

                if (file.name === 'file-fake.jpg') {
                    return of(fakeJpgAnswer);
                }

                return of();
            });

            uploadWidgetComponent.field.params.multiple = true;
            fixture.detectChanges();
            const inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', { target: { files: [filePngFake, filJpgFake] } });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                inputElement = <HTMLInputElement> element.querySelector('#upload-id');
                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(uploadWidgetComponent.field.value).not.toBeNull();
                expect(uploadWidgetComponent.field.value.length).toBe(2);
                expect(uploadWidgetComponent.field.value[0].id).toBe(1155);
                expect(uploadWidgetComponent.field.value[1].id).toBe(1156);
                expect(uploadWidgetComponent.field.json.value.length).toBe(2);
            });
        }));

        it('should show all the file uploaded on multiple field', async(() => {
            uploadWidgetComponent.field.params.multiple = true;
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-1156');
                const pngElement = element.querySelector('#file-1155');
                expect(jpegElement).not.toBeNull();
                expect(pngElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('a_jpg_file.jpg');
                expect(pngElement.textContent).toBe('a_png_file.png');
            });
        }));

        it('should show correctly the file name when is formed with special characters', async(() => {
            uploadWidgetComponent.field.value.push(fakeCreationFile('±!@#$%^&*()_+{}:”|<>?§™£-=[];’\\,./.jpg', 10));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-10');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe(`±!@#$%^&*()_+{}:”|<>?§™£-=[];’\\,./.jpg`);
            });
        }));

        it('should show correctly the file name when is formed with Arabic characters', async(() => {
            const name = 'غ ظ	ض	ذ	خ	ث	ت	ش	ر	ق	ص	ف	ع	س	ن	م	ل	ك	ي	ط	ح	ز	و	ه	د	ج	ب	ا.jpg';
            uploadWidgetComponent.field.value.push(fakeCreationFile(name, 11));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-11');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('غ ظ	ض	ذ	خ	ث	ت	ش	ر	ق	ص	ف	ع	س	ن	م	ل	ك	ي	ط	ح	ز	و	ه	د	ج	ب	ا.jpg');
            });
        }));

        it('should show correctly the file name when is formed with French characters', async(() => {
            // cspell: disable-next
            uploadWidgetComponent.field.value.push(fakeCreationFile('Àâæçéèêëïîôœùûüÿ.jpg', 12));

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-12');
                expect(jpegElement).not.toBeNull();
                // cspell: disable-next
                expect(jpegElement.textContent).toBe('Àâæçéèêëïîôœùûüÿ.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Greek characters', async(() => {
            // cspell: disable-next
            uploadWidgetComponent.field.value.push(fakeCreationFile('άέήίϊϊΐόύϋΰώθωερτψυιοπασδφγηςκλζχξωβνμ.jpg', 13));

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-13');
                expect(jpegElement).not.toBeNull();
                // cspell: disable-next
                expect(jpegElement.textContent).toBe('άέήίϊϊΐόύϋΰώθωερτψυιοπασδφγηςκλζχξωβνμ.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Polish accented characters', async(() => {
            uploadWidgetComponent.field.value.push(fakeCreationFile('Ą	Ć	Ę	Ł	Ń	Ó	Ś	Ź	Żą	ć	ę	ł	ń	ó	ś	ź	ż.jpg', 14));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-14');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('Ą	Ć	Ę	Ł	Ń	Ó	Ś	Ź	Żą	ć	ę	ł	ń	ó	ś	ź	ż.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Spanish accented characters', async(() => {
            uploadWidgetComponent.field.value.push(fakeCreationFile('á, é, í, ó, ú, ñ, Ñ, ü, Ü, ¿, ¡. Á, É, Í, Ó, Ú.jpg', 15));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-15');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('á, é, í, ó, ú, ñ, Ñ, ü, Ü, ¿, ¡. Á, É, Í, Ó, Ú.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Swedish characters', async(() => {
            // cspell: disable-next
            uploadWidgetComponent.field.value.push(fakeCreationFile('Äåéö.jpg', 16));
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-16');
                expect(jpegElement).not.toBeNull();
                // cspell: disable-next
                expect(jpegElement.textContent).toBe('Äåéö.jpg');
            });
        }));

        it('should remove file from field value', async(() => {
            uploadWidgetComponent.field.params.multiple = true;
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const buttonElement = <HTMLButtonElement> element.querySelector('#file-1156-remove');
                buttonElement.click();
                fixture.detectChanges();
                const jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).toBeNull();
                expect(uploadWidgetComponent.field.value.length).toBe(1);
            });
        }));

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
