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
import { SearchFormComponent } from './search-form.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchForm } from '../../models/search-form.interface';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyMenuHarness as MatMenuHarness } from '@angular/material/legacy-menu/testing';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';

describe('SearchFormComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<SearchFormComponent>;
    let component: SearchFormComponent;
    let queryBuilder: SearchQueryBuilderService;
    const mockSearchForms: SearchForm[] = [
        { default: false, index: 0, name: 'All', selected: false },
        { default: true, index: 1, name: 'First', selected: true },
        { default: false, index: 2, name: 'Second', selected: false }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchFormComponent);
        component = fixture.componentInstance;
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        queryBuilder.searchForms.next(mockSearchForms);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    const getTitle = () => fixture.debugElement.query(By.css('.adf-search-form-title'))?.nativeElement as HTMLSpanElement;

    it('should show search forms', () => {
        const title = getTitle();
        expect(title.innerText).toContain(mockSearchForms[1].name);
    });

    it('should emit on form change', async () => {
        spyOn(queryBuilder, 'updateSelectedConfiguration').and.stub();

        let changedForm: SearchForm;
        component.formChange.subscribe((form) => (changedForm = form));

        const menu = await loader.getHarness(MatMenuHarness);
        await menu.open();

        const menuItems = await menu.getItems();
        expect(menuItems.length).toEqual(3);
        await menuItems[2].click();

        expect(changedForm).toEqual(mockSearchForms[2]);
        expect(queryBuilder.updateSelectedConfiguration).toHaveBeenCalled();
    });

    it('should not show menu if only one config found', async () => {
        queryBuilder.searchForms.next([{ name: 'one', selected: true, default: true, index: 0 }]);
        fixture.detectChanges();

        const button = await loader.getHarness(MatButtonHarness.with({ selector: '.adf-search-form' }));
        await button.click();

        const title = getTitle();
        expect(title.innerText).toContain('one');

        fixture.detectChanges();

        const hasMenu = await loader.hasHarness(MatMenuHarness);
        expect(hasMenu).toBe(false);
    });

    it('should not display search form if no form configured', () => {
        queryBuilder.searchForms.next([]);
        fixture.detectChanges();

        const field = getTitle();
        expect(field).toBeUndefined();
    });
});
