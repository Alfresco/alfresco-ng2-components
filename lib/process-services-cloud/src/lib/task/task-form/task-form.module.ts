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

import { NgModule } from '@angular/core';
import { TaskFormCloudComponent } from './components/task-form-cloud/task-form-cloud.component';
import { UserTaskCloudComponent } from './components/user-task-cloud/user-task-cloud.component';
import { UserTaskCloudButtonsComponent } from './components/user-task-cloud-buttons/user-task-cloud-buttons.component';

export const TASK_FORM_CLOUD_DIRECTIVES = [UserTaskCloudButtonsComponent, TaskFormCloudComponent, UserTaskCloudComponent] as const;

/** @deprecated use standalone component imports instead (...TASK_FORM_CLOUD_DIRECTIVES) */
@NgModule({
    imports: [...TASK_FORM_CLOUD_DIRECTIVES],
    exports: [...TASK_FORM_CLOUD_DIRECTIVES]
})
export class TaskFormModule {}
