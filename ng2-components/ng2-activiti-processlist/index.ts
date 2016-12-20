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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';

import {
    ActivitiProcessInstanceListComponent,
    ActivitiProcessFilters,
    ActivitiProcessInstanceHeader,
    ActivitiProcessInstanceTasks,
    ActivitiProcessInstanceVariables,
    ActivitiProcessComments,
    ActivitiProcessInstanceDetails,
    ActivitiStartProcessInstance
} from './src/components/index';

import { ActivitiProcessService } from './src/services/activiti-process.service';

// components
export * from './src/components/activiti-processlist.component';
export * from './src/components/activiti-filters.component';
export * from './src/components/activiti-process-instance-details.component';
export * from './src/components/activiti-start-process.component';

// models
export * from './src/models/index';

// services
export * from './src/services/activiti-process.service';

export const ACTIVITI_PROCESSLIST_DIRECTIVES: [any] = [
    ActivitiProcessInstanceListComponent,
    ActivitiProcessFilters,
    ActivitiProcessInstanceDetails,
    ActivitiProcessInstanceHeader,
    ActivitiProcessInstanceTasks,
    ActivitiProcessInstanceVariables,
    ActivitiProcessComments,
    ActivitiStartProcessInstance
];

export const ACTIVITI_PROCESSLIST_PROVIDERS: [any] = [
    ActivitiProcessService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        ActivitiFormModule,
        ActivitiTaskListModule
    ],
    declarations: [
        ...ACTIVITI_PROCESSLIST_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_PROCESSLIST_PROVIDERS
    ],
    exports: [
        ...ACTIVITI_PROCESSLIST_DIRECTIVES
    ]
})
export class ActivitiProcessListModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ActivitiProcessListModule,
            providers: [
                ...ACTIVITI_PROCESSLIST_PROVIDERS
            ]
        };
    }
}
