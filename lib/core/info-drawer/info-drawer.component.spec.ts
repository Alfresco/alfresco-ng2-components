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
import { InfoDrawerLayoutComponent } from './info-drawer-layout.component';
import { InfoDrawerComponent } from './info-drawer.component';

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
        component.onTabChange(event);
        expect(tabEmitSpy).toHaveBeenCalled();
        expect(tabEmitSpy).toHaveBeenCalledWith('DETAILS');
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
    </adf-info-drawer>
       `
})
class CustomInfoDrawerComponent {
}

describe('Custom InfoDrawer', () => {
    let fixture: ComponentFixture<CustomInfoDrawerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                InfoDrawerComponent,
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
    });

    it('should render the title', () => {
        fixture.detectChanges();
        let title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('Fake Title Custom');
    });
});
