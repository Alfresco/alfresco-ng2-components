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

import { SearchFacetFieldComponent } from './search-facet-field.component';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { FacetField } from '../../models/facet-field.interface';
import { FacetFieldBucket } from '../../models/facet-field-bucket.interface';
import { SearchFilterList } from '../../models/search-filter-list.model';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchFacetFieldComponent', () => {
      let component: SearchFacetFieldComponent;
      let fixture: ComponentFixture<SearchFacetFieldComponent>;
      let searchFacetFiltersService: SearchFacetFiltersService;
      let queryBuilder: SearchQueryBuilderService;

      beforeEach(async () => {
          TestBed.configureTestingModule({
              imports: [
                  TranslateModule.forRoot(),
                  ContentTestingModule
              ]
          });
          searchFacetFiltersService = TestBed.inject(SearchFacetFiltersService);
          queryBuilder = TestBed.inject(SearchQueryBuilderService);
      });

      beforeEach(() => {
            fixture = TestBed.createComponent(SearchFacetFieldComponent);
            component = fixture.componentInstance;
            spyOn(searchFacetFiltersService, 'updateSelectedBuckets').and.stub();
      });

      it('should update bucket model and query builder on facet toggle', () => {
            spyOn(queryBuilder, 'update').and.stub();
            spyOn(queryBuilder, 'addUserFacetBucket').and.callThrough();

            const event: any = { checked: true };
            const field: FacetField = { field: 'f1', label: 'f1', buckets: new SearchFilterList() };
            const bucket: FacetFieldBucket = { checked: false, filterQuery: 'q1', label: 'q1', count: 1 };
            component.field = field;
            fixture.detectChanges();

            component.onToggleBucket(event, field, bucket);

            expect(bucket.checked).toBeTruthy();
            expect(queryBuilder.addUserFacetBucket).toHaveBeenCalledWith(field, bucket);
            expect(queryBuilder.update).toHaveBeenCalled();
            expect(searchFacetFiltersService.updateSelectedBuckets).toHaveBeenCalled();
    });

      it('should update bucket model and query builder on facet un-toggle', () => {
        spyOn(queryBuilder, 'update').and.stub();
        spyOn(queryBuilder, 'removeUserFacetBucket').and.callThrough();

        const event: any = { checked: false };
        const field: FacetField = { field: 'f1', label: 'f1', buckets: new SearchFilterList() };
        const bucket: FacetFieldBucket = { checked: true, filterQuery: 'q1', label: 'q1', count: 1 };

        component.field = field;
        fixture.detectChanges();

        component.onToggleBucket(event, field, bucket);

        expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledWith(field, bucket);
        expect(queryBuilder.update).toHaveBeenCalled();
        expect(searchFacetFiltersService.updateSelectedBuckets).toHaveBeenCalled();
    });

      it('should unselect facet query and update builder', () => {
        spyOn(queryBuilder, 'update').and.stub();
        spyOn(queryBuilder, 'removeUserFacetBucket').and.callThrough();

        const event: any = { checked: false };
        const query = { checked: true, label: 'q1', filterQuery: 'query1' };
        const field = { field: 'q1', type: 'query', label: 'label1', buckets: new SearchFilterList([ query ] ) } as FacetField;

        component.field = field;
        fixture.detectChanges();

        component.onToggleBucket(event, field, query as any);

        expect(query.checked).toEqual(false);
        expect(queryBuilder.removeUserFacetBucket).toHaveBeenCalledWith(field, query);
        expect(queryBuilder.update).toHaveBeenCalled();
        expect(searchFacetFiltersService.updateSelectedBuckets).toHaveBeenCalled();
    });

      it('should update query builder only when has bucket to unselect', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const field: FacetField = { field: 'f1', label: 'f1' };
        component.onToggleBucket({ checked: true } as any, field, null);

        expect(queryBuilder.update).not.toHaveBeenCalled();
    });

      it('should allow to to reset selected buckets', () => {
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: true, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: false, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.field = field;
        fixture.detectChanges();

        expect(component.canResetSelectedBuckets(field)).toBeTruthy();
    });

      it('should not allow to reset selected buckets', () => {
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: false, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: false, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.field = field;
        fixture.detectChanges();

        expect(component.canResetSelectedBuckets(field)).toEqual(false);
    });

      it('should reset selected buckets', () => {
        spyOn(queryBuilder, 'execute').and.stub();
        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: false, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: true, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.field = field;
        fixture.detectChanges();

        component.resetSelectedBuckets(field);

        expect(buckets[0].checked).toEqual(false);
        expect(buckets[1].checked).toEqual(false);
    });

      it('should update query builder upon resetting buckets', () => {
        spyOn(queryBuilder, 'update').and.stub();

        const buckets: FacetFieldBucket[] = [
            { label: 'bucket1', checked: false, count: 1, filterQuery: 'q1' },
            { label: 'bucket2', checked: true, count: 1, filterQuery: 'q2' }
        ];

        const field: FacetField = {
            field: 'f1',
            label: 'field1',
            buckets: new SearchFilterList<FacetFieldBucket>(buckets)
        };

        component.field = field;
        fixture.detectChanges();

        component.resetSelectedBuckets(field);
        expect(queryBuilder.update).toHaveBeenCalled();
    });

});
