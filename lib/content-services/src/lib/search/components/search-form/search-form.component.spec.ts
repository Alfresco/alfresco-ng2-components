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
import { SearchFormComponent } from './search-form.component';
import { setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchForm } from '../../models/search-form.interface';
import { By } from '@angular/platform-browser';

describe('SearchFormComponent', () => {
    let fixture: ComponentFixture<SearchFormComponent>;
    let component: SearchFormComponent;
    let queryBuilder: SearchQueryBuilderService;
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
            { provide: SEARCH_QUERY_SERVICE_TOKEN, useClass: SearchQueryBuilderService }
        ]
    });

    beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    queryBuilder = TestBed.inject<SearchQueryBuilderService>(SEARCH_QUERY_SERVICE_TOKEN);
    queryBuilder.searchForms.next(mockSearchForms);
    fixture.detectChanges();
  });

    it('should show search forms', () => {
        const title = fixture.debugElement.query(By.css('.adf-search-form-title'));
        expect(title.nativeElement.innerText).toContain(mockSearchForms[1].name);
    });

    it('should emit on form change', (done) => {
        spyOn(queryBuilder, 'updateSelectedConfiguration').and.stub();
        component.formChange.subscribe((form) => {
            expect(form).toEqual(mockSearchForms[2]);
            expect(queryBuilder.updateSelectedConfiguration).toHaveBeenCalled();
            done();
        });

        const button = fixture.debugElement.query(By.css('.adf-search-form')).nativeElement;
        button.click();
        fixture.detectChanges();

        const matOption = fixture.debugElement.queryAll(By.css('.mat-menu-item'))[2].nativeElement;
        matOption.click();
    });

    it('should not show menu if only one config found', () => {
        queryBuilder.searchForms.next([{ name: 'one', selected: true, default: true, index: 0 }]);
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.adf-search-form')).nativeElement;
        button.click();

        const title = fixture.debugElement.query(By.css('.adf-search-form-title'));
        expect(title.nativeElement.innerText).toContain('one');

        fixture.detectChanges();
        const matOption = fixture.debugElement.query(By.css('.mat-menu-item'));
        expect(matOption).toBe(null, 'should not show mat menu');
    });

    it('should not display search form if no form configured', () => {
        queryBuilder.searchForms.next([]);
        fixture.detectChanges();

        const field = fixture.debugElement.query(By.css('.adf-search-form-title'));
        expect(field).toEqual(null, 'search form displayed for empty configuration');
    });
});
