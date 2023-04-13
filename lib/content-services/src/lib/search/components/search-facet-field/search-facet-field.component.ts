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

import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { FacetField } from '../../models/facet-field.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FacetFieldBucket } from '../../models/facet-field-bucket.interface';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { FacetWidget } from '../../models/facet-widget.interface';
import { TranslationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-search-facet-field',
    templateUrl: './search-facet-field.component.html',
    styleUrls: ['./search-facet-field.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFacetFieldComponent implements FacetWidget {

    @Input()
    field!: FacetField;

    displayValue$: Subject<string> = new Subject<string>();

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN) public queryBuilder: SearchQueryBuilderService,
                private searchFacetFiltersService: SearchFacetFiltersService,
                private translationService: TranslationService) {
    }

    get canUpdateOnChange() {
       return  this.field.settings?.allowUpdateOnChange ?? true;
    }

    onToggleBucket(event: MatCheckboxChange, field: FacetField, bucket: FacetFieldBucket) {
        if (event && bucket) {
            if (event.checked) {
                this.selectFacetBucket(field, bucket);
            } else {
                this.unselectFacetBucket(field, bucket);
            }
        }
    }

    selectFacetBucket(field: FacetField, bucket: FacetFieldBucket) {
        if (bucket) {
            bucket.checked = true;
            this.queryBuilder.addUserFacetBucket(field, bucket);
            this.searchFacetFiltersService.updateSelectedBuckets();
            if (this.canUpdateOnChange) {
                this.updateDisplayValue();
                this.queryBuilder.update();
            }
        }
    }

    unselectFacetBucket(field: FacetField, bucket: FacetFieldBucket) {
        if (bucket) {
            bucket.checked = false;
            this.queryBuilder.removeUserFacetBucket(field, bucket);
            this.searchFacetFiltersService.updateSelectedBuckets();
            if (this.canUpdateOnChange) {
                this.updateDisplayValue();
                this.queryBuilder.update();
            }
        }
    }

    canResetSelectedBuckets(field: FacetField): boolean {
        if (field && field.buckets) {
            return field.buckets.items.some((bucket) => bucket.checked);
        }
        return false;
    }

    resetSelectedBuckets(field: FacetField) {
        if (field && field.buckets) {
            for (const bucket of field.buckets.items) {
                bucket.checked = false;
                this.queryBuilder.removeUserFacetBucket(field, bucket);
            }
            this.searchFacetFiltersService.updateSelectedBuckets();
            if (this.canUpdateOnChange) {
                this.queryBuilder.update();
            }
        }
    }

    getBucketCountDisplay(bucket: FacetFieldBucket): string {
        return bucket.count === null ? '' : `(${bucket.count})`;
    }

    updateDisplayValue(): void {
        if (!this.field.buckets?.items) {
            this.displayValue$.next('');
        } else {
            const displayValue = this.field.buckets?.items?.filter((item) => item.checked)
                .map((item) => this.translationService.instant(item.display || item.label))
                .join(', ');
            this.displayValue$.next(displayValue);
        }
    }

    reset(): void {
        this.resetSelectedBuckets(this.field);
        this.updateDisplayValue();
        this.queryBuilder.update();
    }

    submitValues(): void {
        this.updateDisplayValue();
        this.queryBuilder.update();
    }
}
