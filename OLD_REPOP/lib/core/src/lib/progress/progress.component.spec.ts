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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ProgressComponent } from './progress.component';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

describe('ProgressComponent', () => {
    let component: ProgressComponent;
    let fixture: ComponentFixture<ProgressComponent>;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProgressComponent]
        });

        fixture = TestBed.createComponent(ProgressComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should default to bar variant and indeterminate mode', () => {
        expect(component.variant).toBe('bar');
        expect(component.mode).toBe('indeterminate');
    });

    it('should change mode to determinate when value is set', () => {
        component.value = 50;
        expect(component.mode).toBe('determinate');
    });

    it('should not change mode if variant is spinner and an invalid mode is set', () => {
        component.variant = 'spinner';
        component.mode = 'query'; // Invalid for spinner
        expect(component.mode).toBe('indeterminate');
    });

    it('should accept buffer mode when variant is bar', () => {
        component.variant = 'bar';
        component.mode = 'buffer';
        expect(component.mode).toBe('buffer');
    });

    it('should ignore setting value to undefined', () => {
        component.value = 50;
        component.value = undefined;
        expect(component.value).toBeUndefined();
        expect(component.mode).toBe('determinate'); // Mode remains unchanged
    });

    it('should apply ariaLabel if provided', async () => {
        const testLabel = 'Progress Label';
        component.ariaLabel = testLabel;
        fixture.detectChanges();

        const host = await testingUtils.getMatProgressBarHost();

        expect(await host.getAttribute('aria-label')).toBe(testLabel);
    });

    it('should hide from accessibility tree if ariaHidden is true', async () => {
        component.ariaHidden = true;
        fixture.detectChanges();

        const host = await testingUtils.getMatProgressBarHost();

        expect(await host.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set testId if provided', () => {
        const testId = 'progress-test-id';
        component.testId = testId;
        fixture.detectChanges();
        const progressBarElement = testingUtils.getByDataAutomationId(testId);
        expect(progressBarElement).not.toBeNull();
    });
});
