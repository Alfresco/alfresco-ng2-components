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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockFeatureFlags } from '../mocks/features-service-mock.factory';
import { NotFeaturesDirective } from './not-features.directive';
import { UnitTestingUtils } from '../../../../src/lib/testing/unit-testing-utils';

@Component({
    template: `
        <div>
            <div id="underFeatureFlag" *adfNotForFeatures="features"></div>
        </div>
    `,
    standalone: false
})
class TestWithEnabledFlagComponent {
    features = ['feature1', 'feature3'];
}

@Component({
    template: `
        <div>
            <div id="underFeatureFlag" *adfNotForFeatures="features"></div>
        </div>
    `,
    standalone: false
})
class TestWithDisabledFlagComponent {
    features = 'feature2';
}

describe('NotFeaturesDirective', () => {
    let enabledFixture: ComponentFixture<TestWithEnabledFlagComponent>;
    let disabledFixture: ComponentFixture<TestWithDisabledFlagComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NotFeaturesDirective],
            providers: [
                provideMockFeatureFlags({
                    feature1: true,
                    feature2: false,
                    feature3: true
                }),
                NotFeaturesDirective
            ],
            declarations: [TestWithEnabledFlagComponent, TestWithDisabledFlagComponent]
        });
        enabledFixture = TestBed.createComponent(TestWithEnabledFlagComponent);
        enabledFixture.detectChanges();

        disabledFixture = TestBed.createComponent(TestWithDisabledFlagComponent);
        disabledFixture.detectChanges();

        testingUtils = new UnitTestingUtils(disabledFixture.debugElement);
    });

    it('should render the element with disabled features', () => {
        const disabledFixtureElement = testingUtils.getByCSS('#underFeatureFlag');
        expect(disabledFixtureElement).toBeDefined();
        expect(disabledFixtureElement.nativeElement).toBeDefined();
    });

    it('should not render the element with enabled features', () => {
        testingUtils.setDebugElement(enabledFixture.debugElement);
        expect(testingUtils.getByCSS('#underFeatureFlag')).toBeNull();
    });
});
