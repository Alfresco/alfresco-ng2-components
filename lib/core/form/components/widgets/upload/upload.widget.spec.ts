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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { EcmModelService } from '../../../services/ecm-model.service';
import { FormService } from '../../../services/form.service';
import { ProcessContentService } from '../../../services/process-content.service';
import { MaterialModule } from '../../../../material.module';
import { FormFieldTypes } from '../core/form-field-types';
import { FormModel } from '../core/form.model';
import { ErrorWidgetComponent } from '../error/error.component';
import { FormFieldModel } from './../core/form-field.model';
import { UploadWidgetComponent } from './upload.widget';

let fakePngAnswer = {
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

let fakeJpgAnswer = {
    'id': 1156,
    'name': 'a_jpg_file.jpg',
    'created': '2017-07-25T17:17:37.118Z',
    'createdBy': {'id': 1001, 'firstName': 'Admin', 'lastName': 'admin', 'email': 'admin'},
    'relatedContent': false,
    'contentAvailable': true,
    'link': false,
    'mimeType': 'image/jpeg',
    'simpleType': 'image',
    'previewStatus': 'queued',
    'thumbnailStatus': 'queued'
};

declare let jasmine: any;

describe('UploadWidgetComponent', () => {

    let contentService: ProcessContentService;

    let filePngFake = new File(['fakePng'], 'file-fake.png', {type: 'image/png'});
    let filJpgFake = new File(['fakeJpg'], 'file-fake.jpg', {type: 'image/jpg'});

    describe('when template is ready', () => {
        let uploadWidgetComponent: UploadWidgetComponent;
        let fixture: ComponentFixture<UploadWidgetComponent>;
        let element: HTMLInputElement;
        let debugElement: DebugElement;
        let inputElement: HTMLInputElement;
        let formServiceInstance: FormService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ MaterialModule],
                declarations: [UploadWidgetComponent, ErrorWidgetComponent],
                providers: [FormService, EcmModelService, ProcessContentService]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(UploadWidgetComponent);
                uploadWidgetComponent = fixture.componentInstance;
                element = fixture.nativeElement;
                debugElement = fixture.debugElement;
                contentService = TestBed.get(ProcessContentService);
            });
        }));

        beforeEach(() => {
            jasmine.Ajax.install();

        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
            jasmine.Ajax.uninstall();
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
            expect(uploadWidgetComponent.field.value.length).toBe(0);
            expect(uploadWidgetComponent.field.json.value.length).toBe(0);
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
            formServiceInstance = TestBed.get(FormService);
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
            uploadWidgetComponent.field.params.multiple = false;
            fixture.detectChanges();
            let inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', {target: {files: [filJpgFake]}});

            jasmine.Ajax.requests.at(0).respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeJpgAnswer
            });

            let filesList = fixture.debugElement.query(By.css('#file-1156'));
            expect(filesList).toBeDefined();

        }));

        it('should update the form after deleted a file', async(() => {
            uploadWidgetComponent.field.params.multiple = true;

            spyOn(uploadWidgetComponent.field, 'updateForm');
            fixture.detectChanges();
            let inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', {target: {files: [filePngFake, filJpgFake]}});

            jasmine.Ajax.requests.at(0).respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakePngAnswer
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeJpgAnswer
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let deleteButton = <HTMLInputElement> element.querySelector('#file-1155-remove');
                deleteButton.click();

                expect(uploadWidgetComponent.field.updateForm).toHaveBeenCalled();
            });

        }));

        it('should set has field value all the files uploaded', async(() => {
            uploadWidgetComponent.field.params.multiple = true;
            fixture.detectChanges();
            let inputDebugElement = fixture.debugElement.query(By.css('#upload-id'));
            inputDebugElement.triggerEventHandler('change', {target: {files: [filePngFake, filJpgFake]}});

            jasmine.Ajax.requests.at(0).respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakePngAnswer
            });

            jasmine.Ajax.requests.at(1).respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeJpgAnswer
            });

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
            uploadWidgetComponent.field.value = [];
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                let pngElement = element.querySelector('#file-1155');
                expect(jpegElement).not.toBeNull();
                expect(pngElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('a_jpg_file.jpg');
                expect(pngElement.textContent).toBe('a_png_file.png');
            });
        }));

        it('should show correctly the file name when is formed with special characters', async(() => {
            uploadWidgetComponent.field.value = [];
            fakeJpgAnswer.name = '±!@#$%^&*()_+{}:”|<>?§™£-=[];’\\,./.jpg';
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe(`±!@#$%^&*()_+{}:”|<>?§™£-=[];’\\,./.jpg`);
            });
        }));

        it('should show correctly the file name when is formed with Arabic characters', async(() => {
            uploadWidgetComponent.field.value = [];
            fakeJpgAnswer.name = 'غ ظ	ض	ذ	خ	ث	ت	ش	ر	ق	ص	ف	ع	س	ن	م	ل	ك	ي	ط	ح	ز	و	ه	د	ج	ب	ا.jpg';
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('غ ظ	ض	ذ	خ	ث	ت	ش	ر	ق	ص	ف	ع	س	ن	م	ل	ك	ي	ط	ح	ز	و	ه	د	ج	ب	ا.jpg');
            });
        }));

        it('should show correctly the file name when is formed with French characters', async(() => {
            uploadWidgetComponent.field.value = [];
            fakeJpgAnswer.name = 'Àâæçéèêëïîôœùûüÿ.jpg';
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('Àâæçéèêëïîôœùûüÿ.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Greek characters', async(() => {
            uploadWidgetComponent.field.value = [];
            fakeJpgAnswer.name = 'άέήίϊϊΐόύϋΰώθωερτψυιοπασδφγηςκλζχξωβνμ.jpg';
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('άέήίϊϊΐόύϋΰώθωερτψυιοπασδφγηςκλζχξωβνμ.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Polish accented characters', async(() => {
            uploadWidgetComponent.field.value = [];
            fakeJpgAnswer.name = 'Ą	Ć	Ę	Ł	Ń	Ó	Ś	Ź	Żą	ć	ę	ł	ń	ó	ś	ź	ż.jpg';
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('Ą	Ć	Ę	Ł	Ń	Ó	Ś	Ź	Żą	ć	ę	ł	ń	ó	ś	ź	ż.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Spanish accented characters', async(() => {
            uploadWidgetComponent.field.value = [];
            fakeJpgAnswer.name = 'á, é, í, ó, ú, ñ, Ñ, ü, Ü, ¿, ¡. Á, É, Í, Ó, Ú.jpg';
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('á, é, í, ó, ú, ñ, Ñ, ü, Ü, ¿, ¡. Á, É, Í, Ó, Ú.jpg');
            });
        }));

        it('should show correctly the file name when is formed with Swedish characters', async(() => {
            uploadWidgetComponent.field.value = [];
            fakeJpgAnswer.name = 'Äåéö.jpg';
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).not.toBeNull();
                expect(jpegElement.textContent).toBe('Äåéö.jpg');
            });
        }));

        it('should remove file from field value', async(() => {
            uploadWidgetComponent.field.params.multiple = true;
            uploadWidgetComponent.field.value = [];
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let buttonElement = <HTMLButtonElement> element.querySelector('#file-1156-remove');
                buttonElement.click();
                fixture.detectChanges();
                let jpegElement = element.querySelector('#file-1156');
                expect(jpegElement).toBeNull();
                expect(uploadWidgetComponent.field.value.length).toBe(1);
            });
        }));

        it('should emit form content clicked event on icon click', (done) => {

            spyOn(contentService, 'getContentPreview').and.returnValue(Observable.of(new Blob()));
            spyOn(contentService, 'getFileRawContent').and.returnValue(Observable.of(new Blob()));

            formServiceInstance.formContentClicked.subscribe((content: any) => {
                expect(content.name).toBe(fakeJpgAnswer.name);
                expect(content.id).toBe(fakeJpgAnswer.id);
                expect(content.contentBlob).not.toBeNull();
                done();
            });

            uploadWidgetComponent.field.params.multiple = true;
            uploadWidgetComponent.field.value = [];
            uploadWidgetComponent.field.value.push(fakeJpgAnswer);
            uploadWidgetComponent.field.value.push(fakePngAnswer);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let fileJpegIcon = debugElement.query(By.css('#file-1156-icon'));
                fileJpegIcon.nativeElement.dispatchEvent(new MouseEvent('click'));
            });

        });

    });

});
