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
import { SearchFacetChipComponent } from './search-facet-chip.component';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { SearchQueryBuilderService } from '../../../services/search-query-builder.service';
import { SearchFilterList } from '../../../models/search-filter-list.model';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatChipHarness } from '@angular/material/chips/testing';

describe('SearchFacetChipComponent', () => {
    let loader: HarnessLoader;
    let component: SearchFacetChipComponent;
    let fixture: ComponentFixture<SearchFacetChipComponent>;
    let queryBuilder: SearchQueryBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchFacetChipComponent);
        component = fixture.componentInstance;
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        spyOn(queryBuilder, 'update').and.stub();

        component.field = { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList() };
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should update search query on apply click', async () => {
        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        const applyButton = await menu.getHarness(MatButtonHarness.with({ selector: '#apply-filter-button' }));
        await applyButton.click();

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should update search query on cancel click', async () => {
        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        const cancelButton = await menu.getHarness(MatButtonHarness.with({ selector: '#cancel-filter-button' }));
        await cancelButton.click();

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should display arrow down icon and not disable the chip when items are loaded', async () => {
        component.field.buckets.items = [{ count: 1, label: 'test', filterQuery: '' }];

        const menu = await loader.getHarness(MatMenuHarness);
        expect(await menu.isDisabled()).toBe(false);

        const icon = await loader.getHarness(MatIconHarness);
        expect(await icon.getName()).toBe('keyboard_arrow_down');
    });

    it('should display arrow up icon when menu is opened', async () => {
        component.field.buckets.items = [{ count: 1, label: 'test', filterQuery: '' }];

        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        const icon = await loader.getHarness(MatIconHarness);
        expect(await icon.getName()).toBe('keyboard_arrow_up');
    });

    it('should display remove icon and disable facet when no items are loaded', async () => {
        const menu = await loader.getHarness(MatChipHarness);
        const disabled = await menu.isDisabled();
        expect(disabled).toBe(true);

        const icon = await loader.getHarness(MatIconHarness);
        const iconName = await icon.getName();
        expect(iconName).toBe('remove');
    });

    it('should not open context menu when no items are loaded', async () => {
        const menu = await loader.getHarness(MatMenuHarness);
        await (await menu.host()).sendKeys(TestKey.ENTER);
        expect(await menu.isOpen()).toBe(false);
    });
});
