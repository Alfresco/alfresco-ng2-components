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

/*tslint:disable: ban*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SidenavLayoutComponent } from './sidenav-layout.component';
import { Component, Input } from '@angular/core';
import { LayoutModule, MediaMatcher } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { MaterialModule } from '../material.module';
import { SidenavLayoutContentDirective } from './sidenav-layout-content.directive';
import { SidenavLayoutHeaderDirective } from './sidenav-layout-header.directive';
import { SidenavLayoutNavigationDirective } from './sidenav-layout-navigation.directive';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-layout-container',
    template: `
        <ng-content select="[app-layout-navigation]"></ng-content>
        <ng-content select="[app-layout-content]"></ng-content>`
})
export class DummyLayoutContainerComponent {
    @Input() sidenavMin: number;
    @Input() sidenavMax: number;
    @Input() mediaQueryList: MediaQueryList;
    @Input() hideSidenav: boolean;
    toggleMenu () {}
}

describe('SidenavLayoutComponent', () => {

    let fixture: ComponentFixture<any>,
        mediaMatcher: MediaMatcher,
        mediaQueryList: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                PlatformModule,
                LayoutModule,
                MaterialModule
            ],
            declarations: [
                DummyLayoutContainerComponent,
                SidenavLayoutComponent,
                SidenavLayoutContentDirective,
                SidenavLayoutHeaderDirective,
                SidenavLayoutNavigationDirective
            ],
            providers: [
                MediaMatcher
            ]
        });
    }));

    beforeEach(() => {
        mediaQueryList = {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('Template transclusion', () => {

        @Component({
            selector: 'app-test-component-for-sidenav',
            template: `
            <adf-sidenav-layout [sidenavMin]="70" [sidenavMax]="320" [stepOver]="600" [hideSidenav]="false">

                <ng-template appLayoutHeader let-toggleMenu="toggleMenu">
                    <div id="header-test" (click)="toggleMenu()"></div>
                </ng-template>

                <ng-template appLayoutNavigation let-isMenuMinimized="isMenuMinimized">
                    <div id="nav-test">{{ isMenuMinimized !== undefined ? 'variable-is-injected' : 'variable-is-not-injected' }}</div>
                </ng-template>

                <ng-template appLayoutContent>
                    <div id="content-test"></div>
                </ng-template>
            </adf-sidenav-layout>`
        })
        class SidenavLayoutTesterComponent {}

        beforeEach(async(() => {
            TestBed.configureTestingModule({ declarations: [ SidenavLayoutTesterComponent ] }).compileComponents();
        }));

        beforeEach(() => {
            mediaMatcher = TestBed.get(MediaMatcher);
            spyOn(mediaMatcher, 'matchMedia').and.returnValue(mediaQueryList);

            fixture = TestBed.createComponent(SidenavLayoutTesterComponent);
            fixture.detectChanges();
        });

        describe('appLayoutNavigation', () => {

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

        describe('appLayoutHeader', () => {

            const outerHeaderSelector = By.css('.sidenav-layout > #header-test'),
                innerHeaderSelector = By.css('.sidenav-layout [data-automation-id="adf-layout-container"] #header-test');

            it('should contain the transcluded header template outside of the layout-container', () => {
                mediaQueryList.matches = false;
                fixture.detectChanges();
                const outerHeaderElement = fixture.debugElement.query(outerHeaderSelector);
                const innerHeaderElement = fixture.debugElement.query(innerHeaderSelector);

                expect(outerHeaderElement === null).toBe(false, 'Outer header should be shown');
                expect(innerHeaderElement === null).toBe(true, 'Inner header should not be shown');
            });

            it('should contain the transcluded header template inside of the layout-container', () => {
                mediaQueryList.matches = true;
                fixture.detectChanges();
                const outerHeaderElement = fixture.debugElement.query(outerHeaderSelector);
                const innerHeaderElement = fixture.debugElement.query(innerHeaderSelector);

                expect(outerHeaderElement === null).toBe(true, 'Outer header should not be shown');
                expect(innerHeaderElement === null).toBe(false, 'Inner header should be shown');
            });

            it('should call through the layout container\'s toggleMenu method', () => {
                mediaQueryList.matches = false;
                fixture.detectChanges();
                const layoutContainerComponent = fixture.debugElement.query(By.directive(DummyLayoutContainerComponent)).componentInstance;
                spyOn(layoutContainerComponent, 'toggleMenu');

                const outerHeaderElement = fixture.debugElement.query(outerHeaderSelector);
                outerHeaderElement.triggerEventHandler('click', {});

                expect(layoutContainerComponent.toggleMenu).toHaveBeenCalled();
            });
        });

        describe('appLayoutContent', () => {

            const injectedElementSelector = By.css('[data-automation-id="adf-layout-container"] #content-test');

            it('should contain the transcluded content template', () => {
                const injectedElement = fixture.debugElement.query(injectedElementSelector);

                expect(injectedElement === null).toBe(false);
            });
        });
    });

    describe('General behaviour', () => {

        let component: SidenavLayoutComponent;

        beforeEach(async(() => {
            TestBed.compileComponents();
        }));

        beforeEach(() => {
            mediaMatcher = TestBed.get(MediaMatcher);
            spyOn(mediaMatcher, 'matchMedia').and.callFake((mediaQuery) => {
                mediaQueryList.originalMediaQueryPassed = mediaQuery;
                spyOn(mediaQueryList, 'addListener').and.stub();
                spyOn(mediaQueryList, 'removeListener').and.stub();
                return mediaQueryList;
            });

            fixture = TestBed.createComponent(SidenavLayoutComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should pass through input paramters', () => {
            component.sidenavMin = 1;
            component.sidenavMax = 2;
            component.hideSidenav = true;
            fixture.detectChanges();

            const layoutContainerComponent = fixture.debugElement.query(By.directive(DummyLayoutContainerComponent)).componentInstance;

            expect(layoutContainerComponent.sidenavMin).toBe(component.sidenavMin);
            expect(layoutContainerComponent.sidenavMax).toBe(component.sidenavMax);
            expect(layoutContainerComponent.hideSidenav).toBe(component.hideSidenav);
            expect(layoutContainerComponent.mediaQueryList.originalMediaQueryPassed).toBe(`(max-width: 600px)`);
        });

        it('addListener of mediaQueryList should have been called', () => {
            expect(mediaQueryList.addListener).toHaveBeenCalledTimes(1);
            expect(mediaQueryList.addListener).toHaveBeenCalledWith(component.onMediaQueryChange);
        });

        it('addListener of mediaQueryList should have been called', () => {
            fixture.destroy();

            expect(mediaQueryList.removeListener).toHaveBeenCalledTimes(1);
            expect(mediaQueryList.removeListener).toHaveBeenCalledWith(component.onMediaQueryChange);
        });
    });

    describe('toggleMenu', () => {

        let component;

        beforeEach(async(() => {
            TestBed.compileComponents();
        }));

        beforeEach(() => {
            mediaMatcher = TestBed.get(MediaMatcher);
            spyOn(mediaMatcher, 'matchMedia').and.returnValue(mediaQueryList);

            fixture = TestBed.createComponent(SidenavLayoutComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
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
    });
});
