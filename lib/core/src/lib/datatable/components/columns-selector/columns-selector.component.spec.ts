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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ColumnsSelectorComponent } from './columns-selector.component';
import { DataColumn } from '../../data/data-column.model';
import { Observable, Subject } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { CoreTestingModule } from '../../../testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

describe('ColumnsSelectorComponent', () => {
    let fixture: ComponentFixture<ColumnsSelectorComponent>;
    let loader: HarnessLoader;

    let component: ColumnsSelectorComponent;
    let inputColumns: DataColumn[] = [];

    const menuOpenedTrigger = new Subject<void>();
    const menuClosedTrigger = new Subject<void>();

    let mainMenuTrigger: { menuOpened: Observable<void>; menuClosed: Observable<void> };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            declarations: [ColumnsSelectorComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ColumnsSelectorComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);

        component = fixture.componentInstance;
        inputColumns = [{
            id: 'id0',
            key: 'key0',
            title: 'title0',
            type: 'text'
        }, {
            id: 'id1',
            key: 'key1',
            title: 'title1',
            type: 'text'
        }, {
            id: 'id2',
            key: 'key2',
            title: 'title2',
            type: 'text'
        }, {
            id: 'id3',
            key: 'NoTitle',
            type: 'text'
        }, {
            id: 'id4',
            key: 'IsHidden',
            type: 'text',
            title: 'title4',
            isHidden: true
        }];

        mainMenuTrigger = {
            menuOpened: menuOpenedTrigger.asObservable(),
            menuClosed: menuClosedTrigger.asObservable()
        };

        component.columns = inputColumns;
        component.mainMenuTrigger = mainMenuTrigger as MatMenuTrigger;

        fixture.detectChanges();
    });

    it('should clear search after closing menu', fakeAsync(() => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        let searchInput = fixture.debugElement.query(By.css('.adf-columns-selector-search-input')).nativeElement;
        searchInput.value = 'TEST';
        searchInput.dispatchEvent(new Event('input'));

        tick(300);
        expect(searchInput.value).toBe('TEST');

        menuClosedTrigger.next();
        tick(300);
        searchInput = fixture.debugElement.query(By.css('.adf-columns-selector-search-input')).nativeElement;

        expect(searchInput.value).toBe('');
    }));

    it('should list only columns with title', async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const checkboxes = await loader.getAllHarnesses(MatCheckboxHarness);

        const inputColumnsWithTitle = inputColumns.filter(column => !!column.title);
        expect(checkboxes.length).toBe(inputColumnsWithTitle.length);

        for await (const checkbox of checkboxes) {
            const checkboxLabel = await checkbox.getLabelText();

            const inputColumn = inputColumnsWithTitle.find(inputColumnWithTitle => inputColumnWithTitle.title === checkboxLabel);
            expect(inputColumn).toBeTruthy('Should have all columns with title');
        }
    });

    it('should filter columns by search text', fakeAsync(async () => {
        fixture.detectChanges();
        menuOpenedTrigger.next();

        const searchInput = fixture.debugElement.query(By.css('.adf-columns-selector-search-input')).nativeElement;
        searchInput.value = inputColumns[0].title;
        searchInput.dispatchEvent(new Event('input'));

        tick(400);
        fixture.detectChanges();

        const columnCheckboxes = await loader.getAllHarnesses(MatCheckboxHarness);

        expect(columnCheckboxes.length).toBe(1);
        expect(await columnCheckboxes[0].getLabelText()).toBe(inputColumns[0].title);
    }));

    it('should change column visibility', async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const firstColumnCheckbox = await loader.getHarness(MatCheckboxHarness);
        const checkBoxName = await firstColumnCheckbox.getLabelText();

        const toggledColumnItem = component.columnItems.find(item => item.title === checkBoxName);
        expect(toggledColumnItem.isHidden).toBeFalsy();

        await firstColumnCheckbox.toggle();
        expect(toggledColumnItem.isHidden).toBe(true);
    });

    it('should set proper default state for checkboxes', async () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const checkboxes = await loader.getAllHarnesses(MatCheckboxHarness);

        expect(await checkboxes[0].isChecked()).toBe(true);
        expect(await checkboxes[1].isChecked()).toBe(true);
        expect(await checkboxes[2].isChecked()).toBe(true);
        expect(await checkboxes[3].isChecked()).toBe(false);
    });

    it('should show hidden columns at the end of the list', async () => {
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

        component.columns = [hiddenDataColumn, shownDataColumn];
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const checkboxes = await loader.getAllHarnesses(MatCheckboxHarness);

        expect(await checkboxes[0].getLabelText()).toBe(shownDataColumn.title);
        expect(await checkboxes[1].getLabelText()).toBe(hiddenDataColumn.title);
    });
});
