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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockFeatureFlags } from '../mocks/features-service-mock.factory';
import { FeaturesDirective } from './features.directive';
import { UnitTestingUtils } from '@alfresco/adf-core';

@Component({
    template: `
        <div>
            <div id="underFeatureFlag" *adfForFeatures="features"></div>
        </div>
    `
})
class TestWithEnabledFlagComponent {
    features = 'feature1';
}
@Component({
    template: `
        <div>
            <div id="underFeatureFlag" *adfForFeatures="features"></div>
        </div>
    `
})
class TestWithDisabledFlagComponent {
    features = ['feature1', 'feature2'];
}

describe('FeaturesDirective', () => {
    let enabledFixture: ComponentFixture<TestWithEnabledFlagComponent>;
    let disabledFixture: ComponentFixture<TestWithDisabledFlagComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommonModule, FeaturesDirective],
            providers: [
                provideMockFeatureFlags({
                    feature1: true,
                    feature2: false,
                    feature3: true
                }),
                FeaturesDirective
            ],
            declarations: [TestWithEnabledFlagComponent, TestWithDisabledFlagComponent]
        });
        enabledFixture = TestBed.createComponent(TestWithEnabledFlagComponent);
        enabledFixture.detectChanges();

        disabledFixture = TestBed.createComponent(TestWithDisabledFlagComponent);
        disabledFixture.detectChanges();

        await enabledFixture.whenStable();
        await disabledFixture.whenStable();
    });

    it('should render the element with enabled features', () => {
        const enabledFixtureElement = UnitTestingUtils.getByCSS(enabledFixture.debugElement, '#underFeatureFlag');
        expect(enabledFixtureElement).toBeDefined();
        expect(enabledFixtureElement.nativeElement).toBeDefined();
    });

    it('should not render the element with disabled features', () => {
        expect(UnitTestingUtils.getByCSS(disabledFixture.debugElement, '#underFeatureFlag')).toBeNull();
    });
});
