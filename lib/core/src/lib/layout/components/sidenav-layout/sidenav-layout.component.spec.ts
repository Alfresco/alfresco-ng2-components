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
import { By } from '@angular/platform-browser';
import { SidenavLayoutComponent } from './sidenav-layout.component';
import { Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidenavLayoutContentDirective } from '../../directives/sidenav-layout-content.directive';
import { SidenavLayoutHeaderDirective } from '../../directives/sidenav-layout-header.directive';
import { SidenavLayoutNavigationDirective } from '../../directives/sidenav-layout-navigation.directive';
import { UserPreferencesService } from '../../../common/services/user-preferences.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'adf-test-component-for-sidenav',
    standalone: true,
    imports: [SidenavLayoutComponent, SidenavLayoutHeaderDirective, SidenavLayoutNavigationDirective, SidenavLayoutContentDirective],
    template: ` <adf-sidenav-layout [sidenavMin]="70" [sidenavMax]="320" [stepOver]="600" [hideSidenav]="false">
        <adf-sidenav-layout-header>
            <ng-template let-toggleMenu="toggleMenu">
                <div id="header-test" (click)="toggleMenu()" role="button" tabindex="0" (keyup.enter)="toggleMenu()"></div>
            </ng-template>
        </adf-sidenav-layout-header>

        <adf-sidenav-layout-navigation>
            <ng-template let-isMenuMinimized="isMenuMinimized">
                <div id="nav-test">{{ isMenuMinimized !== undefined ? 'variable-is-injected' : 'variable-is-not-injected' }}</div>
            </ng-template>
        </adf-sidenav-layout-navigation>

        <adf-sidenav-layout-content>
            <ng-template>
                <div id="content-test"></div>
            </ng-template>
        </adf-sidenav-layout-content>
    </adf-sidenav-layout>`
})
export class SidenavLayoutTesterComponent {}

describe('SidenavLayoutComponent', () => {
    let fixture: ComponentFixture<any>;
    let mediaQueryList: any;
    let component: SidenavLayoutComponent;
    let mediaMatcher: MediaMatcher;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NoopAnimationsModule, SidenavLayoutComponent],
            providers: [MediaMatcher, { provide: UserPreferencesService, useValue: { select: () => of() } }]
        });
        mediaQueryList = {
            mediaFn: null,
            matches: false,
            addListener(mediaFn) {
                this.mediaFn = mediaFn;
            },
            removeListener: () => {}
        };

        mediaMatcher = TestBed.inject(MediaMatcher);
        spyOn(mediaMatcher, 'matchMedia').and.callFake(() => mediaQueryList);

        fixture = TestBed.createComponent(SidenavLayoutComponent);
        component = fixture.componentInstance;
        component.sidenavMin = 70;
        component.sidenavMax = 320;
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('toggleMenu', () => {
        beforeEach(() => {
            component.ngOnInit();
        });

        it('should toggle the isMenuMinimized if the mediaQueryList.matches is false (we are on desktop)', () => {
            mediaQueryList.matches = false;
            component.isMenuMinimized = false;

            component.toggleMenu();

            expect(component.isMenuMinimized).toBe(true);
        });

        it('should set the isMenuMinimized to false if the mediaQueryList.matches is true (we are on mobile)', () => {
            mediaQueryList.matches = true;
            component.isMenuMinimized = true;

            component.toggleMenu();

            expect(component.isMenuMinimized).toBe(false);
        });

        it('should expand nav bar when mobile view switched', () => {
            mediaQueryList.matches = true;
            component.isMenuMinimized = true;
            component.expanded.subscribe((expanded) => expect(expanded).toBeTruthy());
            mediaQueryList.mediaFn();
        });
    });

    describe('menuOpenState', () => {
        it('should be true by default', (done) => {
            component.ngOnInit();

            component.menuOpenState$.subscribe((value) => {
                expect(value).toBe(true);
                done();
            });
        });

        it('should be the same as the expanded Sidenav value by default', (done) => {
            component.expandedSidenav = false;
            component.ngOnInit();

            component.menuOpenState$.subscribe((value) => {
                expect(value).toBe(false);
                done();
            });
        });

        it('should emit value on toggleMenu action', (done) => {
            component.expandedSidenav = false;

            component.ngOnInit();
            component.toggleMenu();

            component.menuOpenState$.subscribe((value) => {
                expect(value).toBe(true);
                done();
            });
        });
    });
});

describe('Template transclusion', () => {
    let fixture: ComponentFixture<any>;
    let mediaMatcher: MediaMatcher;
    let mediaQueryList: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, NoopAnimationsModule, SidenavLayoutTesterComponent],
            providers: [MediaMatcher, { provide: UserPreferencesService, useValue: { select: () => of() } }]
        });

        mediaQueryList = {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };

        mediaMatcher = TestBed.inject(MediaMatcher);
        spyOn(mediaMatcher, 'matchMedia').and.callFake(() => mediaQueryList);

        fixture = TestBed.createComponent(SidenavLayoutTesterComponent);
        fixture.detectChanges();
    });

    describe('adf-sidenav-layout-navigation', () => {
        const injectedElementSelector = By.css('[data-automation-id="adf-layout-container"] #nav-test');

        it('should contain the transcluded side navigation template', () => {
            const injectedElement = fixture.debugElement.query(injectedElementSelector);

            expect(injectedElement === null).toBe(false);
        });

        it('should let the isMenuMinimized property of component to be accessed by the transcluded template', () => {
            const injectedElement = fixture.debugElement.query(injectedElementSelector);

            expect(injectedElement.nativeElement.innerText.trim()).toBe('variable-is-injected');
        });
    });

    describe('adf-sidenav-layout-header', () => {
        const outerHeaderSelector = By.css('.adf-sidenav-layout-full-space > #header-test');
        const innerHeaderSelector = By.css('.adf-layout__content > #header-test');

        it('should contain the transcluded header template outside of the layout-container', () => {
            mediaQueryList.matches = false;
            fixture.detectChanges();
            const outerHeaderElement = fixture.debugElement.query(outerHeaderSelector);

            expect(outerHeaderElement).toBeDefined();
        });

        it('should contain the transcluded header template inside of the layout-container', () => {
            mediaQueryList.matches = true;

            fixture.detectChanges();
            const innerHeaderElement = fixture.debugElement.query(innerHeaderSelector);

            expect(innerHeaderElement).toBeDefined();
        });
    });

    describe('adf-sidenav-layout-content', () => {
        const injectedElementSelector = By.css('[data-automation-id="adf-layout-container"] #content-test');

        it('should contain the transcluded content template', () => {
            const injectedElement = fixture.debugElement.query(injectedElementSelector);
            expect(injectedElement === null).toBe(false);
        });
    });
});
