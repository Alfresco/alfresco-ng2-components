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

import { PathElementEntity } from 'alfresco-js-api';
import { DocumentListBreadcrumb } from './breadcrumb.component';
import { DocumentList } from '../document-list';

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

    it('should prevent default click behavior', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);
        component.onRoutePathClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should emit navigation event', (done) => {
        let node = <PathElementEntity> { id: '-id-', name: 'name' };
        component.navigate.subscribe(val => {
            expect(val.value).toBe(node);
            done();
        });

        component.onRoutePathClick(node, null);
    });

    it('should update document list on click', (done) => {
        let documentList = new DocumentList(null, null, null);
        spyOn(documentList, 'loadFolderByNodeId').and.stub();

        let node = <PathElementEntity> { id: '-id-', name: 'name' };
        component.target = documentList;

        component.onRoutePathClick(node, null);
        setTimeout(() => {
            expect(documentList.loadFolderByNodeId).toHaveBeenCalledWith(node.id);
            done();
        }, 0);
    });

});
