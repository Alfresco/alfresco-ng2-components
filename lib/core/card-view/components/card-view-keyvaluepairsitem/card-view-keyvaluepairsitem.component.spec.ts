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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardViewKeyValuePairsItemModel } from '../../models/card-view-keyvaluepairs.model';
import { CardViewKeyValuePairsItemComponent } from './card-view-keyvaluepairsitem.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { CardViewUpdateService } from '../../services/card-view-update.service';

describe('CardViewKeyValuePairsItemComponent', () => {

    let fixture: ComponentFixture<CardViewKeyValuePairsItemComponent>;
    let component: CardViewKeyValuePairsItemComponent;
    let cardViewUpdateService;
    const mockEmptyData = [{ name: '', value: '' }];
    const mockData = [{ name: 'test-name', value: 'test-value' }];

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewKeyValuePairsItemComponent);
        cardViewUpdateService = TestBed.get(CardViewUpdateService);
        component = fixture.componentInstance;
        component.property = new CardViewKeyValuePairsItemModel({
            label: 'Key Value Pairs',
            value: [],
            key: 'key-value-pairs',
            editable: true
        });
        component.editable = true;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Component', () => {

        it('should render the label', () => {
            fixture.detectChanges();

            const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('Key Value Pairs');
        });

        it('should render readOnly table is editable property is FALSE', () => {
            component.property = new CardViewKeyValuePairsItemModel({
                label: 'Key Value Pairs',
                value: mockData,
                key: 'key-value-pairs'
            });

            component.ngOnChanges();
            fixture.detectChanges();

            const table = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs__read-only'));
            const form = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs'));

            expect(table).not.toBeNull();
            expect(form).toBeNull();
        });

        it('should add new item on ADD button click', () => {
            component.ngOnChanges();
            fixture.detectChanges();

            const addButton = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs__add-btn'));
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(JSON.stringify(component.values)).toBe(JSON.stringify(mockEmptyData));

            const content = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs'));
            expect(content).not.toBeNull();

            const nameInput = fixture.debugElement.query(By.css(`[data-automation-id="card-${component.property.key}-name-input-0"]`));
            const valueInput = fixture.debugElement.query(By.css(`[data-automation-id="card-${component.property.key}-value-input-0"]`));
            expect(nameInput).not.toBeNull();
            expect(valueInput).not.toBeNull();

        });

        it('should remove an item from list on REMOVE button click', () => {
            spyOn(cardViewUpdateService, 'update');
            component.ngOnChanges();
            fixture.detectChanges();

            const addButton = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs__add-btn'));
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            const removeButton = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs__remove-btn'));
            removeButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(component.values.length).toBe(0);
            const content = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs'));
            expect(content).toBeNull();

            expect(cardViewUpdateService.update).toHaveBeenCalled();
            expect(component.property.value.length).toBe(0);
        });

        it('should update property on input blur', async(() => {
            spyOn(cardViewUpdateService, 'update');
            component.ngOnChanges();
            fixture.detectChanges();

            const addButton = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs__add-btn'));
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            const nameInput = fixture.debugElement.query(By.css(`[data-automation-id="card-${component.property.key}-name-input-0"]`));
            const valueInput = fixture.debugElement.query(By.css(`[data-automation-id="card-${component.property.key}-value-input-0"]`));

            nameInput.nativeElement.value = mockData[0].name;
            nameInput.nativeElement.dispatchEvent(new Event('input'));
            valueInput.nativeElement.value = mockData[0].value;
            valueInput.nativeElement.dispatchEvent(new Event('input'));

            fixture.whenStable().then(() => {
                fixture.detectChanges();

                valueInput.triggerEventHandler('blur', null);
                fixture.detectChanges();

                expect(cardViewUpdateService.update).toHaveBeenCalled();
                expect(JSON.stringify(component.property.value)).toBe(JSON.stringify(mockData));
            });
        }));

        it('should not update property if at least one input is empty on blur', async(() => {
            spyOn(cardViewUpdateService, 'update');
            component.ngOnChanges();
            fixture.detectChanges();

            const addButton = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs__add-btn'));
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            const valueInput = fixture.debugElement.query(By.css(`[data-automation-id="card-${component.property.key}-value-input-0"]`));

            valueInput.nativeElement.value = mockData[0].value;
            valueInput.nativeElement.dispatchEvent(new Event('input'));

            fixture.whenStable().then(() => {
                fixture.detectChanges();

                valueInput.triggerEventHandler('blur', null);
                fixture.detectChanges();

                expect(cardViewUpdateService.update).not.toHaveBeenCalled();
            });
        }));

    });
});
