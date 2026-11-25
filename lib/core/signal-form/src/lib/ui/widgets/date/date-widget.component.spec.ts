/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { createFieldsForm, errorText, renderWidget, typeInto } from '../../testing/widget-testing.mock';
import { SignalDateWidgetComponent } from './date-widget.component';

describe('SignalDateWidgetComponent', () => {
    const dateInput = (element: HTMLElement): HTMLInputElement => element.querySelector('input');
    const detectChangesTwice = (fixture: ComponentFixture<SignalDateWidgetComponent>): void => {
        fixture.detectChanges();
        fixture.detectChanges();
    };
    const typeAndLeave = (fixture: ComponentFixture<SignalDateWidgetComponent>, text: string): void => {
        typeInto(dateInput(fixture.nativeElement), text);
        dateInput(fixture.nativeElement).dispatchEvent(new Event('blur'));
        detectChangesTwice(fixture);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should submit a typed date as an ISO date', () => {
        const form = createFieldsForm([{ id: 'due', name: 'Due', type: 'date' }]);
        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');

        typeAndLeave(fixture, '15-3-2024');
        const submittedDate = form.submittedValues()['due'];
        const valid = form.valid();

        expect(submittedDate).toBe('2024-03-15T00:00:00.000Z');
        expect(valid).toBeTrue();
    });

    it('should keep unparseable text, report it and submit no date', () => {
        const form = createFieldsForm([{ id: 'due', name: 'Due', type: 'date' }]);
        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');

        typeAndLeave(fixture, 'Ada');
        const shownText = dateInput(fixture.nativeElement).value;
        const valid = form.valid();
        const shownError = errorText(fixture.nativeElement);
        const submittedDate = form.submittedValues()['due'];

        expect(shownText).toBe('Ada');
        expect(valid).toBeFalse();
        expect(shownError).toBe('FORM.FIELD.VALIDATOR.INVALID_DATE_FORMAT');
        expect(submittedDate).toBeNull();
    });

    it('should show the initial date and a value set by a rule, in the display format', () => {
        const form = createFieldsForm([{ id: 'due', name: 'Due', type: 'date', value: '2024-03-15', dateDisplayFormat: 'DD/MM/YYYY' }]);
        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');
        const initialText = dateInput(fixture.nativeElement).value;

        form.setValue('due', new Date(2025, 0, 2));
        fixture.detectChanges();
        const changedText = dateInput(fixture.nativeElement).value;

        expect(initialText).toBe('15/03/2024');
        expect(changedText).toBe('02/01/2025');
    });

    it('should submit a day picked from the calendar', async () => {
        const form = createFieldsForm([{ id: 'due', name: 'Due', type: 'date', value: '2024-03-15' }]);
        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');
        const pickerInput = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatDatepickerInputHarness.with({ selector: '#due' }));

        await pickerInput.openCalendar();
        await (await pickerInput.getCalendar()).selectCell({ text: '20' });
        const submittedDate = form.submittedValues()['due'];
        const shownText = dateInput(fixture.nativeElement).value;

        expect(submittedDate).toBe('2024-03-20T00:00:00.000Z');
        expect(shownText).toBe('20-3-2024');
    });

    it('should report an empty required date as required', () => {
        const form = createFieldsForm([{ id: 'due', name: 'Due', type: 'date', required: true, minValue: '2024-03-15' }]);
        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');

        typeAndLeave(fixture, '');
        const shownError = errorText(fixture.nativeElement);

        expect(shownError).toBe('FORM.FIELD.REQUIRED');
    });

    it('should report a date out of range against its bound', () => {
        const form = createFieldsForm([{ id: 'due', name: 'Due', type: 'date', required: true, minValue: '2024-03-15' }]);
        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');

        typeAndLeave(fixture, '1-1-2024');
        const shownError = errorText(fixture.nativeElement);

        expect(shownError).toBe('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');
    });

    it('should disable a read-only date', () => {
        const form = createFieldsForm([{ id: 'due', type: 'date', readOnly: true }]);

        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');
        const disabled = dateInput(fixture.nativeElement).disabled;

        expect(disabled).toBeTrue();
    });

    it("should keep today's date widget container id", () => {
        const form = createFieldsForm([{ id: 'due', type: 'date' }]);

        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');
        const container = fixture.nativeElement.querySelector('#data-widget');

        const holdsInput = container?.contains(dateInput(fixture.nativeElement));

        expect(container).not.toBeNull();
        expect(holdsInput).toBeTrue();
    });

    it('should mark a required date as required on its input, following rules that change it', () => {
        const form = createFieldsForm([{ id: 'due', type: 'date', required: true }]);
        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');
        const requiredBefore = dateInput(fixture.nativeElement).required;

        form.setRequired('due', false);
        fixture.detectChanges();
        const requiredAfter = dateInput(fixture.nativeElement).required;

        expect(requiredBefore).toBeTrue();
        expect(requiredAfter).toBeFalse();
    });

    it('should show its label to the left, with the date format, when the form asks for it', () => {
        const form = createFieldsForm([{ id: 'due', name: 'Due', type: 'date' }], { leftLabels: true });

        const fixture = renderWidget(SignalDateWidgetComponent, form, 'due');
        const leftLabelText = fixture.nativeElement.querySelector('label.adf-signal-form-left-label[for="due"]')?.textContent;

        expect(leftLabelText).toContain('Due');
        expect(leftLabelText).toContain('(D-M-YYYY)');
    });
});
