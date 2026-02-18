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
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, RouterModule.forRoot([]), MatButtonModule, NavbarComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    });

    it('should render correct number of navbar items', () => {
        const testItems = [
            { label: 'Home', routerLink: '/home' },
            { label: 'About', routerLink: '/about' }
        ];
        component.items = testItems;
        fixture.detectChanges();
        const renderedItems = testingUtils.getAllByCSS('.adf-navbar-item-btn');
        expect(renderedItems.length).toBe(testItems.length);
    });

    it('should render navbar items with correct label and router-link', () => {
        const testItems = [
            { label: 'Home', routerLink: '/home' },
            { label: 'About', routerLink: '/about' }
        ];
        component.items = testItems;
        fixture.detectChanges();

        // Query all RouterLink directives
        const linkDebugEls = fixture.debugElement.queryAll(By.directive(RouterLink));
        expect(linkDebugEls.length).toBe(testItems.length);

        const renderedItems = testingUtils.getAllByCSS('.adf-navbar-item-btn').map((item) => item.nativeElement);
        testItems.forEach((item, index) => {
            expect(renderedItems[index].textContent).toContain(item.label);
        });

        // Verify the component's items have the correct routerLink values
        expect(component.items).toEqual(testItems);
    });
});
