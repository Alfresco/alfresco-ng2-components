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
import { CardViewMapItemModel } from '../../models/card-view-mapitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewMapItemComponent } from './card-view-mapitem.component';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('CardViewMapItemComponent', () => {
    let service: CardViewUpdateService;
    let fixture: ComponentFixture<CardViewMapItemComponent>;
    let component: CardViewMapItemComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CardViewMapItemComponent]
        });
        fixture = TestBed.createComponent(CardViewMapItemComponent);
        service = TestBed.inject(CardViewUpdateService);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    afterEach(() => {
        fixture.destroy();
    });

    const getPropertyLabel = (): string => testingUtils.getInnerTextByCSS('.adf-property-label');
    const getPropertyValue = (): string => testingUtils.getInnerTextByDataAutomationId(`card-mapitem-value-${component.property.key}`);

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

        expect(getPropertyLabel()).toBe('Map label');
        expect(getPropertyValue().trim()).toBe('Fake default');
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

        expect(testingUtils.getByCSS('.adf-property-label')).toBeNull();
        expect(getPropertyValue().trim()).toBe('');
    });

    it('should render the label and value', () => {
        component.property = new CardViewMapItemModel({
            label: 'Map label',
            value: new Map([['999', 'fakeProcessName']]),
            key: 'mapkey',
            default: ''
        });

        fixture.detectChanges();

        expect(getPropertyLabel()).toBe('Map label');
        expect(getPropertyValue().trim()).toBe('fakeProcessName');
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

        const disposableUpdate = service.itemClicked$.subscribe((response) => {
            expect(response.target).not.toBeNull();
            expect(response.target.type).toEqual('map');
            expect(response.target.clickable).toBeTruthy();
            expect(response.target.displayValue).toEqual('fakeProcessName');
            disposableUpdate.unsubscribe();
            done();
        });

        testingUtils.clickByCSS('.adf-mapitem-clickable-value');
    });
});
