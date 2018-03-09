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

import { NgModule } from '@angular/core';
import { TextFacetComponent } from './text-facet.component';
import { MatButtonModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RadioFacetComponent } from './radio-facet.component';
import { FieldsFacetComponent } from './fields-facet.component';
import { ScopeLocationsFacetComponent } from './scope-locations-facet.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSelectModule
    ],
    declarations: [
        TextFacetComponent,
        RadioFacetComponent,
        FieldsFacetComponent,
        ScopeLocationsFacetComponent
    ],
    exports: [
        TextFacetComponent,
        RadioFacetComponent,
        FieldsFacetComponent,
        ScopeLocationsFacetComponent
    ],
    entryComponents: [
        TextFacetComponent,
        RadioFacetComponent,
        FieldsFacetComponent,
        ScopeLocationsFacetComponent
    ]
})
export class FacetsModule {
}
