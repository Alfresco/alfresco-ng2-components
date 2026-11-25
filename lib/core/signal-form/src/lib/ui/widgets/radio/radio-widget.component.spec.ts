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
import { TestBed } from '@angular/core/testing';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { createFieldsForm, renderWidget } from '../../testing/widget-testing.mock';
import { SignalRadioWidgetComponent } from './radio-widget.component';

describe('SignalRadioWidgetComponent', () => {
    const sizes = [
        { id: 'small', name: 'Small' },
        { id: 'large', name: 'Large' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should submit the chosen option', async () => {
        const form = createFieldsForm([{ id: 'size', name: 'Size', type: 'radio-buttons', options: sizes }]);
        const fixture = renderWidget(SignalRadioWidgetComponent, form, 'size');
        const group = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatRadioGroupHarness.with({ selector: '#size' }));

        await group.checkRadioButton({ label: 'Large' });
        const submittedSize = form.submittedValues()['size'];

        expect(submittedSize).toEqual({ id: 'large', name: 'Large' });
    });

    it('should show a radio button for each option', () => {
        const form = createFieldsForm([{ id: 'size', name: 'Size', type: 'radio-buttons', options: sizes }]);

        const fixture = renderWidget(SignalRadioWidgetComponent, form, 'size');
        const radioButtons = fixture.nativeElement.querySelectorAll('.adf-radio-button');

        expect(radioButtons.length).toBe(2);
    });

    it('should show an asterisk after the name of a required radio group', () => {
        const form = createFieldsForm([{ id: 'size', name: 'Size', type: 'radio-buttons', required: true, options: sizes }]);

        const fixture = renderWidget(SignalRadioWidgetComponent, form, 'size');
        const asterisk = fixture.nativeElement.querySelector('.adf-asterisk');

        expect(asterisk).not.toBeNull();
    });

    it('should show an asterisk once a rule makes an optional radio group required', () => {
        const form = createFieldsForm([{ id: 'size', name: 'Size', type: 'radio-buttons', options: sizes }]);
        const fixture = renderWidget(SignalRadioWidgetComponent, form, 'size');

        form.setRequired('size', true);
        fixture.detectChanges();
        const asterisk = fixture.nativeElement.querySelector('.adf-asterisk');

        expect(asterisk).not.toBeNull();
    });

    it('should show no asterisk after the name of an optional radio group', () => {
        const form = createFieldsForm([{ id: 'size', name: 'Size', type: 'radio-buttons', options: sizes }]);

        const fixture = renderWidget(SignalRadioWidgetComponent, form, 'size');
        const asterisk = fixture.nativeElement.querySelector('.adf-asterisk');

        expect(asterisk).toBeNull();
    });
});
