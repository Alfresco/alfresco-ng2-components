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

import { FormFieldType } from '../definition/form-field-types';
import { SignalAmountWidgetComponent } from '../ui/widgets/amount/amount-widget.component';
import { SignalCheckboxWidgetComponent } from '../ui/widgets/checkbox/checkbox-widget.component';
import { SignalDateWidgetComponent } from '../ui/widgets/date/date-widget.component';
import { SignalDropdownWidgetComponent } from '../ui/widgets/dropdown/dropdown-widget.component';
import { SignalMultilineTextWidgetComponent } from '../ui/widgets/multiline-text/multiline-text-widget.component';
import { SignalRadioWidgetComponent } from '../ui/widgets/radio/radio-widget.component';
import { BUILT_IN_FIELD_TYPE_RESOLVER } from './built-in-field-types';

describe('BUILT_IN_FIELD_TYPES', () => {
    it('should show a multi-line text field with the multi-line text widget', async () => {
        const widget = await BUILT_IN_FIELD_TYPE_RESOLVER.definitionFor(FormFieldType.MultilineText)?.component?.();

        expect(widget).toBe(SignalMultilineTextWidgetComponent);
    });

    it('should show an amount field with the amount widget', async () => {
        const widget = await BUILT_IN_FIELD_TYPE_RESOLVER.definitionFor(FormFieldType.Amount)?.component?.();

        expect(widget).toBe(SignalAmountWidgetComponent);
    });

    it('should show a boolean field with the checkbox widget', async () => {
        const widget = await BUILT_IN_FIELD_TYPE_RESOLVER.definitionFor(FormFieldType.Boolean)?.component?.();

        expect(widget).toBe(SignalCheckboxWidgetComponent);
    });

    it('should show a dropdown field with the dropdown widget', async () => {
        const widget = await BUILT_IN_FIELD_TYPE_RESOLVER.definitionFor(FormFieldType.Dropdown)?.component?.();

        expect(widget).toBe(SignalDropdownWidgetComponent);
    });

    it('should show a radio buttons field with the radio widget', async () => {
        const widget = await BUILT_IN_FIELD_TYPE_RESOLVER.definitionFor(FormFieldType.RadioButtons)?.component?.();

        expect(widget).toBe(SignalRadioWidgetComponent);
    });

    it('should show a date field with the date widget', async () => {
        const widget = await BUILT_IN_FIELD_TYPE_RESOLVER.definitionFor(FormFieldType.Date)?.component?.();

        expect(widget).toBe(SignalDateWidgetComponent);
    });
});
