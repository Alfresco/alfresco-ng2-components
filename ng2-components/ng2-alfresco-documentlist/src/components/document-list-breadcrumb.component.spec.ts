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

import {
    it,
    describe,
    beforeEach,
    expect
} from '@angular/core/testing';

import {
    DocumentListBreadcrumb,
    PathNode
} from './document-list-breadcrumb.component';
import { DocumentList } from './document-list';

describe('DocumentListBreadcrumb', () => {

    let component;

    beforeEach(() => {
        component = new DocumentListBreadcrumb();
    });

    it('should set current path', () => {
        let path = '/some/path';
        component.currentFolderPath = path;
        expect(component.currentFolderPath).toBe(path);
    });

    it('should init with root folder by default', () => {
        expect(component.route.length).toBe(1);
        expect(component.route[0]).toEqual(
            jasmine.objectContaining({
                name: 'Root',
                path: '/'
            })
        );
    });

    it('should fallback to default root for invalid path', () => {
        component.currentFolderPath = null;
        expect(component.currentFolderPath).toBe('/');

        expect(component.route.length).toBe(1);
        expect(component.route[0]).toEqual(
            jasmine.objectContaining({
                name: 'Root',
                path: '/'
            })
        );
    });

    it('should parse the route', () => {
        component.currentFolderPath = '/some/path';

        expect(component.route.length).toBe(3);
        expect(component.route).toEqual(
            jasmine.objectContaining([
                { name: 'Root', path: '/' },
                { name: 'some', path: '/some' },
                { name: 'path', path: '/some/path' }
            ])
        );
    });

    it('should prevent default click behavior', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);
        component.onRoutePathClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should emit navigation event', (done) => {
        let node = <PathNode> { name: 'name', path: '/path' };
        component.navigate.subscribe(val => {
            expect(val.value.name).toBe(node.name);
            expect(val.value.path).toBe(node.path);
            done();
        });

        component.onRoutePathClick(node, null);
    });

    it('should update document list on click', () => {
        let documentList = new DocumentList(null, null, null);
        spyOn(documentList, 'displayFolderContent').and.stub();

        let node = <PathNode> { name: 'name', path: '/path' };
        component.target = documentList;

        component.onRoutePathClick(node, null);
        expect(documentList.currentFolderPath).toBe(node.path);
    });

    it('should do nothing for same path', () => {
        let called = 0;

        component.pathChanged.subscribe(() => called++);

        component.currentFolderPath = '/';
        component.currentFolderPath = '/';

        expect(called).toBe(0);
    });

    it('should emit path changed event', (done) => {
        let path = '/some/path';

        component.pathChanged.subscribe(e => {
            expect(e.value).toBe(path);
            expect(e.route).toBe(component.route);
            done();
        });

        component.currentFolderPath = path;
    });

});
