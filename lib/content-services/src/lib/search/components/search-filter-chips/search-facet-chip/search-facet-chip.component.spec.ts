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
import { SearchFacetChipComponent } from './search-facet-chip.component';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { SearchQueryBuilderService } from '../../../services/search-query-builder.service';
import { setupTestBed } from '@alfresco/adf-core';
import { SearchFilterList } from '../../../models/search-filter-list.model';

describe('SearchFacetChipComponent', () => {
  let component: SearchFacetChipComponent;
  let fixture: ComponentFixture<SearchFacetChipComponent>;
  let queryBuilder: SearchQueryBuilderService;

  setupTestBed({
      imports: [
          TranslateModule.forRoot(),
          ContentTestingModule
      ]
  });

  beforeEach(() => {
      fixture = TestBed.createComponent(SearchFacetChipComponent);
      component = fixture.componentInstance;
      queryBuilder = TestBed.inject(SearchQueryBuilderService);
      spyOn(queryBuilder, 'update').and.stub();

      component.field = { type: 'field', label: 'f2', field: 'f2', buckets: new SearchFilterList() };
      fixture.detectChanges();
  });

  it('should update search query on apply click',  () => {
        const chip = fixture.debugElement.query(By.css('mat-chip'));
        chip.triggerEventHandler('click', { stopPropagation: () => null });
        fixture.detectChanges();
        const applyButton = fixture.debugElement.query(By.css('#apply-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(queryBuilder.update).toHaveBeenCalled();
    });

  it('should update search query on cancel click',  () => {
        const chip = fixture.debugElement.query(By.css('mat-chip'));
        chip.triggerEventHandler('click', { stopPropagation: () => null });
        fixture.detectChanges();
        const applyButton = fixture.debugElement.query(By.css('#cancel-filter-button'));
        applyButton.triggerEventHandler('click', {});
        expect(queryBuilder.update).toHaveBeenCalled();
    });
});
