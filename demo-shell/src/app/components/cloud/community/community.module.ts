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
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    ProcessServicesCloudModule,
    LocalPreferenceCloudService,
    PROCESS_FILTERS_SERVICE_TOKEN,
    TASK_FILTERS_SERVICE_TOKEN
} from '@alfresco/adf-process-services-cloud';

import { CommunityCloudComponent } from './community-cloud.component';
import { CommunityTasksCloudDemoComponent } from './community-task-cloud.component';
import { CommunityCloudFiltersDemoComponent } from './community-filters.component';
import { CommunityProcessesCloudDemoComponent } from './community-processes-cloud.component';
import { CommunityStartProcessCloudDemoComponent } from './community-start-process-cloud.component';
import { CommunityStartTaskCloudDemoComponent } from './community-start-task-cloud.component';
import { CommunityProcessDetailsCloudDemoComponent } from './community-process-details-cloud.component';
import { CommunityTaskDetailsCloudDemoComponent } from './community-task-details-cloud.component';
import { AppCloudSharedModule } from '../shared/cloud.shared.module';

const routes: Routes = [
    {
        path: '',
        component: CommunityCloudComponent,
        children: [
            {
                path: 'tasks',
                component: CommunityTasksCloudDemoComponent
            },
            {
                path: 'processes',
                component: CommunityProcessesCloudDemoComponent
            },
            {
                path: 'start-task',
                component: CommunityStartTaskCloudDemoComponent
            },
            {
                path: 'start-process',
                component: CommunityStartProcessCloudDemoComponent
            },
            {
                path: 'task-details/:taskId',
                component: CommunityTaskDetailsCloudDemoComponent
            },
            {
                path: 'process-details/:processInstanceId',
                component: CommunityProcessDetailsCloudDemoComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ProcessServicesCloudModule,
        RouterModule.forChild(routes),
        AppCloudSharedModule,
        FlexLayoutModule
    ],
    declarations: [
        CommunityCloudComponent,
        CommunityTasksCloudDemoComponent,
        CommunityCloudFiltersDemoComponent,
        CommunityProcessesCloudDemoComponent,
        CommunityStartProcessCloudDemoComponent,
        CommunityStartTaskCloudDemoComponent,
        CommunityProcessDetailsCloudDemoComponent,
        CommunityTaskDetailsCloudDemoComponent
    ],
    providers: [
        { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService },
        { provide: TASK_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
    ]
})
export class AppCommunityModule {}
