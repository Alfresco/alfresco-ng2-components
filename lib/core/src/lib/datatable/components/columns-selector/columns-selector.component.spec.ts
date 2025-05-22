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
import { NoopTranslateModule } from '../../../testing/noop-translate.module';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('ColumnsSelectorComponent', () => {
    let fixture: ComponentFixture<ColumnsSelectorComponent>;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    let component: ColumnsSelectorComponent;
    let inputColumns: DataColumn[] = [];

    const menuOpenedTrigger = new Subject<void>();
    const menuClosedTrigger = new Subject<void>();

    let mainMenuTrigger: { menuOpened: Observable<void>; menuClosed: Observable<void> };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, ColumnsSelectorComponent]
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

    it('should clear search after closing menu', fakeAsync(() => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        let searchInput = testingUtils.getByCSS('.adf-columns-selector-search-input').nativeElement;
        testingUtils.fillInputByCSS('.adf-columns-selector-search-input', 'TEST');

        tick(300);
        expect(searchInput.value).toBe('TEST');

        menuClosedTrigger.next();
        tick(300);
        searchInput = testingUtils.getByCSS('.adf-columns-selector-search-input').nativeElement;

        expect(searchInput.value).toBe('');
    }));

    it('should list only columns with title', async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const checkboxes = await testingUtils.getAllMatCheckboxes();
        const inputColumnsWithTitle = inputColumns.filter((column) => !!column.title);
        expect(checkboxes.length).toBe(inputColumnsWithTitle.length);

        for (const checkbox of checkboxes) {
            const checkboxLabel = await checkbox.getLabelText();

            const inputColumn = inputColumnsWithTitle.find((inputColumnWithTitle) => inputColumnWithTitle.title === checkboxLabel);
            expect(inputColumn).toBeTruthy('Should have all columns with title');
        }
    });

    it('should filter columns by search text', fakeAsync(async () => {
        fixture.detectChanges();
        menuOpenedTrigger.next();

        testingUtils.fillInputByCSS('.adf-columns-selector-search-input', inputColumns[0].title);

        tick(400);
        fixture.detectChanges();

        const columnCheckboxes = await testingUtils.getAllMatCheckboxes();

        expect(columnCheckboxes.length).toBe(1);
        expect(await columnCheckboxes[0].getLabelText()).toBe(inputColumns[0].title);
    }));

    it('should change column visibility', async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const firstColumnCheckbox = await testingUtils.getMatCheckbox();
        const checkBoxName = await firstColumnCheckbox.getLabelText();

        const toggledColumnItem = component.columnItems.find((item) => item.title === checkBoxName);
        expect(toggledColumnItem?.isHidden).toBe(undefined);

        await firstColumnCheckbox.toggle();
        expect(toggledColumnItem?.isHidden).toBeTrue();
    });

    describe('checkboxes', () => {
        it('should have set proper default state', async () => {
            menuOpenedTrigger.next();
            fixture.detectChanges();

            const checkboxes = await testingUtils.getAllMatCheckboxes();

            expect(await checkboxes[0].isChecked()).toBe(true);
            expect(await checkboxes[1].isChecked()).toBe(true);
            expect(await checkboxes[2].isChecked()).toBe(true);
            expect(await checkboxes[3].isChecked()).toBe(false);
        });

        it('should be disabled when visible columns limit is reached', async () => {
            component.maxColumnsVisible = 4;
            menuOpenedTrigger.next();
            fixture.detectChanges();

            const checkboxes = await testingUtils.getAllMatCheckboxes();

            expect(await checkboxes[0].isDisabled()).toBe(false);
            expect(await checkboxes[1].isDisabled()).toBe(false);
            expect(await checkboxes[2].isDisabled()).toBe(false);
            expect(await checkboxes[3].isDisabled()).toBe(true);
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

            const checkboxes = await testingUtils.getAllMatCheckboxes();
            const labeTextOne = await checkboxes[0].getLabelText();
            const labeTextTwo = await checkboxes[1].getLabelText();

            expect(labeTextOne).toBe(shownDataColumn.title!);
            expect(labeTextTwo).toBe(hiddenDataColumn.title!);
        });

        it('should NOT show hidden columns at the end of the list if sorting is disabled', async () => {
            component.columns = [hiddenDataColumn, shownDataColumn];
            component.columnsSorting = false;
            menuOpenedTrigger.next();
            fixture.detectChanges();

            const checkboxes = await testingUtils.getAllMatCheckboxes();
            const labeTextOne = await checkboxes[0].getLabelText();
            const labeTextTwo = await checkboxes[1].getLabelText();

            expect(labeTextOne).toBe(hiddenDataColumn.title!);
            expect(labeTextTwo).toBe(shownDataColumn.title!);
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

            const checkboxes = await testingUtils.getAllMatCheckboxes();
            const labeTextOne = await checkboxes[0].getLabelText();
            expect(labeTextOne).toBe(`${column.title}  ${column.subtitle}`);
        });
    });
});
