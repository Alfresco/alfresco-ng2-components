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

import { NgModule } from '@angular/core';
import { ProcessFiltersCloudModule } from './process-filters/process-filters-cloud.module';
import { ProcessListCloudModule } from './process-list/process-list-cloud.module';
import { StartProcessCloudModule } from './start-process/start-process-cloud.module';
import { CoreModule } from '@alfresco/adf-core';
import { ProcessHeaderCloudModule } from './process-header/process-header-cloud.module';
import { ProcessDirectiveModule } from './directives/process-directive.module';
import { ProcessNameCloudPipe } from '../pipes/process-name-cloud.pipe';

@NgModule({
    imports: [
        CoreModule,
        ProcessFiltersCloudModule,
        ProcessListCloudModule,
        StartProcessCloudModule,
        ProcessHeaderCloudModule,
        ProcessDirectiveModule
    ],
    exports: [
        ProcessFiltersCloudModule,
        ProcessListCloudModule,
        StartProcessCloudModule,
        ProcessHeaderCloudModule,
        ProcessDirectiveModule
    ],
    providers: [ProcessNameCloudPipe]
})
export class ProcessCloudModule { }
