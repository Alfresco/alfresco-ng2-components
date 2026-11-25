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
import { createFieldsForm, pasteInto, renderWidget } from '../../testing/widget-testing.mock';
import { SignalDecimalWidgetComponent } from './decimal-widget.component';

describe('SignalDecimalWidgetComponent', () => {
    const textInput = (element: HTMLElement): HTMLInputElement => element.querySelector('input');

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should accept a paste of any length, as a decimal has no length limit', () => {
        const form = createFieldsForm([{ id: 'ratio', type: 'bigdecimal' }]);
        const fixture = renderWidget(SignalDecimalWidgetComponent, form, 'ratio');

        const accepted = pasteInto(textInput(fixture.nativeElement), '1'.repeat(2000));

        expect(accepted.defaultPrevented).toBeFalse();
    });

    it('should style decimal fields as today', () => {
        const form = createFieldsForm([{ id: 'ratio', type: 'bigdecimal' }]);

        const fixture = renderWidget(SignalDecimalWidgetComponent, form, 'ratio');
        const styledElement = fixture.nativeElement.querySelector('.adf-decimal-widget');

        expect(styledElement).not.toBeNull();
    });
});
