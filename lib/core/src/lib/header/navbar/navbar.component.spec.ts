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
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, TranslateModule.forRoot(), RouterModule.forRoot([]), MatButtonModule, NavbarComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render correct number of navbar items', () => {
        const testItems = [
            { label: 'Home', routerLink: '/home' },
            { label: 'About', routerLink: '/about' }
        ];
        component.items = testItems;
        fixture.detectChanges();
        const renderedItems = fixture.nativeElement.querySelectorAll('.adf-navbar-item-btn');
        expect(renderedItems.length).toBe(testItems.length);
    });

    it('should render navbar items with correct label and router-link', () => {
        const testItems = [
            { label: 'Home', routerLink: '/home' },
            { label: 'About', routerLink: '/about' }
        ];
        component.items = testItems;
        fixture.detectChanges();
        const renderedItems = fixture.nativeElement.querySelectorAll('.adf-navbar-item-btn');
        testItems.forEach((item, index) => {
            expect(renderedItems[index].textContent).toContain(item.label);
            expect(renderedItems[index].getAttribute('ng-reflect-router-link')).toContain(item.routerLink);
        });
    });
});
