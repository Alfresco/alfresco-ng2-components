/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ReplaySubject } from 'rxjs';
import { SearchNumberRangeComponent } from './search-number-range.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('SearchNumberRangeComponent', () => {
    let component: SearchNumberRangeComponent;
    let fixture: ComponentFixture<SearchNumberRangeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, SearchNumberRangeComponent]
        });
        fixture = TestBed.createComponent(SearchNumberRangeComponent);
        component = fixture.componentInstance;
        component.id = 'contentSize';
        component.context = {
            queryFragments: {
                contentSize: ''
            },
            filterRawParams: {},
            populateFilters: new ReplaySubject(1),
            update: jasmine.createSpy('update')
        } as any;
    });

    it('should setup form elements on init', () => {
        component.ngOnInit();
        expect(component.form).toBeDefined();
        expect(component.to).toBeDefined();
        expect(component.form).toBeDefined();
    });

    it('should reset form', () => {
        component.ngOnInit();
        component.form.reset({ from: '10', to: '20' });
        component.reset();

        expect(component.from.value).toEqual('');
        expect(component.to.value).toEqual('');
        expect(component.form.value).toEqual({ from: '', to: '' });
    });

    it('should update query builder on reset', () => {
        component.context.queryFragments[component.id] = 'query';
        component.ngOnInit();
        component.reset();

        expect(component.context.queryFragments.contentSize).toEqual('');
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.filterRawParams[component.id]).toBeUndefined();
    });

    it('should update query builder on value changes', () => {
        component.settings = { field: 'cm:content.size' };

        component.ngOnInit();
        component.apply(
            {
                from: '10',
                to: '20'
            },
            true
        );

        const expectedQuery = 'cm:content.size:[10 TO 20]';
        expect(component.context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.filterRawParams[component.id].from).toEqual('10');
        expect(component.context.filterRawParams[component.id].to).toEqual('20');
    });

    it('should fetch format from the settings', () => {
        component.settings = {
            field: 'cm:content.size',
            format: '<{FROM} TO {TO}>'
        };
        component.ngOnInit();

        expect(component.field).toEqual('cm:content.size');
        expect(component.format).toEqual('<{FROM} TO {TO}>');
    });

    it('should use default format if not provided', () => {
        component.settings = {
            field: 'cm:content.size'
        };
        component.ngOnInit();

        expect(component.field).toEqual('cm:content.size');
        expect(component.format).toEqual('[{FROM} TO {TO}]');
    });

    it('should format value based on the current pattern', () => {
        component.settings = {
            field: 'cm:content.size',
            format: '<{FROM} TO {TO}>'
        };
        component.ngOnInit();

        component.apply({ from: '0', to: '100' }, true);
        expect(component.context.queryFragments[component.id]).toEqual('cm:content.size:<0 TO 100>');
    });

    it('should return true if TO value is bigger than FROM value', () => {
        component.ngOnInit();
        component.from = new UntypedFormControl('10');
        component.to = new UntypedFormControl('20');
        component.form = new UntypedFormGroup(
            {
                from: component.from,
                to: component.to
            },
            component.formValidator
        );

        expect(component.formValidator).toBeTruthy();
    });

    it('should throw pattern error if "from" value is formed by letters', () => {
        component.ngOnInit();
        component.from = new UntypedFormControl('abc', component.validators);
        expect(component.from.hasError('pattern')).toBe(true);
    });

    it('should not throw pattern error if "from" value is formed by digits', () => {
        component.ngOnInit();
        component.from = new UntypedFormControl(123, component.validators);
        expect(component.from.hasError('pattern')).toBe(false);
    });

    it('should throw required error if "from" value is empty', () => {
        component.ngOnInit();
        component.from = new UntypedFormControl('', component.validators);
        expect(component.from.hasError('required')).toBe(true);
    });

    it('should not throw required error if "from" value is not empty', () => {
        component.ngOnInit();
        component.from = new UntypedFormControl(123, component.validators);
        expect(component.from.hasError('required')).toBe(false);
    });

    it('should throw error if "from" value is a negative value', () => {
        component.ngOnInit();
        component.from = new UntypedFormControl(-100, component.validators);
        expect(component.from.hasError('min')).toBe(true);
    });

    it('should populate filter state when populate filters event has been observed', () => {
        component.settings = {
            field: 'cm:content.size'
        };
        component.context.filterLoaded = new ReplaySubject(1);
        spyOn(component.context.filterLoaded, 'next').and.stub();
        spyOn(component.displayValue$, 'next').and.stub();
        fixture.detectChanges();
        component.context.populateFilters.next({ contentSize: { from: '10', to: '100' } });
        fixture.detectChanges();

        expect(component.displayValue$.next).toHaveBeenCalledWith('10 - 100 ');
        expect(component.context.filterRawParams[component.id]).toEqual({ from: '10', to: '100' });
        expect(component.form.value).toEqual({ from: '10', to: '100' });
        expect(component.context.filterLoaded.next).toHaveBeenCalled();
    });
});
