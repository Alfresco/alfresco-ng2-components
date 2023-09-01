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
import { Node } from '@alfresco/js-api';
import { ThumbnailService } from '../common/services/thumbnail.service';

const mockNode: Node = ({
    isFile: true,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: new Date('2017-05-24T15:08:55.640Z'),
    nodeType: 'cm:content',
    content: {
        mimeType: 'application/rtf',
        mimeTypeName: 'Rich Text Format',
        sizeInBytes: 14530,
        encoding: 'UTF-8'
    },
    parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
    createdAt: new Date('2017-05-24T15:08:55.640Z'),
    path: {
        name: '/Company Home/Guest Home',
        isComplete: true,
        elements: [{
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
        }, { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }]
    },
    isFolder: false,
    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
    name: 'b_txt_file.rtf',
    id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
    properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
    allowableOperations: ['delete', 'update']
});

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
        component.drawerIcon = mockNode;
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

    describe('Info Drawer header Icon', () => {
        let thumbnailService: ThumbnailService;
        beforeEach(() => {
          thumbnailService = TestBed.inject(ThumbnailService);
          component.drawerIcon = mockNode;

        });

        it('should resolve folder icon', () => {
          spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_folder.svg`);
          mockNode.isFolder = true;
          const value = component.getInfoDrawerIcon(mockNode);
          expect(value).toContain(`assets/images/ft_ic_folder`);
        });

        it('should resolve smart folder icon', () => {
          spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_smart_folder.svg`);
          mockNode.isFolder = true;
          const value = component.getInfoDrawerIcon(mockNode);
          expect(value).toContain(`assets/images/ft_ic_smart_folder`);
        });

        it('should resolve link folder icon', () => {
          spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_folder_shortcut_link.svg`);
          mockNode.isFolder = true;
          const value = component.getInfoDrawerIcon(mockNode);
          expect(value).toContain(`assets/images/ft_ic_folder_shortcut_link`);
        });

        it('should resolve rule folder icon', () => {
          spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_folder_rule.svg`);
          mockNode.isFolder = true;
          const value = component.getInfoDrawerIcon(mockNode);
          expect(value).toContain(`assets/images/ft_ic_folder_rule`);
        });

        it('should resolve file icon for content type', () => {
          spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_raster_image.svg`);
          mockNode.isFile = true;
          mockNode.isFolder = false;
          const value = component.getInfoDrawerIcon(mockNode);
          expect(value).toContain(`assets/images/ft_ic_raster_image`);
        });

        it('should resolve fallback file icon for unknown node', () => {
          spyOn(thumbnailService, 'getDefaultMimeTypeIcon').and.returnValue(`assets/images/ft_ic_miscellaneous.svg`);
          mockNode.isFile = false;
          mockNode.isFolder = false;
          const value = component.getInfoDrawerIcon(mockNode);
          expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
        });
    });
});

@Component({
    template: `
    <adf-info-drawer [selectedIndex]="tabIndex" drawerIcon="mockNode" title="Fake Title Custom">
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

    it('should render a icon with title', () => {
        fixture.detectChanges();
        const icon: any = fixture.debugElement.queryAll(By.css('[info-drawer-icon]'));
        const srcAttribute = icon[0].nativeElement.getAttribute('src');
        expect(icon.length).toBe(1);
        expect(srcAttribute).toContain('/assets/images/ft_ic_miscellaneous.svg');
    });
});

@Component({
    template: `
    <adf-info-drawer [showHeader]="showHeader" drawerIcon="mockNode" title="Fake Visibility Info Drawer Title">
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
        component.drawerIcon = mockNode;
    });

    it('should show info drawer header by default', () => {
        fixture.detectChanges();
        const title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        const icon: any = fixture.debugElement.queryAll(By.css('[info-drawer-icon]'));
        const srcAttribute = icon[0].nativeElement.getAttribute('src');
        expect(title.length).toBe(1);
        expect(icon.length).toBe(1);
        expect(srcAttribute).toContain('/assets/images/ft_ic_miscellaneous.svg');
        expect(title[0].nativeElement.innerText).toBe('Fake Visibility Info Drawer Title');
        expect(component.showHeader).toEqual(true);
    });

    it('should not show info drawer header with icon when showHeader is false', () => {
        fixture.detectChanges();
        component.showHeader = false;
        fixture.detectChanges();
        const title: any = fixture.debugElement.queryAll(By.css('[info-drawer-title]'));
        const icon: any = fixture.debugElement.queryAll(By.css('[info-drawer-icon]'));
        expect(title.length).toBe(0);
        expect(icon.length).toBe(0);
    });
});
