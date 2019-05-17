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

import { LayoutContainerComponent } from './layout-container.component';
import { SimpleChange } from '@angular/core';

describe('LayoutContainerComponent', () => {
    let layoutContainerComponent: LayoutContainerComponent;

    beforeEach(() => {
        layoutContainerComponent = new LayoutContainerComponent();
        layoutContainerComponent.sidenavMin = 70;
        layoutContainerComponent.sidenavMax = 200;
        layoutContainerComponent.mediaQueryList = {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };
    });

    describe('OnInit', () => {
        describe('Sidenav expanded', () => {
            beforeEach(() => {
                layoutContainerComponent.expandedSidenav = true;
            });

            describe('Sidenav [start] position', () => {
                beforeEach(() => {
                    layoutContainerComponent.position = 'start';
                });

                it('should set `margin-left` equal to sidenavMax when direction is `ltr`', () => {
                    layoutContainerComponent.direction = 'ltr';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'compact', params: { 'margin-left': layoutContainerComponent.sidenavMax}
                    });
                });

                it('should set `margin-right` equal to sidenavMax when direction is `rtl`', () => {
                    layoutContainerComponent.direction = 'rtl';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'compact', params: { 'margin-right': layoutContainerComponent.sidenavMax}
                    });
                });
            });

            describe('Sidenav [end] position', () => {
                beforeEach(() => {
                    layoutContainerComponent.position = 'end';
                });

                it('should set `margin-right` equal to sidenavMax when direction is `ltr`', () => {
                    layoutContainerComponent.direction = 'ltr';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'compact', params: { 'margin-right': layoutContainerComponent.sidenavMax}
                    });
                });

                it('should set `margin-left` equal to sidenavMax when direction is `rtl`', () => {
                    layoutContainerComponent.direction = 'rtl';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'compact', params: { 'margin-left': layoutContainerComponent.sidenavMax}
                    });
                });
            });
        });

        describe('Sidenav compact', () => {
            beforeEach(() => {
                layoutContainerComponent.expandedSidenav = false;
            });

            describe('Sidenav [start] position', () => {
                beforeEach(() => {
                    layoutContainerComponent.position = 'start';
                });

                it('should set `margin-left` equal to sidenavMin when direction is `ltr`', () => {
                    layoutContainerComponent.direction = 'ltr';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'expanded', params: { 'margin-left': layoutContainerComponent.sidenavMin}
                    });
                });

                it('should set `margin-right` equal to sidenavMin when direction is `rtl`', () => {
                    layoutContainerComponent.direction = 'rtl';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'expanded', params: { 'margin-right': layoutContainerComponent.sidenavMin}
                    });
                });
            });

            describe('Sidenav [end] position', () => {
                beforeEach(() => {
                    layoutContainerComponent.position = 'end';
                });

                it('should set `margin-right` equal to sidenavMin when direction is `ltr`', () => {
                    layoutContainerComponent.direction = 'ltr';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'expanded', params: { 'margin-right': layoutContainerComponent.sidenavMin}
                    });
                });

                it('should set `margin-left` equal to sidenavMin when direction is `rtl`', () => {
                    layoutContainerComponent.direction = 'rtl';
                    layoutContainerComponent.ngOnInit();

                    expect(layoutContainerComponent.contentAnimationState).toEqual({
                        value: 'expanded', params: { 'margin-left': layoutContainerComponent.sidenavMin}
                    });
                });
            });
        });
    });

    describe('OnChange direction', () => {
        describe('Sidenav [start] position', () => {
            beforeEach(() => {
                layoutContainerComponent.position = 'start';
            });

            it('should set `margin-left` when current direction is `ltr`', () => {
                layoutContainerComponent.direction = 'ltr';
                layoutContainerComponent.ngOnChanges({ direction: new SimpleChange('', '', false) });

                expect(layoutContainerComponent.contentAnimationState.params['margin-left']).not.toBeNull();
            });

            it('should set `margin-right` when current direction is `rtl`', () => {
                layoutContainerComponent.direction = 'rtl';
                layoutContainerComponent.ngOnChanges({ direction: new SimpleChange('', '', false) });

                expect(layoutContainerComponent.contentAnimationState.params['margin-right']).not.toBeNull();
            });
        });

        describe('Sidenav [end] position', () => {
            beforeEach(() => {
                layoutContainerComponent.position = 'end';
            });

            it('should set `margin-right` when current direction is `ltr`', () => {
                layoutContainerComponent.direction = 'ltr';
                layoutContainerComponent.ngOnChanges({ direction: new SimpleChange('', '', false) });

                expect(layoutContainerComponent.contentAnimationState.params['margin-right']).not.toBeNull();
            });

            it('should set `margin-left` when current direction is `rtl`', () => {
                layoutContainerComponent.direction = 'rtl';
                layoutContainerComponent.ngOnChanges({ direction: new SimpleChange('', '', false) });

                expect(layoutContainerComponent.contentAnimationState.params['margin-left']).not.toBeNull();
            });
        });
    });

    describe('toggleMenu()', () => {
        it('should switch to sidenav to compact state', () => {
            layoutContainerComponent.expandedSidenav = true;
            layoutContainerComponent.ngOnInit();

            layoutContainerComponent.toggleMenu();

            expect(layoutContainerComponent.sidenavAnimationState).toEqual({
                value: 'compact', params: { width: layoutContainerComponent.sidenavMin }
            });
        });

        it('should switch to sidenav to expanded state', () => {
            layoutContainerComponent.expandedSidenav = false;
            layoutContainerComponent.ngOnInit();

            layoutContainerComponent.toggleMenu();

            expect(layoutContainerComponent.sidenavAnimationState).toEqual({
                value: 'expanded', params: { width: layoutContainerComponent.sidenavMax }
            });
        });
    });
});
