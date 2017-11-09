"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var document_list_component_mock_1 = require("../../assets/document-list.component.mock");
var material_module_1 = require("../../../material.module");
var document_list_service_1 = require("../../services/document-list.service");
var document_list_component_1 = require("../document-list.component");
var breadcrumb_component_1 = require("./breadcrumb.component");
describe('Breadcrumb', function () {
    var component;
    var fixture;
    var element;
    var documentList;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                ng2_alfresco_datatable_1.DataTableModule,
                material_module_1.MaterialModule
            ],
            declarations: [
                document_list_component_1.DocumentListComponent,
                breadcrumb_component_1.BreadcrumbComponent
            ],
            providers: [
                document_list_service_1.DocumentListService
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(breadcrumb_component_1.BreadcrumbComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        documentList = testing_1.TestBed.createComponent(document_list_component_1.DocumentListComponent).componentInstance;
    });
    it('should prevent default click behavior', function () {
        var event = jasmine.createSpyObj('event', ['preventDefault']);
        component.onRoutePathClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });
    it('should root be present as default node if the path is null', function () {
        var change = new core_1.SimpleChange(null, document_list_component_mock_1.fakeNodeWithCreatePermission, true);
        component.root = 'default';
        component.ngOnChanges({ 'folderNode': change });
        expect(component.route[0].name).toBe('default');
    });
    it('should emit navigation event', function (done) {
        var node = { id: '-id-', name: 'name' };
        component.navigate.subscribe(function (val) {
            expect(val).toBe(node);
            done();
        });
        component.onRoutePathClick(node, null);
    });
    it('should update document list on click', function (done) {
        spyOn(documentList, 'loadFolderByNodeId').and.stub();
        var node = { id: '-id-', name: 'name' };
        component.target = documentList;
        component.onRoutePathClick(node, null);
        setTimeout(function () {
            expect(documentList.loadFolderByNodeId).toHaveBeenCalledWith(node.id);
            done();
        }, 0);
    });
    it('should not parse the route when node not provided', function () {
        expect(component.parseRoute(null)).toEqual([]);
    });
    it('should not parase the route when node has no path', function () {
        var node = {};
        expect(component.parseRoute(node)).toEqual([]);
    });
    it('should append the node to the route', function () {
        var node = {
            id: 'test-id',
            name: 'test-name',
            path: {
                elements: [
                    { id: 'element-id', name: 'element-name' }
                ]
            }
        };
        var route = component.parseRoute(node);
        expect(route.length).toBe(2);
        expect(route[1].id).toBe(node.id);
        expect(route[1].name).toBe(node.name);
    });
    it('should trim the route if custom root id provided', function () {
        var node = {
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
        var route = component.parseRoute(node);
        expect(route.length).toBe(3);
        expect(route[0].id).toBe('element-2-id');
        expect(route[0].name).toBe('element-2-name');
        expect(route[2].id).toBe(node.id);
        expect(route[2].name).toBe(node.name);
    });
    it('should rename root node if custom name provided', function () {
        var node = {
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
        var route = component.parseRoute(node);
        expect(route.length).toBe(4);
        expect(route[0].id).toBe('element-1-id');
        expect(route[0].name).toBe('custom root');
    });
    it('should replace root id if nothing to trim in the path', function () {
        var node = {
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
        var route = component.parseRoute(node);
        expect(route.length).toBe(4);
        expect(route[0].id).toBe('custom-id');
        expect(route[0].name).toBe('element-1-name');
    });
    it('should replace both id and name of the root element', function () {
        var node = {
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
        var route = component.parseRoute(node);
        expect(route.length).toBe(4);
        expect(route[0].id).toBe('custom-id');
        expect(route[0].name).toBe('custom-name');
    });
});
