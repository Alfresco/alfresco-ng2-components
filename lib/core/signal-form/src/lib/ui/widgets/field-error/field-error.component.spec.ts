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
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconHarness } from '@angular/material/icon/testing';
import { NoopTranslateModule } from '../../../../../../src/lib/testing/noop-translate.module';
import { SignalFieldErrorComponent } from './field-error.component';

describe('SignalFieldErrorComponent', () => {
    it("should show the error icon and the error's message", async () => {
        TestBed.configureTestingModule({ imports: [NoopTranslateModule] });
        const fixture = TestBed.createComponent(SignalFieldErrorComponent);
        fixture.componentRef.setInput('message', { key: 'FORM.FIELD.VALIDATOR.NO_LONGER_THAN', params: { maxLength: '5' } });
        fixture.detectChanges();
        const element: HTMLElement = fixture.nativeElement;

        const icon = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatIconHarness.with({ selector: '.adf-error-icon' }));

        expect(await icon.getName()).toBe('error_outline');
        expect(element.querySelector('.adf-error-text')?.textContent).toBe('FORM.FIELD.VALIDATOR.NO_LONGER_THAN');
    });
});
