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
import { EcmModelService } from '../../../services/ecm-model.service';
import { FormService } from '../../../services/form.service';
import { FormFieldTypes } from '../core/form-field-types';
import { FormModel } from '../core/form.model';
import { FormFieldModel } from './../core/form-field.model';
import { UploadWidgetComponent } from './upload.widget';

describe('UploadWidgetComponent', () => {

    let componentHandler;
    let widget: UploadWidgetComponent;
    let formService: FormService;

    beforeEach(() => {
        formService = new FormService(null, null, null);
        widget = new UploadWidgetComponent(formService, null, null);
    });

    it('should setup with field data', () => {
        const fileName = 'hello world';
        const encodedFileName = encodeURI(fileName);

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: [
                { name: encodedFileName }
            ]
        });

        widget.ngOnInit();
        expect(widget.hasFile).toBeTruthy();
        expect(widget.fileName).toBe(encodeURI(fileName));
        expect(widget.displayText).toBe(fileName);
    });

    it('should require form field to setup', () => {
        widget.field = null;
        widget.ngOnInit();

        expect(widget.hasFile).toBeFalsy();
        expect(widget.fileName).toBeUndefined();
        expect(widget.displayText).toBeUndefined();
    });

    it('should reset local properties', () => {
        widget.hasFile = true;
        widget.fileName = '<fileName>';
        widget.displayText = '<displayText>';

        widget.reset();
        expect(widget.hasFile).toBeFalsy();
        expect(widget.fileName).toBeNull();
        expect(widget.displayText).toBeNull();
    });

    it('should reset field value', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: [
                { name: 'filename' }
            ]
        });
        widget.reset();
        expect(widget.field.value).toBeNull();
        expect(widget.field.json.value).toBeNull();
    });

    describe('when template is ready', () => {
        let uploadWidgetComponent: UploadWidgetComponent;
        let fixture: ComponentFixture<UploadWidgetComponent>;
        let element: HTMLInputElement;
        let inputElement: HTMLInputElement;

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
        }));

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [UploadWidgetComponent],
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
            inputElement = <HTMLInputElement>element.querySelector('#upload-id');

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
            inputElement = <HTMLInputElement>element.querySelector('#upload-id');

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
            inputElement = <HTMLInputElement>element.querySelector('#upload-id');

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(inputElement.getAttributeNode('multiple')).toBeFalsy();
            });
        }));

    });

});
