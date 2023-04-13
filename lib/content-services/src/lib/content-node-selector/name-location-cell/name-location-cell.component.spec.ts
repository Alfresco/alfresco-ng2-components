/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { NameLocationCellComponent } from './name-location-cell.component';
import { By } from '@angular/platform-browser';
import { DataRow, setupTestBed } from '@alfresco/adf-core';

describe('NameLocationCellComponent', () => {
    let component: NameLocationCellComponent;
    let fixture: ComponentFixture<NameLocationCellComponent>;
    let rowData: DataRow;

    setupTestBed({
        declarations: [
            NameLocationCellComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NameLocationCellComponent);
        component = fixture.componentInstance;

        rowData = {
            getValue: (key): any => {
                if (key === 'name') {
                    return 'file-name';
                } else if (key === 'path') {
                    return { name: '/path/to/location' };
                }
                return undefined;
            }
        } as DataRow;
        component.row = rowData;
        fixture.detectChanges();
    });

    it('should set fileName and location properly', () => {
        const fileName = fixture.debugElement.query(By.css('.adf-name-location-cell-name')).nativeElement.innerText;
        const location = fixture.debugElement.query(By.css('.adf-name-location-cell-location')).nativeElement.innerText;
        expect(fileName).toBe('file-name');
        expect(location).toBe('/path/to/location');
    });

    it('should set tooltip properly', () => {
        const tooltip = fixture.debugElement.query(By.css('.adf-name-location-cell-location')).nativeElement.getAttribute('title');

        expect(tooltip).toEqual('/path/to/location');
    });
});
