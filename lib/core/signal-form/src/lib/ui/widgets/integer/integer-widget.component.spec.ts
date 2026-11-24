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
import { createFieldsForm, errorText, pasteInto, renderWidget } from '../../testing/widget-testing.mock';
import { SignalIntegerWidgetComponent } from './integer-widget.component';

describe('SignalIntegerWidgetComponent', () => {
    const textInput = (element: HTMLElement): HTMLInputElement => element.querySelector('input');

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should refuse a paste longer than an integer allows', () => {
        const form = createFieldsForm([{ id: 'count', type: 'integer' }]);
        const fixture = renderWidget(SignalIntegerWidgetComponent, form, 'count');

        const refused = pasteInto(textInput(fixture.nativeElement), '1'.repeat(11));
        fixture.detectChanges();

        expect(refused.defaultPrevented).toBeTrue();
        expect(errorText(fixture.nativeElement)).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');
    });

    it('should accept a paste that fits an integer', () => {
        const form = createFieldsForm([{ id: 'count', type: 'integer' }]);
        const fixture = renderWidget(SignalIntegerWidgetComponent, form, 'count');

        const accepted = pasteInto(textInput(fixture.nativeElement), '1'.repeat(10));

        expect(accepted.defaultPrevented).toBeFalse();
    });

    it('should style integer fields as today', () => {
        const form = createFieldsForm([{ id: 'count', type: 'integer' }]);

        const fixture = renderWidget(SignalIntegerWidgetComponent, form, 'count');
        const styledElement = fixture.nativeElement.querySelector('.adf-number-widget');

        expect(styledElement).not.toBeNull();
    });
});
