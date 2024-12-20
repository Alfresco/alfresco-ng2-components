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
import { HeaderLayoutComponent } from './header.component';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';

describe('HeaderLayoutComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<HeaderLayoutComponent>;
    let component: HeaderLayoutComponent;

    describe('Input parameters', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CoreTestingModule, HeaderLayoutComponent]
            });
            fixture = TestBed.createComponent(HeaderLayoutComponent);
            loader = TestbedHarnessEnvironment.loader(fixture);
            component = fixture.componentInstance;
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('title element should been displayed', () => {
            const titleElement = fixture.debugElement.query(By.css('.adf-app-title'));
            expect(titleElement === null).toBeFalsy();
        });

        it('should show TEST TITLE', () => {
            component.title = 'TEST TITLE';
            fixture.detectChanges();

            const titleElement = fixture.nativeElement.querySelector('.adf-app-title');
            expect(titleElement.innerText).toEqual('TEST TITLE');
        });

        it('color attribute should be present on toolbar', async () => {
            component.color = 'primary';
            fixture.detectChanges();

            const toolbar = await loader.getHarness(MatToolbarHarness);
            const host = await toolbar.host();

            expect(await host.getAttribute('ng-reflect-color')).toBe('primary');
        });

        it('should change background color when custom is provided', async () => {
            component.color = '#42f57e';
            fixture.detectChanges();

            const toolbarHarness = await loader.getHarness(MatToolbarHarness);
            const toolbar = await toolbarHarness.host();
            expect(await toolbar.getCssValue('background-color')).toBe('rgb(66, 245, 126)');
        });

        it('should background image be set to none if is not provided', async () => {
            fixture.detectChanges();

            const toolbarHarness = await loader.getHarness(MatToolbarHarness);
            const toolbar = await toolbarHarness.host();
            expect(await toolbar.getCssValue('background-image')).toEqual('none');
        });

        it('should background image be set to none if is provided as empty string', async () => {
            component.backgroundImage = '';

            fixture.detectChanges();

            const toolbarHarness = await loader.getHarness(MatToolbarHarness);
            const toolbar = await toolbarHarness.host();
            expect(await toolbar.getCssValue('background-image')).toEqual('none');
        });

        it('should change background image when provided', async () => {
            component.backgroundImage = '/assets/someImage.png';
            fixture.detectChanges();

            const toolbarHarness = await loader.getHarness(MatToolbarHarness);
            const toolbar = await toolbarHarness.host();
            expect(await toolbar.getCssValue('background-image')).toContain('/assets/someImage.png');
        });

        it('should display the img element with the expected src if a logo path is set', () => {
            component.logo = 'logo.png';
            fixture.detectChanges();

            const logo = fixture.nativeElement.querySelector('.adf-app-logo');
            const src = logo.getAttribute('src');
            expect(src).toEqual('logo.png');
        });

        it('should have custom url link set on logo when the redirectUrl is set', async () => {
            component.redirectUrl = '/customHomePage';
            fixture.detectChanges();

            const logoAnchor = fixture.nativeElement.querySelector('a');
            expect(/\/customHomePage$/.test(logoAnchor.href)).toEqual(true);
        });

        it('should have custom tooltip text set on logo when the tooltip parameter is set', () => {
            component.tooltip = 'logo title';
            fixture.detectChanges();

            const logoAnchor = fixture.nativeElement.querySelector('a');
            expect(logoAnchor.title).toEqual('logo title');
        });

        it('test click on sidenav button', () => {
            component.showSidenavToggle = true;
            fixture.detectChanges();
            spyOn(component.clicked, 'emit');
            const button = fixture.nativeElement.querySelector('.adf-menu-icon');

            button.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(component.clicked.emit).toHaveBeenCalledWith(true);
        });

        it('if showSidenavToggle is true the button menu should be displayed', () => {
            component.showSidenavToggle = true;
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('.adf-menu-icon');
            expect(button === null).toBeFalsy();
        });

        it('if showSidenavToggle is false the button menu should not be displayed', () => {
            component.showSidenavToggle = false;
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('.adf-menu-icon');
            expect(button === null).toBeTruthy();
        });

        it('if expandedSidenav is false aria expanded should be false too', () => {
            component.expandedSidenav = false;
            fixture.detectChanges();

            const nodeAttributes = fixture.debugElement.nativeElement.querySelector('#adf-sidebar-toggle-start').attributes as NamedNodeMap;
            expect(nodeAttributes.getNamedItem('aria-expanded').value).toEqual('false');
        });

        it('if expandedSidenav is true aria expanded should be true too', () => {
            component.expandedSidenav = true;
            fixture.detectChanges();

            const nodeAttributes = fixture.debugElement.nativeElement.querySelector('#adf-sidebar-toggle-start').attributes as NamedNodeMap;
            expect(nodeAttributes.getNamedItem('aria-expanded').value).toEqual('true');
        });

        it('if expandedSidenav is false than we click on the sidenav button aria expanded should be true and if click again it should be false', () => {
            component.expandedSidenav = false;
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('#adf-sidebar-toggle-start');
            button.click();

            fixture.detectChanges();

            const nodeAttributes = button.attributes as NamedNodeMap;
            expect(nodeAttributes.getNamedItem('aria-expanded').value).toEqual('true');

            button.click();

            fixture.detectChanges();

            const nodeAttributes2 = button.attributes as NamedNodeMap;
            expect(nodeAttributes2.getNamedItem('aria-expanded').value).toEqual('false');
        });

        it('if position is end the button menu should be at the end', () => {
            component.position = 'end';
            fixture.detectChanges();

            const buttonStart = fixture.nativeElement.querySelector('#adf-sidebar-toggle-start');
            const buttonEnd = fixture.nativeElement.querySelector('#adf-sidebar-toggle-end');
            expect(buttonStart === null).toBeTruthy();
            expect(buttonEnd === null).toBeFalsy();
        });

        it('if position is start the button menu should be at the start', () => {
            component.position = 'start';
            fixture.detectChanges();

            const buttonStart = fixture.nativeElement.querySelector('#adf-sidebar-toggle-start');
            const buttonEnd = fixture.nativeElement.querySelector('#adf-sidebar-toggle-end');
            expect(buttonStart === null).toBeFalsy();
            expect(buttonEnd === null).toBeTruthy();
        });

        it('should display the logo image when the input is set to true [showLogo=true]', () => {
            component.showLogo = true;
            fixture.detectChanges();

            const logo = fixture.debugElement.query(By.css('.adf-app-logo'));

            expect(logo.nativeElement).not.toBeNull();
        });

        it('should NOT display the logo image when the input is set to false [showLogo=false]', () => {
            component.showLogo = false;
            fixture.detectChanges();

            const logo = fixture.debugElement.query(By.css('.adf-app-logo'));

            expect(logo).toBeNull();
        });

        it('should display the default toggle icon', () => {
            component.showSidenavToggle = true;
            fixture.detectChanges();

            const toggleIcon = fixture.debugElement.query(By.css('.adf-menu-icon'));

            expect(toggleIcon.nativeElement.textContent.trim()).toBe('menu');
        });

        it('should display the correct toggle icon', () => {
            component.showSidenavToggle = true;
            component.toggleIcon = 'apps';
            fixture.detectChanges();

            const toggleIcon = fixture.debugElement.query(By.css('.adf-menu-icon'));

            expect(toggleIcon.nativeElement.textContent.trim()).toBe('apps');
        });
    });

    describe('Template transclusion', () => {
        @Component({
            selector: 'adf-test-layout-header',
            standalone: true,
            imports: [HeaderLayoutComponent],
            template: ` <adf-layout-header title="test" color="primary">
                <p>Test text</p>
                <p></p>
            </adf-layout-header>`
        })
        class HeaderLayoutTesterComponent {}

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CoreTestingModule, HeaderLayoutTesterComponent]
            });
        });

        it('should project the provided nodes into the component', () => {
            const hostFixture = TestBed.createComponent(HeaderLayoutTesterComponent);
            hostFixture.detectChanges();
            const innerText = hostFixture.nativeElement.querySelector('p').innerText;
            expect(innerText).toEqual('Test text');
        });
    });
});
