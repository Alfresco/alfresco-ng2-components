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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { PerformSearchCallback } from '../../interfaces/perform-search-callback.interface';
import { map } from 'rxjs/operators';
import { LightUserRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PeopleSearchFieldComponent } from '../people-search-field/people-search-field.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-people-search',
    imports: [CommonModule, TranslatePipe, PeopleSearchFieldComponent, MatButtonModule],
    templateUrl: './people-search.component.html',
    styleUrls: ['./people-search.component.scss'],
    host: {
        class: 'adf-people-search'
    },
    encapsulation: ViewEncapsulation.None
})
export class PeopleSearchComponent implements OnInit {
    @Input()
    headerTitle?: string;

    @Input()
    actionLabel?: string;

    /** Parameters for displaying the list. */
    @Input({ required: true })
    results: Observable<LightUserRepresentation[]>;

    /** Emitted when a search is performed with a new keyword. */
    @Output()
    searchPeople = new EventEmitter<any>();

    /** Emitted when a user is selected and the action button is clicked. */
    @Output()
    success = new EventEmitter<LightUserRepresentation>();

    /** Emitted when the "close" button is clicked. */
    @Output()
    closeSearch = new EventEmitter();

    filteredResults$: Observable<LightUserRepresentation[]>;
    selectedUser: LightUserRepresentation = {} as any;
    performSearch: PerformSearchCallback;

    ngOnInit() {
        this.filteredResults$ = this.results.pipe(map((users) => users.filter((user) => user.id !== this.selectedUser.id)));
        this.performSearch = this.performSearchCallback.bind(this);
    }

    onRowClick(user: LightUserRepresentation) {
        this.selectedUser = user;
    }

    closeSearchList() {
        this.closeSearch.emit();
    }

    involveUserAndClose() {
        this.involveUser();
        this.closeSearchList();
    }

    involveUser() {
        if (this.selectedUser === undefined) {
            return;
        }
        this.success.emit(this.selectedUser);
    }

    private performSearchCallback(event: any): Observable<LightUserRepresentation[]> {
        this.searchPeople.emit(event);
        return this.filteredResults$;
    }
}
