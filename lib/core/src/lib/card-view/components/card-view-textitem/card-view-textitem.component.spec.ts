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
import { By } from '@angular/platform-browser';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { CardViewItemFloatValidator } from '../../validators/card-view-item-float.validator';
import { CardViewItemIntValidator } from '../../validators/card-view-item-int.validator';
import { CardViewIntItemModel } from '../../models/card-view-intitem.model';
import { CardViewFloatItemModel } from '../../models/card-view-floatitem.model';
import { MatChipsModule } from '@angular/material/chips';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardViewItemValidator } from '../../interfaces/card-view-item-validator.interface';

describe('CardViewTextItemComponent', () => {

    let fixture: ComponentFixture<CardViewTextItemComponent>;
    let component: CardViewTextItemComponent;

    const expectedErrorMessages = [{ message: 'Something went wrong' } as CardViewItemValidator];

    const updateTextField = (key, value) => {
        const editInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${key}"]`));
        editInput.nativeElement.value = value;
        editInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    };

    const getTextFieldValue = (key): string => {
        const textItemInput = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${key}"]`));
        expect(textItemInput).not.toBeNull();
        return textItemInput.nativeElement.value;
    };

    const getTextFieldError = (key): string => {
        const textItemInputError = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${key}"] li`));
        expect(textItemInputError).not.toBeNull();
        return textItemInputError.nativeElement.innerText;
    };

    const checkCtrlZActions = (ctrlKeyValue: boolean, codeValue: string, metaKeyValue: boolean, mockTestValue: string, flag: boolean) => {
        component.textInput.setValue(mockTestValue);
        const event = new KeyboardEvent('keydown', {
            ctrlKey: ctrlKeyValue,
            code: codeValue,
            metaKey: metaKeyValue
        } as KeyboardEventInit );
        component.undoText(event);
        if (flag) {
            expect(component.textInput.value).toBe('');
        } else {
            expect(component.textInput.value).not.toBe('');
        }
    };

    const renderChipsForMultiValuedProperties = async (cardViewTextItemObject, flag: boolean, length: number,
        param1: string, param2: string, param3: string) => {
        component.property = new CardViewTextItemModel(cardViewTextItemObject);
        component.useChipsForMultiValueProperty = flag;
        component.ngOnChanges({ property: new SimpleChange(null, null, true) });

        fixture.detectChanges();
        await fixture.whenStable();
        const valueChips = fixture.debugElement.queryAll(By.css(`mat-chip`));
        expect(valueChips).not.toBeNull();
        expect(valueChips.length).toBe(length);
        expect(valueChips[0].nativeElement.innerText.trim()).toBe(param1);
        expect(valueChips[1].nativeElement.innerText.trim()).toBe(param2);
        expect(valueChips[2].nativeElement.innerText.trim()).toBe(param3);
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
            fixture.detectChanges();
        });

        it('should render the label and value', async () => {
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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
            fixture.detectChanges();
            await fixture.whenStable();
            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render value when editable:true', async () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();
            await fixture.whenStable();
            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('Lorem ipsum');

        });

        it('should render the edit icon in case of editable:true', () => {
            component.editable = true;
            component.property.editable = true;

            fixture.detectChanges();

            const editIcon = fixture.debugElement.query(By.css('.adf-textitem-edit-icon'));
            expect(editIcon).not.toBeNull('Edit icon should be shown');
        });

        it('should NOT render the edit icon in case of editable:false', async () => {
            component.editable = false;
            fixture.detectChanges();
            await fixture.whenStable();
            const editIcon = fixture.debugElement.query(By.css('.adf-textitem-edit-icon'));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');
        });

        it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', async () => {
            component.editable = false;
            component.property.editable = true;

            fixture.detectChanges();
            await fixture.whenStable();
            const editIcon = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-edit-icon-${component.property.key}"]`));
            expect(editIcon).toBeNull('Edit icon should NOT be shown');

        });

        it('should render chips for multivalue properties when chips are enabled', async () => {
            const cardViewTextItemObject = {
                label: 'Text label 1',
                value: ['item1', 'item2', 'item3'],
                key: 'textkey',
                default: ['FAKE-DEFAULT-KEY'],
                editable: true,
                multivalued: true
            };
            renderChipsForMultiValuedProperties(cardViewTextItemObject, true, 3, 'item1', 'item2', 'item3');

        });

        it('should render chips for multivalue integers when chips are enabled', async () => {
            const cardViewTextItemObject = {
                label: 'Text label 2',
                value: [1, 2, 3],
                key: 'textkey',
                editable: true,
                multivalued: true
            };
            renderChipsForMultiValuedProperties(cardViewTextItemObject, true, 3, '1', '2', '3');

        });

        it('should render chips for multivalue decimal numbers when chips are enabled', async () => {
            const cardViewTextItemObject = {
                label: 'Text label 3',
                value: [1.1, 2.2, 3.3],
                key: 'textkey',
                editable: true,
                multivalued: true
            };
            renderChipsForMultiValuedProperties(cardViewTextItemObject, true, 3, '1.1', '2.2', '3.3');

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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });

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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
            fixture.detectChanges();
        });

        it('should render the default as value if the value is empty, clickable is false and displayEmpty is true', async () => {
            component.property.clickable = false;
            component.displayEmpty = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the default as value if the value is empty and clickable true', async () => {
            component.property.clickable = true;

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const value = getTextFieldValue(component.property.key);
            expect(value).toBe('FAKE-DEFAULT-KEY');
        });

        it('should not render the edit icon in case of clickable true but edit false', async () => {
            component.property.clickable = true;

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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });

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

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-${component.property.key}"]`));
            expect(value).toBeNull('icon should NOT be shown');
        });

        it('should not render the edit icon in case of clickable false and icon defined', async () => {
            component.property.clickable = false;
            component.property.icon = 'FAKE_ICON';

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
            component.ngOnChanges({});

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-clickable-icon-${component.property.key}"]`));
            expect(value.nativeElement.innerText).toBe('FAKE_ICON');
            value.nativeElement.click();
            fixture.detectChanges();
            expect(callBackSpy).toHaveBeenCalled();
        });

        it('should click event to the event stream when clickable property enabled', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'clicked').and.stub();

            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.editable = false;
            component.ngOnChanges({});

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const value = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-toggle-${component.property.key}"]`));
            value.nativeElement.click();
            fixture.detectChanges();
            expect(cardViewUpdateService.clicked).toHaveBeenCalled();
        });

        it('should update input the value on input updated', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            component.property.editable = true;
            component.editable = true;
            component.property.isValid = () => true;
            const expectedText = 'changed text';

            updateTextField(component.property.key, expectedText);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property },
                changed: {
                    textkey: expectedText
                }
            });
            expect(getTextFieldValue(component.property.key)).toEqual(expectedText);
        });

        it('should copy value to clipboard on double click', async () => {
            const clipboardService = TestBed.inject(ClipboardService);
            spyOn(clipboardService, 'copyContentToClipboard');

            component.property.value = 'myValueToCopy';
            component.property.icon = 'FAKE_ICON';
            component.editable = false;
            component.copyToClipboardAction = true;
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const doubleClickEl = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            doubleClickEl.triggerEventHandler('dblclick', new MouseEvent('dblclick'));

            fixture.detectChanges();
            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('myValueToCopy', 'CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
        });

        it('should clear value when clear value icon is clicked', async () => {
            spyOn(component, 'update');
            component.property.value = 'testValue';
            component.property.icon = 'FAKE_ICON';
            component.property.clickable = true;
            component.property.editable = true;
            component.editable = true;
            component.property.isValid = () => true;

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            const clickEl = fixture.debugElement.query(By.css(`.adf-textitem-clear-icon`));
            clickEl.triggerEventHandler('click', new MouseEvent('click'));

            fixture.detectChanges();
            const elementValue = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-value-${component.property.key}"]`));
            expect(elementValue.nativeElement.textContent).toEqual('');
            expect(component.update).toHaveBeenCalled();
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
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
            fixture.detectChanges();
        });

        it('should call the isValid method with the edited value', async () => {
            spyOn(component.property, 'isValid');

            updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            expect(component.property.isValid).toHaveBeenCalledWith('updated-value');
        });

        it('should trigger the update event if the editedValue is valid', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.property.isValid = () => true;

            updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            const property = { ...component.property };
            expect(cardViewUpdateService.update).toHaveBeenCalledWith(property, 'updated-value');
        });

        it('should trigger the update event if the editedValue is NOT valid', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.property.isValid = () => false;

            updateTextField(component.property.key, '@invalid-value');
            await fixture.whenStable();

            expect(cardViewUpdateService.update).toHaveBeenCalled();
        });

        it('should trigger the update event if the editedValue is valid', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.property.isValid = () => true;

            updateTextField(component.property.key, 'valid-value');
            await fixture.whenStable();

            expect(cardViewUpdateService.update).toHaveBeenCalled();
        });

        it('should set the errorMessages properly if the editedValue is invalid', async () => {
            component.property.isValid = () => false;
            component.property.getValidationErrors = () => expectedErrorMessages;

            updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            expect(component.errors).toBe(expectedErrorMessages);
        });

        it('should set the errorMessages properly if the editedValue is valid', async () => {
            component.property.isValid = () => true;

            updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            expect(component.errors).toEqual([]);
        });

        it('should render the error', () => {
            component.errors = expectedErrorMessages;
            component.editable = true;
            fixture.detectChanges();

            const errorMessage: HTMLElement = fixture.debugElement.nativeElement.querySelector('.adf-textitem-editable-error');
            expect(errorMessage.textContent).toBe(expectedErrorMessages[0].message);
        });

        it('should NOT display error when exiting editable mode', () => {
            component.errors = expectedErrorMessages;
            component.editable = true;
            fixture.detectChanges();

            let errorMessage: HTMLElement = fixture.debugElement.nativeElement.querySelector('.adf-textitem-editable-error');
            expect(errorMessage.textContent).toBe(expectedErrorMessages[0].message);

            component.editable = false;
            fixture.detectChanges();

            errorMessage = fixture.debugElement.nativeElement.querySelector('.adf-textitem-editable-error');
            expect(errorMessage).toBeNull();
        });

        it('should update the property value after a successful update attempt', async () => {
            component.editedValue = 'TEST';
            component.update();

            expect(component.property.value).toEqual(component.editedValue);
        });

        it('should trigger an update event on the CardViewUpdateService [integration]', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            component.property.isValid = () => true;
            const expectedText = 'changed text';

            updateTextField(component.property.key, expectedText);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property },
                changed: {
                    textkey: expectedText
                }
            });
        });

        it('should update the value using the updateItem$ subject', () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            component.property.isValid = () => true;
            const expectedText = 'changed text';

            let value = getTextFieldValue(component.property.key);
            expect(value).toEqual('Lorem ipsum');
            expect(component.property.value).toBe('Lorem ipsum');

            cardViewUpdateService.updateElement({ key: component.property.key, value: expectedText } as any);
            component.ngOnChanges({ property: new SimpleChange(value, expectedText, false) });
            fixture.detectChanges();

            value = getTextFieldValue(component.property.key);
            expect(value).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);

        });

        it('should render the default as value if the value is empty, clickable is true and displayEmpty is true', () => {
            component.property.value = '';
            component.property.clickable = true;
            component.displayEmpty = true;

            fixture.detectChanges();

            const inputField = getTextFieldValue(component.property.key);
            expect(inputField).toBe('Lorem ipsum');
        });

        it('should update multiline input the value on input updated', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            spyOn(component, 'update').and.callThrough();
            component.property.isValid = () => true;
            component.property.multiline = true;
            const expectedText = 'changed text';

            updateTextField(component.property.key, expectedText);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property },
                changed: {
                    textkey: expectedText
                }
            });

            expect(component.update).toHaveBeenCalled();
            expect(getTextFieldValue(component.property.key)).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        });
    });

    describe('number', () => {
        let cardViewUpdateService: CardViewUpdateService;

        beforeEach(() => {
            cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            component.property = new CardViewIntItemModel({
                label: 'Text label',
                value: 10,
                key: 'textkey',
                default: 1,
                editable: true
            });
            component.editable = true;
            component.property.validators?.push(new CardViewItemIntValidator());
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
            fixture.detectChanges();
        });

        it('should show validation error when string passed', async () => {
            updateTextField(component.property.key, 'update number');
            await fixture.whenStable();
            fixture.detectChanges();

            const errorMessage = getTextFieldError(component.property.key);
            expect(errorMessage).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
        });

        it('should NOT show validation error for empty string', async () => {
            updateTextField(component.property.key, '');
            await fixture.whenStable();
            fixture.detectChanges();

            const errorElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-error-textkey"]'));
            expect(errorElement).toBeNull();
        });

        it('should NOT show validation error for null', async () => {
            updateTextField(component.property.key, null);
            await fixture.whenStable();
            fixture.detectChanges();

            const inputElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-textkey"]'));
            const errorElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-error-textkey"]'));

            expect(inputElement.nativeElement.value).toBe('');
            expect(errorElement).toBeNull();
        });

        it('should show validation error for only spaces string', async () => {
            updateTextField(component.property.key, ' ');
            await fixture.whenStable();
            fixture.detectChanges();

            const errorMessage = getTextFieldError(component.property.key);
            expect(errorMessage).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
        });

        it('should NOT show validation error for empty string', async () => {
            updateTextField(component.property.key, '');
            await fixture.whenStable();
            fixture.detectChanges();

            const errorElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-error-textkey"]'));
            expect(errorElement).toBeNull();
        });

        it('should NOT show validation error for null', async () => {
            updateTextField(component.property.key, null);
            await fixture.whenStable();
            fixture.detectChanges();

            const inputElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-textkey"]'));
            const errorElement = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-error-textkey"]'));

            expect(inputElement.nativeElement.value).toBe('');
            expect(errorElement).toBeNull();
        });

        it('should show validation error for float number', async () => {
            updateTextField(component.property.key, 123.456);
            await fixture.whenStable();
            fixture.detectChanges();

            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
        });

        it('should show validation error for exceed the number limit (2147483648)', async () => {
            updateTextField(component.property.key, 2147483648);
            await fixture.whenStable();
            fixture.detectChanges();

            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
        });

        it('should not show validation error for below the number limit (2147483647)', async () => {
            updateTextField(component.property.key, 2147483647);
            await fixture.whenStable();
            fixture.detectChanges();

            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();
            expect(component.property.value).toBe('2147483647');
        });

        it('should update input the value on input updated', async () => {
            const expectedNumber = 2020;
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, expectedNumber);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property },
                changed: {
                    textkey: expectedNumber.toString()
                }
            });

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
            cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            component.property = new CardViewFloatItemModel({
                label: 'Text label',
                value: floatValue,
                key: 'textkey',
                default: 1,
                editable: true
            });
            component.editable = true;
            component.property.validators?.push(new CardViewItemFloatValidator());
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
            fixture.detectChanges();
        });

        it('should show validation error when string passed', async () => {
            updateTextField(component.property.key, 'hello there');
            await fixture.whenStable();
            fixture.detectChanges();

            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');
            expect(component.property.value).toBe(floatValue);
        });

        it('should show validation error for empty string (float)', async () => {
            updateTextField(component.property.key, ' ');
            await fixture.whenStable();
            fixture.detectChanges();

            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');
            expect(component.property.value).toBe(floatValue);
        });

        it('should update input the value on input updated', async () => {
            const expectedNumber = 88.44;
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            spyOn(component, 'update').and.callThrough();

            updateTextField(component.property.key, expectedNumber);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property },
                changed: {
                    textkey: expectedNumber.toString()
                }
            });

            const error = fixture.debugElement.query(By.css(`[data-automation-id="card-textitem-error-${component.property.key}"] li`));
            expect(error).toBeFalsy();
            expect(getTextFieldValue(component.property.key)).toEqual(expectedNumber.toString());
            expect(component.property.value).toBe(expectedNumber.toString());
        });
    });

    describe('events', () => {

        it('should perform undo action by clearing the text that we enter in the text field using undo keyboard shortcut', async () => {
            checkCtrlZActions(true, 'KeyZ', false, 'UNDO TEST', true);

        });


        it('should not perform undo action when we hit any other shortcut instead of using undo keyboard shortcut', async () => {
            checkCtrlZActions(true, 'KeyH', false, 'DO NOT DO UNDO', false);

        });

        it('should not perform undo action when control key is not pressed even if the keycode is correct', async () => {
            checkCtrlZActions(false, 'KeyZ', false, 'DO NOT DO UNDO', false);

        });

        it('should perform undo action in MacOS by clearing the text that we enter in the text field using undo keyboard shortcut', async () => {
            checkCtrlZActions(false, 'KeyZ', true, 'UNDO TEST FOR MACOS', true);

        });
    });
});
