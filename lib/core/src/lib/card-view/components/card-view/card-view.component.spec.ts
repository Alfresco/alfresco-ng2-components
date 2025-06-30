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
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewComponent } from './card-view.component';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { of } from 'rxjs';
import { CardViewSelectItemOption } from '../../interfaces/card-view-selectitem-properties.interface';
import { CardViewItem } from '../../interfaces/card-view-item.interface';
import { CardViewItemDispatcherComponent } from '../card-view-item-dispatcher/card-view-item-dispatcher.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopTranslateModule } from '../../../testing/noop-translate.module';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('CardViewComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<CardViewComponent>;
    let component: CardViewComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAnimationsModule, MatSnackBarModule, MatDialogModule, CardViewComponent]
        });

        fixture = TestBed.createComponent(CardViewComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => {
        fixture.destroy();
    });

    const getPropertyLabel = (): string => testingUtils.getInnerTextByCSS('.adf-property-label');
    const getPropertyValue = (): string => testingUtils.getByCSS('.adf-property-value').nativeElement.value;
    const getPropertyValueText = (): string => testingUtils.getInnerTextByCSS('.adf-property-value');
    const getPropertyValueByDataAutomationId = (dataAutomationId: string): string =>
        testingUtils.getByDataAutomationId(dataAutomationId).nativeElement.value;

    it('should render the label and value', async () => {
        component.properties = [new CardViewTextItemModel({ label: 'My label', value: 'My value', key: 'some key' })];

        fixture.detectChanges();
        await fixture.whenStable();

        expect(getPropertyLabel()).toBe('My label');
        expect(getPropertyValue()).toBe('My value');
    });

    it('should pass through editable property to the items', () => {
        component.editable = true;
        component.properties = [
            new CardViewDateItemModel({
                label: 'My date label',
                value: '2017-06-14',
                key: 'some-key',
                editable: true
            })
        ];

        fixture.detectChanges();

        expect(testingUtils.getByDataAutomationId('datepicker-some-key')).not.toBeNull('Datepicker should be in DOM');
    });

    it('should render the date in the correct format', async () => {
        component.properties = [
            new CardViewDateItemModel({
                label: 'My date label',
                value: '2017-06-14',
                key: 'some key',
                format: 'short'
            })
        ];

        fixture.detectChanges();
        await fixture.whenStable();
        expect(getPropertyLabel()).toBe('My date label');
        expect(getPropertyValueText()).toBe('6/14/17, 12:00 AM');
    });

    it('should render the default value if the value is empty, not editable and displayEmpty is true', async () => {
        component.properties = [
            new CardViewTextItemModel({
                label: 'My default label',
                value: null,
                default: 'default value',
                key: 'some-key',
                editable: false
            })
        ];
        component.editable = true;
        component.displayEmpty = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(getPropertyLabel()).toBe('My default label');
        expect(getPropertyValueByDataAutomationId('card-textitem-value-some-key')).toBe('default value');
    });

    it('should render the default value if the value is empty and is editable', async () => {
        component.properties = [
            new CardViewTextItemModel({
                label: 'My default label',
                value: null,
                default: 'default value',
                key: 'some-key',
                editable: true
            })
        ];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(getPropertyLabel()).toBe('My default label');
        expect(getPropertyValueByDataAutomationId('card-textitem-value-some-key')).toBe('default value');
    });

    it('should render the select element with the None option when not set in the properties', async () => {
        const options: CardViewSelectItemOption<string>[] = [
            { label: 'Option 1', key: '1' },
            { label: 'Option 2', key: '2' }
        ];
        component.properties = [
            new CardViewSelectItemModel({
                label: 'My default label',
                value: '1',
                default: 'default value',
                key: 'some-key',
                editable: true,
                options$: of(options)
            })
        ];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const currentOptions = await testingUtils.getMatSelectOptions();
        expect(currentOptions.length).toBe(3);
        expect(await currentOptions[0].getText()).toContain('CORE.CARDVIEW.NONE');
        expect(await currentOptions[1].getText()).toContain(options[0].label);
        expect(await currentOptions[2].getText()).toContain(options[1].label);
    });

    it('should render the select element with the None option when set true in the properties', async () => {
        const options: CardViewSelectItemOption<string>[] = [
            { label: 'Option 1', key: '1' },
            { label: 'Option 2', key: '2' }
        ];
        component.properties = [
            new CardViewSelectItemModel({
                label: 'My default label',
                value: '1',
                default: 'default value',
                key: 'some-key',
                editable: true,
                displayNoneOption: true,
                options$: of(options)
            })
        ];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const currentOptions = await testingUtils.getMatSelectOptions();
        expect(currentOptions.length).toBe(3);
        expect(await currentOptions[0].getText()).toContain('CORE.CARDVIEW.NONE');
        expect(await currentOptions[1].getText()).toContain(options[0].label);
        expect(await currentOptions[2].getText()).toContain(options[1].label);
    });

    it('should not render the select element with the None option when set false in the properties', async () => {
        const options: CardViewSelectItemOption<string>[] = [
            { label: 'Option 1', key: '1' },
            { label: 'Option 2', key: '2' }
        ];
        component.properties = [
            new CardViewSelectItemModel({
                label: 'My default label',
                value: '1',
                default: 'default value',
                key: 'some-key',
                editable: true,
                displayNoneOption: false,
                options$: of(options)
            })
        ];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const currentOptions = await testingUtils.getMatSelectOptions();
        expect(currentOptions.length).toBe(2);
        expect(await currentOptions[0].getText()).toContain(options[0].label);
        expect(await currentOptions[1].getText()).toContain(options[1].label);
    });

    it('should show/hide the label for multivalued chip property based on displayLabelForChips input', () => {
        const multiValueProperty: CardViewItem = new CardViewTextItemModel({
            label: 'My Multivalue Label',
            value: ['Value 1', 'Value 2', 'Value 3'],
            key: 'multi-key'
        });

        component.properties = [multiValueProperty];
        fixture.detectChanges();

        const cardViewItemDispatcherComponent = getCardViewItemDispatcherComponent();

        expect(cardViewItemDispatcherComponent.displayLabelForChips).toBe(false);

        component.displayLabelForChips = true;
        fixture.detectChanges();

        expect(cardViewItemDispatcherComponent.displayLabelForChips).toBe(true);
    });

    /**
     * Return the card view item dispatcher component
     *
     * @returns the dispatcher component instance
     */
    function getCardViewItemDispatcherComponent(): CardViewItemDispatcherComponent {
        const cardViewItemDispatcherDebugElement = testingUtils.getByDirective(CardViewItemDispatcherComponent);
        return cardViewItemDispatcherDebugElement.componentInstance as CardViewItemDispatcherComponent;
    }
});
