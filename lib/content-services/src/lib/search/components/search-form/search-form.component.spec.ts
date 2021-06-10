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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormComponent } from './search-form.component';
import { setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { SearchHeaderQueryBuilderService } from '../../search-header-query-builder.service';
import { SearchForm } from '../../models/search-form.interface';
import { By } from '@angular/platform-browser';

describe('SearchFormComponent', () => {
    let fixture: ComponentFixture<SearchFormComponent>;
    let component: SearchFormComponent;
    let queryBuilder: SearchHeaderQueryBuilderService;
    const mockSearchForms: SearchForm[] = [
        { default: false, index: 0, name: 'All', selected: false },
        { default: true, index: 1, name: 'First', selected: true },
        { default: false, index: 2, name: 'Second', selected: false }
    ];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: SEARCH_QUERY_SERVICE_TOKEN, useClass: SearchHeaderQueryBuilderService }
        ]
    });

    beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    queryBuilder = TestBed.inject<SearchHeaderQueryBuilderService>(SEARCH_QUERY_SERVICE_TOKEN);
    spyOn(queryBuilder, 'getSearchConfigurationDetails').and.returnValue(mockSearchForms);
    fixture.detectChanges();
  });

    it('should show search forms', async () => {
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.selected).toBe(1);
        const label = fixture.debugElement.query(By.css('.mat-form-field mat-label'));
        expect(label.nativeElement.innerText).toContain('SEARCH.FORMS');
        const selectValue = fixture.debugElement.query(By.css('.mat-select-value'));
        expect(selectValue.nativeElement.innerText).toContain('First');
    });

    it('should emit on form change', async (done) => {
        component.formChange.subscribe((form) => {
            expect(form).toEqual(mockSearchForms[2]);
            done();
        });

        await fixture.whenStable();
        fixture.detectChanges();

        const matSelect = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;
        matSelect.click();
        fixture.detectChanges();

        const matOption = fixture.debugElement.queryAll(By.css('.mat-option'))[2].nativeElement;
        matOption.click();
    });

    it('should not display search form if no form configured', async () => {
        component.searchForms = [];
        await fixture.whenStable();
        fixture.detectChanges();
        const field = fixture.debugElement.query(By.css('.mat-form-field'));
        expect(field).not.toBeDefined('search form displayed for empty configuration');
    });
});
