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
import { SearchWidgetChipComponent } from './search-widget-chip.component';
import { simpleCategories } from '../../../../mock';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { SearchQueryBuilderService } from '../../../services/search-query-builder.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness } from '@angular/material/chips/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { provideRouter } from '@angular/router';

describe('SearchWidgetChipComponent', () => {
    let loader: HarnessLoader;
    let component: SearchWidgetChipComponent;
    let fixture: ComponentFixture<SearchWidgetChipComponent>;
    let queryBuilder: SearchQueryBuilderService;

    const focusTrapFactory = jasmine.createSpyObj('ConfigurableFocusTrapFactory', ['create']);
    const focusTrap = jasmine.createSpyObj('ConfigurableFocusTrap', ['focusInitialElement', 'destroy']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatMenuModule, SearchWidgetChipComponent],
            providers: [provideRouter([]), { provide: ConfigurableFocusTrapFactory, useValue: focusTrapFactory }]
        });
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
        fixture = TestBed.createComponent(SearchWidgetChipComponent);
        component = fixture.componentInstance;
        spyOn(queryBuilder, 'update').and.stub();

        component.category = simpleCategories[1];
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
        focusTrapFactory.create.and.returnValue(focusTrap);
    });

    it('should update search query on apply click', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
        applyButton.triggerEventHandler('click', {});

        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should update search query on cancel click', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        const applyButton = fixture.debugElement.query(By.css('#cancel-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(queryBuilder.update).toHaveBeenCalled();
    });

    it('should display arrow down icon', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        const icon = await chip.getHarness(MatIconHarness);
        expect(await icon.getName()).toBe('keyboard_arrow_down');
    });

    it('should display arrow up icon when menu is opened', async () => {
        component.onMenuOpen();
        fixture.detectChanges();

        const chip = await loader.getHarness(MatChipHarness);
        const icon = await chip.getHarness(MatIconHarness);
        expect(await icon.getName()).toBe('keyboard_arrow_up');
    });

    it('should create focus trap and focus initial element when menu opens', async () => {
        const chip = await loader.getHarness(MatChipHarness);
        await (await chip.host()).click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(focusTrapFactory.create).toHaveBeenCalledWith(component.menuContainer.nativeElement);
        expect(focusTrap.focusInitialElement).toHaveBeenCalled();
    });

    it('should destroy focus trap on main menu closed', () => {
        component.focusTrap = focusTrap;
        component.onClosed();

        expect(focusTrap.destroy).toHaveBeenCalled();
        expect(component.focusTrap).toBeNull();
    });
});
