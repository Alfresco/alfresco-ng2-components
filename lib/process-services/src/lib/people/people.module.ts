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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '@alfresco/adf-core';
import { PeopleComponent } from './components/people/people.component';
import { PeopleListComponent } from './components/people-list/people-list.component';
import { PeopleSearchComponent } from './components/people-search/people-search.component';
import { PeopleSearchFieldComponent } from './components/people-search-field/people-search-field.component';
import { PeopleSelectorComponent } from './components/people-selector/people-selector.component';

import { PeopleSearchActionLabelDirective } from './directives/people-search-action-label.directive';
import { PeopleSearchTitleDirective } from './directives/people-search-title.directive';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonModule,
        CoreModule
    ],
    declarations: [
        PeopleComponent,
        PeopleSearchComponent,
        PeopleSearchFieldComponent,
        PeopleSelectorComponent,
        PeopleSearchTitleDirective,
        PeopleSearchActionLabelDirective,
        PeopleListComponent
    ],
    exports: [
        PeopleComponent,
        PeopleSearchComponent,
        PeopleSearchFieldComponent,
        PeopleSelectorComponent,
        PeopleSearchTitleDirective,
        PeopleSearchActionLabelDirective,
        PeopleListComponent
    ]
})
export class PeopleModule {
}
