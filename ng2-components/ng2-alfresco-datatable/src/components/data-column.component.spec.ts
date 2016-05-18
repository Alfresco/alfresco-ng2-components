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
    expect,
    beforeEach
} from 'angular2/testing';

import {AlfrescoServiceMock} from '../assets/alfresco.service.mock';
import { DataTableComponent } from './datatable.component';
import { DataColumnComponent } from './data-column.component';
import { DataColumnListComponent } from './data-column-list.component';

describe('ContentColumn', () => {

    let dataTable: DataTableComponent;
    let columnList: DataColumnListComponent;

    beforeEach(() => {
        let alfrescoServiceMock = new AlfrescoServiceMock();
        dataTable = new DataTableComponent(alfrescoServiceMock);
        columnList = new DataColumnListComponent(dataTable);
    });

    it('should register model within parent column list', () => {
        spyOn(columnList, 'registerColumn').and.callThrough();

        let column = new DataColumnComponent(columnList);
        column.ngOnInit();

        expect(columnList.registerColumn).toHaveBeenCalled();
    });

    it('should setup model properties during registration', () => {

        let column = new DataColumnComponent(columnList);
        column.title = '<title>';
        column.srTitle = '<sr-title>';
        column.source = '<source>';
        column.cssClass = '<css-class>';
        column.ngOnInit();

        expect(dataTable.columns.length).toBe(1);

        let model = dataTable.columns[0];
        expect(model.title).toBe(column.title);
        expect(model.srTitle).toBe(column.srTitle);
        expect(model.source).toBe(column.source);
        expect(model.cssClass).toBe(column.cssClass);
    });

    it('should setup screen reader title for thumbnail column', () => {

        let column = new DataColumnComponent(columnList);
        column.source = '$thumbnail';
        column.ngOnInit();

        expect(dataTable.columns.length).toBe(1);

        let model = dataTable.columns[0];
        expect(model.srTitle).toBe('Thumbnail');
    });

});
