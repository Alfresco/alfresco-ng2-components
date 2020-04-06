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
import { CardViewItemFloatValidator, CardViewItemIntValidator, CardViewIntItemModel, CardViewFloatItemModel } from '@alfresco/adf-core';
import { MatChipsModule } from '@angular/material';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { DebugElement } from '@angular/core';

describe('CardViewTextItemComponent', () => {

    let fixture: ComponentFixture<CardViewTextItemComponent>;
    let component: CardViewTextItemComponent;

    setupTestBed({
        imports: [
            CoreTestingModule,
            MatChipsModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewTextItemComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering', () => {

        beforeEach(() => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: 'Lorem ipsum',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: false
            });
        });

        it('should render the label and value', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('Text label');

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('Lorem ipsum');
        });

        it('should render the displayName as value when available', async () => {
            component.property = new CardViewTextItemModel({
                label: 'Name label',
                value: { id: 123, displayName: 'User Name' },
                key: 'namekey'
            });
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('User Name');
        });

        it('should render the default as value if the value is empty, editable is false and displayEmpty is true', async () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: false
            });
            component.displayEmpty = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the default as value if the value is empty and editable true', async () => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: true
            });
            component.editable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render value when editable:true', async () => {
            component.editable = true;
            component.property.editable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('Lorem ipsum');
        });

        it('should render the edit icon in case of editable:true', () => {
            component.editable = true;
            component.property.editable = true;
            component.ngOnChanges();
            fixture.detectChanges();

            const editIcon = fixture.debugElement.query(By.css('.adf-textitem-edit-icon'));
            expect(editIcon).not.toBeNull('Edit icon should be shown');
        });

        it('should NOT render the edit icon in case of editable:false', async () => {
            component.editable = false;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const editIcon = fixture.debugElement.query(By.css('.adf-textitem-edit-icon'));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');
        });

        it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', async () => {
            component.editable = false;
            component.property.editable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');
        });

        it('should render chips for multivalue properties when chips are enabled', async () => {
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
            await fixture.whenStable();

            const valueChips = fixture.debugElement.queryAll(By.css(`mat-chip`));
            expect(valueChips).not.toBeNull();
            expect(valueChips.length).toBe(3);
            expect(valueChips[0].nativeElement.innerText.trim()).toBe('item1');
            expect(valueChips[1].nativeElement.innerText.trim()).toBe('item2');
            expect(valueChips[2].nativeElement.innerText.trim()).toBe('item3');
        });

        it('should render string for multivalue properties when chips are disabled', async () => {
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
            await fixture.whenStable();

            const valueChips = fixture.debugElement.query(By.css(`mat-chip-list`));
            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('item1,item2,item3');
            expect(valueChips).toBeNull();
        });
    });

    describe('clickable', () => {
        beforeEach(() => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: '',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: false
            });
        });

        it('should render the default as value if the value is empty, clickable is false and displayEmpty is true', async () => {
            component.property.clickable = false;
            component.displayEmpty = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the default as value if the value is empty and clickable true', async () => {
            component.property.clickable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('FAKE-DEFAULT-KEY');
        });

        it('should not render the edit icon in case of clickable true but edit false', async () => {
            component.property.clickable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css('.adf-textitem-edit-icon'));
            expect(value).toBeNull();
        });

        it('should not render the clickable icon in case editable set to false', async () => {
            component.property.clickable = true;
            component.property.icon = 'create';
            component.editable = false;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-${component.property.key}"]`));
            expect(value).toBeNull('icon should NOT be shown');
        });

        it('should render the defined clickable icon in case of clickable true and editable input set to true', async () => {
            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.editable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-${component.property.key}"]`));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('FAKE_ICON');
        });

        it('should not render clickable icon in case of clickable true and icon undefined', async () => {
            component.property.clickable = true;
            component.editable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-${component.property.key}"]`));
            expect(value).toBeNull('icon should NOT be shown');
        });

        it('should not render the edit icon in case of clickable false and icon defined', async () => {
            component.property.clickable = false;
            component.property.icon = 'FAKE_ICON';
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.icon}"]`));
            expect(value).toBeNull('Edit icon should NOT be shown');
        });

        it('should call back function when clickable property enabled', async () => {
            const callBackSpy = jasmine.createSpy('callBack');
            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.property.clickCallBack = callBackSpy;
            component.editable = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-${component.property.key}"]`));
            expect(value.nativeElement.innerText).toBe('FAKE_ICON');
            value.nativeElement.click();
            expect(callBackSpy).toHaveBeenCalled();
        });

        it('should click event to the event stream when clickable property enabled', async () => {
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'clicked').and.stub();

            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.editable = false;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${component.property.key}"]`));
            value.nativeElement.click();
            expect(cardViewUpdateService.clicked).toHaveBeenCalled();
        });

        it('should update input the value on input updated', async (done) => {
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);

            component.property.clickable = true;
            component.property.editable = true;
            component.editable = true;
            component.property.isValid = () => true;
            const expectedText = 'changed text';
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedText });
                disposableUpdate.unsubscribe();
                done();
            });

            updateTextField(component.property.key, expectedText);

            component.ngOnChanges();
            fixture.detectChanges();

            expect(getTextFieldValue(component.property.key)).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        });

        it('should copy value to clipboard on double click', async () => {
            const clipboardService = TestBed.get(ClipboardService);
            spyOn(clipboardService, 'copyContentToClipboard');

            component.property.value = 'myValueToCopy';
            component.property.icon = 'FAKE_ICON';
            component.editable = false;
            component.copyToClipboardAction = true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const doubleClickEl = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            doubleClickEl.triggerEventHandler('dblclick', new MouseEvent('dblclick'));

            fixture.detectChanges();
            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('myValueToCopy', 'CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
        });

    });

    describe('Update', () => {

        beforeEach(() => {
            component.property = new CardViewTextItemModel({
                label: 'Text label',
                value: 'Lorem ipsum',
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: true
            });
        });

        it('should call the isValid method with the edited value', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            spyOn(component.property, 'isValid');
            updateTextField(component.property.key, 'updated-value');
            expect(component.property.isValid).toHaveBeenCalledWith('updated-value');
        });

        it('should trigger the update event if the editedValue is valid', async () => {
            component.property.isValid = () => true;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            const property = { ...component.property };

            spyOn(cardViewUpdateService, 'update');
            updateTextField(component.property.key, 'updated-value');
            expect(cardViewUpdateService.update).toHaveBeenCalledWith(property, 'updated-value');
        });

        it('should NOT trigger the update event if the editedValue is invalid', async () => {
            component.property.isValid = () => false;
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);

            spyOn(cardViewUpdateService, 'update');
            updateTextField(component.property.key, 'updated-value');
            expect(cardViewUpdateService.update).not.toHaveBeenCalled();
        });

        it('should set the errorMessages properly if the editedValue is invalid', async () => {
            const expectedErrorMessages = ['Something went wrong'];
            component.property.isValid = () => false;
            component.property.getValidationErrors = () => expectedErrorMessages;

            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, 'updated-value');
            expect(component.errorMessages).toBe(expectedErrorMessages);
        });

        it('should update the property value after a successful update attempt', async () => {
            component.property.isValid = () => true;
            component.update();
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.property.value).toBe(component.editedValue);
        });

        it('should render the default as value if the value is empty, clickable is false and displayEmpty is true', async (done) => {
            const functionTestClick = () => done();

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
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const inputField = getTextField(component.property.key);
            inputField.nativeElement.click();
        });

        it('should trigger an update event on the CardViewUpdateService [integration]', async (done) => {
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            const expectedText = 'changed text';
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe(
                (updateNotification) => {
                    expect(updateNotification.target).toEqual({ ...component.property });
                    expect(updateNotification.changed).toEqual({ textkey: expectedText });
                    disposableUpdate.unsubscribe();
                    done();
                }
            );

            updateTextField(component.property.key, expectedText);
        });

        it('should update the value using the updateItem$ subject', async(async () => {
            component.property.isValid = () => true;
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            const expectedText = 'changed text';
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            let value = getTextFieldValue(component.property.key);
            expect(value).toEqual('Lorem ipsum');
            expect(component.property.value).toBe('Lorem ipsum');

            cardViewUpdateService.updateElement({ key: component.property.key, value: expectedText });
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            value = getTextFieldValue(component.property.key);
            expect(value).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        }));

        it('should update multiline input the value on input updated', async (done) => {
            component.property.isValid = () => true;
            component.property.multiline = true;
            const expectedText = 'changed text';
            spyOn(component, 'update').and.callThrough();
            const cardViewUpdateService = TestBed.get(CardViewUpdateService);
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedText });
                disposableUpdate.unsubscribe();
                done();
            });

            updateTextField(component.property.key, expectedText);

            expect(component.update).toHaveBeenCalled();
            fixture.detectChanges();

            expect(getTextFieldValue(component.property.key)).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        });
    });

    describe('number', () => {
        let cardViewUpdateService: CardViewUpdateService;

        beforeEach(() => {
            cardViewUpdateService = TestBed.get(CardViewUpdateService);
            component.property = new CardViewIntItemModel({
                label: 'Text label',
                value: 10,
                key: 'textkey',
                default: 1,
                editable: true
            });
            component.editable = true;
            component.property.validators.push(new CardViewItemIntValidator());

        });

        it('should show validation error when string passed', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, 'update number');

            fixture.detectChanges();
            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
        });

        it('should show validation error for empty string', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, ' ');

            fixture.detectChanges();
            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
            expect(component.property.value).toBe(10);
        });

        it('should show validation error for float number', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, 123.456);

            fixture.detectChanges();
            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
            expect(component.property.value).toBe(10);
        });

        it('should show validation error for exceed the number limit (2147483648)', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, 2147483648);

            fixture.detectChanges();
            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
            expect(component.property.value).toBe(10);
        });

        it('should not show validation error for below the number limit (2147483647)', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, 2147483647);

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();

            expect(component.property.value).toBe('2147483647');
        });

        it('should update input the value on input updated', async (done) => {
            const expectedNumber = 2020;
            spyOn(component, 'update').and.callThrough();
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedNumber.toString() });
                disposableUpdate.unsubscribe();
                done();
            });

            updateTextField(component.property.key, expectedNumber);

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();

            expect(getTextFieldValue(component.property.key)).toEqual(expectedNumber.toString());
            expect(component.property.value).toBe(expectedNumber.toString());
        });
    });

    describe('float', () => {
        let cardViewUpdateService: CardViewUpdateService;
        const floatValue = 77.33;

        beforeEach(() => {
            cardViewUpdateService = TestBed.get(CardViewUpdateService);
            component.property = new CardViewFloatItemModel({
                label: 'Text label',
                value: floatValue,
                key: 'textkey',
                default: 'FAKE-DEFAULT-KEY',
                editable: true
            });
            component.editable = true;
            component.property.validators.push(new CardViewItemFloatValidator());
        });

        it('should show validation error when string passed', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, 'hello there');

            fixture.detectChanges();
            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');
            expect(component.property.value).toBe(floatValue);
        });

        it('should show validation error for empty string', async () => {
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            updateTextField(component.property.key, ' ');

            fixture.detectChanges();
            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');
            expect(component.property.value).toBe(floatValue);
        });

        it('should update input the value on input updated', async (done) => {
            const expectedNumber = 88.44;
            spyOn(component, 'update').and.callThrough();
            component.ngOnChanges();
            fixture.detectChanges();
            await fixture.whenStable();

            const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe((updateNotification) => {
                expect(updateNotification.target).toEqual({ ...component.property });
                expect(updateNotification.changed).toEqual({ textkey: expectedNumber.toString() });
                disposableUpdate.unsubscribe();
                done();
            });

            updateTextField(component.property.key, expectedNumber);

            fixture.detectChanges();
            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();

            expect(getTextFieldValue(component.property.key)).toEqual(expectedNumber.toString());
            expect(component.property.value).toBe(expectedNumber.toString());
        });
    });

    function updateTextField(key, value) {
        const editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${key}"]`));
        editInput.nativeElement.value = value;
        editInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    function getTextFieldValue(key): string {
        const textItemInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${key}"]`));
        expect(textItemInput).not.toBeNull();
        return textItemInput.nativeElement.value;
    }

    function getTextField(key): DebugElement {
        const textItemInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${key}"]`));
        expect(textItemInput).not.toBeNull();
        return textItemInput;
    }

    function getTextFieldError(key): string {
        const textItemInputError = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${key}"] li`));
        expect(textItemInputError).not.toBeNull();
        return textItemInputError.nativeElement.innerText;
    }
});
