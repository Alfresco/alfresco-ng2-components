/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectDataTableAdapter } from './../../data/object-datatable-adapter';
import { ObjectDataColumn } from './../../data/object-datacolumn.model';

import { LocationCellComponent } from './location-cell.component';
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreTestingModule } from '../../../testing/core.testing.module';

describe('LocationCellComponent', () => {
    let component: LocationCellComponent;
    let fixture: ComponentFixture<LocationCellComponent>;
    let dataTableAdapter: ObjectDataTableAdapter;
    let rowData;
    let columnData;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(LocationCellComponent);
        component = fixture.componentInstance;
    }));

    beforeEach(() => {
        rowData = {
            name: '1',
            path: {
                elements: [
                    { id: '1', name: 'path' },
                    { id: '2', name: 'to' },
                    { id: '3', name: 'location' }
                ],
                name: '/path/to/location'
            }
        };

        columnData = { format: '/somewhere', type: 'location', key: 'path'};

        dataTableAdapter = new ObjectDataTableAdapter(
            [rowData],
            [ new ObjectDataColumn(columnData) ]
        );

        component.link = [];
        component.column = dataTableAdapter.getColumns()[0];
        component.data = dataTableAdapter;
        component.row = dataTableAdapter.getRows()[0];
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should set tooltip', () => {
        fixture.detectChanges();

        expect(component.tooltip).toEqual(rowData.path.name);
    });

    it('should set router link', () => {
        fixture.detectChanges();

        expect(component.link).toEqual([ columnData.format , rowData.path.elements[2].id ]);
    });

    it('should not setup cell when path has no data', (done) => {
        rowData.path = {};

        fixture.detectChanges();

        expect(component.tooltip).toBeUndefined();
        expect(component.link).toEqual([]);
        component.value$.subscribe((value) => {
            expect(value).toBe('');
            done();
        });

    });

    it('should not setup cell when path is missing required properties', (done) => {
        rowData.path = { someProp: '' };

        fixture.detectChanges();

        expect(component.tooltip).toBeUndefined();
        expect(component.link).toEqual([]);

        component.value$.subscribe((value) => {
            expect(value).toBe('');
            done();
        });
    });

    it('should not setup cell when path data is missing one of the property', () => {
        rowData.path = {
            name: 'some-name'
        };

        let value = '';

        component.value$.subscribe((val) => {
            value = val;
        });

        fixture.detectChanges();

        expect(value).toBe('');
        expect(component.tooltip).toBeUndefined();
        expect(component.link).toEqual([]);

        rowData.path = {
            elements: []
        };

        fixture.detectChanges();

        expect(value).toBe('');
        expect(component.tooltip).toBeUndefined();
        expect(component.link).toEqual([]);
    });
});
