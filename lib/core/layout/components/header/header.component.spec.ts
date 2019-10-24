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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderLayoutComponent } from './header.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { By } from '@angular/platform-browser';
import { LayoutModule } from '../..';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './../../../material.module';

describe('HeaderLayoutComponent', () => {
    let fixture: ComponentFixture<HeaderLayoutComponent>;
    let component: HeaderLayoutComponent;

    describe('Input parameters', () => {
        setupTestBed({
            imports: [CoreTestingModule]
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(HeaderLayoutComponent);
            component = fixture.componentInstance;
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should create instance of HeaderLayoutComponent', () => {
            expect(fixture.componentInstance instanceof HeaderLayoutComponent).toBe(true, 'should create HeaderLayoutComponent');
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

        it('color attribute should be present on mat-toolbar', () => {
            component.color = 'primary';
            fixture.detectChanges();

            const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
            expect(toolbar.getAttribute('ng-reflect-color') === null).toBeFalsy();
            expect(toolbar.getAttribute('ng-reflect-color')).toEqual('primary');
        });

        it('should display the img element with the expected src if a logo path is set', () => {
            component.logo = 'logo.png';
            fixture.detectChanges();

            const logo = fixture.nativeElement.querySelector('.adf-app-logo');
            const src = logo.getAttribute('src');
            expect(logo === null).toBeFalsy();
            expect(src).toEqual('logo.png');
        });

        it('should have custom url link set on logo when the redirectUrl is set', () => {
            component.redirectUrl = '/customHomePage';
            fixture.detectChanges();

            const logoAnchor = fixture.nativeElement.querySelector('mat-toolbar>a');
            expect(/\/customHomePage$/.test(logoAnchor.href)).toEqual(true);
        });

        it('should have custom tooltip text set on logo when the tooltip parameter is set', () => {
            component.tooltip = 'logo title';
            fixture.detectChanges();

            const logoAnchor = fixture.nativeElement.querySelector('mat-toolbar>a');
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
    });

    describe('Template transclusion', () => {

        @Component({
            selector: 'adf-test-layout-header',
            template: `<adf-layout-header title="test" color="primary"><p>Test text<p></adf-layout-header>`
        })
        class HeaderLayoutTesterComponent {}

        setupTestBed({
            declarations: [HeaderLayoutTesterComponent],
            imports: [ CoreTestingModule, LayoutModule, MaterialModule, RouterTestingModule ]
        });

        it('should project the provided nodes into the component', () => {
            const hostFixture = TestBed.createComponent(HeaderLayoutTesterComponent);
            hostFixture.detectChanges();
            const innerText = hostFixture.nativeElement.querySelector('mat-toolbar>p').innerText;
            expect(innerText).toEqual('Test text');
        });
    });
});
