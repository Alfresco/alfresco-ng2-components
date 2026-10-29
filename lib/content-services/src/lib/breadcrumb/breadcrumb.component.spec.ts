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
import { Node, PathElement } from '@alfresco/js-api';
import { fakeNodeWithCreatePermission } from '../mock';
import { DocumentListComponent, DocumentListService } from '../document-list';
import { BreadcrumbComponent } from './breadcrumb.component';
import { of } from 'rxjs';
import { DataRow, DragDropStateService, NoopAuthModule, UnitTestingUtils } from '@alfresco/adf-core';
import { DebugElement, SimpleChange } from '@angular/core';
import { CdkTrapFocus, LiveAnnouncer } from '@angular/cdk/a11y';
import { TranslateService } from '@ngx-translate/core';
import { CompactBreadcrumbComponent } from './compact-breadcrumb.component';
import { By } from '@angular/platform-browser';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

describe('Breadcrumb', () => {
    let component: BreadcrumbComponent;
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let documentListService: DocumentListService = jasmine.createSpyObj({
        loadFolderByNodeId: of(''),
        isCustomSourceService: false
    });
    let documentListComponent: DocumentListComponent;
    let liveAnnouncer: LiveAnnouncer;
    let translateService: TranslateService;
    let unitTestingUtils: UnitTestingUtils;

    const breadcrumbItemCurrent = '.adf-breadcrumb-item-current';

    const getBreadcrumbActionText = (): string => fixture.debugElement.nativeElement.querySelector(breadcrumbItemCurrent).textContent.trim();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule],
            providers: [{ provide: DocumentListService, useValue: documentListService }]
        });
        fixture = TestBed.createComponent(BreadcrumbComponent);
        component = fixture.componentInstance;
        documentListComponent = TestBed.createComponent<DocumentListComponent>(DocumentListComponent).componentInstance;
        documentListService = TestBed.inject(DocumentListService);
        liveAnnouncer = TestBed.inject(LiveAnnouncer);
        translateService = TestBed.inject(TranslateService);
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should prevent default click behavior', () => {
        const event = jasmine.createSpyObj('event', ['preventDefault']);
        event.type = 'click';
        component.onRoutePathClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should root be present as default node if the path is null', () => {
        component.root = 'default';
        component.folderNode = fakeNodeWithCreatePermission;
        component.ngOnChanges({});

        expect(component.route[0].name).toBe('default');
    });

    it('should emit navigation event', (done) => {
        const node = { id: '-id-', name: 'name' };
        component.navigate.subscribe((val) => {
            expect(val).toBe(node);
            done();
        });

        component.onRoutePathClick(node, null);
    });

    describe('target', () => {
        let folderNode: Node;

        beforeEach(() => {
            folderNode = {
                id: 'folder2',
                name: 'folder 2',
                nodeType: 'cm:folder',
                isFolder: true,
                isFile: false,
                modifiedAt: null,
                modifiedByUser: null,
                createdAt: null,
                createdByUser: null,
                path: {
                    elements: [
                        {
                            id: '-root-',
                            name: 'root'
                        },
                        {
                            id: 'folder1',
                            name: 'folder 1'
                        }
                    ]
                }
            };
        });

        it('should update document list on click', () => {
            const node = { id: '-id-', name: 'name' };
            component.target = documentListComponent;

            component.onRoutePathClick(node, null);

            expect(documentListService.loadFolderByNodeId).toHaveBeenCalledWith(
                node.id,
                documentListComponent.DEFAULT_PAGINATION,
                documentListComponent.includeFields,
                documentListComponent.where,
                documentListComponent.orderBy,
                undefined
            );
        });

        it('should update document list with filters param for recent files when filters are provided', () => {
            const node = { id: '-id-', name: 'name' };
            component.target = documentListComponent;
            documentListComponent.filters = ['filter1', 'filter2'];

            component.onRoutePathClick(node, null);

            expect(documentListService.loadFolderByNodeId).toHaveBeenCalledWith(
                node.id,
                documentListComponent.DEFAULT_PAGINATION,
                documentListComponent.includeFields,
                documentListComponent.where,
                documentListComponent.orderBy,
                documentListComponent.filters
            );
        });

        it('should build the path based on the document list node', () => {
            component.target = documentListComponent;
            component.ngOnInit();

            documentListComponent.$folderNode.next(folderNode);

            expect(component.route.length).toBe(3);
            expect(component.route[0].id).toBe('-root-');
            expect(component.route[1].id).toBe('folder1');
            expect(component.route[2].id).toBe('folder2');
        });

        it('should navigate to root folder', () => {
            spyOn(documentListComponent, 'navigateTo').and.stub();

            component.target = documentListComponent;
            component.ngOnInit();

            documentListComponent.$folderNode.next(folderNode);
            component.onRoutePathClick(component.route[0]);

            expect(documentListComponent.navigateTo).toHaveBeenCalledWith('-root-');
        });

        it('should navigate to parent folder', () => {
            spyOn(documentListComponent, 'navigateTo').and.stub();

            component.target = documentListComponent;
            component.ngOnInit();

            documentListComponent.$folderNode.next(folderNode);
            component.onRoutePathClick(component.route[component.route.length - 2]);

            expect(documentListComponent.navigateTo).toHaveBeenCalledWith('folder1');
        });

        it('should not navigate if component is read-only', () => {
            spyOn(documentListComponent, 'navigateTo').and.stub();

            component.target = documentListComponent;
            component.readOnly = true;
            component.ngOnInit();

            documentListComponent.$folderNode.next(folderNode);
            component.onRoutePathClick(component.route[0]);

            expect(documentListComponent.navigateTo).not.toHaveBeenCalled();
        });
    });

    it('should announce heading role for the current breadcrumb item', () => {
        const mockFolderNode = {
            id: 'test-id',
            name: 'test-name',
            path: {
                elements: [{ id: 'element-1-id', name: 'element-1-name' }]
            }
        } as Node;
        component.folderNode = mockFolderNode;
        component.ngOnChanges({});
        fixture.detectChanges();

        const titleElement = unitTestingUtils.getByCSS(breadcrumbItemCurrent);
        expect(titleElement.nativeElement.tagName).toBe('H1');
    });

    it('should not parse the route when node not provided', () => {
        expect(component.parseRoute(null)).toEqual([]);
    });

    it('should not parse the route when node has no path', () => {
        const node: any = {};
        expect(component.parseRoute(node)).toEqual([]);
    });

    it('should append the node to the route', () => {
        const node: any = {
            id: 'test-id',
            name: 'test-name',
            path: {
                elements: [{ id: 'element-id', name: 'element-name' }]
            }
        };
        const route = component.parseRoute(node);

        expect(route.length).toBe(2);
        expect(route[1].id).toBe(node.id);
        expect(route[1].name).toBe(node.name);
    });

    it('should trim the route if custom root id provided', () => {
        const node: any = {
            id: 'test-id',
            name: 'test-name',
            path: {
                elements: [
                    { id: 'element-1-id', name: 'element-1-name' },
                    { id: 'element-2-id', name: 'element-2-name' },
                    { id: 'element-3-id', name: 'element-3-name' }
                ]
            }
        };
        component.rootId = 'element-2-id';
        const route = component.parseRoute(node);

        expect(route.length).toBe(3);

        expect(route[0].id).toBe('element-2-id');
        expect(route[0].name).toBe('element-2-name');

        expect(route[2].id).toBe(node.id);
        expect(route[2].name).toBe(node.name);
    });

    it('should rename root node if custom name provided', () => {
        const node: any = {
            id: 'test-id',
            name: 'test-name',
            path: {
                elements: [
                    { id: 'element-1-id', name: 'element-1-name' },
                    { id: 'element-2-id', name: 'element-2-name' },
                    { id: 'element-3-id', name: 'element-3-name' }
                ]
            }
        };
        component.root = 'custom root';
        const route = component.parseRoute(node);

        expect(route.length).toBe(4);
        expect(route[0].id).toBe('element-1-id');
        expect(route[0].name).toBe('custom root');
    });

    it('should replace root id if nothing to trim in the path', () => {
        const node: any = {
            id: 'test-id',
            name: 'test-name',
            path: {
                elements: [
                    { id: 'element-1-id', name: 'element-1-name' },
                    { id: 'element-2-id', name: 'element-2-name' },
                    { id: 'element-3-id', name: 'element-3-name' }
                ]
            }
        };
        component.rootId = 'custom-id';
        const route = component.parseRoute(node);

        expect(route.length).toBe(4);
        expect(route[0].id).toBe('custom-id');
        expect(route[0].name).toBe('element-1-name');
    });

    it('should replace both id and name of the root element', () => {
        const node: any = {
            id: 'test-id',
            name: 'test-name',
            path: {
                elements: [
                    { id: 'element-1-id', name: 'element-1-name' },
                    { id: 'element-2-id', name: 'element-2-name' },
                    { id: 'element-3-id', name: 'element-3-name' }
                ]
            }
        };
        component.root = 'custom-name';
        component.rootId = 'custom-id';
        const route = component.parseRoute(node);

        expect(route.length).toBe(4);
        expect(route[0].id).toBe('custom-id');
        expect(route[0].name).toBe('custom-name');
    });

    it('should apply the transformation function when there is one', () => {
        const node: any = {
            id: null,
            name: null,
            path: {
                elements: [
                    { id: 'element-1-id', name: 'element-1-name' },
                    { id: 'element-2-id', name: 'element-2-name' },
                    { id: 'element-3-id', name: 'element-3-name' }
                ]
            }
        };
        component.transform = (transformNode) => {
            transformNode.id = 'test-id';
            transformNode.name = 'test-name';
            return transformNode;
        };
        component.folderNode = node;
        component.ngOnChanges({});
        expect(component.route.length).toBe(4);
        expect(component.route[3].id).toBe('test-id');
        expect(component.route[3].name).toBe('test-name');
    });

    it('should set title based on selectedRowItemsCount', () => {
        component.transform = (transformNode) => {
            transformNode.id = 'test-id';
            transformNode.name = 'test-name';
            return transformNode;
        };

        component.folderNode = {
            path: { elements: [{ id: 'element-1-id', name: 'element-1-name' }] }
        } as Node;

        component.ngOnChanges({});
        fixture.detectChanges();

        expect(getBreadcrumbActionText()).toEqual('test-name');

        component.selectedRowItemsCount = 2;
        fixture.detectChanges();

        expect(getBreadcrumbActionText()).toEqual('BREADCRUMB.HEADER.SELECTED');
    });

    it('should announce number of selected items when selectedRowItemsCount changes', () => {
        const change = new SimpleChange(null, 10, true);
        spyOn(liveAnnouncer, 'announce');
        spyOn(translateService, 'instant').and.callThrough();

        component.ngOnChanges({ selectedRowItemsCount: change });

        expect(translateService.instant).toHaveBeenCalledWith('BREADCRUMB.HEADER.SELECTED', { count: 10 });
        expect(liveAnnouncer.announce).toHaveBeenCalledWith('BREADCRUMB.HEADER.SELECTED');
    });

    describe('Compact mode', () => {
        let folderNode: Node;

        const getBreadcrumbItems = (): DebugElement[] => unitTestingUtils.getAllByCSS('.adf-breadcrumb-item');

        const getBreadcrumbContainerPathCompactModeElement = (): DebugElement =>
            unitTestingUtils.getByCSS('.adf-breadcrumb-container-path-compact-mode');

        beforeEach(() => {
            folderNode = {
                id: 'folder2',
                name: 'folder 2',
                nodeType: 'cm:folder',
                isFolder: true,
                isFile: false,
                path: {
                    elements: [
                        {
                            id: '-root-',
                            name: 'root'
                        },
                        {
                            id: 'folder0',
                            name: 'folder 0'
                        },
                        {
                            id: 'folder1',
                            name: 'folder 1'
                        }
                    ]
                }
            } as Node;
            component.target = documentListComponent;
            component.compactMode = true;
            fixture.detectChanges();

            documentListComponent.$folderNode.next(folderNode);
            fixture.detectChanges();
        });

        it('should display correct paths and compact breadcrumb in compact mode', () => {
            const items = getBreadcrumbItems();
            expect(items.length).toBe(3);
            expect(items[0].query(By.css('.adf-breadcrumb-item-anchor')).nativeElement.textContent.trim()).toBe('root');
            expect(items[1].query(By.directive(CompactBreadcrumbComponent))).not.toBeNull();
            expect(items[2].query(By.css(breadcrumbItemCurrent)).nativeElement.textContent.trim()).toBe('folder 2');
        });

        it('should display element with adf-breadcrumb-container-path-compact-mode class in compact mode', () => {
            expect(getBreadcrumbContainerPathCompactModeElement()).not.toBeNull();
        });

        it('should not display element with adf-breadcrumb-container-path-compact-mode class in not compact mode', () => {
            component.compactMode = false;

            fixture.detectChanges();
            expect(getBreadcrumbContainerPathCompactModeElement()).toBeNull();
        });

        describe('CompactBreadcrumb', () => {
            let compactBreadcrumbComponent: CompactBreadcrumbComponent;

            beforeEach(() => {
                compactBreadcrumbComponent = unitTestingUtils.getByDirective(CompactBreadcrumbComponent).componentInstance;
            });

            it('should have assigned correct nodes', () => {
                expect(compactBreadcrumbComponent.nodes()).toEqual([
                    {
                        node: folderNode.path.elements[0],
                        current: false,
                        libraryContainer: false,
                        description: 'BREADCRUMB.COMPACT_MENU.FIRST_LEVEL'
                    },
                    {
                        node: folderNode.path.elements[1],
                        current: false,
                        libraryContainer: false,
                        description: 'BREADCRUMB.COMPACT_MENU.NOT_FIRST_LEVEL'
                    },
                    {
                        node: folderNode.path.elements[2],
                        current: false,
                        libraryContainer: false,
                        description: 'BREADCRUMB.COMPACT_MENU.NOT_FIRST_LEVEL'
                    },
                    {
                        node: jasmine.objectContaining({
                            id: folderNode.id,
                            name: folderNode.name
                        }),
                        current: true,
                        libraryContainer: false,
                        description: 'BREADCRUMB.COMPACT_MENU.CURRENT_LEVEL'
                    }
                ]);
            });

            it('should emit dropped event on breadcrumbs when dropped event is emitted', () => {
                spyOn(component.dropped, 'emit');
                const event = {
                    item: {}
                } as CdkDragDrop<PathElement, PathElement, DataRow>;

                compactBreadcrumbComponent.dropped.emit(event);
                expect(component.dropped.emit).toHaveBeenCalledWith(event);
            });

            it('should emit navigate on breadcrumbs when navigate event is emitted', () => {
                spyOn(component.navigate, 'emit');
                const element = folderNode.path.elements[1];

                compactBreadcrumbComponent.navigate.emit(element);
                expect(component.navigate.emit).toHaveBeenCalledWith(element);
            });

            it('should have assigned fullWidth to true', () => {
                spyOnProperty(fixture.nativeElement, 'clientWidth').and.returnValue(361);

                fixture.detectChanges();
                expect(compactBreadcrumbComponent.fullWidth()).toBeTrue();
            });

            it('should have assigned fullWidth to false', () => {
                spyOnProperty(fixture.nativeElement, 'clientWidth').and.returnValue(362);

                fixture.detectChanges();
                expect(compactBreadcrumbComponent.fullWidth()).toBeFalse();
            });
        });

        describe('Drop', () => {
            let dropList: CdkDropList;
            let trapFocus: CdkTrapFocus;
            let dragDropStateService: DragDropStateService;

            beforeEach(() => {
                const injector = unitTestingUtils.getByCSS('#adf-breadcrumb-path').injector;
                dropList = injector.get(CdkDropList);
                trapFocus = injector.get(CdkTrapFocus);
                dragDropStateService = TestBed.inject(DragDropStateService);
            });

            it('should emit dropped event when cdkDropListDropped event is emitted, isPointerOverContainer is true and correct node is hovered', () => {
                spyOn(component.dropped, 'emit');
                getBreadcrumbItems()[0].nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
                const event = {
                    item: {},
                    isPointerOverContainer: true
                } as CdkDragDrop<PathElement, PathElement, DataRow>;

                dropList.dropped.emit(event);
                expect(component.dropped.emit).toHaveBeenCalledWith(event);
            });

            it('should not emit dropped event when cdkDropListDropped event is emitted, isPointerOverContainer is false and correct node is hovered', () => {
                spyOn(component.dropped, 'emit');
                getBreadcrumbItems()[0].nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

                dropList.dropped.emit({
                    item: {},
                    isPointerOverContainer: false
                } as CdkDragDrop<PathElement, PathElement, DataRow>);
                expect(component.dropped.emit).not.toHaveBeenCalled();
            });

            it('should not emit dropped event when cdkDropListDropped event is emitted, isPointerOverContainer is true and none node is hovered', () => {
                spyOn(component.dropped, 'emit');

                dropList.dropped.emit({
                    item: {},
                    isPointerOverContainer: true
                } as CdkDragDrop<PathElement, PathElement, DataRow>);
                expect(component.dropped.emit).not.toHaveBeenCalled();
            });

            it('should not emit dropped event when cdkDropListDropped event is emitted, isPointerOverContainer is true and hovered node is last node', () => {
                spyOn(component.dropped, 'emit');
                getBreadcrumbItems()[2].nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

                dropList.dropped.emit({
                    item: {},
                    isPointerOverContainer: true
                } as CdkDragDrop<PathElement, PathElement, DataRow>);
                expect(component.dropped.emit).not.toHaveBeenCalled();
            });

            it('should not emit dropped event when cdkDropListDropped event is emitted, isPointerOverContainer is true and hovered node is compact breadcrumb item', () => {
                spyOn(component.dropped, 'emit');
                getBreadcrumbItems()[1].nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

                dropList.dropped.emit({
                    item: {},
                    isPointerOverContainer: true
                } as CdkDragDrop<PathElement, PathElement, DataRow>);
                expect(component.dropped.emit).not.toHaveBeenCalled();
            });

            it('should have assigned hoveredItem to cdkDropListData', () => {
                getBreadcrumbItems()[0].nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

                fixture.detectChanges();
                expect(dropList.data).toBe(folderNode.path.elements[0]);
            });

            it('should have assigned cdkDropListSortingDisabled to true', () => {
                expect(dropList.sortingDisabled).toBeTrue();
            });

            it('should have assigned true to cdkTrapFocus if DragDropStateService has dragging set to true', () => {
                dragDropStateService.dragging.set(true);

                fixture.detectChanges();
                expect(trapFocus.enabled).toBeTrue();
            });

            it('should have assigned false to cdkTrapFocus if DragDropStateService has dragging set to false', () => {
                dragDropStateService.dragging.set(false);

                fixture.detectChanges();
                expect(trapFocus.enabled).toBeFalse();
            });
        });
    });
});
