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

import { IconCellComponent } from './icon-cell.component';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('IconCellComponent', () => {
    let component: IconCellComponent;
    let fixture: ComponentFixture<IconCellComponent>;
    let loader: HarnessLoader;
    const renderAndCheckResult = async (value: any, expectedOccurrence: boolean, expectedIconName?: string) => {
        component.value$.next(value);
        fixture.detectChanges();

        const icon = await UnitTestingUtils.getMatIconOrNull(loader);

        expectedOccurrence ? expect(icon).not.toBeNull() : expect(icon).toBeNull();
        if (expectedIconName) {
            expect(await icon?.getName()).toBe(expectedIconName);
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IconCellComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(IconCellComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('Initialization', () => {
        let rowData: any;
        let columnData: any;
        let dataTableAdapter: ObjectDataTableAdapter;
        let nextSpy: jasmine.Spy;

        beforeEach(() => {
            rowData = {
                id: '1',
                value: 'group'
            };
            columnData = { type: 'icon', key: 'value' };
            dataTableAdapter = new ObjectDataTableAdapter([rowData], [new ObjectDataColumn(columnData)]);
            nextSpy = spyOn(component.value$, 'next');
        });

        it('should setup inital value', () => {
            component.column = dataTableAdapter.getColumns()[0];
            component.row = dataTableAdapter.getRows()[0];
            component.data = dataTableAdapter;

            component.ngOnInit();

            expect(nextSpy).toHaveBeenCalledOnceWith(rowData.value);
        });

        it('should NOT setup inital value', () => {
            component.ngOnInit();

            expect(nextSpy).not.toHaveBeenCalled();
        });
    });

    describe('UI', () => {
        it('should render icon element in case of non-empty string (icon name validation NOT included)', async () => {
            await renderAndCheckResult('group', true, 'group');
            await renderAndCheckResult('groupe', true, 'groupe');
            await renderAndCheckResult('0', true, '0');
            await renderAndCheckResult('false', true, 'false');
        });

        it('should NOT render icon element in case of empty string', async () => {
            await renderAndCheckResult('', false);
        });

        it('should NOT render icon element in case of type different than string', async () => {
            await renderAndCheckResult(0, false);
            await renderAndCheckResult({}, false);
            await renderAndCheckResult(null, false);
            await renderAndCheckResult(undefined, false);
            await renderAndCheckResult(NaN, false);
        });
    });
});
