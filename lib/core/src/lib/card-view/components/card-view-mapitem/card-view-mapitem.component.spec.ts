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

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardViewMapItemModel } from '../../models/card-view-mapitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewMapItemComponent } from './card-view-mapitem.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';

describe('CardViewMapItemComponent', () => {
    let service: CardViewUpdateService;

    let fixture: ComponentFixture<CardViewMapItemComponent>;
    let component: CardViewMapItemComponent;
    let debug: DebugElement;
    let element: HTMLElement;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewMapItemComponent);
        service = TestBed.get(CardViewUpdateService);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the default if the value is empty and displayEmpty is true', () => {
        component.property = new CardViewMapItemModel({
            label: 'Map label',
            value: null,
            key: 'mapkey',
            default: 'Fake default',
            clickable: false
        });
        component.displayEmpty = true;
        fixture.detectChanges();

        const labelValue = debug.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('Map label');

        const value = debug.query(By.css(`[data-automation-id="card-mapitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('Fake default');
    });

    it('should NOT render the default if the value is empty and displayEmpty is false', () => {
        component.property = new CardViewMapItemModel({
            label: 'Map label',
            value: null,
            key: 'mapkey',
            default: 'Fake default',
            clickable: false
        });
        component.displayEmpty = false;
        fixture.detectChanges();

        const labelValue = debug.query(By.css('.adf-property-label'));
        expect(labelValue).toBeNull();

        const value = debug.query(By.css(`[data-automation-id="card-mapitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('');
    });

    it('should render the label and value', () => {
        component.property = new CardViewMapItemModel({
            label: 'Map label',
            value: new Map([['999', 'fakeProcessName']]),
            key: 'mapkey',
            default: ''
        });

        fixture.detectChanges();

        const labelValue = debug.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('Map label');

        const value = debug.query(By.css(`[data-automation-id="card-mapitem-value-${component.property.key}"]`));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('fakeProcessName');
    });

    it('should render a clickable value', (done) => {
        component.property = new CardViewMapItemModel({
            label: 'Map label',
            value: new Map([['999', 'fakeProcessName']]),
            key: 'mapkey',
            default: 'Fake default',
            clickable: true
        });

        fixture.detectChanges();
        const value: any = element.querySelector('.adf-mapitem-clickable-value');

        const disposableUpdate = service.itemClicked$.subscribe((response) => {
            expect(response.target).not.toBeNull();
            expect(response.target.type).toEqual('map');
            expect(response.target.clickable).toBeTruthy();
            expect(response.target.displayValue).toEqual('fakeProcessName');
            disposableUpdate.unsubscribe();
            done();
        });

        value.click();
    });

});
