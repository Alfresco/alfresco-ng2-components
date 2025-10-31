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
import { FeatureFlagsWrapperComponent } from './feature-flags-wrapper';
import { provideMockFeatureFlags } from '../mocks/features-service-mock.factory';
import { WritableFeaturesServiceToken } from '../interfaces/features.interface';
import { StorageFeaturesService } from '../services/storage-features.service';
import { TranslateModule } from '@ngx-translate/core';

describe('FeatureFlagsWrapperComponent', () => {
    let fixture: ComponentFixture<FeatureFlagsWrapperComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FeatureFlagsWrapperComponent, TranslateModule.forRoot()],
            providers: [{ provide: WritableFeaturesServiceToken, useClass: StorageFeaturesService }, provideMockFeatureFlags({})]
        });

        const storageFeaturesService = TestBed.inject(WritableFeaturesServiceToken);
        storageFeaturesService.init();

        fixture = TestBed.createComponent(FeatureFlagsWrapperComponent);
        fixture.detectChanges();
    });

    it('should render the wrapper div', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.adf-feature-flags-wrapper')).toBeTruthy();
    });

    it('should render the feature flags overrides component', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('adf-feature-flags-overrides')).toBeTruthy();
    });
});
