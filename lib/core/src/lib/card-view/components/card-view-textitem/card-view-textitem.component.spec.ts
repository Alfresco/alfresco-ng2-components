/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { CardViewItemFloatValidator } from '../../validators/card-view-item-float.validator';
import { CardViewItemIntValidator } from '../../validators/card-view-item-int.validator';
import { CardViewIntItemModel } from '../../models/card-view-intitem.model';
import { CardViewFloatItemModel } from '../../models/card-view-floatitem.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { DebugElement, SimpleChange } from '@angular/core';
import { CardViewItemValidator } from '../../interfaces/card-view-item-validator.interface';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('CardViewTextItemComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<CardViewTextItemComponent>;
    let component: CardViewTextItemComponent;
    let testingUtils: UnitTestingUtils;

    const expectedErrorMessages = [{ message: 'Something went wrong' } as CardViewItemValidator];

    const getTextField = (key: string): Promise<MatInputHarness> => testingUtils.getMatInputByDataAutomationId(`card-textitem-value-${key}`);

    const getTextFieldValue = async (key: string): Promise<string> => {
        const textField = await getTextField(key);
        return textField.getValue();
    };

    const updateTextField = async (key: string, value: string) => {
        await testingUtils.fillMatInputByDataAutomationId(`card-textitem-value-${key}`, value);
        fixture.detectChanges();
    };

    const updateTextFieldWithNumber = (key: string, value: number) => {
        testingUtils.fillInputByDataAutomationId(`card-textitem-value-${key}`, value);
        fixture.detectChanges();
    };

    const getErrorElements = (key: string, includeItems = false): DebugElement[] =>
        testingUtils.getAllByCSS(`[data-automation-id="card-textitem-error-${key}"]${includeItems ? ' li' : ''}`);

    const getTextFieldError = (key: string): string => {
        const textItemInputErrors = getErrorElements(key, true);
        expect(textItemInputErrors.length).not.toBe(0);
        return textItemInputErrors[0].nativeElement.innerText;
    };

    const verifyNoErrors = (key: string) => {
        const errorElement = getErrorElements(key);
        expect(errorElement.length).toBe(0);
    };

    const checkCtrlZActions = (ctrlKeyValue: boolean, codeValue: string, metaKeyValue: boolean, mockTestValue: string, flag: boolean) => {
        component.textInput.setValue(mockTestValue);
        const event = new KeyboardEvent('keydown', {
            ctrlKey: ctrlKeyValue,
            code: codeValue,
            metaKey: metaKeyValue
        } as KeyboardEventInit);
        component.undoText(event);
        if (flag) {
            expect(component.textInput.value).toBe('');
        } else {
            expect(component.textInput.value).not.toBe('');
        }
    };

    const renderChipsForMultiValuedProperties = async (
        cardViewTextItemObject,
        flag: boolean,
        length: number,
        param1: string,
        param2: string,
        param3: string
    ) => {
        component.property = new CardViewTextItemModel(cardViewTextItemObject);
        component.editable = cardViewTextItemObject.editable;
        component.useChipsForMultiValueProperty = flag;
        component.ngOnChanges({ property: new SimpleChange(null, null, true) });

        fixture.detectChanges();
        await fixture.whenStable();

        const valueChips = await testingUtils.getMatChips();
        expect(valueChips.length).toBe(length);
        expect(await valueChips[0].getText()).toBe(param1);
        expect(await valueChips[1].getText()).toBe(param2);
        expect(await valueChips[2].getText()).toBe(param3);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CardViewTextItemComponent]
        });
        fixture = TestBed.createComponent(CardViewTextItemComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
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

            expect(testingUtils.getInnerTextByCSS('.adf-property-label')).toBe('Text label');
            expect(await getTextFieldValue(component.property.key)).toBe('Lorem ipsum');
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

            expect(await getTextFieldValue(component.property.key)).toBe('User Name');
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

            expect(await getTextFieldValue(component.property.key)).toBe('FAKE-DEFAULT-KEY');
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

            expect(await getTextFieldValue(component.property.key)).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render value when editable:true', async () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();
            await fixture.whenStable();

            expect(await getTextFieldValue(component.property.key)).toBe('Lorem ipsum');
        });

        it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', async () => {
            component.editable = false;
            component.property.editable = true;

            fixture.detectChanges();
            await fixture.whenStable();
            const editIcon = await testingUtils.checkIfMatIconExistsWithAncestorByDataAutomationId(
                `card-textitem-clickable-icon-${component.property.key}`
            );
            expect(editIcon).toBeFalse();
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
            await renderChipsForMultiValuedProperties(cardViewTextItemObject, true, 3, 'item1', 'item2', 'item3');
        });

        it('should render chips for multivalue integers when chips are enabled', async () => {
            const cardViewTextItemObject = {
                label: 'Text label 2',
                value: [1, 2, 3],
                key: 'textkey',
                editable: true,
                multivalued: true
            };
            await renderChipsForMultiValuedProperties(cardViewTextItemObject, true, 3, '1', '2', '3');
        });

        it('should render chips for multivalue decimal numbers when chips are enabled', async () => {
            const cardViewTextItemObject = {
                label: 'Text label 3',
                value: [1.1, 2.2, 3.3],
                key: 'textkey',
                editable: true,
                multivalued: true
            };
            await renderChipsForMultiValuedProperties(cardViewTextItemObject, true, 3, '1.1', '2.2', '3.3');
        });

        it('should only render new chip when provided value is valid for specified validators set', async () => {
            const cardViewTextItemFloatObject = {
                label: 'Test label',
                value: [10, 20.2, 35.8],
                key: 'textkey',
                editable: true,
                multivalued: true,
                type: 'float'
            };
            component.editable = true;
            await renderChipsForMultiValuedProperties(cardViewTextItemFloatObject, true, 3, '10', '20.2', '35.8');
            const floatValidator: CardViewItemValidator = new CardViewItemFloatValidator();
            component.property.validators = [floatValidator];
            const inputElement = testingUtils.getByDataAutomationId('card-textitem-editchipinput-textkey').nativeElement;
            component.addValueToList({ value: 'abcd', chipInput: inputElement } as MatChipInputEvent);
            fixture.detectChanges();

            expect(getTextFieldError('textkey')).toBe('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');
            let valueChips = await testingUtils.getMatChips();
            expect(valueChips.length).toBe(3);

            component.addValueToList({ value: '22.1', chipInput: inputElement } as MatChipInputEvent);
            fixture.detectChanges();

            verifyNoErrors('textkey');
            valueChips = await testingUtils.getMatChips();
            expect(valueChips.length).toBe(4);
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

            expect(await getTextFieldValue(component.property.key)).toBe('item1,item2,item3');
            expect(await testingUtils.checkIfMatChipGridExists()).toBe(false);
        });

        it('should display the label for multi-valued chips if displayLabelForChips is true', async () => {
            const cardViewTextItemObject = {
                label: 'Text label',
                value: ['item1', 'item2', 'item3'],
                key: 'textkey',
                default: ['FAKE-DEFAULT-KEY'],
                editable: true,
                multivalued: true
            };

            component.editable = true;
            component.property = new CardViewTextItemModel(cardViewTextItemObject);
            component.displayLabelForChips = true;
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getInnerTextByCSS('.adf-property-label')).toBe('Text label');
        });

        it('should NOT display the label for multi-valued chips if displayLabelForChips is false', async () => {
            const cardViewTextItemObject = {
                label: 'Text label',
                value: ['item1', 'item2', 'item3'],
                key: 'textkey',
                default: ['FAKE-DEFAULT-KEY'],
                editable: true,
                multivalued: true
            };

            component.editable = true;
            component.property = new CardViewTextItemModel(cardViewTextItemObject);
            component.displayLabelForChips = false;
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('.adf-property-label')).toBeNull();
        });

        it('should return true when editable is true, and property.editable is false', () => {
            component.editable = true;
            component.property.editable = false;
            fixture.detectChanges();
            expect(component.isReadonlyProperty).toBe(true);
        });

        it('should return false when editable is false, and property.editable is false', () => {
            component.editable = false;
            component.property.editable = false;
            fixture.detectChanges();
            expect(component.isReadonlyProperty).toBe(false);
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

            expect(await getTextFieldValue(component.property.key)).toBe('FAKE-DEFAULT-KEY');
        });

        it('should render the default as value if the value is empty and clickable true', async () => {
            component.property.clickable = true;

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(await getTextFieldValue(component.property.key)).toBe('FAKE-DEFAULT-KEY');
        });

        it('should not render the edit icon in case of clickable true but edit false', async () => {
            component.property.clickable = true;

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const editIcon = await testingUtils.checkIfMatIconExistsWithAncestorByDataAutomationId(
                `card-textitem-clickable-icon-${component.property.key}`
            );
            expect(editIcon).toBeFalse();
        });

        it('should not render the clickable icon in case editable set to false', async () => {
            component.property.clickable = true;
            component.property.icon = 'create';
            component.editable = false;

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const editIcon = await testingUtils.checkIfMatIconExistsWithAncestorByDataAutomationId(
                `card-textitem-clickable-icon-${component.property.key}`
            );
            expect(editIcon).toBeFalse();
        });

        it('should render the defined clickable icon in case of clickable true and editable input set to true', async () => {
            component.property.clickable = true;
            component.property.icon = 'FAKE_ICON';
            component.editable = true;
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const editIcon = await testingUtils.getMatIconWithAncestorByDataAutomationId(`card-textitem-clickable-icon-${component.property.key}`);
            expect(editIcon).not.toBeNull();
            expect(await editIcon.getName()).toBe('FAKE_ICON');
        });

        it('should not render clickable icon in case of clickable true and icon undefined', async () => {
            component.property.clickable = true;
            component.editable = true;

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const editIcon = await testingUtils.checkIfMatIconExistsWithAncestorByDataAutomationId(
                `card-textitem-clickable-icon-${component.property.key}`
            );
            expect(editIcon).toBeFalse();
        });

        it('should not render the edit icon in case of clickable false and icon defined', async () => {
            component.property.clickable = false;
            component.property.icon = 'FAKE_ICON';

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const editIcon = await testingUtils.checkIfMatIconExistsWithAncestorByDataAutomationId(
                `card-textitem-clickable-icon-${component.property.key}`
            );
            expect(editIcon).toBeFalse();
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

            const editIcon = await testingUtils.getMatIconWithAncestorByDataAutomationId(`card-textitem-clickable-icon-${component.property.key}`);
            expect(await editIcon.getName()).toBe('FAKE_ICON');
            await testingUtils.clickMatIconWithAncestorByDataAutomationId(`card-textitem-clickable-icon-${component.property.key}`);
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

            testingUtils.clickByDataAutomationId(`card-textitem-toggle-${component.property.key}`);
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

            await updateTextField(component.property.key, expectedText);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property, isValidValue: true },
                changed: {
                    textkey: expectedText
                }
            });

            expect(await getTextFieldValue(component.property.key)).toEqual(expectedText);
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

            testingUtils.doubleClickByDataAutomationId(`card-textitem-value-${component.property.key}`);
            fixture.detectChanges();

            expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith(
                'myValueToCopy',
                'CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE'
            );
        });

        it('should input be readonly if item it NOT editable', async () => {
            component.editable = false;
            component.property.clickable = true;
            component.ngOnChanges({});

            loader = TestbedHarnessEnvironment.loader(fixture);
            testingUtils.setLoader(loader);
            const inputHarness = await testingUtils.getMatInputByDataAutomationId(`card-textitem-value-${component.property.key}`);

            expect(component.isEditable).toBe(false);
            expect(await inputHarness.isReadonly()).toBe(true);
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
            component.editable = true;
            component.ngOnChanges({ property: new SimpleChange(null, null, true) });
            fixture.detectChanges();
        });

        it('should call the isValid method with the edited value', async () => {
            spyOn(component.property, 'isValid');

            await updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            expect(component.property.isValid).toHaveBeenCalledWith('updated-value');
        });

        it('should trigger the update event if the editedValue is valid', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.property.isValid = () => true;

            await updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            const property = { ...component.property, isValidValue: true };
            expect(cardViewUpdateService.update).toHaveBeenCalledWith(property, 'updated-value');
        });

        it('should trigger the update event if the editedValue is NOT valid', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.property.isValid = () => false;

            await updateTextField(component.property.key, '@invalid-value');
            await fixture.whenStable();

            const property = { ...component.property, isValidValue: false };
            expect(cardViewUpdateService.update).toHaveBeenCalledWith(property, '@invalid-value');
        });

        it('should trigger the update event if the editedValue is valid', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            spyOn(cardViewUpdateService, 'update');
            component.property.isValid = () => true;

            await updateTextField(component.property.key, 'valid-value');
            await fixture.whenStable();

            expect(cardViewUpdateService.update).toHaveBeenCalled();
        });

        it('should set the errorMessages properly if the editedValue is invalid', async () => {
            component.property.isValid = () => false;
            component.property.getValidationErrors = () => expectedErrorMessages;

            await updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            expect(component.errors).toBe(expectedErrorMessages);
        });

        it('should set the errorMessages properly if the editedValue is valid', async () => {
            component.property.isValid = () => true;

            await updateTextField(component.property.key, 'updated-value');
            await fixture.whenStable();

            expect(component.errors).toEqual([]);
        });

        it('should render the error', () => {
            component.errors = expectedErrorMessages;
            component.editable = true;
            fixture.detectChanges();

            const errorMessages = getErrorElements(component.property.key, true);
            expect(errorMessages[0].nativeElement.textContent).toBe(expectedErrorMessages[0].message);
        });

        it('should NOT display error when exiting editable mode', () => {
            component.errors = expectedErrorMessages;
            component.editable = true;
            fixture.detectChanges();

            let errorMessages = getErrorElements(component.property.key, true);
            expect(errorMessages[0].nativeElement.textContent).toBe(expectedErrorMessages[0].message);

            component.editable = false;
            fixture.detectChanges();

            errorMessages = getErrorElements(component.property.key, false);
            expect(errorMessages).toEqual([]);
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

            await updateTextField(component.property.key, expectedText);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property, isValidValue: true },
                changed: {
                    textkey: expectedText
                }
            });
        });

        it('should update the value using the updateItem$ subject', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            component.property.isValid = () => true;
            const expectedText = 'changed text';

            expect(await getTextFieldValue(component.property.key)).toEqual('Lorem ipsum');
            expect(component.property.value).toBe('Lorem ipsum');

            cardViewUpdateService.updateElement({ key: component.property.key, value: expectedText } as any);
            component.ngOnChanges({ property: new SimpleChange(await getTextFieldValue(component.property.key), expectedText, false) });
            fixture.detectChanges();

            expect(await getTextFieldValue(component.property.key)).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        });

        it('should render the default as value if the value is empty, clickable is true and displayEmpty is true', async () => {
            component.property.value = '';
            component.property.clickable = true;
            component.displayEmpty = true;

            fixture.detectChanges();

            expect(await getTextFieldValue(component.property.key)).toBe('Lorem ipsum');
        });

        it('should update multiline input the value on input updated', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            spyOn(component, 'update').and.callThrough();
            component.property.isValid = () => true;
            component.property.multiline = true;
            const expectedText = 'changed text';

            await updateTextField(component.property.key, expectedText);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property, isValidValue: true },
                changed: {
                    textkey: expectedText
                }
            });

            expect(component.update).toHaveBeenCalled();
            expect(await getTextFieldValue(component.property.key)).toEqual(expectedText);
            expect(component.property.value).toBe(expectedText);
        });

        it('should NOT propagate update if is NOT editable', () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            component.editable = false;

            fixture.detectChanges();
            component.update();

            expect(component.isEditable).toBe(false);
            expect(itemUpdatedSpy).not.toHaveBeenCalled();
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
            await updateTextField(component.property.key, 'update number');
            await fixture.whenStable();
            fixture.detectChanges();

            const errorMessage = getTextFieldError(component.property.key);
            expect(errorMessage).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
        });

        it('should NOT show validation error for empty string', async () => {
            await updateTextField(component.property.key, '');
            await fixture.whenStable();
            fixture.detectChanges();

            verifyNoErrors('textkey');
        });

        it('should NOT show validation error for null', async () => {
            await updateTextField(component.property.key, null);
            await fixture.whenStable();
            fixture.detectChanges();

            expect(await getTextFieldValue('textkey')).toBe('');
            verifyNoErrors('textkey');
        });

        it('should show validation error for only spaces string', async () => {
            await updateTextField(component.property.key, ' ');
            await fixture.whenStable();
            fixture.detectChanges();

            const errorMessage = getTextFieldError(component.property.key);
            expect(errorMessage).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
        });

        it('should show validation error for float number', async () => {
            updateTextFieldWithNumber(component.property.key, 123.456);
            await fixture.whenStable();
            fixture.detectChanges();

            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
        });

        it('should show validation error for exceed the number limit (2147483648)', async () => {
            updateTextFieldWithNumber(component.property.key, 2147483648);
            await fixture.whenStable();
            fixture.detectChanges();

            const error = getTextFieldError(component.property.key);
            expect(error).toEqual('CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR');
            expect(component.property.value).toBe(10);
        });

        it('should not show validation error for below the number limit (2147483647)', async () => {
            updateTextFieldWithNumber(component.property.key, 2147483647);
            await fixture.whenStable();
            fixture.detectChanges();

            verifyNoErrors(component.property.key);
            expect(component.property.value).toBe('2147483647');
        });

        it('should update input the value on input updated', async () => {
            const expectedNumber = 2020;
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            spyOn(component, 'update').and.callThrough();

            updateTextFieldWithNumber(component.property.key, expectedNumber);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property, isValidValue: true },
                changed: {
                    textkey: expectedNumber.toString()
                }
            });

            verifyNoErrors(component.property.key);
            expect(await getTextFieldValue(component.property.key)).toEqual(expectedNumber.toString());
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
            await updateTextField(component.property.key, 'hello there');
            await fixture.whenStable();
            fixture.detectChanges();

            expect(getTextFieldError(component.property.key)).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');
        });

        it('should show validation error for empty string (float)', async () => {
            await updateTextField(component.property.key, ' ');
            await fixture.whenStable();
            fixture.detectChanges();

            expect(getTextFieldError(component.property.key)).toEqual('CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR');
        });

        it('should update input the value on input updated', async () => {
            const expectedNumber = 88.44;
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            spyOn(component, 'update').and.callThrough();

            updateTextFieldWithNumber(component.property.key, expectedNumber);
            await fixture.whenStable();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: { ...component.property, isValidValue: true },
                changed: {
                    textkey: expectedNumber.toString()
                }
            });

            verifyNoErrors(component.property.key);
            expect(await getTextFieldValue(component.property.key)).toEqual(expectedNumber.toString());
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
