/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { MaterialModule } from '../../../material.module';
import { SidebarActionMenuComponent } from './sidebar-action-menu.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SidebarActionMenuComponent', () => {
    let element: HTMLElement;
    let component: SidebarActionMenuComponent;
    let fixture: ComponentFixture<SidebarActionMenuComponent>;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarActionMenuComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create instance of SidebarActionMenuComponent', () => {
        expect(fixture.componentInstance instanceof SidebarActionMenuComponent).toBe(true, 'should create SidebarActionMenuComponent');
    });

    it('should display title', () => {
        component.title = 'Fake-Title';
        component.expanded = true;
        fixture.detectChanges();
        const title = element.querySelector('.adf-sidebar-action-menu-text');
        fixture.detectChanges();
        expect(title.textContent).toBe('Fake-Title');
    });
});

@Component({
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
    let element: HTMLElement;

    setupTestBed({
        declarations: [
            SidebarActionMenuComponent,
            CustomSidebarActionMenuComponent
        ],
        imports: [
            MaterialModule,
            NoopAnimationsModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomSidebarActionMenuComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should create instance of CustomSidebarActionMenuComponent', () => {
        expect(component instanceof CustomSidebarActionMenuComponent).toBe(true, 'should create CustomSidebarActionMenuComponent');
    });

    it('should defined adf-sidebar-action-menu', () => {
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('adf-sidebar-action-menu');
        expect(element).toBeDefined();
    });

    it('should display the title', () => {
        component.title = 'FakeTitle';
        fixture.detectChanges();
        const title = element.querySelector('.adf-sidebar-action-menu-text');
        fixture.detectChanges();
        expect(title.textContent).toBe('FakeTitle');
    });

    it('should render the adf-sidebar-menu-options', () => {
        fixture.detectChanges();
        const actionButton = fixture.nativeElement.querySelector('.adf-sidebar-action-menu-button');
        const options = fixture.nativeElement.querySelectorAll('.adf-sidebar-action-menu-options');
        actionButton.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(actionButton).not.toBeNull();
            expect(actionButton).toBeDefined();
            expect(options).toBeDefined();
            expect(actionButton.innerText.trim()).toBe('Fake titlearrow_drop_down');
        });
    });

    it('should show icon on icon menu', () => {
        component.title = 'FakeTitle';
        component.expanded = false;
        fixture.detectChanges();
        const actionIcon = fixture.nativeElement.querySelector('.adf-sidebar-action-menu-icon');
        expect(actionIcon).not.toBeNull();
        expect(actionIcon).toBeDefined();
        expect(actionIcon.innerText.trim()).toBe('queue');
    });
});
