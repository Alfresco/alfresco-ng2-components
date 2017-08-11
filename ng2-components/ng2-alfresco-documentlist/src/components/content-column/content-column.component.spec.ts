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

import { DocumentListServiceMock } from './../../assets/document-list.service.mock';
import { DocumentListComponent } from './../document-list.component';
import { ContentColumnListComponent } from './content-column-list.component';
import { ContentColumnComponent } from './content-column.component';

describe('ContentColumn', () => {

    let documentList: DocumentListComponent;
    let columnList: ContentColumnListComponent;

    beforeEach(() => {
        let service = new DocumentListServiceMock();
        documentList = new DocumentListComponent(service, null, null);
        columnList = new ContentColumnListComponent(documentList);

        documentList.ngOnInit();
    });

    it('should register model within parent column list', () => {
        spyOn(columnList, 'registerColumn').and.callThrough();

        let column = new ContentColumnComponent(columnList);
        column.ngAfterContentInit();

        expect(columnList.registerColumn).toHaveBeenCalled();

        let columns = documentList.data.getColumns();
        expect(columns.length).toBe(1);
        expect(columns[0]).toBe(column);
    });

    it('should setup screen reader title for thumbnail column', () => {
        let column = new ContentColumnComponent(columnList);
        column.key = '$thumbnail';
        column.ngOnInit();

        expect(column.srTitle).toBe('Thumbnail');
    });

    it('should register on init', () => {
        let column = new ContentColumnComponent(columnList);
        spyOn(column, 'register').and.callThrough();

        column.ngAfterContentInit();
        expect(column.register).toHaveBeenCalled();
    });

    it('should require action list to register action with', () => {
        let column = new ContentColumnComponent(columnList);
        expect(column.register()).toBeTruthy();

        column = new ContentColumnComponent(null);
        expect(column.register()).toBeFalsy();
    });

});
