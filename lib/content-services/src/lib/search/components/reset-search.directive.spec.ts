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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { SearchFacetFiltersService } from '../services/search-facet-filters.service';
import { SearchQueryBuilderService } from '../services/search-query-builder.service';

@Component({
    template: `<button adf-reset-search>Reset</button>`,
    standalone: false
})
class TestComponent {}

describe('Directive: ResetSearchDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let searchFacetFiltersService: SearchFacetFiltersService;
    let queryBuilder: SearchQueryBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            declarations: [TestComponent]
        });
        fixture = TestBed.createComponent(TestComponent);
        searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);
        queryBuilder = TestBed.inject(SearchQueryBuilderService);
    });

    it('should reset the search on click', () => {
        spyOn(queryBuilder, 'resetToDefaults');
        searchFacetFiltersService.responseFacets = [{ type: 'field', label: 'f1' }] as any;
        fixture.nativeElement.querySelector('button').click();
        expect(searchFacetFiltersService.responseFacets).toEqual([]);
        expect(queryBuilder.resetToDefaults).toHaveBeenCalled();
    });
});
