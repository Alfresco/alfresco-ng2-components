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
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { createFieldsForm, renderWidget } from '../../testing/widget-testing.mock';
import { SignalDropdownWidgetComponent } from './dropdown-widget.component';

describe('SignalDropdownWidgetComponent', () => {
    const options = (...names: string[]) => names.map((name) => ({ id: name.toLowerCase(), name }));
    const select = (fixture: ComponentFixture<SignalDropdownWidgetComponent>, selector: string): Promise<MatSelectHarness> =>
        TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness.with({ selector }));

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should submit the chosen option of a single dropdown', async () => {
        const form = createFieldsForm([
            { id: 'country', name: 'Country', type: 'dropdown', hasEmptyValue: true, options: options('Italy', 'France') }
        ]);
        const fixture = renderWidget(SignalDropdownWidgetComponent, form, 'country');
        const country = await select(fixture, '#country');

        await country.open();
        await country.clickOptions({ text: 'France' });
        const submittedCountry = form.submittedValues()['country'];

        expect(submittedCountry).toEqual({ id: 'france', name: 'France' });
    });

    it('should submit the chosen options of a multiple dropdown', async () => {
        const form = createFieldsForm([{ id: 'tags', name: 'Tags', type: 'dropdown', selectionType: 'multiple', options: options('Alpha', 'Beta') }]);
        const fixture = renderWidget(SignalDropdownWidgetComponent, form, 'tags');
        const tags = await select(fixture, '#tags');

        await tags.open();
        await tags.clickOptions({ text: 'Alpha' });
        await tags.clickOptions({ text: 'Beta' });
        const submittedTags = form.submittedValues()['tags'];

        expect(submittedTags).toEqual([
            { id: 'alpha', name: 'Alpha' },
            { id: 'beta', name: 'Beta' }
        ]);
    });

    it('should disable a read-only dropdown', async () => {
        const form = createFieldsForm([{ id: 'locked', name: 'Locked', type: 'dropdown', readOnly: true, options: options('One') }]);
        const fixture = renderWidget(SignalDropdownWidgetComponent, form, 'locked');

        const disabled = await (await select(fixture, '#locked')).isDisabled();

        expect(disabled).toBeTrue();
    });

    it('should mark a required dropdown as required', async () => {
        const form = createFieldsForm([{ id: 'country', type: 'dropdown', required: true, options: options('Italy') }]);
        const fixture = renderWidget(SignalDropdownWidgetComponent, form, 'country');

        const required = await (await select(fixture, '#country')).isRequired();

        expect(required).toBeTrue();
    });

    it('should follow rules that change whether the dropdown is required', async () => {
        const form = createFieldsForm([{ id: 'country', type: 'dropdown', required: true, options: options('Italy') }]);
        const fixture = renderWidget(SignalDropdownWidgetComponent, form, 'country');

        form.setRequired('country', false);
        const required = await (await select(fixture, '#country')).isRequired();

        expect(required).toBeFalse();
    });

    it('should show its label to the left when the form asks for it', () => {
        const form = createFieldsForm([{ id: 'country', name: 'Country', type: 'dropdown', options: options('Italy') }], { leftLabels: true });

        const fixture = renderWidget(SignalDropdownWidgetComponent, form, 'country');
        const leftLabelText = fixture.nativeElement.querySelector('label.adf-signal-form-left-label[for="country"]')?.textContent;

        expect(leftLabelText).toContain('Country');
    });

    it('should name the dropdown by its left label', () => {
        const form = createFieldsForm([{ id: 'country', name: 'Country', type: 'dropdown', options: options('Italy') }], { leftLabels: true });

        const fixture = renderWidget(SignalDropdownWidgetComponent, form, 'country');
        const labelledBy = fixture.nativeElement.querySelector('#country')?.getAttribute('aria-labelledby')?.split(' ').filter(Boolean);

        expect(labelledBy).toEqual(['country-label']);
    });
});
