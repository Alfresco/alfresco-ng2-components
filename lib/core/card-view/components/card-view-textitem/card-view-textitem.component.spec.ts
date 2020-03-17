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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { CardViewItemFloatValidator, CardViewItemIntValidator } from '@alfresco/adf-core';
import { MatChipsModule } from '@angular/material';

describe('CardViewTextItemComponent', () => {

    let fixture: ComponentFixture<CardViewTextItemComponent>;
    let component: CardViewTextItemComponent;
    const mouseEvent = new MouseEvent('click');

    setupTestBed({
        imports: [
            CoreTestingModule,
            MatChipsModule
        ]
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

            const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('Text label');

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('Lorem ipsum');
        });

        it('should render the displayName as value when available', () => {
            let componentWithDisplayName: CardViewTextItemComponent;
            componentWithDisplayName = fixture.componentInstance;
            componentWithDisplayName.property = new CardViewTextItemModel({
                label: 'Name label',
                value: { id: 123, displayName: 'User Name' },
                key: 'namekey'
            });
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('User Name');
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

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
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

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render value when editable:true', () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('Lorem ipsum');
        });

        it('should render the edit icon in case of editable:true', () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();

            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).not.toBeNull('Edit icon should be shown');
        });

        it('should NOT render the edit icon in case of editable:false', () => {
            component.editable = false;
            fixture.detectChanges();

            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');
        });

        it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', () => {
            component.editable = false;
            component.property.editable = true;
            fixture.detectChanges();

            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');
        });

        it('should render chips for multivalue properties when chips are enabled', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: ['item1', 'item2', 'item3'],
                key: 'textkey',
                default: ['FAKE-DEFAULT-KEY'],
                editable: true,
                multivalued: true
            });
            component.useChipsForMultiValueProperty = true;
            component.ngOnChanges();
            fixture.detectChanges();

            const valueChips = fixture.debugElement.queryAll(By.css(`mat-chip`));
            expect(valueChips).not.toBeNull();
            expect(valueChips.length).toBe(3);
            expect(valueChips[0].nativeElement.innerText.trim()).toBe('item1');
            expect(valueChips[1].nativeElement.innerText.trim()).toBe('item2');
            expect(valueChips[2].nativeElement.innerText.trim()).toBe('item3');
        });

        it('should render string for multivalue properties when chips are disabled', () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: ['item1', 'item2', 'item3'],
                key: 'textkey',
                default: ['FAKE-DEFAULT-KEY'],
                editable: true,
                multivalued: true
            });

            component.useChipsForMultiValueProperty = false;
            component.ngOnChanges();
            fixture.detectChanges();

            const valueChips = fixture.debugElement.query(By.css(`mat-chip-list`));
            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('item1,item2,item3');
            expect(valueChips).toBeNull();
        });
    });

    describe('clickable', () => {
        beforeEach(() => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY'
            });
        });

        it('should render the default as value if the value is empty, clickable is false and displayEmpty is true', () => {
            component.property.clickable = false;
            component.displayEmpty = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the default as value if the value is empty and clickable true', () => {
            component.property.clickable = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
        });

        it('should not render the edit icon in case of clickable true but edit false', () => {
            component.property.clickable = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.icon}"]`));
            expect(value).toBeNull();
        });

        it('should not render the clickable icon in case editable set to false', () => {
            component.property.clickable = true;
            component.property.icon = 'create';
            component.editable = false;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-textkey"]`));
            expect(value).toBeNull('icon should NOT be shown');
        });

        it('should render the defined clickable icon in case of clickable true and editable input set to true', () => {
            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.editable = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-textkey"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('FAKE_ICON');
        });

        it('should not render clickable icon in case of clickable true and icon undefined', () => {
            component.property.clickable = true;
            component.editable = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-textkey"]`));
            expect(value).toBeNull('icon should NOT be shown');
        });

        it('should not render the edit icon in case of clickable false and icon defined', () => {
            component.property.clickable = false;
            component.property.icon = 'FAKE_ICON';
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.icon}"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should call back function when clickable property enabled', () => {
            const callBackSpy = jasmine.createSpy('callBack');
            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.property.clickCallBack = callBackSpy;
            component.editable = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-textkey"]`));
            expect(value.nativeElement.innerText).toBe('FAKE_ICON');
            value.nativeElement.click();
            expect(callBackSpy).toHaveBeenCalled();
        });

        it('should click event to the event stream when clickable property enabled', () => {
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'clicked').and.stub();

            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.editable = false;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${component.property.key}"]`));
            value.nativeElement.click();
            expect(cardViewUpdateService.clicked).toHaveBeenCalled();
        });

        it('should update input the value on click of save', () => {
            component.property.clickable = true;

            component.property.editable = true;
            component.editable = true;
            component.editedValue = 'updated-value';
            component.property.isValid = () => true;
            const expectedText = 'changed text';
            spyOn(component, 'update').and.callThrough();
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            fixture.detectChanges();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedText });
                disposableUpdate.unsubscribe();
            });

            updateTextField(component.property.key, expectedText);

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();

            expect(component.update).toHaveBeenCalled();
            fixture.detectChanges();

            expect(getFieldValue(component.property.key)).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        });

    });

    describe('Update', () => {
        const event = new MouseEvent('click');

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

            component.update(event);

            expect(component.property.isValid).toHaveBeenCalledWith('updated-value');
        });

        it('should trigger the update event if the editedValue is valid', () => {
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.editedValue = 'updated-value';
            const property = { ...component.property };

            component.update(event);

            expect(cardViewUpdateService.update).toHaveBeenCalledWith(property, 'updated-value');
        });

        it('should NOT trigger the update event if the editedValue is invalid', () => {
            component.property.isValid = () => false;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');

            component.update(event);

            expect(cardViewUpdateService.update).not.toHaveBeenCalled();
        });

        it('should set the errorMessages properly if the editedValue is invalid', () => {
            const expectedErrorMessages = ['Something went wrong'];
            component.property.isValid = () => false;
            component.property.getValidationErrors = () => expectedErrorMessages;

            component.update(event);

            expect(component.errorMessages).toBe(expectedErrorMessages);
        });

        it('should update the property value after a successful update attempt', async(() => {
            component.property.isValid = () => true;
            component.update(event);

            fixture.whenStable().then(() => {
                expect(component.property.value).toBe(component.editedValue);
            });
        }));

        it('should switch back to readonly mode after an update attempt', async(() => {
            component.property.isValid = () => true;
            component.update(event);

            fixture.whenStable().then(() => {
                expect(component.inEdit).toBeFalsy();
            });
        }));

        it('should render the default as value if the value is empty, clickable is false and displayEmpty is true', (done) => {
            const functionTestClick = () => {
                done();
            };

            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                clickable: true,
                clickCallBack: () => {
                    functionTestClick();
                }
            });
            component.displayEmpty = true;
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            value.nativeElement.click();
        });

        it('should trigger an update event on the CardViewUpdateService [integration]', (done) => {
            component.inEdit = false;
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            const expectedText = 'changed text';
            fixture.detectChanges();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe(
                (updateNotification) => {
                    expect(updateNotification.target).toEqual({ ...component.property });
                    expect(updateNotification.changed).toEqual({ textkey: expectedText });
                    disposableUpdate.unsubscribe();
                    done();
                }
            );

            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${component.property.key}"]`));
            editIcon.nativeElement.dispatchEvent(new MouseEvent('click'));
            fixture.detectChanges();

            const editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-editinput-${component.property.key}"]`));
            editInput.nativeElement.value = expectedText;
            editInput.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const updateInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            updateInput.nativeElement.dispatchEvent(new MouseEvent('click'));
        });

        it('should update the value using the enter key', async(() => {
            component.inEdit = false;
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            const expectedText = 'changed text';
            fixture.detectChanges();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe(
                (updateNotification) => {
                    expect(updateNotification.target).toEqual({ ...component.property });
                    expect(updateNotification.changed).toEqual({ textkey: expectedText });
                    disposableUpdate.unsubscribe();
                }
            );

            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${component.property.key}"]`));
            editIcon.nativeElement.dispatchEvent(new MouseEvent('click'));
            fixture.detectChanges();

            const editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-editinput-${component.property.key}"]`));
            editInput.nativeElement.value = expectedText;
            editInput.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const enterKeyboardEvent = new KeyboardEvent('keydown', { 'key': 'Enter' });
            editInput.nativeElement.dispatchEvent(enterKeyboardEvent);
            fixture.detectChanges();

            const textItemReadOnly = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(textItemReadOnly.nativeElement.textContent).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        }));

        it('should update the value using the updateItem$ subject', async(() => {
            component.inEdit = false;
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            const expectedText = 'changed text';
            fixture.detectChanges();

            const textItemReadOnly = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(textItemReadOnly.nativeElement.textContent).toEqual('Lorem ipsum');
            expect(component.property.value).toBe('Lorem ipsum');

            cardViewUpdateService.updateElement({ key: component.property.key, value: expectedText  });
            fixture.detectChanges();

            expect(textItemReadOnly.nativeElement.textContent).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        }));

        it('should reset the value using the escape key', async(() => {
            component.inEdit = false;
            component.property.isValid = () => true;
            fixture.detectChanges();

            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${component.property.key}"]`));
            editIcon.nativeElement.dispatchEvent(new MouseEvent('click'));
            fixture.detectChanges();

            const editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-editinput-${component.property.key}"]`));
            editInput.nativeElement.value = 'changed text';
            editInput.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const enterKeyboardEvent = new KeyboardEvent('keydown', { 'key': 'Escape' });
            editInput.nativeElement.dispatchEvent(enterKeyboardEvent);
            fixture.detectChanges();

            const textItemReadOnly = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(textItemReadOnly.nativeElement.textContent).toEqual('Lorem ipsum');
            expect(component.property.value).toBe('Lorem ipsum');
        }));

        it('should reset the value onclick of clear button', () => {
            component.inEdit = false;
            component.property.isValid = () => true;
            spyOn(component, 'reset').and.callThrough();
            fixture.detectChanges();

            updateTextField(component.property.key, 'changed text');

            const clearButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-reset-${component.property.key}"]`));
            clearButton.nativeElement.click();
            expect(component.reset).toHaveBeenCalled();

            fixture.detectChanges();

            expect(getFieldValue(component.property.key)).toEqual('Lorem ipsum');
            expect(component.property.value).toBe('Lorem ipsum');
        });

        it('should update multiline input the value on click of save', () => {
            component.inEdit = false;
            component.property.isValid = () => true;
            component.property.multiline = true;
            const expectedText = 'changed text';
            spyOn(component, 'update').and.callThrough();
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            fixture.detectChanges();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedText });
                disposableUpdate.unsubscribe();
            });

            updateTextArea(component.property.key, expectedText);

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();

            expect(component.update).toHaveBeenCalled();
            fixture.detectChanges();

            expect(getFieldValue(component.property.key)).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        });
    });

    describe('number', () => {
        let cardViewUpdateService: CardViewUpdateService;

        beforeEach(() => {
            component.property.editable = true;
            component.editable = true;
            component.inEdit = false;
            component.property.value = 10;
            component.property.validators.push(new CardViewItemIntValidator());
            component.ngOnChanges();
            fixture.detectChanges();
            cardViewUpdateService = TestBed.get(CardViewUpdateService);
        });

        it('should show validation error when string passed', () => {
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, 'update number');

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            fixture.detectChanges();
            expect(component.update).toHaveBeenCalled();

            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error.nativeElement.innerText).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
        });

        it('should show validation error for empty string', () => {
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, ' ');

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error.nativeElement.innerText).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');

            expect(component.property.value).toBe(10);
        });

        it('should show validation error for float number', () => {
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, 0.024);

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error.nativeElement.innerText).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');

            expect(component.property.value).toBe(10);
        });

        it('should show validation error for exceed the number limit (2147483648)', () => {
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, 2147483648);

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error.nativeElement.innerText).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');

            expect(component.property.value).toBe(10);
        });

        it('should not show validation error for below the number limit (2147483647)', () => {
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, 2147483647);

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();

            expect(component.property.value).toBe('2147483647');
        });

        it('should reset the value onclick of clear button', () => {
            spyOn(component, 'reset').and.callThrough();
            fixture.detectChanges();

            updateTextField(component.property.key, 20);

            const clearButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-reset-${component.property.key}"]`));
            clearButton.nativeElement.click();
            expect(component.reset).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();

            expect(getFieldValue(component.property.key)).toEqual('10');
            expect(component.property.value).toBe(10);
        });

        it('should update input the value on click of save', () => {
            component.property.multiline = true;
            const expectedNumber = 2020;
            spyOn(component, 'update').and.callThrough();
            fixture.detectChanges();
            expect(component.property.value).not.toEqual(expectedNumber);

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedNumber.toString() });
                disposableUpdate.unsubscribe();
            });

            updateTextArea(component.property.key, expectedNumber);

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();

            expect(getFieldValue(component.property.key)).toEqual(expectedNumber.toString());
            expect(component.property.value).toBe(expectedNumber.toString());
        });
    });

    describe('float', () => {
        let cardViewUpdateService: CardViewUpdateService;
        const floatValue = 77.33;

        beforeEach(() => {
            component.property.editable = true;
            component.editable = true;
            component.inEdit = false;
            component.property.value = floatValue;
            component.property.validators.push(new CardViewItemFloatValidator());
            component.ngOnChanges();
            fixture.detectChanges();
            cardViewUpdateService = TestBed.get(CardViewUpdateService);
        });

        it('should show validation error when string passed', () => {
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, ' ');

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error.nativeElement.innerText).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');

            expect(component.property.value).toBe(floatValue);
        });

        it('should show validation error for empty string', () => {
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, ' ');

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error.nativeElement.innerText).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');

            expect(component.property.value).toBe(floatValue);
        });

        it('should update input the value on click of save', () => {
            component.property.multiline = true;
            const expectedFloat = 88.44;
            spyOn(component, 'update').and.callThrough();
            fixture.detectChanges();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedFloat.toString() });
                disposableUpdate.unsubscribe();
            });

            updateTextArea(component.property.key, expectedFloat);

            const saveButton = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-update-${component.property.key}"]`));
            saveButton.nativeElement.click();
            expect(component.update).toHaveBeenCalled();

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();

            expect(getFieldValue(component.property.key)).toEqual(expectedFloat.toString());
            expect(component.property.value).toBe(expectedFloat.toString());
        });
    });

    function updateTextField(key, value) {
        const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${key}"]`));
        editIcon.nativeElement.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();

        const editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-editinput-${key}"]`));
        editInput.nativeElement.value = value;
        editInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    function updateTextArea(key, value) {
        const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${key}"]`));
        editIcon.nativeElement.dispatchEvent(mouseEvent);
        fixture.detectChanges();

        const editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edittextarea-${key}"]`));
        editInput.nativeElement.value = value;
        editInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    function getFieldValue(key): string {
        const textItemReadOnly = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${key}"]`));
        return textItemReadOnly.nativeElement.textContent;
    }
});
