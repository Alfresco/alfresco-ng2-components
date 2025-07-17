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
import { LanguagePickerComponent } from './language-picker.component';
import { MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { LanguageMenuComponent } from './language-menu.component';
import { QueryList } from '@angular/core';
import { UnitTestingUtils } from '@alfresco/adf-core';

describe('LanguagePickerComponent', () => {
    let component: LanguagePickerComponent;
    let fixture: ComponentFixture<LanguagePickerComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LanguagePickerComponent]
        });

        fixture = TestBed.createComponent(LanguagePickerComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should assign menuItems to MatMenu in ngAfterViewInit', () => {
        testingUtils.getByDirective(MatMenuTrigger).nativeElement.click();
        fixture.detectChanges();
        const languageMenuComponent = testingUtils.getByDirective(LanguageMenuComponent).componentInstance;
        const menuItem1 = new MatMenuItem(null, null, null, null, null);
        const menuItem2 = new MatMenuItem(null, null, null, null, null);

        languageMenuComponent.menuItems = new QueryList<MatMenuItem>();
        languageMenuComponent.menuItems.reset([menuItem1, menuItem2]);
        spyOn(component.menu, 'ngAfterContentInit').and.callThrough();

        component.ngAfterViewInit();
        // eslint-disable-next-line no-underscore-dangle
        expect(component.menu._allItems.length).toBe(2);
        // eslint-disable-next-line no-underscore-dangle
        expect(component.menu._allItems.toArray()).toEqual([menuItem1, menuItem2]);
        expect(component.menu.ngAfterContentInit).toHaveBeenCalled();
    });
});
