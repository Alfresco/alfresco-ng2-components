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
"use strict";
var breadcrumb_component_1 = require("./breadcrumb.component");
var document_list_1 = require("../document-list");
describe('DocumentListBreadcrumb', function () {
    var component;
    beforeEach(function () {
        component = new breadcrumb_component_1.DocumentListBreadcrumb();
    });
    it('should set current path', function () {
        var path = '/some/path';
        component.currentFolderPath = path;
        expect(component.currentFolderPath).toBe(path);
    });
    it('should init with root folder by default', function () {
        expect(component.route.length).toBe(1);
        expect(component.route[0]).toEqual(jasmine.objectContaining({
            name: 'Root',
            path: '/'
        }));
    });
    it('should fallback to default root for invalid path', function () {
        component.currentFolderPath = null;
        expect(component.currentFolderPath).toBe('/');
        expect(component.route.length).toBe(1);
        expect(component.route[0]).toEqual(jasmine.objectContaining({
            name: 'Root',
            path: '/'
        }));
    });
    it('should parse the route', function () {
        component.currentFolderPath = '/some/path';
        expect(component.route.length).toBe(3);
        expect(component.route).toEqual(jasmine.objectContaining([
            { name: 'Root', path: '/' },
            { name: 'some', path: '/some' },
            { name: 'path', path: '/some/path' }
        ]));
    });
    it('should prevent default click behavior', function () {
        var event = jasmine.createSpyObj('event', ['preventDefault']);
        component.onRoutePathClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });
    it('should emit navigation event', function (done) {
        var node = { name: 'name', path: '/path' };
        component.navigate.subscribe(function (val) {
            expect(val.value.name).toBe(node.name);
            expect(val.value.path).toBe(node.path);
            done();
        });
        component.onRoutePathClick(node, null);
    });
    it('should update document list on click', function (done) {
        var documentList = new document_list_1.DocumentList(null, null, null);
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.resolve());
        var node = { name: 'name', path: '/path' };
        component.target = documentList;
        component.onRoutePathClick(node, null);
        setTimeout(function () {
            expect(documentList.currentFolderPath).toBe(node.path);
            done();
        }, 0);
    });
    it('should do nothing for same path', function () {
        var called = 0;
        component.pathChanged.subscribe(function () { return called++; });
        component.currentFolderPath = '/';
        component.currentFolderPath = '/';
        expect(called).toBe(0);
    });
    it('should emit path changed event', function (done) {
        var path = '/some/path';
        component.pathChanged.subscribe(function (e) {
            expect(e.value).toBe(path);
            expect(e.route).toBe(component.route);
            done();
        });
        component.currentFolderPath = path;
    });
});
//# sourceMappingURL=breadcrumb.component.spec.js.map