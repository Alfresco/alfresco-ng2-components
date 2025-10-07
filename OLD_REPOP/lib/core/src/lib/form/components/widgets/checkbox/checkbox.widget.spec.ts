/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UnitTestingUtils } from '../../../../testing';
import { FormFieldModel, FormFieldTypes, FormModel } from '../core';
import { CheckboxWidgetComponent } from './checkbox.widget';

describe('CheckboxWidgetComponent', () => {
    let loader: HarnessLoader;
    let widget: CheckboxWidgetComponent;
    let fixture: ComponentFixture<CheckboxWidgetComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatCheckboxModule]
        });
        fixture = TestBed.createComponent(CheckboxWidgetComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => fixture.destroy());

    describe('when template is ready', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'check-id',
                name: 'check-name',
                value: '',
                type: FormFieldTypes.BOOLEAN,
                readOnly: false,
                required: true
            });
        });

        it('should be marked as invalid when required after interaction', async () => {
            const checkbox = await testingUtils.getMatCheckbox();
            expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();

            await checkbox.check();
            await checkbox.uncheck();

            expect(testingUtils.getByCSS('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk = testingUtils.getByCSS('.adf-asterisk').nativeElement;

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });

        it('should be checked if boolean true is passed', async () => {
            widget.field.value = true;
            fixture.detectChanges();

            expect(await testingUtils.checkIfMatCheckboxIsChecked()).toBe(true);
        });

        it('should not be checked if false is passed', async () => {
            widget.field.value = false;
            fixture.detectChanges();

            expect(await testingUtils.checkIfMatCheckboxIsChecked()).toBe(false);
        });

        describe('when tooltip is set', () => {
            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                    type: FormFieldTypes.BOOLEAN,
                    tooltip: 'my custom tooltip'
                });
                fixture.detectChanges();
            });

            it('should show tooltip', async () => {
                await testingUtils.hoverOverMatCheckbox();
                const host = await testingUtils.getMatCheckboxHost();
                const tooltip = await host.getAttribute('title');
                expect(tooltip).toBe('my custom tooltip');
            });
        });
    });
});
