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

import { OverlayContainer } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ContextMenuHolderComponent } from './context-menu-holder.component';
import { ContextMenuModule } from './context-menu.module';
import { ContextMenuService } from './context-menu.service';
import { CoreModule } from '../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { setupTestBed } from '../testing/setupTestBed';

describe('ContextMenuHolderComponent', () => {
    let fixture: ComponentFixture<ContextMenuHolderComponent>;
    let component: ContextMenuHolderComponent;
    let contextMenuService: ContextMenuService;
    const overlayContainer = {
        getContainerElement: () => ({
            addEventListener: () => {},
            querySelector: (val) => ({
                name: val,
                clientWidth: 0,
                clientHeight: 0,
                parentElement: {
                    style: {
                        left: 0,
                        top: 0
                    }
                }
            })

        })
    };

    const getViewportRect = {
        getViewportRect: () => ({
            left: 0, top: 0, width: 1014, height: 686, bottom: 0, right: 0
        })
    };

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot(),
            ContextMenuModule
        ],
        providers: [
            {
                provide: OverlayContainer,
                useValue: overlayContainer
            },
            {
                provide: ViewportRuler,
                useValue: getViewportRect
            }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContextMenuHolderComponent);
        component = fixture.componentInstance;
        contextMenuService = TestBed.get(ContextMenuService);

        component.ngOnDestroy = () => {};
        fixture.detectChanges();
    });

    beforeEach(() => {
        spyOn(component.menuTrigger, 'openMenu');
    });

    describe('Events', () => {
        it('should show menu on service event', () => {
            spyOn(component, 'showMenu');

            contextMenuService.show.next(<any> {});

            expect(component.showMenu).toHaveBeenCalled();
        });

        it('should set DOM element reference on  menu open event', () => {
            component.menuTrigger.onMenuOpen.next();

            expect(component.mdMenuElement.name).toBe('.context-menu');
        });

        it('should reset DOM element reference on  menu close event', () => {
            component.menuTrigger.onMenuClose.next();

            expect(component.mdMenuElement).toBe(null);
        });
    });

    describe('onMenuItemClick()', () => {

        it('should emit when link is not disabled', () => {
            const menuItem = {
                model: {
                    disabled: false
                },
                subject: {
                    next: (val) => val
                }
            };

            spyOn(menuItem.subject, 'next');

            const event = {
                preventDefault: () => null,
                stopImmediatePropagation: () => null
            };

            component.onMenuItemClick(<any> event, menuItem);

            expect(menuItem.subject.next).toHaveBeenCalledWith(menuItem);
        });

        it('should not emit when link is disabled', () => {
            const menuItem = {
                model: {
                    disabled: false
                },
                subject: {
                    next: (val) => val
                }
            };

            spyOn(menuItem.subject, 'next');

            const event = {
                preventDefault: () => null,
                stopImmediatePropagation: () => null
            };

            menuItem.model.disabled = true;
            component.onMenuItemClick(<any> event, menuItem);

            expect(menuItem.subject.next).not.toHaveBeenCalled();
        });
    });

    describe('showMenu()', () => {
        it('should open menu panel', () => {
            component.showMenu(<any> {}, [{}]);

            expect(component.menuTrigger.openMenu).toHaveBeenCalled();
        });
    });

    describe('Menu position', () => {
        beforeEach(() => {
            component.menuTrigger.onMenuOpen.next();
            component.mdMenuElement.clientHeight = 160;
            component.mdMenuElement.clientWidth = 200;
        });

        it('should set position to mouse position', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 100,
                clientY: 210
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.mdMenuElement.parentElement.style).toEqual({
                left: '100px',
                top: '210px'
            });
        }));

        it('should adjust position relative to right margin of the screen', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 1000,
                clientY: 210
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.mdMenuElement.parentElement.style).toEqual({
                left: '800px',
                top: '210px'
            });
        }));

        it('should adjust position relative to bottom margin of the screen', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 100,
                clientY: 600
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.mdMenuElement.parentElement.style).toEqual({
                left: '100px',
                top: '440px'
            });
        }));

        it('should adjust position relative to bottom - right margin of the screen', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 900,
                clientY: 610
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.mdMenuElement.parentElement.style).toEqual({
                left: '700px',
                top: '450px'
            });
        }));
    });

    describe('Menu direction', () => {
        beforeEach(() => {
            component.menuTrigger.onMenuOpen.next();
            component.mdMenuElement.clientHeight = 160;
            component.mdMenuElement.clientWidth = 200;
        });

        it('should set default menu direction', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 100,
                clientY: 210
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.menuTrigger.menu.xPosition).toBe('after');
            expect(component.menuTrigger.menu.yPosition).toBe('below');
        }));

        it('should adjust direction relative to right margin of the screen', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 1000,
                clientY: 210
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.menuTrigger.menu.xPosition).toBe('before');
            expect(component.menuTrigger.menu.yPosition).toBe('below');
        }));

        it('should adjust direction relative to bottom margin of the screen', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 100,
                clientY: 600
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.menuTrigger.menu.xPosition).toBe('after');
            expect(component.menuTrigger.menu.yPosition).toBe('above');
        }));

        it('should adjust position relative to bottom - right margin of the screen', fakeAsync(() => {
            const contextMenuEvent = {
                clientX: 900,
                clientY: 610
            };

            component.showMenu(<any> contextMenuEvent, [{}]);
            tick();

            expect(component.menuTrigger.menu.xPosition).toBe('before');
            expect(component.menuTrigger.menu.yPosition).toBe('above');
        }));
    });
});
