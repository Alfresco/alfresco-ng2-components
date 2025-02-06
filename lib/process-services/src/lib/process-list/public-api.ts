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

// component
import { ProcessInstanceListComponent } from './components/process-list/process-list.component';
import { ProcessFiltersComponent } from './components/process-filters/process-filters.component';
import { ProcessInstanceDetailsComponent } from './components/process-instance-details/process-instance-details.component';
import { ProcessInstanceHeaderComponent } from './components/process-instance-header/process-instance-header.component';
import { ProcessInstanceTasksComponent } from './components/process-instance-tasks/process-instance-tasks.component';
import { StartProcessInstanceComponent } from './components/start-process/start-process.component';
import { ProcessAuditDirective } from './components/process-audit/process-audit.directive';

export * from './components/process-filters/process-filters.component';
export * from './components/process-instance-details/process-instance-details.component';
export * from './components/process-audit/process-audit.directive';
export * from './components/process-instance-header/process-instance-header.component';
export * from './components/process-instance-tasks/process-instance-tasks.component';
export * from './components/process-list/process-list.component';
export * from './components/start-process/start-process.component';

// services
export * from './services/process.service';
export * from './services/process-filter.service';

export const PROCESS_LIST_DIRECTIVES = [
    ProcessAuditDirective,
    ProcessInstanceListComponent,
    ProcessFiltersComponent,
    ProcessInstanceDetailsComponent,
    ProcessInstanceHeaderComponent,
    ProcessInstanceTasksComponent,
    StartProcessInstanceComponent
] as const;
