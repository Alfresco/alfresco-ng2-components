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
import { setupTestBed } from '../../../testing/setup-test-bed';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewComponent } from './card-view.component';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { of } from 'rxjs';
import { CardViewSelectItemOption } from '../../interfaces/card-view-selectitem-properties.interface';

describe('CardViewComponent', () => {

    let fixture: ComponentFixture<CardViewComponent>;
    let component: CardViewComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the label and value', async () => {
        component.properties = [new CardViewTextItemModel({ label: 'My label', value: 'My value', key: 'some key' })];

        fixture.detectChanges();
        await fixture.whenStable();

        const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('My label');

        const value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.value).toBe('My value');
    });

    it('should pass through editable property to the items', () => {
        component.editable = true;
        component.properties = [new CardViewDateItemModel({
            label: 'My date label',
            value: '2017-06-14',
            key: 'some-key',
            editable: true
        })];

        fixture.detectChanges();

        const datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-some-key"]`));
        expect(datePicker).not.toBeNull('Datepicker should be in DOM');
    });

    it('should render the date in the correct format', async () => {
        component.properties = [new CardViewDateItemModel({
            label: 'My date label',
            value: '2017-06-14',
            key: 'some key',
            format: 'short'
        })];

        fixture.detectChanges();
        await fixture.whenStable();

        const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('My date label');

        const value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText).toBe('6/14/17, 12:00 AM');
    });

    it('should render the default value if the value is empty, not editable and displayEmpty is true', async () => {
        component.properties = [new CardViewTextItemModel({
            label: 'My default label',
            value: null,
            default: 'default value',
            key: 'some-key',
            editable: false
        })];
        component.editable = true;
        component.displayEmpty = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('My default label');

        const value = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-some-key"]'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.value).toBe('default value');
    });

    it('should render the default value if the value is empty and is editable', async () => {
        component.properties = [new CardViewTextItemModel({
            label: 'My default label',
            value: null,
            default: 'default value',
            key: 'some-key',
            editable: true
        })];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('My default label');

        const value = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-some-key"]'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.value).toBe('default value');
    });

    it('should render the select element with the None option when not set in the properties', async () => {
        const options: CardViewSelectItemOption<string>[] = [{label : 'Option 1', key: '1'}, {label : 'Option 2', key: '2'}];
        component.properties = [new CardViewSelectItemModel({
            label: 'My default label',
            value: '1',
            default: 'default value',
            key: 'some-key',
            editable: true,
            options$: of(options)
        })];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const labelValue = fixture.debugElement.query(By.css('adf-card-view-selectitem .mat-select-trigger'));
        labelValue.triggerEventHandler('click', null);
        fixture.detectChanges();
        await fixture.whenStable();

        const currentOptions = document.querySelectorAll('mat-option');
        expect(currentOptions.length).toBe(3);
        expect(currentOptions[0].innerHTML).toContain('CORE.CARDVIEW.NONE');
        expect(currentOptions[1].innerHTML).toContain(options[0].label);
        expect(currentOptions[2].innerHTML).toContain(options[1].label);
    });

    it('should render the select element with the None option when set true in the properties', async () => {
        const options: CardViewSelectItemOption<string>[] = [{label : 'Option 1', key: '1'}, {label : 'Option 2', key: '2'}];
        component.properties = [new CardViewSelectItemModel({
            label: 'My default label',
            value: '1',
            default: 'default value',
            key: 'some-key',
            editable: true,
            displayNoneOption: true,
            options$: of(options)
        })];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const labelValue = fixture.debugElement.query(By.css('adf-card-view-selectitem .mat-select-trigger'));
        labelValue.triggerEventHandler('click', null);
        fixture.detectChanges();
        await fixture.whenStable();

        const currentOptions = document.querySelectorAll('mat-option');
        expect(currentOptions.length).toBe(3);
        expect(currentOptions[0].innerHTML).toContain('CORE.CARDVIEW.NONE');
        expect(currentOptions[1].innerHTML).toContain(options[0].label);
        expect(currentOptions[2].innerHTML).toContain(options[1].label);
    });

    it('should not render the select element with the None option when set false in the properties', async () => {
        const options: CardViewSelectItemOption<string>[] = [{label : 'Option 1', key: '1'}, {label : 'Option 2', key: '2'}];
        component.properties = [new CardViewSelectItemModel({
            label: 'My default label',
            value: '1',
            default: 'default value',
            key: 'some-key',
            editable: true,
            displayNoneOption: false,
            options$: of(options)
        })];
        component.editable = true;
        component.displayEmpty = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const labelValue = fixture.debugElement.query(By.css('adf-card-view-selectitem .mat-select-trigger'));
        labelValue.triggerEventHandler('click', null);
        fixture.detectChanges();
        await fixture.whenStable();

        const currentOptions = document.querySelectorAll('mat-option');
        expect(currentOptions.length).toBe(2);
        expect(currentOptions[0].innerHTML).toContain(options[0].label);
        expect(currentOptions[1].innerHTML).toContain(options[1].label);
    });
});
