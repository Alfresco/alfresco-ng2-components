/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CardViewArrayItemComponent } from './card-view-arrayitem.component';
import { CardViewArrayItemModel, CardViewArrayItem } from '../../models/card-view-arrayitem.model';
import { By } from '@angular/platform-browser';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness, MatChipListboxHarness } from '@angular/material/chips/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('CardViewArrayItemComponent', () => {
    let loader: HarnessLoader;
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, CardViewArrayItemComponent]
        });
        fixture = TestBed.createComponent(CardViewArrayItemComponent);
        service = TestBed.inject(CardViewUpdateService);
        component = fixture.componentInstance;
        component.property = new CardViewArrayItemModel(mockDefaultProps);
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => {
        fixture.destroy();
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

        it('should call service on chip click', async () => {
            const chip = await loader.getHarness(MatChipHarness);
            await (await chip.host()).click();

            expect(serviceSpy).toHaveBeenCalled();
        });

        it('should call service on edit icon click', async () => {
            const button = await loader.getHarness(
                MatButtonHarness.with({ selector: `[data-automation-id="card-array-item-clickable-icon-array"]` })
            );
            await button.click();

            expect(serviceSpy).toHaveBeenCalled();
        });

        it('should NOT call service on chip list container click', async () => {
            const chipList = await loader.getHarness(MatChipListboxHarness);
            await (await chipList.host()).click();

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

        it('should render chip list', async () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                editable: true
            });
            fixture.detectChanges();

            const chipListBox = await loader.getAllHarnesses(MatChipHarness);
            expect(chipListBox).not.toBeNull();
            expect(chipListBox.length).toBe(4);

            const firstChipText = await chipListBox[0].getText();
            const secondChipText = await chipListBox[1].getText();
            expect(firstChipText).toEqual('Zlatan');
            expect(secondChipText).toEqual('Lionel Messi');
        });

        it('should render chip with defined icon', async () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                editable: true
            });
            fixture.detectChanges();

            const chipListBox = await loader.getAllHarnesses(MatChipHarness);
            expect(chipListBox).not.toBeNull();
            expect(chipListBox.length).toBe(4);

            const chip1Icon = await loader.getHarness(MatIconHarness.with({ ancestor: `[data-automation-id="card-arrayitem-chip-Zlatan"]` }));
            const chip2Icon = await loader.getHarness(MatIconHarness.with({ ancestor: `[data-automation-id="card-arrayitem-chip-Lionel Messi"]` }));
            const firstChipText = await chipListBox[0].getText();
            const secondChipText = await chipListBox[1].getText();

            expect(firstChipText).toEqual('Zlatan');
            expect(await chip1Icon.getName()).toBe('person');
            expect(secondChipText).toEqual('Lionel Messi');
            expect(await chip2Icon.getName()).toBe('group');
        });

        it('should render defined icon if clickable set to true', () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                clickable: true
            });
            fixture.detectChanges();
            const editIcon = fixture.nativeElement.querySelector('[data-automation-id="card-array-item-clickable-icon-array"]');
            expect(editIcon).toBeDefined();
            expect(editIcon.innerText).toBe('edit');
        });

        it('should not render defined icon if clickable set to false', async () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                clickable: false
            });
            fixture.detectChanges();
            const editExists = await loader.hasHarness(
                MatButtonHarness.with({ selector: `[data-automation-id="card-array-item-clickable-icon-array"]` })
            );
            expect(editExists).toBe(false);
        });

        it('should render all values if noOfItemsToDisplay is not defined', async () => {
            fixture.detectChanges();

            const chipList = await loader.getAllHarnesses(MatChipHarness);

            const moreElement = fixture.debugElement.query(By.css('[data-automation-id="card-arrayitem-more-chip"]'));
            expect(moreElement).toBeNull();
            expect(chipList.length).toBe(4);
        });

        it('should render only two values along with more item chip if noOfItemsToDisplay is set to 2', async () => {
            component.property = new CardViewArrayItemModel({
                ...mockDefaultProps,
                noOfItemsToDisplay: 2
            });
            fixture.detectChanges();

            const chipList = await loader.getAllHarnesses(MatChipHarness);

            expect(chipList.length).toBe(3);
            expect(await chipList[2].getText()).toBe('2 CORE.CARDVIEW.MORE');
        });
    });
});
