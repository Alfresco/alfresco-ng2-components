/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { By } from '@angular/platform-browser';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewSelectItemComponent } from './card-view-selectitem.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { of } from 'rxjs';

describe('CardViewSelectItemComponent', () => {

    let fixture: ComponentFixture<CardViewSelectItemComponent>;
    let component: CardViewSelectItemComponent;
    const mockData = [{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }, { key: 'three', label: 'Three' }];
    const mockDefaultProps = {
        label: 'Select box label',
        value: 'two',
        options$: of(mockData),
        key: 'key',
        editable: true
    };

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewSelectItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewSelectItemModel(mockDefaultProps);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering', () => {
        it('should render the label', () => {
            fixture.detectChanges();

            const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('Select box label');
        });

        it('should render readOnly value is editable property is FALSE', () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: false
            });

            component.ngOnChanges();
            fixture.detectChanges();

            const readOnly = fixture.debugElement.query(By.css('[data-automation-class="read-only-value"]'));
            const selectBox = fixture.debugElement.query(By.css('[data-automation-class="select-box"]'));

            expect(readOnly).not.toBeNull();
            expect(selectBox).toBeNull();
        });

        it('should render select box if editable property is TRUE', () => {
            component.ngOnChanges();
            component.editable = true;
            fixture.detectChanges();

            const selectBox = fixture.debugElement.query(By.css('[data-automation-class="select-box"]'));
            expect(selectBox).not.toBeNull();
        });

        it('should not have label twice', () => {
            component.ngOnChanges();
            component.editable = true;
            fixture.detectChanges();

            const label = fixture.debugElement.query(By.css('[data-automation-class="select-box"] .mat-form-field-label'));
            expect(label).toBeNull();
        });

    });
});
