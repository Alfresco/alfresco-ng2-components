/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule } from '@angular/core';
import { PeopleComponent } from './components/people/people.component';
import { PeopleListComponent } from './components/people-list/people-list.component';
import { PeopleSearchComponent } from './components/people-search/people-search.component';
import { PeopleSearchFieldComponent } from './components/people-search-field/people-search-field.component';
import { PeopleSelectorComponent } from './components/people-selector/people-selector.component';

/** @deprecated Import the standalone components instead */
@NgModule({
    imports: [PeopleComponent, PeopleSearchComponent, PeopleSearchFieldComponent, PeopleSelectorComponent, PeopleListComponent],
    exports: [PeopleComponent, PeopleSearchComponent, PeopleSearchFieldComponent, PeopleSelectorComponent, PeopleListComponent]
})
export class PeopleModule {}

export const PEOPLE_DIRECTIVES = [
    PeopleComponent,
    PeopleSearchComponent,
    PeopleSearchFieldComponent,
    PeopleSelectorComponent,
    PeopleListComponent
] as const;
