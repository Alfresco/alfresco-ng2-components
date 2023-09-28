/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { InfoDrawerComponent } from './info-drawer.component';
import { of } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CoreTestingModule } from '../testing/core.testing.module';
import { ESCAPE } from '@angular/cdk/keycodes';

describe('InfoDrawerComponent', () => {
    let element: HTMLElement;
    let component: InfoDrawerComponent;
    let fixture: ComponentFixture<InfoDrawerComponent>;
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ]
        });
        translateService = TestBed.inject(TranslateService);
        spyOn(translateService, 'get').and.callFake((key) => of(key));

        fixture = TestBed.createComponent(InfoDrawerComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    it('should define InfoDrawerTabLayout', () => {
        const infoDrawerTabLayout = element.querySelector('adf-info-drawer-layout');
        expect(infoDrawerTabLayout).toBeDefined();
    });

    it('should emit when tab is changed', () => {
        const tabEmitSpy = spyOn(component.currentTab, 'emit');
        const event = {index: 1, tab: {textLabel: 'DETAILS'}} as MatTabChangeEvent;
        component.onTabChange(event);
        expect(tabEmitSpy).toHaveBeenCalledWith(1);
    });

    it('should render the title', () => {
        component.title = 'FakeTitle';
        fixture.detectChanges();
        const title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('FakeTitle');
    });

    it('should stop propagation on keydown event', () => {
        const escapeKeyboardEvent = new KeyboardEvent('keydown', { key: ESCAPE.toString() });
        const stopPropagationSpy = spyOn(escapeKeyboardEvent, 'stopPropagation');

        fixture.debugElement.triggerEventHandler('keydown', escapeKeyboardEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should stop propagation on keyup event', () => {
        const escapeKeyboardEvent = new KeyboardEvent('keyup', { key: ESCAPE.toString() });
        const stopPropagationSpy = spyOn(escapeKeyboardEvent, 'stopPropagation');

        fixture.debugElement.triggerEventHandler('keyup', escapeKeyboardEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
    });
});

@Component({
    template: `
    <adf-info-drawer [selectedIndex]="tabIndex" title="Fake Title Custom">
        <adf-info-drawer-tab label="Tab1">
        </adf-info-drawer-tab>
        <adf-info-drawer-tab label="Tab2">
        </adf-info-drawer-tab>
        <adf-info-drawer-tab label="Tab3" icon="tab-icon">
        </adf-info-drawer-tab>
    </adf-info-drawer>
       `
})
class CustomInfoDrawerComponent extends InfoDrawerComponent {
    tabIndex: number;
}

describe('Custom InfoDrawer', () => {
    let fixture: ComponentFixture<CustomInfoDrawerComponent>;
    let component: CustomInfoDrawerComponent;
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            declarations: [
                CustomInfoDrawerComponent
            ]
        });
        translateService = TestBed.inject(TranslateService);
        spyOn(translateService, 'get').and.callFake((key) => of(key));

        fixture = TestBed.createComponent(CustomInfoDrawerComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the title', () => {
        fixture.detectChanges();
        const title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('Fake Title Custom');
    });

    it('should select the tab 1 (index 0) as default', () => {
        fixture.detectChanges();
        const tab: any = fixture.debugElement.queryAll(By.css('.mat-tab-label-active'));
        expect(tab.length).toBe(1);
        expect(tab[0].nativeElement.innerText).toContain('TAB1');
    });

    it('should select the tab 2 (index 1)', () => {
        component.tabIndex = 1;
        fixture.detectChanges();
        const tab: any = fixture.debugElement.queryAll(By.css('.mat-tab-label-active'));
        expect(tab.length).toBe(1);
        expect(tab[0].nativeElement.innerText).toContain('TAB2');
    });

    it('should render a tab with icon', () => {
        component.tabIndex = 2;
        fixture.detectChanges();
        const tab: any = fixture.debugElement.queryAll(By.css('.mat-tab-label-active'));
        expect(tab[0].nativeElement.innerText).not.toBe('TAB3');
        expect(tab[0].nativeElement.innerText).toContain('tab-icon');
    });
});

@Component({
    template: `
    <adf-info-drawer [showHeader]="showHeader" title="Fake Visibility Info Drawer Title">
    </adf-info-drawer>
       `
})
class VisibilityInfoDrawerComponent extends InfoDrawerComponent {
    showHeader: boolean;
}

describe('Header visibility InfoDrawer', () => {
    let fixture: ComponentFixture<VisibilityInfoDrawerComponent>;
    let component: VisibilityInfoDrawerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            declarations: [
                VisibilityInfoDrawerComponent
            ]
        });
        fixture = TestBed.createComponent(VisibilityInfoDrawerComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should show info drawer header by default', () => {
        fixture.detectChanges();
        const title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('Fake Visibility Info Drawer Title');
        expect(component.showHeader).toEqual(true);
    });

    it('should not show info drawer header when showHeader is false', () => {
        fixture.detectChanges();
        component.showHeader = false;
        fixture.detectChanges();
        const title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        expect(title.length).toBe(0);
    });
});
