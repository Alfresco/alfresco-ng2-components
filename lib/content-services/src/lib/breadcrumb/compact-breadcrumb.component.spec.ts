/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CompactBreadcrumbComponent } from './compact-breadcrumb.component';
import { DragDropStateService, UnitTestingUtils } from '@alfresco/adf-core';
import { DebugElement } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, TestElement } from '@angular/cdk/testing';
import { MatNavListItemHarness } from '@angular/material/list/testing';
import { PathElement } from '@alfresco/js-api';

describe('CompactBreadcrumbComponent', () => {
    let fixture: ComponentFixture<CompactBreadcrumbComponent>;
    let component: CompactBreadcrumbComponent;
    let unitTestingUtils: UnitTestingUtils;
    let dragDropStateService: DragDropStateService;
    let loader: HarnessLoader;

    const wait = async (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay));

    const getMenuTriggerElement = (): HTMLButtonElement => unitTestingUtils.getByCSS('.adf-compact-breadcrumb-trigger').nativeElement;

    const getOpenedMenuElement = (): DebugElement => unitTestingUtils.getByCSS('.adf-compact-breadcrumb-menu-open');

    beforeEach(() => {
        fixture = TestBed.createComponent(CompactBreadcrumbComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
        dragDropStateService = TestBed.inject(DragDropStateService);
        fixture.componentRef.setInput('nodes', []);
    });

    describe('Menu trigger', () => {
        let triggerElement: HTMLButtonElement;

        const getBackdropElementForOpenedMenu = (): DebugElement => unitTestingUtils.getByCSS('.adf-compact-breadcrumb-backdrop-open');

        beforeEach(() => {
            triggerElement = getMenuTriggerElement();
            fixture.detectChanges();
        });

        it('should open menu when click event is triggered', () => {
            triggerElement.click();
            expect(getOpenedMenuElement()).not.toBeNull();
        });

        it('should close menu when click event is triggered twice', () => {
            triggerElement.click();

            triggerElement.click();
            expect(getOpenedMenuElement()).toBeNull();
        });

        it('should menu be closed when click event is not triggered', () => {
            expect(getOpenedMenuElement()).toBeNull();
        });

        it('should render menu backdrop when click event is triggered', () => {
            triggerElement.click();
            fixture.detectChanges();
            expect(getBackdropElementForOpenedMenu()).not.toBeNull();
        });

        it('should not render menu backdrop when click event is triggered twice', () => {
            triggerElement.click();
            fixture.detectChanges();
            triggerElement.click();
            fixture.detectChanges();
            expect(getBackdropElementForOpenedMenu()).toBeNull();
        });

        it('should menu backdrop be not rendered when click event is not triggered', () => {
            expect(getBackdropElementForOpenedMenu()).toBeNull();
        });

        it('should have correct title', () => {
            expect(triggerElement.title).toBe('BREADCRUMB.COMPACT_MENU.OPEN_COMPACT_BREADCRUMB_BUTTON');
        });

        it('should have correct label', () => {
            expect(triggerElement.textContent.trim()).toBe('BREADCRUMB.COMPACT_MENU.OPEN_COMPACT_BREADCRUMB_BUTTON');
        });

        it('should open menu when mouseenter is triggered and DragDropStateService dragging is true', async () => {
            dragDropStateService.dragging.set(true);

            triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
            await wait(500);
            fixture.detectChanges();
            expect(getOpenedMenuElement()).not.toBeNull();
        });

        it('should render menu backdrop when mouseenter is triggered and DragDropStateService dragging is true', async () => {
            dragDropStateService.dragging.set(true);

            triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
            await wait(500);
            fixture.detectChanges();
            expect(getBackdropElementForOpenedMenu()).not.toBeNull();
        });
    });

    describe('Menu', () => {
        let menu: HTMLDivElement;

        const getFullWidthMenuElement = (): DebugElement => unitTestingUtils.getByCSS('.adf-compact-breadcrumb-menu-full-width');

        const getTitle = (): string =>
            unitTestingUtils.getByCSS('.adf-compact-breadcrumb-menu-header-title-description').nativeElement.textContent.trim();

        const getFooter = (): string => unitTestingUtils.getByCSS('.adf-compact-breadcrumb-menu-footer').nativeElement.textContent.trim();

        beforeEach(() => {
            fixture.detectChanges();
            getMenuTriggerElement().click();
            menu = getOpenedMenuElement().nativeElement;
        });

        it('should have adf-compact-breadcrumb-menu-full-width class when fullWidth is true', () => {
            fixture.componentRef.setInput('fullWidth', true);
            fixture.detectChanges();

            expect(getFullWidthMenuElement()).not.toBeNull();
        });

        it('should not have adf-compact-breadcrumb-menu-full-width class when fullWidth is false', () => {
            fixture.componentRef.setInput('fullWidth', false);
            fixture.detectChanges();

            expect(getFullWidthMenuElement()).toBeNull();
        });

        it('should be closed when mouseleave is triggered', async () => {
            menu.dispatchEvent(new MouseEvent('mouseleave'));
            fixture.detectChanges();
            await wait(600);
            fixture.detectChanges();
            expect(getOpenedMenuElement()).toBeNull();
        });

        it('should be open when mouseleave is triggered but before timer ends mouseenter is triggered', async () => {
            menu.dispatchEvent(new MouseEvent('mouseleave'));
            fixture.detectChanges();
            menu.dispatchEvent(new MouseEvent('mouseenter'));
            await wait(600);
            fixture.detectChanges();
            expect(getOpenedMenuElement()).not.toBeNull();
        });

        it('should have correct description when DragDropStateService dragging is true', () => {
            dragDropStateService.dragging.set(true);

            fixture.detectChanges();
            expect(getTitle()).toBe('BREADCRUMB.COMPACT_MENU.DESCRIPTION_WHEN_DRAGGING');
        });

        it('should have correct description when DragDropStateService dragging is false', () => {
            dragDropStateService.dragging.set(false);

            fixture.detectChanges();
            expect(getTitle()).toBe('BREADCRUMB.COMPACT_MENU.DESCRIPTION_NO_DRAGGING');
        });

        it('should have correct footer when DragDropStateService dragging is true', () => {
            dragDropStateService.dragging.set(true);

            fixture.detectChanges();
            expect(getFooter()).toBe('shortcut BREADCRUMB.COMPACT_MENU.PRESS_ESC_TO_CLOSE_HINT_WHEN_DRAGGING');
        });

        it('should have correct footer when DragDropStateService dragging is false', () => {
            dragDropStateService.dragging.set(false);

            fixture.detectChanges();
            expect(getFooter()).toBe('shortcut BREADCRUMB.COMPACT_MENU.PRESS_ESC_TO_CLOSE_HINT_WHEN_NO_DRAGGING');
        });

        describe('Navigation list', () => {
            const getNavList = (): DebugElement => unitTestingUtils.getByDirective(MatNavList);

            const isTrapFocusEnabled = (): boolean => getNavList().injector.get(CdkTrapFocus).enabled;

            const getDropList = (): CdkDropList => getNavList().injector.get(CdkDropList);

            it('should have cdkScrollable directive', () => {
                expect(getNavList().injector.get(CdkScrollable)).not.toBeNull();
            });

            it('should have assigned cdkTrapFocus to true if menu is open', () => {
                fixture.detectChanges();
                expect(isTrapFocusEnabled()).toBeTrue();
            });

            it('should have assigned cdkTrapFocus to false if menu is closed', () => {
                getMenuTriggerElement().click();

                expect(isTrapFocusEnabled()).toBeFalse();
            });

            it('should have assigned cdkDropListSortingDisabled to true', () => {
                expect(getDropList().sortingDisabled).toBeTrue();
            });

            describe('List items', () => {
                let listItems: MatNavListItemHarness[];
                let listItemsElements: TestElement[];
                let nodes: PathElement[];

                const getItemMetas = (): DebugElement[] =>
                    unitTestingUtils.getAllByCSS('.adf-compact-breadcrumb-menu-list-item .adf-compact-breadcrumb-menu-list-item-meta');

                beforeEach(async () => {
                    nodes = [
                        {
                            id: 'id0',
                            name: 'node0',
                            nodeType: 'st:site'
                        },
                        {
                            id: 'id1',
                            name: 'node1',
                            nodeType: 'st:site'
                        },
                        {
                            id: 'id2',
                            name: 'node2'
                        },
                        {
                            id: 'id3',
                            name: 'node3'
                        }
                    ];
                    fixture.componentRef.setInput('nodes', nodes);
                    fixture.detectChanges();
                    listItems = await loader.getAllHarnesses(MatNavListItemHarness);
                    listItemsElements = await Promise.all(listItems.map(async (item) => item.host()));
                });

                it('should render item for each node', () => {
                    expect(listItems.length).toBe(4);
                });

                it('should be enabled if node is not site container and is not last', async () => {
                    for (let i = 0; i < listItems.length; i++) {
                        expect(await listItems[i].isDisabled()).toBe(i === 0 || i === 3);
                    }
                });

                it('should not have adf-compact-breadcrumb-menu-list-item-disabled class if node is not site container and is not last', async () => {
                    for (let i = 0; i < listItemsElements.length; i++) {
                        expect(await listItemsElements[i].hasClass('adf-compact-breadcrumb-menu-list-item-disabled')).toBe(i === 0 || i === 3);
                    }
                });

                it('should set cdkDropListData for NavList if mouseenter is triggered', async () => {
                    await listItemsElements[1].dispatchEvent('mouseenter');
                    expect(getDropList().data).toEqual(nodes[1]);
                });

                it('should set DragDropStateService hoveredDropName if mouseenter is triggered and route is enabled', async () => {
                    const nameBefore = dragDropStateService.hoveredDropName();

                    await listItemsElements[1].dispatchEvent('mouseenter');
                    expect(dragDropStateService.hoveredDropName()).not.toEqual(nameBefore);
                    expect(dragDropStateService.hoveredDropName()).toEqual('node1');
                });

                it('should not set DragDropStateService hoveredDropName if mouseenter is triggered but route is disabled', async () => {
                    const nameBefore = dragDropStateService.hoveredDropName();

                    await listItemsElements[0].dispatchEvent('mouseenter');
                    expect(dragDropStateService.hoveredDropName()).toBe(nameBefore);
                    expect(dragDropStateService.hoveredDropName()).toBe('');
                });

                it('should set cdkDropListData for NavList to null if mouseleave is triggered', async () => {
                    const element = listItemsElements[1];
                    await element.dispatchEvent('mouseenter');

                    await element.dispatchEvent('mouseleave');
                    expect(getDropList().data).toBeNull();
                });

                it('should emit navigate if click is triggered and route is enabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[1].dispatchEvent('click');
                    expect(component.navigate.emit).toHaveBeenCalledWith(nodes[1]);
                });

                it('should not emit navigate if click is triggered and route is enabled but DragDropStateService dragging is true', async () => {
                    spyOn(component.navigate, 'emit');
                    dragDropStateService.dragging.set(true);

                    await listItemsElements[1].dispatchEvent('click');
                    expect(component.navigate.emit).not.toHaveBeenCalled();
                });

                it('should not emit navigate if click is triggered but route is disabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[0].dispatchEvent('click');
                    expect(component.navigate.emit).not.toHaveBeenCalled();
                });

                it('should close menu if click is triggered and route is enabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[1].dispatchEvent('click');
                    expect(getOpenedMenuElement()).toBeNull();
                });

                it('should not close menu if click is triggered and route is enabled but DragDropStateService dragging is true', async () => {
                    spyOn(component.navigate, 'emit');
                    dragDropStateService.dragging.set(true);

                    await listItemsElements[1].dispatchEvent('click');
                    expect(getOpenedMenuElement()).not.toBeNull();
                });

                it('should not close menu if click is triggered but route is disabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[0].dispatchEvent('click');
                    expect(getOpenedMenuElement()).not.toBeNull();
                });

                it('should emit navigate if keydown for enter is triggered and route is enabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[1].dispatchEvent('keydown', { key: 'Enter' });
                    expect(component.navigate.emit).toHaveBeenCalledWith(nodes[1]);
                });

                it('should not emit navigate if keydown for enter is triggered and route is enabled but DragDropStateService dragging is true', async () => {
                    spyOn(component.navigate, 'emit');
                    dragDropStateService.dragging.set(true);

                    await listItemsElements[1].dispatchEvent('keydown', { key: 'Enter' });
                    expect(component.navigate.emit).not.toHaveBeenCalled();
                });

                it('should not emit navigate if keydown for enter is triggered but route is disabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[0].dispatchEvent('keydown', { key: 'Enter' });
                    expect(component.navigate.emit).not.toHaveBeenCalled();
                });

                it('should close menu if keydown for enter is triggered and route is enabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[1].dispatchEvent('keydown', { key: 'Enter' });
                    expect(getOpenedMenuElement()).toBeNull();
                });

                it('should not close menu if keydown for enter is triggered and route is enabled but DragDropStateService dragging is true', async () => {
                    spyOn(component.navigate, 'emit');
                    dragDropStateService.dragging.set(true);

                    await listItemsElements[1].dispatchEvent('keydown', { key: 'Enter' });
                    expect(getOpenedMenuElement()).not.toBeNull();
                });

                it('should not close menu if keydown for enter is triggered but route is disabled', async () => {
                    spyOn(component.navigate, 'emit');

                    await listItemsElements[0].dispatchEvent('keydown', { key: 'Enter' });
                    expect(getOpenedMenuElement()).not.toBeNull();
                });

                it('should have correct text for each item', () => {
                    const anchors = unitTestingUtils.getAllByCSS('.adf-compact-breadcrumb-menu-list-item-anchor');
                    for (let i = 0; i < 4; i++) {
                        expect(anchors[i].nativeElement.textContent.trim()).toBe(nodes[i].name);
                    }
                });

                it('should have correct description for each item', () => {
                    const descriptionElements = unitTestingUtils.getAllByCSS(
                        '.adf-compact-breadcrumb-menu-list-item .adf-compact-breadcrumb-menu-description'
                    );
                    expect(descriptionElements[0].nativeElement.textContent.trim()).toBe('BREADCRUMB.COMPACT_MENU.LIBRARY_CONTAINER_LEVEL');
                    expect(descriptionElements[1].nativeElement.textContent.trim()).toBe('BREADCRUMB.COMPACT_MENU.FIRST_LEVEL_LIBRARY');
                    expect(descriptionElements[2].nativeElement.textContent.trim()).toBe('BREADCRUMB.COMPACT_MENU.NOT_FIRST_LEVEL');
                    expect(descriptionElements[3].nativeElement.textContent.trim()).toBe('BREADCRUMB.COMPACT_MENU.CURRENT_LEVEL');
                });

                it('should have rendered correct icon', async () => {
                    dragDropStateService.dragging.set(true);
                    await listItemsElements[1].dispatchEvent('mouseenter');

                    const itemMetas = getItemMetas();
                    expect(itemMetas[0].nativeElement.textContent.trim()).toBe(
                        'do_not_disturb  BREADCRUMB.COMPACT_MENU.LIBRARY_CONTAINER_LEVEL_ICON_LABEL'
                    );
                    expect(itemMetas[1].nativeElement.textContent.trim()).toBe('check_circle  BREADCRUMB.COMPACT_MENU.DROP_HINT');
                    expect(itemMetas[2].nativeElement.textContent.trim()).toBe('');
                    expect(itemMetas[3].nativeElement.textContent.trim()).toBe('location_on  BREADCRUMB.COMPACT_MENU.CURRENT_LEVEL_ICON_LABEL');
                });

                it('should have not rendered icon for hovered item if DragDropStateService dragging is false even if there is hovered item', async () => {
                    dragDropStateService.dragging.set(false);
                    await listItemsElements[1].dispatchEvent('mouseenter');

                    expect(getItemMetas()[1].nativeElement.textContent.trim()).toBe('');
                });

                it('should have not rendered icon for hovered item if DragDropStateService dragging is true and there is no hovered item', async () => {
                    dragDropStateService.dragging.set(true);

                    expect(getItemMetas()[1].nativeElement.textContent.trim()).toBe('');
                });
            });
        });
    });
});
