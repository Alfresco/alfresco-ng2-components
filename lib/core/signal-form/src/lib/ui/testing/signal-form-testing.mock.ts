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

import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FormFieldType } from '../../definition/form-definition.model';
import { BUILT_IN_FORM_WIDGETS } from '../../widgets/built-in-form-widgets';
import { FormWidgetDefinition } from '../../widgets/form-widget-definition';
import { SignalAmountWidgetComponent } from '../widgets/amount/amount-widget.component';
import { SignalCheckboxWidgetComponent } from '../widgets/checkbox/checkbox-widget.component';
import { SignalDateWidgetComponent } from '../widgets/date/date-widget.component';
import { SignalDateTimeWidgetComponent } from '../widgets/date-time/date-time-widget.component';
import { SignalDisplayTextWidgetComponent } from '../widgets/display-text/display-text-widget.component';
import { SignalDropdownWidgetComponent } from '../widgets/dropdown/dropdown-widget.component';
import { SignalHyperlinkWidgetComponent } from '../widgets/hyperlink/hyperlink-widget.component';
import { SignalJsonWidgetComponent } from '../widgets/json/json-widget.component';
import { SignalMultilineTextWidgetComponent } from '../widgets/multiline-text/multiline-text-widget.component';
import { SignalRadioWidgetComponent } from '../widgets/radio/radio-widget.component';
import { SignalDecimalWidgetComponent, SignalIntegerWidgetComponent, SignalTextWidgetComponent } from '../widgets/text/text-widget.component';

const DIRECT_COMPONENTS: Readonly<Record<string, Type<unknown>>> = {
    [FormFieldType.Text]: SignalTextWidgetComponent,
    [FormFieldType.MultilineText]: SignalMultilineTextWidgetComponent,
    [FormFieldType.Integer]: SignalIntegerWidgetComponent,
    [FormFieldType.Amount]: SignalAmountWidgetComponent,
    [FormFieldType.Decimal]: SignalDecimalWidgetComponent,
    [FormFieldType.Boolean]: SignalCheckboxWidgetComponent,
    [FormFieldType.Dropdown]: SignalDropdownWidgetComponent,
    [FormFieldType.RadioButtons]: SignalRadioWidgetComponent,
    [FormFieldType.Date]: SignalDateWidgetComponent,
    [FormFieldType.DateTime]: SignalDateTimeWidgetComponent,
    [FormFieldType.String]: SignalTextWidgetComponent,
    [FormFieldType.Hyperlink]: SignalHyperlinkWidgetComponent,
    [FormFieldType.DisplayValue]: SignalTextWidgetComponent,
    [FormFieldType.ReadonlyText]: SignalDisplayTextWidgetComponent,
    [FormFieldType.Json]: SignalJsonWidgetComponent
};

/**
 * The built-in widgets with their components imported up front, so specs don't fetch lazy chunks.
 */
export const BUILT_IN_WIDGETS_LOADED_DIRECTLY: FormWidgetDefinition[] = BUILT_IN_FORM_WIDGETS.filter(
    (definition) => DIRECT_COMPONENTS[definition.type]
).map((definition) => ({ ...definition, component: () => Promise.resolve(DIRECT_COMPONENTS[definition.type]) }));

/**
 * Runs change detection until the fixture is stable and, unless told otherwise, no field is still loading its widget.
 *
 * @param fixture the fixture rendering a form
 * @param untilLoaded whether to wait for every widget to load
 */
export const settleFixture = async (fixture: ComponentFixture<unknown>, untilLoaded = true): Promise<void> => {
    const loading = () => fixture.nativeElement.querySelector('[data-automation-id="adf-signal-form-field-loading"]');
    for (let pass = 0; pass < 50; pass++) {
        fixture.detectChanges();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (pass >= 2 && (!untilLoaded || !loading())) {
            break;
        }
    }
    fixture.detectChanges();
};
