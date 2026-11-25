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
import { createFieldsForm, errorText, renderWidget } from '../../testing/widget-testing.mock';
import { SignalCheckboxWidgetComponent } from './checkbox-widget.component';

describe('SignalCheckboxWidgetComponent', () => {
    const checkboxInput = (element: HTMLElement): HTMLInputElement => element.querySelector('[data-automation-id="adf-checkbox-widget"] input');

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should submit a checked checkbox', () => {
        const form = createFieldsForm([{ id: 'agree', name: 'Agree', type: 'boolean', required: true }]);
        const fixture = renderWidget(SignalCheckboxWidgetComponent, form, 'agree');

        checkboxInput(fixture.nativeElement).click();
        fixture.detectChanges();
        const submittedAgreement = form.submittedValues()['agree'];

        expect(submittedAgreement).toBeTrue();
    });

    it('should report a required checkbox once it is checked and cleared', () => {
        const form = createFieldsForm([{ id: 'agree', name: 'Agree', type: 'boolean', required: true }]);
        const fixture = renderWidget(SignalCheckboxWidgetComponent, form, 'agree');

        checkboxInput(fixture.nativeElement).click();
        checkboxInput(fixture.nativeElement).click();
        fixture.detectChanges();
        const shownError = errorText(fixture.nativeElement);

        expect(shownError).toBe('FORM.FIELD.REQUIRED');
    });

    it('should show an asterisk after the name of a required checkbox', () => {
        const form = createFieldsForm([{ id: 'agree', name: 'Agree', type: 'boolean', required: true }]);

        const fixture = renderWidget(SignalCheckboxWidgetComponent, form, 'agree');
        const asterisk = fixture.nativeElement.querySelector('[data-automation-id="adf-checkbox-widget-asterisk"]');

        expect(asterisk).not.toBeNull();
    });

    it('should show an asterisk once a rule makes an optional checkbox required', () => {
        const form = createFieldsForm([{ id: 'agree', name: 'Agree', type: 'boolean' }]);
        const fixture = renderWidget(SignalCheckboxWidgetComponent, form, 'agree');

        form.setRequired('agree', true);
        fixture.detectChanges();
        const asterisk = fixture.nativeElement.querySelector('[data-automation-id="adf-checkbox-widget-asterisk"]');

        expect(asterisk).not.toBeNull();
    });

    it('should show no asterisk after the name of an optional checkbox', () => {
        const form = createFieldsForm([{ id: 'agree', name: 'Agree', type: 'boolean' }]);

        const fixture = renderWidget(SignalCheckboxWidgetComponent, form, 'agree');
        const asterisk = fixture.nativeElement.querySelector('[data-automation-id="adf-checkbox-widget-asterisk"]');

        expect(asterisk).toBeNull();
    });
});
