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
import { SearchWidgetChipComponent } from './search-widget-chip.component';
import { simpleCategories } from '../../../../mock';
import { setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { SearchQueryBuilderService } from '../../../services/search-query-builder.service';

describe('SearchWidgetChipComponent', () => {
    let component: SearchWidgetChipComponent;
    let fixture: ComponentFixture<SearchWidgetChipComponent>;
    let queryBuilder: SearchQueryBuilderService;

    setupTestBed(    {
      imports: [
          MatMenuModule,
          TranslateModule.forRoot(),
          ContentTestingModule
      ]
  });

    beforeEach(() => {
      queryBuilder = TestBed.inject(SearchQueryBuilderService);
      fixture = TestBed.createComponent(SearchWidgetChipComponent);
      component = fixture.componentInstance;
      spyOn(queryBuilder, 'update').and.stub();

      component.category = simpleCategories[1];
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
