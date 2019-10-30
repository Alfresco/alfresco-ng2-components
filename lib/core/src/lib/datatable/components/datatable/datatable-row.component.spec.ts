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

import { DataTableRowComponent } from './datatable-row.component';
import { DataRow } from '../../data/data-row.model';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('DataTableRowComponent', () => {
    let fixture: ComponentFixture<DataTableRowComponent>;
    let component: DataTableRowComponent;

    const row: DataRow = {
        isSelected: false,
        hasValue: jasmine.createSpy('hasValue'),
        getValue: () => {}
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataTableRowComponent]
        });

        fixture = TestBed.createComponent(DataTableRowComponent);
        component = fixture.componentInstance;
    });

    it('should add select class when row is selected', () => {
        row.isSelected = true;
        component.row = row;
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.classList.contains('adf-is-selected')).toBe(true);
    });

    it('should not have select class when row is not selected', () => {
        row.isSelected = false;
        component.row = row;
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.classList.contains('adf-is-selected'))
            .not.toBe(true);
    });

    it('should not have select class when row data is null', () => {
        row.isSelected = false;
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.classList.contains('adf-is-selected'))
            .not.toBe(true);
    });

    it('should set aria selected to true when row is selected', () => {
        row.isSelected = true;
        component.row = row;
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.getAttribute('aria-selected')).toBe('true');
    });

    it('should set aria selected to false when row is not selected', () => {
        row.isSelected = false;
        component.row = row;
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should set aria selected to false when row is null', () => {
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should set aria label', () => {
        spyOn(row, 'getValue').and.returnValue('some-name');
        component.row = row;
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.getAttribute('aria-label')).toBe('some-name');
    });

    it('should set tabindex as focusable  when row is not disabled', () => {
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should not set tabindex when row is disabled', () => {
        component.disabled = true;
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.getAttribute('tabindex')).toBe(null);
    });

    it('should focus element', () => {
        expect(document.activeElement.classList.contains('adf-datatable-row')).toBe(false);

        component.focus();
        expect(document.activeElement.classList.contains('adf-datatable-row')).toBe(true);
    });

    it('should emit keyboard space event', () => {
        spyOn(component.select, 'emit');
        const event = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space'
        });

        fixture.debugElement.nativeElement.dispatchEvent(event);
        expect(component.select.emit).toHaveBeenCalledWith(event);
    });
});
