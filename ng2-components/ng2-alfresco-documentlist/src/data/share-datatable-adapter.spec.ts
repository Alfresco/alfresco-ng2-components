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
    expect
} from '@angular/core/testing';
import { DataColumn, DataRow } from 'ng2-alfresco-datatable';
import { ShareDataTableAdapter } from './share-datatable-adapter';

describe('ShareDataTableAdapter', () => {

    it('should setup rows and columns with constructor', () => {
        let schema = [<DataColumn> {}];
        let adapter = new ShareDataTableAdapter(null, null, schema);

        expect(adapter.getRows()).toEqual([]);
        expect(adapter.getColumns()).toEqual(schema);
    });

    it('should setup columns when constructor is missing schema', () => {
        let adapter = new ShareDataTableAdapter(null, null, null);

        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new columns', () => {
        let columns = [<DataColumn> {}, <DataColumn> {}];
        let adapter = new ShareDataTableAdapter(null, null, null);
        adapter.setColumns(columns);
        expect(adapter.getColumns()).toEqual(columns);
    });

    it('should reset columns', () => {
        let columns = [<DataColumn> {}, <DataColumn> {}];
        let adapter = new ShareDataTableAdapter(null, null, columns);

        expect(adapter.getColumns()).toEqual(columns);
        adapter.setColumns(null);
        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new rows', () => {
        let rows = [<DataRow> {}, <DataRow> {}];
        let adapter = new ShareDataTableAdapter(null, null, null);

        expect(adapter.getRows()).toEqual([]);
        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);
    });

    it('should reset rows', () => {
        let rows = [<DataRow> {}, <DataRow> {}];
        let adapter = new ShareDataTableAdapter(null, null, null);

        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);

        adapter.setRows(null);
        expect(adapter.getRows()).toEqual([]);
    });

    it('should sort new rows', () => {
        let adapter = new ShareDataTableAdapter(null, null, null);
        spyOn(adapter, 'sort').and.callThrough();

        let rows = [<DataRow> {}];
        adapter.setRows(rows);

        expect(adapter.sort).toHaveBeenCalled();
    });

});
