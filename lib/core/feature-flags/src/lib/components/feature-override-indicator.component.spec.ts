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
import { FlagsOverrideComponent } from './feature-override-indicator.component';
import { FeaturesServiceToken } from '../interfaces/features.interface';
import { BehaviorSubject } from 'rxjs';

describe('FlagsOverrideComponent', () => {
    let component: FlagsOverrideComponent;
    let fixture: ComponentFixture<FlagsOverrideComponent>;
    let isEnabledSubject: BehaviorSubject<boolean>;

    beforeEach(() => {
        isEnabledSubject = new BehaviorSubject<boolean>(false);

        TestBed.configureTestingModule({
            imports: [FlagsOverrideComponent],
            providers: [
                {
                    provide: FeaturesServiceToken,
                    useValue: {
                        isEnabled$: () => isEnabledSubject.asObservable()
                    }
                }
            ]
        });

        fixture = TestBed.createComponent(FlagsOverrideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should show red indicator when disabled', () => {
        const compiled = fixture.nativeElement;

        expect(component.isEnabled).toBe(false);
        expect(compiled.textContent).toContain('🔴');
    });

    it('should show green indicator when enabled', () => {
        isEnabledSubject.next(true);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;

        expect(component.isEnabled).toBe(true);
        expect(compiled.textContent).toContain('🟢');
    });

    it('should update when isEnabled$ emits new value', () => {
        expect(component.isEnabled).toBe(false);

        isEnabledSubject.next(true);
        fixture.detectChanges();
        expect(component.isEnabled).toBe(true);

        isEnabledSubject.next(false);
        fixture.detectChanges();
        expect(component.isEnabled).toBe(false);
    });

    it('should support small size', () => {
        component.size = 'small';

        expect(component.size).toBe('small');
    });

    it('should have medium size by default', () => {
        expect(component.size).toBe('medium');
    });

    it('should support large size', () => {
        component.size = 'large';

        expect(component.size).toBe('large');
    });

    it('should trigger change detection when isEnabled changes', () => {
        isEnabledSubject.next(true);
        fixture.detectChanges();

        expect(component.isEnabled).toBe(true);
    });

    it('should create component when isEnabled$ is not available', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [FlagsOverrideComponent],
            providers: [
                {
                    provide: FeaturesServiceToken,
                    useValue: {}
                }
            ]
        });

        const testFixture = TestBed.createComponent(FlagsOverrideComponent);
        testFixture.detectChanges();

        expect(testFixture.componentInstance).toBeTruthy();
        expect(testFixture.componentInstance.isEnabled).toBe(false);
        expect(testFixture.nativeElement.textContent).toContain('🔴');
    });
});
