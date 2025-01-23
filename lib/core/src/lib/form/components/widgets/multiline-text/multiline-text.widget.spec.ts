/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormModel } from '../core/form.model';
import { FormFieldModel } from '../core/form-field.model';
import { FormFieldTypes } from '../core/form-field-types';
import { MultilineTextWidgetComponentComponent } from './multiline-text.widget';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopTranslateModule } from '../../../../testing/noop-translate.module';
import { UnitTestingUtils } from '../../../../testing/unit-testing-utils';

describe('MultilineTextWidgetComponentComponent', () => {
    let loader: HarnessLoader;
    let widget: MultilineTextWidgetComponentComponent;
    let fixture: ComponentFixture<MultilineTextWidgetComponentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAnimationsModule, MultilineTextWidgetComponentComponent]
        });
        fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('when tooltip is set', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.MULTILINE_TEXT,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const host = await UnitTestingUtils.getMatInputHost(loader);
            await host.hover();

            const tooltip = await host.getAttribute('title');
            expect(tooltip).toBe('my custom tooltip');
        });
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.MULTILINE_TEXT,
                required: true
            });
            fixture.detectChanges();
        });

        it('should be marked as invalid after interaction', async () => {
            expect(UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-invalid')).toBeFalsy();

            await UnitTestingUtils.blurMatInput(loader);
            expect(UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk', async () => {
            const asterisk = UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-asterisk').nativeElement;

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });
});
