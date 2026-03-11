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
            imports: [DataTableRowComponent]
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

        expect(fixture.debugElement.nativeElement.classList.contains('adf-is-selected')).not.toBe(true);
    });

    it('should not have select class when row data is null', () => {
        row.isSelected = false;
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.classList.contains('adf-is-selected')).not.toBe(true);
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

    it('should set tabindex as non focusable by default (disabled propery is not passed)', () => {
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.getAttribute('tabindex')).toBeNull();
    });

    it('should not set tabindex when row is disabled', () => {
        component.disabled = false;
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should focus element', () => {
        expect(document.activeElement.classList.contains('adf-datatable-row')).toBe(false);
        component.disabled = false;
        fixture.detectChanges();

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

    describe('ariaLabel getter', () => {
        it('should return null when row is null', () => {
            component.row = null;
            expect(component.ariaLabel).toBeNull();
        });

        it('should return name when row has name value', () => {
            spyOn(row, 'getValue').and.returnValue('document-name');
            component.row = row;

            expect(component.ariaLabel).toBe('document-name');
        });

        it('should return title when row has no name but has title', () => {
            spyOn(row, 'getValue').and.callFake((key: string) => {
                if (key === 'name') {
                    return null;
                }
                if (key === 'title') {
                    return 'document-title';
                }
                return null;
            });
            component.row = row;

            expect(component.ariaLabel).toBe('document-title');
        });

        it('should return empty string when row has neither name nor title', () => {
            spyOn(row, 'getValue').and.returnValue(null);
            component.row = row;

            expect(component.ariaLabel).toBe('');
        });

        it('should append "selected" when row is selected and has name', () => {
            row.isSelected = true;
            spyOn(row, 'getValue').and.returnValue('document-name');
            component.row = row;

            expect(component.ariaLabel).toBe('document-name selected');
        });

        it('should append "selected" when row is selected and has title', () => {
            row.isSelected = true;
            spyOn(row, 'getValue').and.callFake((key: string) => {
                if (key === 'name') {
                    return null;
                }
                if (key === 'title') {
                    return 'document-title';
                }
                return null;
            });
            component.row = row;

            expect(component.ariaLabel).toBe('document-title selected');
        });

        it('should return empty string when row is selected but has no name or title', () => {
            row.isSelected = true;
            spyOn(row, 'getValue').and.returnValue(null);
            component.row = row;

            expect(component.ariaLabel).toBe('');
        });
    });
});
