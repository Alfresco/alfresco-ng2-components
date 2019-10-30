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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { CardViewArrayItemComponent } from './card-view-arrayitem.component';
import { CardViewArrayItemModel } from '../../models/card-view-arrayitem.model';
import { By } from '@angular/platform-browser';

describe('CardViewArrayItemComponent', () => {
    let component: CardViewArrayItemComponent;
    let fixture: ComponentFixture<CardViewArrayItemComponent>;

    const mockData = ['Zlatan', 'Lionel Messi', 'Mohamed', 'Ronaldo'];
    const mockDefaultProps = {
        label: 'Array of items',
        value: of(mockData),
        key: 'array',
        icon: 'person'
    };
    setupTestBed({
        imports: [CoreTestingModule]
    });

    afterEach(() => {
        fixture.destroy();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewArrayItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewArrayItemModel(mockDefaultProps);
    });

    it('should create CardViewArrayItemComponent', () => {
        expect(component instanceof CardViewArrayItemComponent).toBeTruthy();
    });

    describe('Rendering', () => {
        it('should render the label', () => {
            fixture.detectChanges();

            const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('Array of items');
        });

        it('should render chip list', () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                editable: true
            });
            fixture.detectChanges();

            const chiplistContainer = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-chip-list-container"]'));
            const chip1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Zlatan"] span');
            const chip2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Lionel Messi"] span');

            expect(chiplistContainer).not.toBeNull();
            expect(chip1.innerText).toEqual('Zlatan');
            expect(chip2.innerText).toEqual('Lionel Messi');
        });

        it('should render all values if noOfItemsToDisplay is not defined', () => {
            fixture.detectChanges();

            const chiplistContainer = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-chip-list-container"]'));
            const moreElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-more-chip"]'));
            const chip = fixture.nativeElement.querySelectorAll('mat-chip');

            expect(chiplistContainer).not.toBeNull();
            expect(moreElement).toBeNull();
            expect(chip.length).toBe(4);
        });

        it('should render only two values along with more item chip if noOfItemsToDisplay is set to 2', () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                noOfItemsToDisplay: 2
            });
            fixture.detectChanges();

            const chiplistContainer = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-chip-list-container"]'));
            const chip = fixture.debugElement.queryAll(By.css('mat-chip'));

            expect(chiplistContainer).not.toBeNull();
            expect(chip.length).toBe(3);
            expect(chip[2].nativeElement.innerText).toBe('2 CORE.CARDVIEW.MORE');
        });
    });
});
