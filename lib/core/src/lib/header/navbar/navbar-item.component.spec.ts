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
import { NavbarItemComponent } from './navbar-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UnitTestingUtils } from '@alfresco/adf-core';

describe('NavbarItemComponent', () => {
    let component: NavbarItemComponent;
    let fixture: ComponentFixture<NavbarItemComponent>;
    let button: HTMLElement;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarItemComponent, RouterTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarItemComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        component.label = 'Test Label';
        component.routerLink = '/expected-route';
        fixture.detectChanges();

        button = testingUtils.getByCSS('.adf-navbar-item-btn').nativeElement;
    });

    it('should display label', () => {
        fixture.detectChanges();
        expect(button.textContent).toContain('Test Label');
    });

    it('should navigate to routerLink on click', () => {
        const navigateByUrlSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

        button.click();
        fixture.detectChanges();
        expect(navigateByUrlSpy.calls.mostRecent().args[0].toString()).toBe('/expected-route');
    });
});
