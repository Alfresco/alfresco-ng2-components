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
import { OverlayContainer } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewSelectItemComponent } from './card-view-selectitem.component';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('CardViewSelectItemComponent', () => {

    let fixture: ComponentFixture<CardViewSelectItemComponent>;
    let component: CardViewSelectItemComponent;
    let overlayContainer: OverlayContainer;
    const mockData = [{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }, { key: 'three', label: 'Three' }];
    const mockDefaultProps = {
        label: 'Select box label',
        value: 'two',
        options$: of(mockData),
        key: 'key',
        editable: true
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewSelectItemComponent);
        component = fixture.componentInstance;
        overlayContainer = TestBed.inject(OverlayContainer);
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

        it('should be possible edit selectBox item', () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = true;
            component.ngOnChanges();
            fixture.detectChanges();

            expect(component.value).toEqual('two');
            expect(component.isEditable()).toBe(true);
            const selectBox = fixture.debugElement.query(By.css('.mat-select-trigger'));
            selectBox.triggerEventHandler('click', {});

            fixture.detectChanges();
            const optionsElement = Array.from(overlayContainer.getContainerElement().querySelectorAll('mat-option'));
            expect(optionsElement.length).toEqual(4);
            optionsElement[1].dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(component.value).toEqual('one');
        });

        it('should be able to enable None option', () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = true;
            component.ngOnChanges();
            fixture.detectChanges();

            expect(component.isEditable()).toBe(true);
            const selectBox = fixture.debugElement.query(By.css('.mat-select-trigger'));
            selectBox.triggerEventHandler('click', {});

            fixture.detectChanges();
            const noneElement: HTMLElement = overlayContainer.getContainerElement().querySelector('mat-option');
            expect(noneElement).toBeDefined();
            expect(noneElement.innerText).toEqual('CORE.CARDVIEW.NONE');
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
