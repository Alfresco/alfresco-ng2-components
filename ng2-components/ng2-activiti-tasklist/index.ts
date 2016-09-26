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

import {
    ActivitiApps,
    ActivitiTaskList,
    ActivitiTaskDetails,
    ActivitiFilters,
    NoTaskDetailsTemplateComponent,
    ActivitiChecklist,
    ActivitiComments,
    ActivitiPeople,
    ActivitiTaskHeader,
    ActivitiStartProcessButton
} from './src/components/index';

import { ActivitiTaskListService } from './src/services/activiti-tasklist.service';

export * from './src/components/index';
export * from './src/services/activiti-tasklist.service';
export * from  './src/models/filter.model';

export const ACTIVITI_TASKLIST_DIRECTIVES: any[] = [
    NoTaskDetailsTemplateComponent,
    ActivitiApps,
    ActivitiFilters,
    ActivitiTaskList,
    ActivitiTaskDetails,
    ActivitiChecklist,
    ActivitiComments,
    ActivitiPeople,
    ActivitiTaskHeader,
    ActivitiStartProcessButton
];

export const ACTIVITI_TASKLIST_PROVIDERS: any[] = [
    ActivitiTaskListService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        ActivitiFormModule
    ],
    declarations: [
        ...ACTIVITI_TASKLIST_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_TASKLIST_PROVIDERS
    ],
    exports: [
        ...ACTIVITI_TASKLIST_DIRECTIVES
    ]
})
export class ActivitiTaskListModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ActivitiTaskListModule,
            providers: [
                ...ACTIVITI_TASKLIST_PROVIDERS
            ]
        };
    }
}
