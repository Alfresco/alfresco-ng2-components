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
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewBoolItemComponent } from './card-view-boolitem.component';
import { CardViewBoolItemModel } from '../../models/card-view-boolitem.model';
import { NoopTranslateModule } from '../../../testing/noop-translate.module';

describe('CardViewBoolItemComponent', () => {
    let fixture: ComponentFixture<CardViewBoolItemComponent>;
    let component: CardViewBoolItemComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule]
        });
        fixture = TestBed.createComponent(CardViewBoolItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewBoolItemModel({
            label: 'Boolean label',
            value: true,
            key: 'boolKey',
            default: false,
            editable: false
        });
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering', () => {
        it('should render the label and value if the property is editable', () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();

            const label = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(label).not.toBeNull();
            expect(label.nativeElement.innerText).toBe('Boolean label');

            const value = fixture.debugElement.query(By.css('.adf-property-value'));
            expect(value).not.toBeNull();
        });

        it('should NOT render the label and value if the property is NOT editable and has no proper boolean value set', () => {
            component.editable = true;
            component.property.value = undefined;
            component.property.editable = false;
            fixture.detectChanges();

            const label = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(label).toBeNull();

            const value = fixture.debugElement.query(By.css('.adf-property-value'));
            expect(value).toBeNull();
        });

        it('should render the label and value if the property is NOT editable but has a proper boolean value set', () => {
            component.editable = true;
            component.property.value = false;
            component.property.editable = false;
            fixture.detectChanges();

            const label = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(label).not.toBeNull();

            const value = fixture.debugElement.query(By.css('.adf-property-value'));
            expect(value).not.toBeNull();
        });

        it('should render ticked checkbox if property value is true', () => {
            component.property.value = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-property-value input[type="checkbox"]'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.checked).toBe(true);
        });

        it('should render ticked checkbox if property value is not set but default is true and editable', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = undefined;
            component.property.default = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-property-value input[type="checkbox"]'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.checked).toBe(true);
        });

        it('should render un-ticked checkbox if property value is false', () => {
            component.property.value = false;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-property-value input[type="checkbox"]'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.checked).toBe(false);
        });

        it('should render un-ticked checkbox if property value is not set but default is false and editable', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = undefined;
            component.property.default = false;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-property-value input[type="checkbox"]'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.checked).toBe(false);
        });

        it('should render enabled checkbox if property and component are both editable', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-property-value input[type="checkbox"]'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.hasAttribute('disabled')).toBe(false);
        });

        it('should render disabled checkbox if property is not editable', () => {
            component.editable = true;
            component.property.editable = false;
            component.property.value = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-property-value input[type="checkbox"]'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.hasAttribute('disabled')).toBe(true);
        });

        it('should render disabled checkbox if component is not editable', () => {
            component.editable = false;
            component.property.editable = true;
            component.property.value = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-property-value input[type="checkbox"]'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.hasAttribute('disabled')).toBe(true);
        });
    });

    describe('Update', () => {
        beforeEach(() => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = undefined;
            fixture.detectChanges();
        });

        it('should trigger the update event when changing the checkbox', () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            const property = { ...component.property };

            component.changed({ checked: true } as MatCheckboxChange);

            expect(cardViewUpdateService.update).toHaveBeenCalledWith(property, true);
        });

        it('should update the property value after a changed', async () => {
            component.property.value = true;

            component.changed({ checked: false } as MatCheckboxChange);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.property.value).toBe(false);
        });

        it('should trigger an update event on the CardViewUpdateService [integration]', (done) => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            component.property.value = false;
            fixture.detectChanges();
            const property = { ...component.property };

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual(property);
                expect(updateNotification.changed).toEqual({ boolKey: true });
                disposableUpdate.unsubscribe();
                done();
            });

            const labelElement = fixture.debugElement.query(By.directive(MatCheckbox)).nativeElement.querySelector('label');
            labelElement.click();
        });
    });
});
