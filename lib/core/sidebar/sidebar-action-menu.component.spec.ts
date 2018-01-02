/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { SidebarActionMenuComponent } from './sidebar-action-menu.component';

describe('SidebarActionMenuComponent', () => {
    let element: HTMLElement;
    let component: SidebarActionMenuComponent;
    let fixture: ComponentFixture<SidebarActionMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SidebarActionMenuComponent
            ],
            imports: [
                MaterialModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarActionMenuComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    it('should create instance of SidebarActionMenuComponent', () => {
        expect(fixture.componentInstance instanceof SidebarActionMenuComponent).toBe(true, 'should create SidebarActionMenuComponent');
    });

    it('should render the title', () => {
        component.title = 'FakeTitle';
        fixture.detectChanges();
        let title: any = fixture.debugElement.queryAll(By.css('.adf-sidebar-menu-action-button-text'));
        expect(title.nativeElement.innerText).toBe('FakeTitle');
    });
});

@Component({
    template: `
    <adf-sidebar-action-menu>
    <mat-icon sidebar-menu-title-icon>arrow_drop_down</mat-icon>
    <div sidebar-menu-options>
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
    tittle: string = 'Fake title';
}

describe('Custom SidebarActionMenuComponent', () => {
    let fixture: ComponentFixture<CustomSidebarActionMenuComponent>;
    let component: CustomSidebarActionMenuComponent;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SidebarActionMenuComponent,
                CustomSidebarActionMenuComponent
            ],
            imports: [
                MaterialModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomSidebarActionMenuComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should create instance of CustomSidebarActionMenuComponent', () => {
        expect(fixture.componentInstance instanceof CustomSidebarActionMenuComponent).toBe(true, 'should create CustomSidebarActionMenuComponent');
    });

    it('should adf-sidebar-action-menu', () => {
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('adf-sidebar-action-menu');
        expect(element).toBeDefined();
    });

    it('should render the options sidebar-menu-options', () => {
        fixture.detectChanges();
        let title: any = fixture.nativeElement.querySelector('[sidebar-menu-options]');
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('Fake Option');
    });

    // it('should expand icon', () => {
    //     fixture.detectChanges();
    //     let title: any = fixture.debugElement.queryAll(By.css('[sidebar-menu-expand-icon]'));
    //     expect(title.length).toBe(1);
    //     expect(title[0].nativeElement.innerText).toBe('queue');
    // });

});
