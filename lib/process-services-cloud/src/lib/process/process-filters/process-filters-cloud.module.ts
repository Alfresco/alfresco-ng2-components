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
import { ProcessFiltersCloudComponent } from './components/process-filters-cloud.component';
import { EditProcessFilterCloudComponent } from './components/edit-process-filter-cloud.component';
import { ProcessFilterDialogCloudComponent } from './components/process-filter-dialog-cloud.component';

export const PROCESS_FILTERS_CLOUD_DIRECTIVES = [
    ProcessFiltersCloudComponent,
    EditProcessFilterCloudComponent,
    ProcessFilterDialogCloudComponent
] as const;

/** @deprecated import individual standalone components instead */
@NgModule({
    imports: [...PROCESS_FILTERS_CLOUD_DIRECTIVES],
    exports: [...PROCESS_FILTERS_CLOUD_DIRECTIVES]
})
export class ProcessFiltersCloudModule {}
