/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { ObjectDataColumn } from '../../data/object-datacolumn.model';
import { LocationCellComponent } from './location-cell.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LocationCellComponent', () => {
    let component: LocationCellComponent;
    let fixture: ComponentFixture<LocationCellComponent>;
    let dataTableAdapter: ObjectDataTableAdapter;
    let rowData: any;
    let columnData: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, LocationCellComponent]
        });
        fixture = TestBed.createComponent(LocationCellComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        rowData = {
            name: '1',
            path: {
                elements: [
                    { id: '1', name: 'User files', nodeType: 'folder' },
                    { id: '2', name: 'Favorite', nodeType: 'folder' },
                    { id: '3', name: 'Movies', nodeType: 'folder' }
                ],
                name: '/User files/Favorite/Movies'
            }
        };

        columnData = { format: '/files', type: 'location', key: 'path' };

        dataTableAdapter = new ObjectDataTableAdapter([rowData], [new ObjectDataColumn(columnData)]);

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

        expect(component.link).toEqual([columnData.format, rowData.path.elements[2].id]);
    });

    it('should NOT set router link when format NOT provided', () => {
        component.column.format = undefined;
        fixture.detectChanges();

        expect(component.link).toEqual([]);
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
