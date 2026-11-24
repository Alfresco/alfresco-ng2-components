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

import { TestBed } from '@angular/core/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { createFieldsForm, renderWidget, typeInto } from '../../testing/widget-testing.mock';
import { SignalMultilineTextWidgetComponent } from './multiline-text-widget.component';

describe('SignalMultilineTextWidgetComponent', () => {
    const textArea = (element: HTMLElement): HTMLTextAreaElement => element.querySelector('textarea');

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should cap the height of a multi-line text that must not grow', () => {
        const form = createFieldsForm([{ id: 'notes', type: 'multi-line-text', params: { autoGrow: false } }]);

        const fixture = renderWidget(SignalMultilineTextWidgetComponent, form, 'notes');
        const cappedElement = fixture.nativeElement.querySelector('.adf-multiline-text-widget--capped');

        expect(cappedElement).not.toBeNull();
    });

    it('should not cap the height of a multi-line text that grows', () => {
        const form = createFieldsForm([{ id: 'notes', type: 'multi-line-text' }]);

        const fixture = renderWidget(SignalMultilineTextWidgetComponent, form, 'notes');
        const cappedElement = fixture.nativeElement.querySelector('.adf-multiline-text-widget--capped');

        expect(cappedElement).toBeNull();
    });

    it('should write what is typed into the form', () => {
        const form = createFieldsForm([{ id: 'notes', name: 'Notes', type: 'multi-line-text' }]);
        const fixture = renderWidget(SignalMultilineTextWidgetComponent, form, 'notes');

        typeInto(textArea(fixture.nativeElement), 'Lord Byron');
        fixture.detectChanges();
        const submittedNotes = form.submittedValues()['notes'];

        expect(submittedNotes).toBe('Lord Byron');
    });

    it('should count the characters against the limit', () => {
        const form = createFieldsForm([{ id: 'notes', type: 'multi-line-text', value: 'Adam', maxLength: 10 }]);

        const fixture = renderWidget(SignalMultilineTextWidgetComponent, form, 'notes');
        const counterText = fixture.nativeElement.querySelector('.adf-multiline-counter-block')?.textContent?.trim();

        expect(counterText).toBe('4/10');
    });

    it('should show no counter when the field has no limit', () => {
        const form = createFieldsForm([{ id: 'notes', type: 'multi-line-text', value: 'Adam' }]);

        const fixture = renderWidget(SignalMultilineTextWidgetComponent, form, 'notes');
        const counter = fixture.nativeElement.querySelector('.adf-multiline-counter-block');

        expect(counter).toBeNull();
    });

    it('should show its label to the left when the form asks for it', () => {
        const form = createFieldsForm([{ id: 'notes', name: 'Notes', type: 'multi-line-text' }], { leftLabels: true });

        const fixture = renderWidget(SignalMultilineTextWidgetComponent, form, 'notes');
        const leftLabelText = fixture.nativeElement.querySelector('label.adf-signal-form-left-label[for="notes"]')?.textContent;

        expect(leftLabelText).toContain('Notes');
    });
});
