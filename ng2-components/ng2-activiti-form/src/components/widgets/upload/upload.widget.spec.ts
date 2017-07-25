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
import { CoreModule } from 'ng2-alfresco-core';
import { MATERIAL_MODULE } from '../../../../index';
import { EcmModelService } from '../../../services/ecm-model.service';
import { FormService } from '../../../services/form.service';
import { FormFieldTypes } from '../core/form-field-types';
import { FormModel } from '../core/form.model';
import { ErrorWidgetComponent } from '../error/error.component';
import { FormFieldModel } from './../core/form-field.model';
import { UploadWidgetComponent } from './upload.widget';

describe('UploadWidgetComponent', () => {

    let uploadWidgetComponent: UploadWidgetComponent;
    let fixture: ComponentFixture<UploadWidgetComponent>;
    let element: HTMLInputElement;
    let inputElement: HTMLInputElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), MATERIAL_MODULE],
            declarations: [UploadWidgetComponent, ErrorWidgetComponent],
            providers: [FormService, EcmModelService]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(UploadWidgetComponent);
            uploadWidgetComponent = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

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
        expect(uploadWidgetComponent.fileName).toBe(encodeURI(fileName));
        expect(uploadWidgetComponent.displayText).toBe(fileName);
    });

    it('should require form field to setup', () => {
        uploadWidgetComponent.field = null;
        uploadWidgetComponent.ngOnInit();

        expect(uploadWidgetComponent.hasFile).toBeFalsy();
        expect(uploadWidgetComponent.fileName).toBeUndefined();
        expect(uploadWidgetComponent.displayText).toBeUndefined();
    });

    it('should reset local properties', () => {
        uploadWidgetComponent.hasFile = true;
        uploadWidgetComponent.fileName = '<fileName>';
        uploadWidgetComponent.displayText = '<displayText>';

        uploadWidgetComponent.reset();
        expect(uploadWidgetComponent.hasFile).toBeFalsy();
        expect(uploadWidgetComponent.fileName).toBeNull();
        expect(uploadWidgetComponent.displayText).toBeNull();
    });

    it('should reset field value', () => {
        uploadWidgetComponent.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: [
                { name: 'filename' }
            ]
        });
        uploadWidgetComponent.reset();
        expect(uploadWidgetComponent.field.value).toBeNull();
        expect(uploadWidgetComponent.field.json.value).toBeNull();
    });

    describe('when template is ready', () => {

        beforeEach(() => {
            uploadWidgetComponent.field = new FormFieldModel(new FormModel({ taskId: 'fake-upload-id' }), {
                id: 'upload-id',
                name: 'upload-name',
                value: '',
                type: FormFieldTypes.UPLOAD,
                readOnly: false
            });
        });

        it('should be disabled on readonly forms', async(() => {
            uploadWidgetComponent.field.form.readOnly = true;
            fixture.detectChanges();
            inputElement = <HTMLInputElement> element.querySelector('#upload-id');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(inputElement.disabled).toBeTruthy();
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

    });

});
