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
import { NoopTranslateModule } from '../../../../../src/lib/testing/noop-translate.module';
import { typeInto } from '../testing/widget-testing.mock';
import { SignalMaskedTextInputControlComponent } from './masked-text-input-control.component';

describe('SignalMaskedTextInputControlComponent', () => {
    const render = (value: string | null = null) => {
        const fixture = TestBed.createComponent(SignalMaskedTextInputControlComponent);
        fixture.componentRef.setInput('value', value);
        fixture.componentRef.setInput('inputId', 'phone');
        fixture.componentRef.setInput('mask', '(000) 000-0000');
        fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        return { fixture, control: fixture.componentInstance, input };
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
    });

    it('should show the value, and an empty text for no value', () => {
        expect(render('(123) 456-7890').input.value).toBe('(123) 456-7890');
        expect(render().input.value).toBe('');
    });

    it('should replace what is typed with the masked text', () => {
        const { control, input } = render();

        typeInto(input, '12a34567890');

        expect(input.value).toBe('(123) 456-7890');
        expect(control.value()).toBe('(123) 456-7890');
    });

    it('should fill a reversed mask from the right', () => {
        const { fixture, control, input } = render();
        fixture.componentRef.setInput('mask', '#.##0,00%');
        fixture.componentRef.setInput('reversed', true);
        fixture.detectChanges();

        typeInto(input, '1234');

        expect(control.value()).toBe('12,34%');
    });
});
