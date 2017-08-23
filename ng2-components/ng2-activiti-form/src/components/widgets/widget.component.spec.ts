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
import { ActivitiAlfrescoContentService } from '../../services/activiti-alfresco.service';
import { EcmModelService } from './../../services/ecm-model.service';
import { FormService } from './../../services/form.service';
import { FormFieldModel } from './core/form-field.model';
import { FormModel } from './core/form.model';
import { WidgetComponent } from './widget.component';

describe('WidgetComponent', () => {

    let widget: WidgetComponent;
    let fixture: ComponentFixture<WidgetComponent>;
    let element: HTMLElement;
    let formService: FormService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [WidgetComponent],
            providers: [
                FormService,
                EcmModelService,
                ActivitiAlfrescoContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetComponent);
        formService = TestBed.get(FormService);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('Events', () => {

        it('should click event be redirect on the form event service', (done) => {
            widget.formService.formEvents.subscribe(() => {
                done();
            });

            element.click();
        });

    });

    it('should check field', () => {
        expect(widget.hasField()).toBeFalsy();
        widget.field = new FormFieldModel(new FormModel());
        expect(widget.hasField()).toBeTruthy();
    });

    it('should send an event after view init', (done) => {
        let fakeForm = new FormModel();
        let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
        widget.field = fakeField;

        widget.fieldChanged.subscribe(field => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        widget.ngAfterViewInit();
    });

    it('should send an event when a field is changed', (done) => {
        let fakeForm = new FormModel();
        let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
        widget.fieldChanged.subscribe(field => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        widget.checkVisibility(fakeField);
    });

    it('should eval isRequired state of the field', () => {
        expect(widget.isRequired()).toBeFalsy();

        widget.field = new FormFieldModel(null);
        expect(widget.isRequired()).toBeFalsy();

        widget.field = new FormFieldModel(null, {required: false});
        expect(widget.isRequired()).toBeFalsy();

        widget.field = new FormFieldModel(null, {required: true});
        expect(widget.isRequired()).toBeTruthy();
    });

});
