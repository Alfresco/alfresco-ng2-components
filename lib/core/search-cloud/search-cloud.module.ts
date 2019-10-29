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

import { NgModule } from '@angular/core';
import { SearchCloudComponent } from './search-cloud.component';
import { SearchTextCloudComponent } from './components/search-text-cloud/search-text-cloud.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        SearchCloudComponent,
        SearchTextCloudComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule
    ],
    exports: [ SearchCloudComponent],
    entryComponents: [ SearchTextCloudComponent ]
})
export class SearchCloudModule {}
