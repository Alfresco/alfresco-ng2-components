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

import { ClaimTaskDirective } from './components/task-form/claim-task.directive';
import { UnclaimTaskDirective } from './components/task-form/unclaim-task.directive';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { AttachFormComponent } from './components/attach-form/attach-form.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { TaskAuditDirective } from './components/task-audit/task-audit.directive';
import { TaskFiltersComponent } from './components/task-filters/task-filters.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TaskHeaderComponent } from './components/task-header/task-header.component';
import { StartTaskComponent } from './components/start-task/start-task.component';
import { TaskStandaloneComponent } from './components/task-standalone/task-standalone.component';

export * from './components/task-list/task-list.component';
export * from './components/checklist/checklist.component';
export * from './components/task-header/task-header.component';
export * from './components/task-filters/task-filters.component';
export * from './components/task-form/task-form.component';
export * from './components/task-form/claim-task.directive';
export * from './components/task-form/unclaim-task.directive';
export * from './components/task-details/task-details.component';
export * from './components/task-audit/task-audit.directive';
export * from './components/start-task/start-task.component';
export * from './components/task-standalone/task-standalone.component';
export * from './components/attach-form/attach-form.component';

export * from './services/tasklist.service';
export * from './services/process-upload.service';
export * from './services/task-upload.service';
export * from './services/task-filter.service';

export * from './models/form.model';
export * from './models/task-details.event';
export * from './models/user-event.model';
export * from './models/user-group.model';

export const TASK_LIST_DIRECTIVES = [
    TaskFormComponent,
    AttachFormComponent,
    ChecklistComponent,
    TaskFiltersComponent,
    TaskListComponent,
    TaskDetailsComponent,
    TaskHeaderComponent,
    StartTaskComponent,
    TaskStandaloneComponent,
    ClaimTaskDirective,
    UnclaimTaskDirective,
    TaskAuditDirective
] as const;
