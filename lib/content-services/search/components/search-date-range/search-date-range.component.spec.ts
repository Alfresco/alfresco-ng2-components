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

import { SearchDateRangeComponent } from './search-date-range.component';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { setupTestBed, MomentDateAdapter } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

declare let moment: any;

describe('SearchDateRangeComponent', () => {
    describe('component class', () => {

        let component: SearchDateRangeComponent;
        let fromDate = '2016-10-16';
        let toDate = '2017-10-16';
        const localeFixture = 'it';
        const dateFormatFixture = 'DD-MMM-YY';

        const buildAdapter = (): MomentDateAdapter => {
            const dateAdapter = new MomentDateAdapter();
            dateAdapter.overrideDisplayFormat = null;
            return dateAdapter;
        };

        const buildUserPreferences = (): any => {
            const userPreferences = {
                userPreferenceStatus: { LOCALE: localeFixture },
                select: (property) => {
                    return of(userPreferences.userPreferenceStatus[property]);
                }
            };
            return userPreferences;
        };

        const theDateAdapter = <any> buildAdapter();

        beforeEach(() => {
            component = new SearchDateRangeComponent(theDateAdapter, buildUserPreferences());
        });

        it('should setup form elements on init', () => {
            component.ngOnInit();
            expect(component.from).toBeDefined();
            expect(component.to).toBeDefined();
            expect(component.form).toBeDefined();
        });

        it('should setup the format of the date from configuration', () => {
            component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
            component.ngOnInit();
            expect(theDateAdapter.overrideDisplayFormat).toBe(dateFormatFixture);
        });

        it('should setup form control with formatted valid date on change', () => {
            component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
            component.ngOnInit();

            const inputString = '20-feb-18';
            const momentFromInput = moment(inputString, dateFormatFixture);
            expect(momentFromInput.isValid()).toBeTruthy();

            component.onChangedHandler({ srcElement: { value: inputString } }, component.from);
            expect(component.from.value.toString()).toEqual(momentFromInput.toString());
        });

        it('should NOT setup form control with invalid date on change', () => {
            component.settings = { field: 'cm:created', dateFormat: dateFormatFixture };
            component.ngOnInit();

            const inputString = '20.f.18';
            const momentFromInput = moment(inputString, dateFormatFixture);
            expect(momentFromInput.isValid()).toBeFalsy();

            component.onChangedHandler({ srcElement: { value: inputString } }, component.from);
            expect(component.from.value.toString()).not.toEqual(momentFromInput.toString());
        });

        it('should reset form', () => {
            component.ngOnInit();
            component.form.setValue({ from: fromDate, to: toDate });

            expect(component.from.value).toEqual(fromDate);
            expect(component.to.value).toEqual(toDate);

            component.reset();

            expect(component.from.value).toEqual('');
            expect(component.to.value).toEqual('');
            expect(component.form.value).toEqual({ from: '', to: '' });
        });

        it('should update query builder on reset', () => {
            const context: any = {
                queryFragments: {
                    createdDateRange: 'query'
                },
                update() {
                }
            };

            component.id = 'createdDateRange';
            component.context = context;

            spyOn(context, 'update').and.stub();

            component.ngOnInit();
            component.reset();

            expect(context.queryFragments.createdDateRange).toEqual('');
            expect(context.update).toHaveBeenCalled();
        });

        it('should update query builder on value changes', () => {
            const context: any = {
                queryFragments: {},
                update() {
                }
            };

            component.id = 'createdDateRange';
            component.context = context;
            component.settings = { field: 'cm:created' };

            spyOn(context, 'update').and.stub();

            component.ngOnInit();
            component.apply({
                from: fromDate,
                to: toDate
            }, true);

            const startDate = moment(fromDate).startOf('day').format();
            const endDate = moment(toDate).endOf('day').format();

            const expectedQuery = `cm:created:['${startDate}' TO '${endDate}']`;
            expect(context.queryFragments[component.id]).toEqual(expectedQuery);
            expect(context.update).toHaveBeenCalled();
        });
    });

    describe('component DOM', () => {
        let component: SearchDateRangeComponent;
        let fixture: ComponentFixture<SearchDateRangeComponent>;
        let translateService: TranslateService;
        let translationSpy: jasmine.Spy;
        const dateFormatFixture = 'DD MMM YYYY';

        setupTestBed({
            imports: [ContentTestingModule]
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(SearchDateRangeComponent);
            component = fixture.componentInstance;

            translateService = TestBed.get(TranslateService);
            translationSpy = spyOn(translateService, 'get').and.callFake((key) => {
                return of(key);
            });

            component.settings = { 'dateFormat': dateFormatFixture, field: 'cm:created' };
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        xit('should display the required format when input date is invalid', () => {
            const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

            inputEl.value = 'invalid-date';
            inputEl.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('blur'));
            fixture.detectChanges();

            expect(translationSpy.calls.mostRecent().args)
                .toEqual(['SEARCH.FILTER.VALIDATION.INVALID-DATE', { requiredFormat: dateFormatFixture }]);

            inputEl.value = '';
            fixture.detectChanges();
        });
    });
});
