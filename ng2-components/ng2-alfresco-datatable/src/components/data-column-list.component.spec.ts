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

import { DataTableComponent } from './datatable.component';
import { AlfrescoServiceMock } from '../assets/alfresco.service.mock';
import { DataColumnListComponent } from './data-column-list.component';
import { DataColumnModel } from '../models/data-column.model';

describe('ContentColumnList', () => {

    let dataTable: DataTableComponent;
    let dataColumnList: DataColumnListComponent;

    beforeEach(() => {
        let alfrescoServiceMock = new AlfrescoServiceMock();
        dataTable = new DataTableComponent(alfrescoServiceMock);
        dataColumnList = new DataColumnListComponent(dataTable);
    });

    it('should register column within parent document list', () => {
        expect(dataTable.columns.length).toBe(0);

        dataColumnList.registerColumn(new DataColumnModel());

        expect(dataTable.columns.length).toBe(1);
    });

});
