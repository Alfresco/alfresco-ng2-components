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
import { MatTabChangeEvent } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { InfoDrawerLayoutComponent } from './info-drawer-layout.component';
import { InfoDrawerComponent } from './info-drawer.component';
import { InfoDrawerTabComponent } from './info-drawer.component';

describe('InfoDrawerComponent', () => {
    let element: HTMLElement;
    let component: InfoDrawerComponent;
    let fixture: ComponentFixture<InfoDrawerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                InfoDrawerComponent,
                InfoDrawerLayoutComponent
            ],
            imports: [
                MaterialModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoDrawerComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    it('should create instance of InfoDrawerComponent', () => {
        expect(fixture.componentInstance instanceof InfoDrawerComponent).toBe(true, 'should create InfoDrawerComponent');
    });

    it('should define InfoDrawerTabLayout', () => {
        let infoDrawerTabLayout = element.querySelector('adf-info-drawer-layout');
        expect(infoDrawerTabLayout).toBeDefined();
    });

    it('should emit when tab is changed', () => {
        let tabEmitSpy = spyOn(component.currentTab, 'emit');
        let event = {index: 1, tab: {textLabel: 'DETAILS'}};
        component.onTabChange(<MatTabChangeEvent> event);
        expect(tabEmitSpy).toHaveBeenCalledWith(1);
    });

    it('should render the title', () => {
        component.title = 'FakeTitle';
        fixture.detectChanges();
        let title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('FakeTitle');
    });
});

@Component({
    template: `
    <adf-info-drawer>
        <div info-drawer-title>Fake Title Custom</div>
        <adf-info-drawer-tab label="Tab1">
        </adf-info-drawer-tab>
        <adf-info-drawer-tab label="Tab2">
        </adf-info-drawer-tab>
    </adf-info-drawer>
       `
})
class CustomInfoDrawerComponent extends InfoDrawerComponent {
}

describe('Custom InfoDrawer', () => {
    let fixture: ComponentFixture<CustomInfoDrawerComponent>;
    let component: CustomInfoDrawerComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                InfoDrawerComponent,
                InfoDrawerTabComponent,
                InfoDrawerLayoutComponent,
                CustomInfoDrawerComponent
            ],
            imports: [
                MaterialModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomInfoDrawerComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should render the title', () => {
        fixture.detectChanges();
        let title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('Fake Title Custom');
    });

    it('should select the tab 1 (index 0) as default', () => {
        fixture.detectChanges();
        let tab: any = fixture.debugElement.queryAll(By.css('.mat-tab-label-active'));
        expect(tab.length).toBe(1);
        expect(tab[0].nativeElement.innerText).toBe('Tab1');
    });

    it('should select the tab 2 (index 1)', () => {
        component.selectedIndex = 1;
        fixture.detectChanges();
        let tab: any = fixture.debugElement.queryAll(By.css('.mat-tab-label-active'));
        expect(tab.length).toBe(1);
        expect(tab[0].nativeElement.innerText).toBe('Tab2');
    });
});
