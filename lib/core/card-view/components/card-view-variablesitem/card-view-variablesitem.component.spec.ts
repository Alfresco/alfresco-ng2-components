/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { CardViewVariablesItemModel } from '../../models/card-view-variables.model';
import { CardViewVariablesItemComponent } from './card-view-variablesitem.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';

describe('CardViewVariablesItemComponent', () => {

    let fixture: ComponentFixture<CardViewVariablesItemComponent>;
    let component: CardViewVariablesItemComponent;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewVariablesItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewVariablesItemModel({
            label: 'Variables',
            value: [],
            key: 'variables'
        });
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Component', () => {

        it('should render the label', () => {
            fixture.detectChanges();

            const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('Variables');
        });

        it('should call add() method on button click', () => {
            const addButton = fixture.debugElement.query(By.css('.card-view__variables__add-btn'));

            spyOn(component, 'add');
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(component.add).toHaveBeenCalled();
        });

        it('should add new variable on add()', () => {
            component.ngOnChanges();
            component.add();

            fixture.detectChanges();

            expect(component.variables.length).toBe(1);
        });

        it('should call remove() method on button click', () => {
            spyOn(component, 'remove');

            component.ngOnChanges();

            const addButton = fixture.debugElement.query(By.css('.card-view__variables__add-btn'));
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            const removeButton = fixture.debugElement.query(By.css('.card-view__variables__remove-btn'));
            removeButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            expect(component.remove).toHaveBeenCalled();
        });

        it('should remove a variable on remove() and call save()', () => {
            spyOn(component, 'save');

            component.ngOnChanges();
            component.add();
            fixture.detectChanges();
            component.remove(0);
            fixture.detectChanges();

            expect(component.variables.length).toBe(0);
            expect(component.save).toHaveBeenCalled();
        });

    });
});
