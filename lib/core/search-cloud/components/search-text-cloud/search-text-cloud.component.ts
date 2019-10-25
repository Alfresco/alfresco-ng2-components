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

import { ViewEncapsulation, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchCloudService } from '../../../services/search-cloud.service';

@Component({
    selector: 'adf-search-text-cloud',
    templateUrl: './search-text-cloud.component.html',
    styleUrls: ['./search-text-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchTextCloudComponent implements OnInit, OnDestroy {

    placeholder: string;

    searchField: FormControl = new FormControl();
    onDestroy$: Subject<void> = new Subject<void>();

    constructor(private searchCloudService: SearchCloudService) {}

    ngOnInit() {
        this.searchField.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe( (value: string) => {
            this.searchCloudService.value.next(value);
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete(); 
    }
}
