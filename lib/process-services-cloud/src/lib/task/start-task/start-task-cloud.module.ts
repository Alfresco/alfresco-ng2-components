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
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { CoreModule } from '@alfresco/adf-core';
import { StartTaskCloudComponent } from './components/start-task-cloud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupCloudModule } from '../../group/group-cloud.module';
import { FormCloudModule } from '../../form/form-cloud.module';
import { PeopleCloudModule } from '../../people/people-cloud.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        GroupCloudModule,
        CoreModule,
        FormCloudModule,
        PeopleCloudModule
    ],
    declarations: [StartTaskCloudComponent],
    exports: [
        StartTaskCloudComponent
    ]
})
export class StartTaskCloudModule {
}
