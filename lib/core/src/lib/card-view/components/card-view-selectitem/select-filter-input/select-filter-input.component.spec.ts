/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreTestingModule } from '../../../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SelectFilterInputComponent } from './select-filter-input.component';
import { MatSelect } from '@angular/material/select';

describe('SelectFilterInputComponent', () => {
    let fixture: ComponentFixture<SelectFilterInputComponent>;
    let component: SelectFilterInputComponent;
    let matSelect: MatSelect;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), CoreTestingModule],
            providers: [MatSelect]
        });

        fixture = TestBed.createComponent(SelectFilterInputComponent);
        component = fixture.componentInstance;
        matSelect = TestBed.inject(MatSelect);
        fixture.detectChanges();
    });

    it('should focus input on initialization', async () => {
        spyOn(component.selectFilterInput.nativeElement, 'focus');
        matSelect.openedChange.next(true);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.selectFilterInput.nativeElement.focus).toHaveBeenCalled();
    });

    it('should clear search term on close', async () => {
        component.onModelChange('some-search-term');
        expect(component.term).toBe('some-search-term');

        matSelect.openedChange.next(false);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.term).toBe('');
    });

    it('should emit event when value changes', async () => {
        spyOn(component.change, 'next');
        component.onModelChange('some-search-term');
        expect(component.change.next).toHaveBeenCalledWith('some-search-term');
    });

    it('should reset value on reset() event', () => {
        component.onModelChange('some-search-term');
        expect(component.term).toBe('some-search-term');

        component.reset();
        expect(component.term).toBe('');
    });

    it('should reset value on Escape event', () => {
        component.onModelChange('some-search-term');
        expect(component.term).toBe('some-search-term');

        component.selectFilterInput.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { "code": 'Escape' } as any));
        fixture.detectChanges();
        expect(component.term).toBe('');
    });
});
