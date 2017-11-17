/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';

import { PipeModule, SearchService } from '@alfresco/adf-core';

import { SearchTriggerDirective } from './components/search-trigger.directive';

import { SearchControlComponent } from './components/search-control.component';
import { SearchComponent } from './components/search.component';

export const ALFRESCO_SEARCH_DIRECTIVES: [any] = [
    SearchComponent,
    SearchControlComponent,
    SearchTriggerDirective
];

export const ALFRESCO_SEARCH_PROVIDERS: [any] = [
    SearchService
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        PipeModule,
        TranslateModule
    ],
    declarations: [
        ...ALFRESCO_SEARCH_DIRECTIVES
    ],
    providers: [
        ...ALFRESCO_SEARCH_PROVIDERS
    ],
    exports: [
        ...ALFRESCO_SEARCH_DIRECTIVES
    ]
})
export class SearchModule {}
