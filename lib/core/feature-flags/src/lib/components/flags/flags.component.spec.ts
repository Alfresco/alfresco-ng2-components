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

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FlagsComponent } from './flags.component';
import { FeaturesDirective } from '../../directives/features.directive';
import { WritableFeaturesServiceToken } from '../../interfaces/features.interface';
import { provideMockFeatureFlags } from '../../mocks/features-service-mock.factory';
import { StorageFeaturesService } from '../../services/storage-features.service';

describe('FlagsComponent', () => {
    let component: FlagsComponent;
    let fixture: ComponentFixture<FlagsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlagsComponent, FeaturesDirective],
            providers: [
                { provide: WritableFeaturesServiceToken, useClass: StorageFeaturesService },
                provideMockFeatureFlags({
                    feature1: true,
                    feature2: false,
                    feature3: true
                })
            ]
        });

        const storageFeaturesService = TestBed.inject(WritableFeaturesServiceToken);
        storageFeaturesService.init();
    });

    it('should initialize flags signal', fakeAsync(() => {
        fixture = TestBed.createComponent(FlagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        tick(100);
        const flags = component.flags();
        expect(flags).toEqual([
            { fictive: false, flag: 'feature1', value: true },
            { fictive: false, flag: 'feature2', value: false },
            { fictive: false, flag: 'feature3', value: true }
        ]);
    }));

    it('should update inputValue$ when onInputChange is called', (done) => {
        fixture = TestBed.createComponent(FlagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.onInputChange('test');
        component.inputValue$.subscribe((value) => {
            expect(value).toBe('test');
            done();
        });
    });

    it('should clear inputValue when onClearInput is called', () => {
        fixture = TestBed.createComponent(FlagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.inputValue = 'test';
        component.onClearInput();
        expect(component.inputValue).toBe('');
    });

    it('should filter flags when input value changes', fakeAsync(() => {
        fixture = TestBed.createComponent(FlagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.onInputChange('feature1');
        tick(150);
        const flags = component.flags();
        expect(flags).toEqual([{ fictive: false, flag: 'feature1', value: true }]);
    }));

    afterEach(() => {
        fixture.destroy();
    });
});
