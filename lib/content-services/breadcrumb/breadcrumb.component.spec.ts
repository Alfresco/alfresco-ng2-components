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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PathElementEntity } from 'alfresco-js-api';
import { setupTestBed } from '@alfresco/adf-core';
import { fakeNodeWithCreatePermission } from '../mock';
import { DocumentListComponent } from '../document-list';
import { BreadcrumbComponent } from './breadcrumb.component';
import { ContentTestingModule } from '../testing/content.testing.module';

describe('Breadcrumb', () => {

    let component: BreadcrumbComponent;
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let documentList: DocumentListComponent;

    setupTestBed({
        imports: [ContentTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BreadcrumbComponent);
        component = fixture.componentInstance;
        documentList = TestBed.createComponent<DocumentListComponent>(DocumentListComponent).componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should prevent default click behavior', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);
        component.onRoutePathClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should root be present as default node if the path is null', () => {
        let change = new SimpleChange(null, fakeNodeWithCreatePermission, true);

        component.root = 'default';
        component.ngOnChanges({ 'folderNode': change });

        expect(component.route[0].name).toBe('default');
    });

    it('should emit navigation event', (done) => {
        let node = <PathElementEntity> { id: '-id-', name: 'name' };
        component.navigate.subscribe(val => {
            expect(val).toBe(node);
            done();
        });

        component.onRoutePathClick(node, null);
    });

    it('should update document list on click', (done) => {
        spyOn(documentList, 'loadFolderByNodeId').and.stub();

        let node = <PathElementEntity> { id: '-id-', name: 'name' };
        component.target = documentList;

        component.onRoutePathClick(node, null);
        setTimeout(() => {
            expect(documentList.loadFolderByNodeId).toHaveBeenCalledWith(node.id);
            done();
        }, 0);
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
                elements: [
                    { id: 'element-id', name: 'element-name' }
                ]
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
        component.transform = ((transformNode) => {
            transformNode.id = 'test-id';
            transformNode.name = 'test-name';
            return transformNode;
        });
        let change = new SimpleChange(null, node, true);
        component.ngOnChanges({ 'folderNode': change });
        expect(component.route.length).toBe(4);
        expect(component.route[3].id).toBe('test-id');
        expect(component.route[3].name).toBe('test-name');
    });
});
