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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarActionMenuComponent } from './sidebar-action-menu.component';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('SidebarActionMenuComponent', () => {
    let component: SidebarActionMenuComponent;
    let fixture: ComponentFixture<SidebarActionMenuComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule, SidebarActionMenuComponent]
        });
        fixture = TestBed.createComponent(SidebarActionMenuComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should display title', () => {
        component.title = 'Fake-Title';
        component.expanded = true;
        fixture.detectChanges();
        const title = testingUtils.getByCSS('.adf-sidebar-action-menu-text').nativeElement;
        fixture.detectChanges();
        expect(title.textContent).toBe('Fake-Title');
    });
});

@Component({
    imports: [CommonModule, SidebarActionMenuComponent, MatIconModule, MatMenuModule],
    // eslint-disable-next-line @alfresco/eslint-angular/no-angular-material-selectors
    template: `
        <adf-sidebar-action-menu [expanded]="expanded" [title]="title">
            <mat-icon adf-sidebar-menu-title-icon>arrow_drop_down</mat-icon>
            <div adf-sidebar-menu-expand-icon>
                <mat-icon>queue</mat-icon>
            </div>
            <div adf-sidebar-menu-options>
                <button mat-menu-item>
                    <mat-icon>assignment</mat-icon>
                    <span>Option1</span>
                </button>
                <button mat-menu-item>
                    <mat-icon>assignment</mat-icon>
                    <span>Option2</span>
                </button>
            </div>
        </adf-sidebar-action-menu>
    `
})
class CustomSidebarActionMenuComponent {
    title: string = 'Fake title';
    expanded: boolean = true;
}

describe('Custom SidebarActionMenuComponent', () => {
    let fixture: ComponentFixture<CustomSidebarActionMenuComponent>;
    let component: CustomSidebarActionMenuComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule, SidebarActionMenuComponent, CustomSidebarActionMenuComponent]
        });
        fixture = TestBed.createComponent(CustomSidebarActionMenuComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    it('should defined adf-sidebar-action-menu', () => {
        fixture.detectChanges();
        expect(testingUtils.getByCSS('adf-sidebar-action-menu')).toBeDefined();
    });

    it('should display the title', () => {
        component.title = 'FakeTitle';
        fixture.detectChanges();
        const title = testingUtils.getByCSS('.adf-sidebar-action-menu-text').nativeElement;
        fixture.detectChanges();
        expect(title.textContent).toBe('FakeTitle');
    });

    it('should render the adf-sidebar-menu-options', async () => {
        fixture.detectChanges();
        const options = testingUtils.getAllByCSS('.adf-sidebar-action-menu-options');
        testingUtils.clickByCSS('.adf-sidebar-action-menu-button');

        fixture.detectChanges();
        await fixture.whenStable();

        expect(options).toBeDefined();
        expect(testingUtils.getInnerTextByCSS('.adf-sidebar-action-menu-button').trim()).toBe('Fake titlearrow_drop_down');
    });

    it('should show icon on icon menu', () => {
        component.title = 'FakeTitle';
        component.expanded = false;
        fixture.detectChanges();
        const actionIcon = testingUtils.getByCSS('.adf-sidebar-action-menu-icon').nativeElement;
        expect(actionIcon).not.toBeNull();
        expect(actionIcon).toBeDefined();
        expect(actionIcon.innerText.trim()).toBe('queue');
    });
});
