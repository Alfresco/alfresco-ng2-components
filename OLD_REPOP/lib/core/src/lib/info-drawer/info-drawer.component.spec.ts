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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { InfoDrawerComponent, InfoDrawerTabComponent } from './info-drawer.component';
import { ESCAPE } from '@angular/cdk/keycodes';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

describe('InfoDrawerComponent', () => {
    let component: InfoDrawerComponent;
    let fixture: ComponentFixture<InfoDrawerComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [InfoDrawerComponent]
        });

        fixture = TestBed.createComponent(InfoDrawerComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    it('should define InfoDrawerTabLayout', () => {
        const infoDrawerTabLayout = testingUtils.getByCSS('adf-info-drawer-layout');
        expect(infoDrawerTabLayout).toBeDefined();
    });

    it('should emit when tab is changed', () => {
        const tabEmitSpy = spyOn(component.currentTab, 'emit');
        const event = { index: 1, tab: { textLabel: 'DETAILS' } } as MatTabChangeEvent;
        component.onTabChange(event);
        expect(tabEmitSpy).toHaveBeenCalledWith(1);
    });

    it('should render the title', () => {
        component.title = 'FakeTitle';
        fixture.detectChanges();
        const title = testingUtils.getAllByCSS('[info-drawer-title]');
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
    imports: [InfoDrawerTabComponent, InfoDrawerComponent],
    template: `
        <adf-info-drawer [selectedIndex]="tabIndex" [icon]="icon" title="Fake Title Custom">
            <adf-info-drawer-tab label="Tab1" />
            <adf-info-drawer-tab label="Tab2" />
            <adf-info-drawer-tab label="Tab3" icon="tab-icon" />
        </adf-info-drawer>
    `
})
class CustomInfoDrawerComponent extends InfoDrawerComponent {
    tabIndex: number;
    icon: string;
}

describe('Custom InfoDrawer', () => {
    let fixture: ComponentFixture<CustomInfoDrawerComponent>;
    let component: CustomInfoDrawerComponent;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    const getNodeIcon = () => testingUtils.getAllByCSS('[info-drawer-node-icon]');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomInfoDrawerComponent]
        });

        fixture = TestBed.createComponent(CustomInfoDrawerComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the title', () => {
        fixture.detectChanges();
        const title = testingUtils.getAllByCSS('[info-drawer-title]');
        expect(title.length).toBe(1);
        expect(title[0].nativeElement.innerText).toBe('Fake Title Custom');
    });

    it('should select the tab 1 (index 0) as default', async () => {
        fixture.detectChanges();

        expect(await testingUtils.getSelectedTabLabelFromMatTabGroup()).toEqual('Tab1');
    });

    it('should select the tab 2 (index 1)', async () => {
        component.tabIndex = 1;
        fixture.detectChanges();

        expect(await testingUtils.getSelectedTabLabelFromMatTabGroup()).toEqual('Tab2');
    });

    it('should render a tab with icon', async () => {
        component.tabIndex = 2;
        fixture.detectChanges();

        expect(await testingUtils.getSelectedTabLabelFromMatTabGroup()).toContain('Tab3');
        expect(await testingUtils.getSelectedTabLabelFromMatTabGroup()).toContain('tab-icon');
    });

    it('should render a icon with title', () => {
        component.icon = '/assets/images/ft_ic_miscellaneous.svg';
        fixture.detectChanges();
        const icon = getNodeIcon();
        const srcAttribute = icon[0].nativeElement.getAttribute('src');
        expect(icon.length).toBe(1);
        expect(srcAttribute).toContain('/assets/images/ft_ic_miscellaneous.svg');
    });
});

@Component({
    imports: [InfoDrawerComponent],
    template: ` <adf-info-drawer [showHeader]="showHeader" [icon]="icon" title="Fake Visibility Info Drawer Title" /> `
})
class VisibilityInfoDrawerComponent extends InfoDrawerComponent {
    showHeader: boolean;
    icon: string;
}

describe('Header visibility InfoDrawer', () => {
    let fixture: ComponentFixture<VisibilityInfoDrawerComponent>;
    let component: VisibilityInfoDrawerComponent;
    let testingUtils: UnitTestingUtils;
    const getNodeIcon = () => testingUtils.getAllByCSS('[info-drawer-node-icon]');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [VisibilityInfoDrawerComponent]
        });
        fixture = TestBed.createComponent(VisibilityInfoDrawerComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    it('should show info drawer header by default', () => {
        component.icon = '/assets/images/ft_ic_miscellaneous.svg';
        fixture.detectChanges();
        const title = testingUtils.getAllByCSS('[info-drawer-title]');
        const icon = getNodeIcon();
        const srcAttribute = icon[0].nativeElement.getAttribute('src');
        expect(title.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(srcAttribute).toContain('/assets/images/ft_ic_miscellaneous.svg');
        expect(title[0].nativeElement.innerText).toBe('Fake Visibility Info Drawer Title');
        expect(component.showHeader).toEqual(true);
    });

    it('should not show info drawer header with icon when showHeader is false', () => {
        component.showHeader = false;
        fixture.detectChanges();
        const title = testingUtils.getAllByCSS('[info-drawer-title]');
        const icon = getNodeIcon();
        expect(title.length).toBe(0);
        expect(icon.length).toBe(0);
    });
});
