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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldModel } from './core/form-field.model';
import { FormModel } from './core/form.model';
import { WidgetComponent } from './widget.component';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../testing';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

describe('WidgetComponent', () => {

    let widget: WidgetComponent;
    let fixture: ComponentFixture<WidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetComponent);

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

        it('should click event be redirect on the form rules event service', (done) => {
            widget.formService.formRulesEvent.pipe(filter(event => event.type === 'click')).subscribe(() => {
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
        const fakeForm = new FormModel();
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });
        widget.field = fakeField;

        widget.fieldChanged.subscribe((field) => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        widget.ngAfterViewInit();
    });

    it('should send an event when a field is changed', (done) => {
        const fakeForm = new FormModel();
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });
        widget.fieldChanged.subscribe((field) => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        widget.onFieldChanged(fakeField);
    });

    it('should send a rule event when a field is changed', (done) => {
        const fakeForm = new FormModel();
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });
        widget.formService.formRulesEvent.subscribe((event) => {
            expect(event.type).toEqual('fieldValueChanged');
            done();
        });

        widget.onFieldChanged(fakeField);
    });

    it('should eval isRequired state of the field', () => {
        expect(widget.isRequired()).toBeFalsy();

        widget.field = new FormFieldModel(null);
        expect(widget.isRequired()).toBeFalsy();

        widget.field = new FormFieldModel(null, { required: false });
        expect(widget.isRequired()).toBeFalsy();

        widget.field = new FormFieldModel(null, { required: true });
        expect(widget.isRequired()).toBeTruthy();
    });
});
