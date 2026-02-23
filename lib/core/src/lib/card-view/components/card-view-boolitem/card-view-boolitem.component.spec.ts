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
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewBoolItemComponent } from './card-view-boolitem.component';
import { CardViewBoolItemModel } from '../../models/card-view-boolitem.model';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CardViewPropertyValidatorDirective } from '../../directives/card-view-property-validator.directive';
import { FormControl, NgModel } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { Injector } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatErrorHarness } from '@angular/material/form-field/testing';

describe('CardViewBoolItemComponent', () => {
    let fixture: ComponentFixture<CardViewBoolItemComponent>;
    let component: CardViewBoolItemComponent;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewBoolItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewBoolItemModel({
            label: 'Boolean label',
            value: true,
            key: 'boolKey',
            default: false,
            editable: false
        });
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => {
        fixture.destroy();
    });

    const getPropertyLabel = () => testingUtils.getByCSS('.adf-property-label');
    const getPropertyValue = () => testingUtils.getByCSS('.adf-property-value');

    describe('Rendering', () => {
        it('should render the label and value if the property is editable', () => {
            component.editable = true;
            component.property.editable = true;
            fixture.detectChanges();

            expect(getPropertyLabel().nativeElement.innerText).toBe('Boolean label');
            expect(getPropertyValue()).not.toBeNull();
        });

        it('should NOT render the label and value if the property is NOT editable and has no proper boolean value set', () => {
            component.editable = true;
            component.property.value = undefined;
            component.property.editable = false;
            fixture.detectChanges();

            expect(getPropertyLabel()).toBeNull();
            expect(getPropertyValue()).toBeNull();
        });

        it('should render the label and value if the property is NOT editable but has a proper boolean value set', () => {
            component.editable = true;
            component.property.value = false;
            component.property.editable = false;
            fixture.detectChanges();

            expect(getPropertyLabel()).not.toBeNull();
            expect(getPropertyValue()).not.toBeNull();
        });

        it('should render ticked checkbox if property value is true', async () => {
            component.property.value = true;
            fixture.detectChanges();

            const checkbox = await testingUtils.getMatCheckboxByDataAutomationId('card-boolean-boolKey');
            expect(checkbox).toBeDefined();
            expect(await checkbox.isChecked()).toBeTrue();
        });

        it('should render ticked checkbox if property value is not set but default is true and editable', async () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = undefined;
            component.property.default = true;
            fixture.detectChanges();

            const checkbox = await testingUtils.getMatCheckboxByDataAutomationId('card-boolean-boolKey');
            expect(checkbox).toBeDefined();
            expect(await checkbox.isChecked()).toBeTrue();
        });

        it('should render un-ticked checkbox if property value is false', async () => {
            component.property.value = false;
            fixture.detectChanges();

            const checkbox = await testingUtils.getMatCheckboxByDataAutomationId('card-boolean-boolKey');
            expect(checkbox).toBeDefined();
            expect(await checkbox.isChecked()).toBeFalse();
        });

        it('should render un-ticked checkbox if property value is not set but default is false and editable', async () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = undefined;
            component.property.default = false;
            fixture.detectChanges();

            const checkbox = await testingUtils.getMatCheckboxByDataAutomationId('card-boolean-boolKey');
            expect(checkbox).toBeDefined();
            expect(await checkbox.isChecked()).toBeFalse();
        });

        it('should render enabled checkbox if property and component are both editable', async () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = true;
            fixture.detectChanges();

            const checkbox = await testingUtils.getMatCheckboxByDataAutomationId('card-boolean-boolKey');
            expect(checkbox).toBeDefined();
            expect(await checkbox.isDisabled()).toBeFalse();
        });

        it('should render disabled checkbox if property is not editable', async () => {
            component.editable = true;
            component.property.editable = false;
            component.property.value = true;
            fixture.detectChanges();

            const checkbox = await testingUtils.getMatCheckboxByDataAutomationId('card-boolean-boolKey');
            expect(checkbox).toBeDefined();
            expect(await checkbox.isDisabled()).toBeTrue();
        });

        it('should render disabled checkbox if component is not editable', async () => {
            component.editable = false;
            component.property.editable = true;
            component.property.value = true;
            fixture.detectChanges();

            const checkbox = await testingUtils.getMatCheckboxByDataAutomationId('card-boolean-boolKey');
            expect(checkbox).toBeDefined();
            expect(await checkbox.isDisabled()).toBeTrue();
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

            component.changed(true);

            expect(cardViewUpdateService.update).toHaveBeenCalledWith(property, true);
        });

        it('should update the property value after a changed', async () => {
            component.property.value = true;

            component.changed(false);

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

            testingUtils.clickByDataAutomationId('card-boolean-label-boolKey');
        });
    });

    describe('Validation', () => {
        let cardViewPropertyValidator: CardViewPropertyValidatorDirective;
        let control: FormControl<string | number>;

        const getCheckboxElementInjector = (): Injector => testingUtils.getByDirective(MatCheckbox).injector;

        beforeEach(() => {
            component.editable = true;
            fixture.detectChanges();
            const checkboxElementInjector = getCheckboxElementInjector();
            cardViewPropertyValidator = checkboxElementInjector.get(CardViewPropertyValidatorDirective);
            control = checkboxElementInjector.get(NgModel).control;
        });

        it('should have assigned correct property', () => {
            expect(cardViewPropertyValidator.property).toBe(component.property);
        });

        it('should display correct error', () => {
            cardViewPropertyValidator.validated.emit(['Error 1', 'Error 2']);
            control.setErrors({
                error1: 'Error 1',
                error2: 'Error 2'
            });
            control.markAsTouched();

            fixture.detectChanges();
            expect(testingUtils.getByDirective(MatError).nativeElement.textContent).toBe('Error 1Error 2');
        });

        it('should join multiple errors with br tag in innerHTML', () => {
            cardViewPropertyValidator.validated.emit(['Error 1', 'Error 2']);
            control.setErrors({
                error1: 'Error 1',
                error2: 'Error 2'
            });
            control.markAsTouched();

            fixture.detectChanges();
            expect(testingUtils.getByDirective(MatError).nativeElement.innerHTML).toContain('Error 1<br>Error 2');
        });

        it('should not contain br tag when there is only one error', () => {
            cardViewPropertyValidator.validated.emit(['Single Error']);
            control.setErrors({
                error1: 'Single Error'
            });
            control.markAsTouched();

            fixture.detectChanges();
            expect(testingUtils.getByDirective(MatError).nativeElement.innerHTML).not.toContain('<br>');
            expect(testingUtils.getByDirective(MatError).nativeElement.textContent).toBe('Single Error');
        });

        it('should join three errors with br tags', () => {
            cardViewPropertyValidator.validated.emit(['Error A', 'Error B', 'Error C']);
            control.setErrors({
                errorA: 'Error A',
                errorB: 'Error B',
                errorC: 'Error C'
            });
            control.markAsTouched();

            fixture.detectChanges();
            expect(testingUtils.getByDirective(MatError).nativeElement.innerHTML).toContain('Error A<br>Error B<br>Error C');
        });

        it('should set empty error string when validated with empty array', () => {
            cardViewPropertyValidator.validated.emit([]);

            expect(component.error).toBe('');
        });

        it('should not display error message when control is touched and has no errors', async () => {
            control.markAsTouched();

            fixture.detectChanges();
            const errors = await loader.getAllHarnesses(MatErrorHarness);
            expect(errors.length).toBe(0);
        });
    });
});
