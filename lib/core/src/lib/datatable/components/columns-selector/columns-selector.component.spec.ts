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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ColumnsSelectorComponent } from './columns-selector.component';
import { DataColumn } from '../../data/data-column.model';
import { Observable, Subject } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('ColumnsSelectorComponent', () => {
    let fixture: ComponentFixture<ColumnsSelectorComponent>;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    let component: ColumnsSelectorComponent;
    let inputColumns: DataColumn[] = [];

    const menuOpenedTrigger = new Subject<void>();
    const menuClosedTrigger = new Subject<void>();
    const getSelectorInputValue = (): Promise<string> => testingUtils.getMatInputValueByDataAutomationId('adf-columns-selector-search-input');
    const fillSelectorInput = (value: string): Promise<void> =>
        testingUtils.fillMatInputByDataAutomationId('adf-columns-selector-search-input', value);

    let mainMenuTrigger: { menuOpened: Observable<void>; menuClosed: Observable<void> };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ColumnsSelectorComponent]
        });

        fixture = TestBed.createComponent(ColumnsSelectorComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);

        component = fixture.componentInstance;
        inputColumns = [
            {
                id: 'id0',
                key: 'key0',
                title: 'title0',
                type: 'text'
            },
            {
                id: 'id1',
                key: 'key1',
                title: 'title1',
                type: 'text'
            },
            {
                id: 'id2',
                key: 'key2',
                title: 'title2',
                type: 'text'
            },
            {
                id: 'id3',
                key: 'NoTitle',
                type: 'text'
            },
            {
                id: 'id4',
                key: 'IsHidden',
                type: 'text',
                title: 'title4',
                isHidden: true
            }
        ];

        mainMenuTrigger = {
            menuOpened: menuOpenedTrigger.asObservable(),
            menuClosed: menuClosedTrigger.asObservable()
        };

        component.columns = inputColumns;
        component.mainMenuTrigger = mainMenuTrigger as MatMenuTrigger;

        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should clear search after closing menu', fakeAsync(async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        await fillSelectorInput('TEST');

        tick(300);
        expect(await getSelectorInputValue()).toBe('TEST');

        menuClosedTrigger.next();
        tick(300);

        expect(await getSelectorInputValue()).toBe('');
    }));

    it('should list only columns with title', async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const options = await testingUtils.getAllMatListOptions();
        const inputColumnsWithTitle = inputColumns.filter((column) => !!column.title);
        expect(options.length).toBe(inputColumnsWithTitle.length);

        for (const option of options) {
            const optionLabel = await option.getFullText();

            const inputColumn = inputColumnsWithTitle.find((inputColumnWithTitle) => inputColumnWithTitle.title === optionLabel);
            expect(inputColumn).toBeTruthy('Should have all columns with title');
        }
    });

    it('should filter columns by search text', fakeAsync(async () => {
        fixture.detectChanges();
        menuOpenedTrigger.next();

        await fillSelectorInput(inputColumns[0].title);

        tick(400);
        fixture.detectChanges();

        const columnOptions = await testingUtils.getAllMatListOptions();

        expect(columnOptions.length).toBe(1);
        expect(await columnOptions[0].getFullText()).toBe(inputColumns[0].title);
    }));

    it('should change column visibility', async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const firstColumnOption = await testingUtils.getMatListOption();
        const optionName = await firstColumnOption.getFullText();

        const toggledColumnItem = component.columnItems.find((item) => item.title === optionName);
        expect(toggledColumnItem?.isHidden).toBeUndefined();

        await firstColumnOption.toggle();
        expect(toggledColumnItem?.isHidden).toBeTrue();
    });

    describe('list options', () => {
        it('should have set proper default state', async () => {
            menuOpenedTrigger.next();
            fixture.detectChanges();

            const options = await testingUtils.getAllMatListOptions();

            expect(await options[0].isSelected()).toBeTrue();
            expect(await options[1].isSelected()).toBeTrue();
            expect(await options[2].isSelected()).toBeTrue();
            expect(await options[3].isSelected()).toBeFalse();
        });

        it('should be disabled when visible columns limit is reached', async () => {
            component.maxColumnsVisible = 4;
            menuOpenedTrigger.next();
            fixture.detectChanges();

            const options = await testingUtils.getAllMatListOptions();

            expect(await options[0].isDisabled()).toBeFalse();
            expect(await options[1].isDisabled()).toBeFalse();
            expect(await options[2].isDisabled()).toBeFalse();
            expect(await options[3].isDisabled()).toBeTrue();
        });
    });

    describe('sorting', () => {
        const hiddenDataColumn: DataColumn = {
            id: 'hiddenDataColumn',
            title: 'hiddenDataColumn',
            key: 'hiddenDataColumn',
            type: 'text',
            isHidden: true
        };

        const shownDataColumn: DataColumn = {
            id: 'shownDataColumn',
            title: 'shownDataColumn',
            key: 'shownDataColumn',
            type: 'text'
        };
        it('should show hidden columns at the end of the list by default', async () => {
            component.columns = [hiddenDataColumn, shownDataColumn];
            menuOpenedTrigger.next();
            fixture.detectChanges();

            const options = await testingUtils.getAllMatListOptions();
            expect(await options[0].getFullText()).toBe(shownDataColumn.title);
            expect(await options[1].getFullText()).toBe(hiddenDataColumn.title);
        });

        it('should NOT show hidden columns at the end of the list if sorting is disabled', async () => {
            component.columns = [hiddenDataColumn, shownDataColumn];
            component.columnsSorting = false;
            menuOpenedTrigger.next();
            fixture.detectChanges();

            const options = await testingUtils.getAllMatListOptions();
            expect(await options[0].getFullText()).toBe(hiddenDataColumn.title);
            expect(await options[1].getFullText()).toBe(shownDataColumn.title);
        });

        it('should show subtitle', async () => {
            const column: DataColumn = {
                id: 'shownDataColumn',
                title: 'title',
                subtitle: 'subtitle',
                key: 'shownDataColumn',
                type: 'text'
            };

            component.columns = [column];

            component.columnsSorting = false;
            menuOpenedTrigger.next();
            fixture.detectChanges();
            expect(await (await testingUtils.getMatListOption()).getFullText()).toBe(`${column.title}  ${column.subtitle}`);
        });
    });
});
