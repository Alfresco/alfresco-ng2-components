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
import { MdIconModule, MdButtonModule } from '@angular/material';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiPeopleService } from './src/services/activiti-people.service';
import { ActivitiTaskListService } from './src/services/activiti-tasklist.service';

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
    ActivitiStartTaskButton,
    ActivitiPeopleSearch,
    TaskAttachmentListComponent,
    ActivitiCreateTaskAttachmentComponent,
    ActivitiPeopleList
} from './src/components/index';

export * from './src/components/index';
export * from './src/services/activiti-tasklist.service';
export * from './src/services/activiti-people.service';
export * from  './src/models/index';

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
    ActivitiStartTaskButton,
    ActivitiPeopleSearch,
    TaskAttachmentListComponent,
    ActivitiCreateTaskAttachmentComponent,
    ActivitiPeopleList
];

export const ACTIVITI_TASKLIST_PROVIDERS: any[] = [
    ActivitiTaskListService,
    ActivitiPeopleService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        ActivitiFormModule,
        MdIconModule,
        MdButtonModule
    ],
    declarations: [
        ...ACTIVITI_TASKLIST_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_TASKLIST_PROVIDERS
    ],
    exports: [
        ...ACTIVITI_TASKLIST_DIRECTIVES,
        MdIconModule,
        MdButtonModule
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
