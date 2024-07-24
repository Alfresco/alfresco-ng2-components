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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardViewKeyValuePairsItemModel } from '../../models/card-view-keyvaluepairs.model';
import { CardViewKeyValuePairsItemComponent } from './card-view-keyvaluepairsitem.component';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('CardViewKeyValuePairsItemComponent', () => {
    let fixture: ComponentFixture<CardViewKeyValuePairsItemComponent>;
    let component: CardViewKeyValuePairsItemComponent;
    let cardViewUpdateService: CardViewUpdateService;
    const mockEmptyData = [{ name: '', value: '' }];
    const mockData = [{ name: 'test-name', value: 'test-value' }];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, TranslateModule.forRoot(), MatIconModule, MatTableModule, FormsModule],
            providers: [CardViewUpdateService],
            declarations: [CardViewKeyValuePairsItemComponent]
        });
        fixture = TestBed.createComponent(CardViewKeyValuePairsItemComponent);
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
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
                key: 'key-value-pairs',
                editable: false
            });

            component.ngOnChanges();
            fixture.detectChanges();

            expect(component.isEditable).toBe(false);
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

            const removeButton = fixture.debugElement.query(By.css('.adf-property-col-delete'));
            removeButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(component.values.length).toBe(0);
            const content = fixture.debugElement.query(By.css('.adf-card-view__key-value-pairs'));
            expect(content).toBeNull();

            expect(cardViewUpdateService.update).toHaveBeenCalled();
            expect(component.property.value.length).toBe(0);
        });
    });
});
