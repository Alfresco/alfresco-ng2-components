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

import { ActivitiApps } from './src/components/activiti-apps.component';
import { ActivitiTaskList } from './src/components/activiti-tasklist.component';
import { ActivitiTaskDetails } from './src/components/activiti-task-details.component';
import { ActivitiFilters } from './src/components/activiti-filters.component';
import { NoTaskDetailsTemplateComponent } from './src/components/no-task-detail-template.component';
import { ActivitiChecklist } from './src/components/activiti-checklist.component';
import { ActivitiComments } from './src/components/activiti-comments.component';
import { ActivitiPeople } from './src/components/activiti-people.component';
import { ActivitiTaskHeader } from './src/components/activiti-task-header.component';

export * from './src/components/activiti-apps.component';
export * from './src/components/activiti-tasklist.component';
export * from './src/services/activiti-tasklist.service';
export * from  './src/models/filter.model';
export * from './src/components/activiti-checklist.component';
export * from './src/components/activiti-comments.component';
export * from './src/components/activiti-people.component';
export * from './src/components/activiti-task-header.component';
export * from './src/components/no-task-detail-template.component';

export const ALFRESCO_TASKLIST_DIRECTIVES: [any] = [
    NoTaskDetailsTemplateComponent,
    ActivitiApps,
    ActivitiFilters,
    ActivitiTaskList,
    ActivitiTaskDetails,
    ActivitiChecklist,
    ActivitiComments,
    ActivitiPeople,
    ActivitiTaskHeader
];
