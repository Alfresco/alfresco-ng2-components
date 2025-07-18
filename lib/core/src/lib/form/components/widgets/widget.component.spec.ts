/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { filter } from 'rxjs/operators';
import { FormRulesEvent } from '../../events';
import { FormFieldModel, FormModel } from './core';
import { WidgetComponent } from './widget.component';

describe('WidgetComponent', () => {
    let widget: WidgetComponent;
    let fixture: ComponentFixture<WidgetComponent>;
    let element: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WidgetComponent]
        });
        fixture = TestBed.createComponent(WidgetComponent);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('Events', () => {
        it('should click event be redirect on the form event service', fakeAsync(() => {
            widget.formService.formEvents.subscribe((event) => {
                expect(event).toBeTruthy();
            });

            element.click();
        }));

        it('should click event be redirect on the form rules event service', fakeAsync(() => {
            widget.formService.formRulesEvent.pipe(filter((event) => event.type === 'click')).subscribe((event) => {
                expect(event).toBeTruthy();
            });

            element.click();
        }));
    });

    it('should check field', () => {
        expect(widget.hasField()).toBeFalsy();
        widget.field = new FormFieldModel(new FormModel());
        expect(widget.hasField()).toBeTruthy();
    });

    it('should send an event after view init', () => {
        const fakeForm = new FormModel();
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });
        widget.field = fakeField;

        let lastValue: FormFieldModel;

        widget.fieldChanged.subscribe((field) => (lastValue = field));
        widget.ngAfterViewInit();

        expect(lastValue).not.toBe(null);
        expect(lastValue.id).toBe('fakeField');
        expect(lastValue.value).toBe('fakeValue');
    });

    it('should send an event when a field is changed', () => {
        const fakeForm = new FormModel();
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });

        let lastValue: FormFieldModel;
        widget.fieldChanged.subscribe((field) => (lastValue = field));
        widget.onFieldChanged(fakeField);

        expect(lastValue).not.toBe(null);
        expect(lastValue.id).toBe('fakeField');
        expect(lastValue.value).toBe('fakeValue');
    });

    it('should send a rule event when a field is changed', () => {
        const fakeForm = new FormModel();
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });

        let lastValue: FormRulesEvent;
        widget.formService.formRulesEvent.subscribe((event) => (lastValue = event));

        widget.onFieldChanged(fakeField);
        expect(lastValue.type).toEqual('fieldValueChanged');
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
