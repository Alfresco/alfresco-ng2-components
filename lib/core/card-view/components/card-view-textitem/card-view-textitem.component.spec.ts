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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';

describe('CardViewTextItemComponent', () => {

    let fixture: ComponentFixture<CardViewTextItemComponent>;
    let component: CardViewTextItemComponent;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewTextItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewTextItemModel({
            label: 'Text label',
            value: 'Lorem ipsum',
            key: 'textkey',
            default: 'FAKE-DEFAULT-KEY',
            editable: false
        });
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering', () => {

        it('should render the label and value', () => {
            fixture.detectChanges();

            let labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('Text label');

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('Lorem ipsum');
        });

        it('should NOT render the default as value if the value is empty, editable is false and displayEmpty is false', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: false
            });
            component.displayEmpty = false;
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('');
        });

        it('should render the default as value if the value is empty, editable is false and displayEmpty is true', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: false
            });
            component.displayEmpty = true;
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the default as value if the value is empty and editable true', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: true
            });
            component.editable = true;
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
        });

        it('should NOT render the default as value if the value is empty, clickable is false and displayEmpty is false', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                clickable: false
            });
            component.displayEmpty = false;
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('');
        });

        it('should render the default as value if the value is empty, clickable is false and displayEmpty is true', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                clickable: false
            });
            component.displayEmpty = true;
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the default as value if the value is empty and clickable true', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                clickable: true
            });
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the edit icon in case of clickable true and icon defined', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                clickable: true,
                icon: 'FAKE-ICON'
            });
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.icon}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-ICON');
        });

        it('should not render the edit icon in case of clickable true and icon undefined', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                clickable: true
            });
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.icon}"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should not render the edit icon in case of clickable false and icon defined', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                clickable: false,
                icon: 'FAKE-ICON'
            });
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.icon}"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should render value when editable:true', () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();

            let value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('Lorem ipsum');
        });

        it('should render the edit icon in case of editable:true', () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();

            let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).not.toBeNull('Edit icon should be shown');
        });

        it('should NOT render the edit icon in case of editable:false', () => {
            component.editable = false;
            fixture.detectChanges();

            let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');
        });

        it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', () => {
            component.editable = false;
            component.property.editable = true;
            fixture.detectChanges();

            let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');
        });
    });

    describe('Update', () => {

        beforeEach(() => {
            component.editable = true;
            component.property.editable = true;
            component.inEdit = true;
            component.editedValue = 'updated-value';
            fixture.detectChanges();
        });

        it('should call the isValid method with the edited value', () => {
            spyOn(component.property, 'isValid');
            component.editedValue = 'updated-value';

            component.update();

            expect(component.property.isValid).toHaveBeenCalledWith('updated-value');
        });

        it('should trigger the update event if the editedValue is valid', () => {
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.editedValue = 'updated-value';

            component.update();

            expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, 'updated-value');
        });

        it('should NOT trigger the update event if the editedValue is invalid', () => {
            component.property.isValid = () => false;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');

            component.update();

            expect(cardViewUpdateService.update).not.toHaveBeenCalled();
        });

        it('should set the errorMessages properly if the editedValue is invalid', () => {
            const expectedErrorMessages = ['Something went wrong'];
            component.property.isValid = () => false;
            component.property.getValidationErrors = () => expectedErrorMessages;

            component.update();

            expect(component.errorMessages).toBe(expectedErrorMessages);
        });

        it('should update the property value after a successful update attempt', async(() => {
            component.property.isValid = () => true;
            component.update();

            fixture.whenStable().then(() => {
                expect(component.property.value).toBe(component.editedValue);
            });
        }));

        it('should switch back to readonly mode after an update attempt', async(() => {
            component.property.isValid = () => true;
            component.update();

            fixture.whenStable().then(() => {
                expect(component.inEdit).toBeFalsy();
            });
        }));

        it('should trigger an update event on the CardViewUpdateService [integration]', (done) => {
            component.inEdit = false;
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            const expectedText = 'changed text';
            fixture.detectChanges();

            let disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe(
                (updateNotification) => {
                    expect(updateNotification.target).toBe(component.property);
                    expect(updateNotification.changed).toEqual({ textkey: expectedText });
                    disposableUpdate.unsubscribe();
                    done();
                }
            );

            let editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-toggle-${component.property.key}"]`));
            editIcon.triggerEventHandler('click', null);
            fixture.detectChanges();

            let editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-editinput-${component.property.key}"]`));
            editInput.nativeElement.value = expectedText;
            editInput.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            let updateInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            updateInput.triggerEventHandler('click', null);
        });
    });
});
