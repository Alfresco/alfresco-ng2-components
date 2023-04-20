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
import { of } from 'rxjs';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { CardViewArrayItemComponent } from './card-view-arrayitem.component';
import { CardViewArrayItemModel, CardViewArrayItem } from '../../models/card-view-arrayitem.model';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { CardViewUpdateService } from '../../services/card-view-update.service';

describe('CardViewArrayItemComponent', () => {
    let component: CardViewArrayItemComponent;
    let fixture: ComponentFixture<CardViewArrayItemComponent>;
    let service: CardViewUpdateService;
    let serviceSpy: jasmine.Spy;

    const mockData = [
        { icon: 'person', value: 'Zlatan' },
        { icon: 'group', value: 'Lionel Messi' },
        { icon: 'person', value: 'Mohamed' },
        { icon: 'person', value: 'Ronaldo' }
    ] as CardViewArrayItem[];

    const mockDefaultProps = {
        label: 'Array of items',
        value: of(mockData),
        key: 'array',
        icon: 'edit'
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    afterEach(() => {
        fixture.destroy();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewArrayItemComponent);
        service = TestBed.inject(CardViewUpdateService);
        component = fixture.componentInstance;
        component.property = new CardViewArrayItemModel(mockDefaultProps);
    });

    describe('Click event', () => {
        beforeEach(() => {
            serviceSpy = spyOn(service, 'clicked');
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                clickable: true
            });

            fixture.detectChanges();
        });

        it('should call service on chip click', () => {
            const chip: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Zlatan"]');
            chip.dispatchEvent(new Event('click'));

            expect(serviceSpy).toHaveBeenCalled();
        });

        it('should call service on edit icon click', () => {
            const editIcon: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="card-array-item-clickable-icon-array"]');
            editIcon.dispatchEvent(new Event('click'));

            expect(serviceSpy).toHaveBeenCalled();
        });

        it('should NOT call service on chip list container click', () => {
            const chiplistContainer: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-list-container"]');
            chiplistContainer.dispatchEvent(new Event('click'));

            expect(serviceSpy).not.toHaveBeenCalled();
        });
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

        it('should render chip with defined icon', () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                editable: true
            });
            fixture.detectChanges();

            const chiplistContainer = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-chip-list-container"]'));
            const chip1 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Zlatan"] span');
            const chip1Icon = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Zlatan"] mat-icon');
            const chip2 = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Lionel Messi"] span');
            const chip2Icon = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Lionel Messi"] mat-icon');

            expect(chiplistContainer).not.toBeNull();
            expect(chip1.innerText).toEqual('Zlatan');
            expect(chip1Icon.innerText).toEqual('person');
            expect(chip2.innerText).toEqual('Lionel Messi');
            expect(chip2Icon.innerText).toEqual('group');
        });

        it('should render defined icon if clickable set to true', () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                clickable: true
            });
            fixture.detectChanges();
            const editicon = fixture.nativeElement.querySelector('[data-automation-id="card-array-item-clickable-icon-array"]');
            expect(editicon).toBeDefined();
            expect(editicon.innerText).toBe('edit');
        });

        it('should not render defined icon if clickable set to false', () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                clickable: false
            });
            fixture.detectChanges();
            const editicon = fixture.nativeElement.querySelector('[data-automation-id="card-array-item-clickable-icon-array"]');
            expect(editicon).toBeNull();
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
