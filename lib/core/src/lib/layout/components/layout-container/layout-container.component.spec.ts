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

import { LayoutContainerComponent } from './layout-container.component';
import { SimpleChange } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';

describe('LayoutContainerComponent', () => {
    let fixture: ComponentFixture<LayoutContainerComponent>;
    let layoutContainerComponent: LayoutContainerComponent;
    let unitTestingUtils: UnitTestingUtils;

    const setupComponent = (expandedSidenav: boolean, position: 'start' | 'end', direction: Direction) => {
        layoutContainerComponent.expandedSidenav = expandedSidenav;
        layoutContainerComponent.position = position;
        layoutContainerComponent.direction = direction;
        layoutContainerComponent.ngOnInit();
    };

    const checkContentAnimationState = (value: string, marginProperty: string, marginValue: number) => {
        expect(layoutContainerComponent.contentAnimationState).toEqual({
            value,
            params: { [marginProperty]: marginValue }
        });
    };

    const testDirectionChange = (position: 'start' | 'end', direction: Direction, marginProperty: string) => {
        layoutContainerComponent.position = position;
        layoutContainerComponent.direction = direction;
        layoutContainerComponent.ngOnChanges({ direction: new SimpleChange('', '', false) });
        expect(layoutContainerComponent.contentAnimationState.params[marginProperty]).not.toBeNull();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LayoutContainerComponent]
        });
        fixture = TestBed.createComponent(LayoutContainerComponent);
        layoutContainerComponent = fixture.componentInstance;
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement, TestbedHarnessEnvironment.loader(fixture));
        layoutContainerComponent.sidenavMin = 70;
        layoutContainerComponent.sidenavMax = 200;
        layoutContainerComponent.mediaQueryList = {
            matches: false,
            addListener: jasmine.createSpy('addListener').and.callFake((callback) => window.addEventListener('resize', callback)),
            removeListener: jasmine.createSpy('removeListener').and.callFake((callback) => window.removeEventListener('resize', callback))
        };
    });

    describe('OnInit', () => {
        it('should initialize sidenav and content states correctly', () => {
            layoutContainerComponent.expandedSidenav = true;
            layoutContainerComponent.ngOnInit();
            expect(layoutContainerComponent.SIDENAV_STATES.MOBILE).toEqual({
                value: 'expanded',
                params: { width: layoutContainerComponent.sidenavMax }
            });
            expect(layoutContainerComponent.SIDENAV_STATES.EXPANDED).toEqual({
                value: 'expanded',
                params: { width: layoutContainerComponent.sidenavMax }
            });
            expect(layoutContainerComponent.SIDENAV_STATES.COMPACT).toEqual({
                value: 'compact',
                params: { width: layoutContainerComponent.sidenavMin }
            });
            expect(layoutContainerComponent.CONTENT_STATES.MOBILE).toEqual({ value: 'expanded' });
            expect(layoutContainerComponent.mediaQueryList.addListener).toHaveBeenCalled();
        });

        describe('Sidenav expanded', () => {
            beforeEach(() => (layoutContainerComponent.expandedSidenav = true));

            describe('Sidenav [start] position', () => {
                beforeEach(() => (layoutContainerComponent.position = 'start'));

                it('should set `margin-left` equal to sidenavMax when direction is `ltr`', () => {
                    setupComponent(true, 'start', 'ltr');
                    checkContentAnimationState('compact', 'margin-left', layoutContainerComponent.sidenavMax);
                });

                it('should set `margin-right` equal to sidenavMax when direction is `rtl`', () => {
                    setupComponent(true, 'start', 'rtl');
                    checkContentAnimationState('compact', 'margin-right', layoutContainerComponent.sidenavMax);
                });
            });

            describe('Sidenav [end] position', () => {
                beforeEach(() => (layoutContainerComponent.position = 'end'));

                it('should set `margin-right` equal to sidenavMax when direction is `ltr`', () => {
                    setupComponent(true, 'end', 'ltr');
                    checkContentAnimationState('compact', 'margin-right', layoutContainerComponent.sidenavMax);
                });

                it('should set `margin-left` equal to sidenavMax when direction is `rtl`', () => {
                    setupComponent(true, 'end', 'rtl');
                    checkContentAnimationState('compact', 'margin-left', layoutContainerComponent.sidenavMax);
                });
            });
        });

        describe('Sidenav compact', () => {
            beforeEach(() => (layoutContainerComponent.expandedSidenav = false));

            describe('Sidenav [start] position', () => {
                beforeEach(() => (layoutContainerComponent.position = 'start'));

                it('should set `margin-left` equal to sidenavMin when direction is `ltr`', () => {
                    setupComponent(false, 'start', 'ltr');
                    checkContentAnimationState('expanded', 'margin-left', layoutContainerComponent.sidenavMin);
                });

                it('should set `margin-right` equal to sidenavMin when direction is `rtl`', () => {
                    setupComponent(false, 'start', 'rtl');
                    checkContentAnimationState('expanded', 'margin-right', layoutContainerComponent.sidenavMin);
                });
            });

            describe('Sidenav [end] position', () => {
                beforeEach(() => (layoutContainerComponent.position = 'end'));

                it('should set `margin-right` equal to sidenavMin when direction is `ltr`', () => {
                    setupComponent(false, 'end', 'ltr');
                    checkContentAnimationState('expanded', 'margin-right', layoutContainerComponent.sidenavMin);
                });

                it('should set `margin-left` equal to sidenavMin when direction is `rtl`', () => {
                    setupComponent(false, 'end', 'rtl');
                    checkContentAnimationState('expanded', 'margin-left', layoutContainerComponent.sidenavMin);
                });
            });
        });
    });

    describe('OnChange direction', () => {
        it('should set `margin-left` for `start` position and `ltr` direction', () => {
            testDirectionChange('start', 'ltr', 'margin-left');
        });

        it('should set `margin-right` for `start` position and `rtl` direction', () => {
            testDirectionChange('start', 'rtl', 'margin-right');
        });

        it('should set `margin-right` for `end` position and `ltr` direction', () => {
            testDirectionChange('end', 'ltr', 'margin-right');
        });

        it('should set `margin-left` for `end` position and `rtl` direction', () => {
            testDirectionChange('end', 'rtl', 'margin-left');
        });
    });

    describe('toggleMenu()', () => {
        let sidenav: MatSidenavHarness;

        beforeEach(async () => {
            sidenav = await unitTestingUtils.getMatSidenav();
        });

        it('should switch to sidenav to compact state', async () => {
            layoutContainerComponent.expandedSidenav = true;
            layoutContainerComponent.ngOnInit();
            layoutContainerComponent.toggleMenu();
            expect(layoutContainerComponent.sidenavAnimationState).toEqual({
                value: 'compact',
                params: { width: layoutContainerComponent.sidenavMin }
            });
            fixture.detectChanges();
            expect(await sidenav.isOpen()).toBeFalse();
        });

        it('should switch to sidenav to expanded state', async () => {
            layoutContainerComponent.expandedSidenav = false;
            layoutContainerComponent.ngOnInit();
            layoutContainerComponent.toggleMenu();
            expect(layoutContainerComponent.sidenavAnimationState).toEqual({
                value: 'expanded',
                params: { width: layoutContainerComponent.sidenavMax }
            });
            expect(await sidenav.isOpen()).toBeTrue();
        });
    });

    describe('Media query change', () => {
        let sidenav: MatSidenavHarness;

        const expandedState = {
            value: 'expanded',
            params: { width: 200 }
        };

        const expandedContentState = {
            value: 'expanded'
        };

        const testMediaQueryChange = (matches: boolean, expectedSidenavState: any, expectedContentState: any) => {
            fixture.detectChanges();
            layoutContainerComponent.mediaQueryList.matches = matches;
            window.dispatchEvent(new Event('resize'));
            expect(layoutContainerComponent.sidenavAnimationState).toEqual(expectedSidenavState);
            expect(layoutContainerComponent.contentAnimationState).toEqual(expectedContentState);
        };

        beforeEach(async () => {
            sidenav = await unitTestingUtils.getMatSidenav();
        });

        it('should close sidenav on mobile and open on desktop', async () => {
            testMediaQueryChange(true, expandedState, expandedContentState);
            layoutContainerComponent.mediaQueryList.matches = false;
            window.dispatchEvent(new Event('resize'));
            expect(layoutContainerComponent.sidenavAnimationState).toEqual(layoutContainerComponent.SIDENAV_STATES.EXPANDED);
            expect(layoutContainerComponent.contentAnimationState).toEqual({
                value: 'compact',
                params: { 'margin-left': layoutContainerComponent.sidenavMax }
            });
            expect(await sidenav.isOpen()).toBeTrue();
        });

        it('should keep sidenav compact when resized back to desktop and hideSidenav is true', async () => {
            layoutContainerComponent.hideSidenav = true;
            testMediaQueryChange(true, expandedState, expandedContentState);
            layoutContainerComponent.mediaQueryList.matches = false;
            window.dispatchEvent(new Event('resize'));
            expect(layoutContainerComponent.sidenavAnimationState).toEqual(layoutContainerComponent.SIDENAV_STATES.COMPACT);
            expect(layoutContainerComponent.contentAnimationState).toEqual({
                value: 'expanded',
                params: { 'margin-left': layoutContainerComponent.sidenavMin }
            });
            expect(await sidenav.isOpen()).toBeFalse();
        });
    });
});
