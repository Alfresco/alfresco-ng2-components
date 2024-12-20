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
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormCloudModule } from '../../form/form-cloud.module';
import { TaskDirectiveModule } from '../directives/task-directive.module';
import { TaskFormCloudComponent } from './components/task-form-cloud/task-form-cloud.component';
import { CoreModule } from '@alfresco/adf-core';
import { TaskScreenCloudComponent } from '../../screen/components/screen-cloud/screen-cloud.component';
import { UserTaskCloudComponent } from './components/user-task-cloud/user-task-cloud.component';
import { UserTaskCloudButtonsComponent } from './components/user-task-cloud-buttons/user-task-cloud-buttons.component';

@NgModule({
    imports: [CoreModule, CommonModule, MaterialModule, FormCloudModule, TaskDirectiveModule, TaskScreenCloudComponent],
    declarations: [TaskFormCloudComponent, UserTaskCloudComponent, UserTaskCloudButtonsComponent],
    exports: [TaskFormCloudComponent, UserTaskCloudComponent]
})
export class TaskFormModule {}
