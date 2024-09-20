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
import { ProcessFiltersCloudModule } from './process-filters/process-filters-cloud.module';
import { StartProcessCloudModule } from './start-process/start-process-cloud.module';
import { CoreModule, LocalizedDatePipe } from '@alfresco/adf-core';
import { ProcessHeaderCloudModule } from './process-header/process-header-cloud.module';
import { ProcessNameCloudPipe } from '../pipes/process-name-cloud.pipe';
import { ProcessListCloudComponent } from './process-list/components/process-list-cloud.component';
import { CancelProcessDirective } from './directives/cancel-process.directive';

@NgModule({
    imports: [
        CoreModule,
        ProcessFiltersCloudModule,
        ProcessListCloudComponent,
        StartProcessCloudModule,
        ProcessHeaderCloudModule,
        CancelProcessDirective
    ],
    exports: [ProcessFiltersCloudModule, ProcessListCloudComponent, StartProcessCloudModule, ProcessHeaderCloudModule, CancelProcessDirective],
    providers: [ProcessNameCloudPipe, LocalizedDatePipe]
})
export class ProcessCloudModule {}
