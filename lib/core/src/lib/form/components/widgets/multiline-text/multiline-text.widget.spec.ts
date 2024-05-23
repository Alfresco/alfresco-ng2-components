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
import { MatInputHarness } from '@angular/material/input/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { FormModel } from '../core/form.model';
import { FormFieldModel } from '../core/form-field.model';
import { FormFieldTypes } from '../core/form-field-types';
import { MultilineTextWidgetComponentComponent } from './multiline-text.widget';
import { ComponentFixture, getTestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../../translation/translation.service';
import { TranslationMock } from '../../../../mock/translation.service.mock';

describe('MultilineTextWidgetComponentComponent', () => {
    let loader: HarnessLoader;
    let widget: MultilineTextWidgetComponentComponent;
    let fixture: ComponentFixture<MultilineTextWidgetComponentComponent>;
    let element: HTMLElement;

    beforeEach(() => {
        getTestBed().configureTestingModule({
            imports: [TranslateModule.forRoot(), NoopAnimationsModule],
            providers: [{ provide: TranslationService, useClass: TranslationMock }]
        });
        fixture = getTestBed().createComponent(MultilineTextWidgetComponentComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
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
            const input = await loader.getHarness(MatInputHarness);
            await (await input.host()).hover();

            const tooltip = await (await input.host()).getAttribute('title');
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
            const input = await loader.getHarness(MatInputHarness);
            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

            await (await input.host()).blur();
            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk', async () => {
            const asterisk = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });
});
