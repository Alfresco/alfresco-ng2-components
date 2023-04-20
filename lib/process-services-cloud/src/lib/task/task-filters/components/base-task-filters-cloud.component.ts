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

import { EventEmitter, Input, Output, OnDestroy, Directive } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FilterParamsModel } from '../models/filter-cloud.model';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseTaskFiltersCloudComponent implements OnDestroy {
    /** Display filters available to the current user for the application with the specified name. */
    @Input()
    appName: string = '';

    /**
     * Parameters to use for the task filter cloud. If there is no match then the default filter
     * (the first one in the list) is selected.
     */
    @Input()
    filterParam: FilterParamsModel;

    /** Toggles display of the filter's icons. */
    @Input()
    showIcons: boolean = false;

    /** Emitted when the list is loaded. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an error occurs during loading. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    counters$: {[key: string]: Observable<number>} = {};
    updatedCounters: string[] = [];

    protected onDestroy$ = new Subject<boolean>();

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    wasFilterUpdated(filterKey: string): boolean {
        return this.updatedCounters.includes(filterKey);
    }

    addToUpdatedCounters(filterKey: string) {
        if (!this.updatedCounters.includes(filterKey)) {
            this.updatedCounters.push(filterKey);
        }
    }

    resetFilterCounter(filterKey: string) {
        const filterIndex = this.updatedCounters.indexOf(filterKey);
        if (filterIndex > -1) {
            this.updatedCounters.splice(filterIndex, 1);
        }
    }
}
