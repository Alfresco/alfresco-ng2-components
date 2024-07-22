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
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarItemComponent } from './navbar-item.component';

describe('NavbarItemComponent', () => {
    let component: NavbarItemComponent;
    let fixture: ComponentFixture<NavbarItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarItemComponent, RouterTestingModule, TranslateModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display label', () => {
        component.label = 'Test Label';
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('.adf-navbar-item-btn');
        expect(button.textContent).toContain('Test Label');
    });

    it('should bind routerLink', () => {
        component.routerLink = '/expected-route';
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.adf-navbar-item-btn');
        expect(button.getAttribute('ng-reflect-router-link')).toEqual('/expected-route');
    });
});
