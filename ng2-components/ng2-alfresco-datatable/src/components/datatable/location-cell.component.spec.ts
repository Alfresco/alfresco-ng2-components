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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from 'ng2-alfresco-core';
import {
    ObjectDataColumn,
    ObjectDataTableAdapter
} from './../../data/index';
import { LocationCellComponent } from './location-cell.component';

describe('LocationCellComponent', () => {
    let component: LocationCellComponent;
    let fixture: ComponentFixture<LocationCellComponent>;
    let dataTableAdapter: ObjectDataTableAdapter;
    let rowData;
    let columnData;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                RouterTestingModule
            ],
            declarations: [
                LocationCellComponent
            ]
        }).compileComponents();

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

    it('should set displayText', () => {
        fixture.detectChanges();

        expect(component.displayText).toBe('location');
    });

    it('should set tooltip', () => {
        fixture.detectChanges();

        expect(component.tooltip).toEqual(rowData.path.name);
    });

    it('should set router link', () => {
        fixture.detectChanges();

        expect(component.link).toEqual([ columnData.format , rowData.path.elements[2].id ]);
    });

    it('should not setup cell when path has no data', () => {
        rowData.path = {};

        fixture.detectChanges();

        expect(component.displayText).toBe('');
        expect(component.tooltip).toBeUndefined();
        expect(component.link).toEqual([]);
    });
});
