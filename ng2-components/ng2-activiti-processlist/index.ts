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

import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdSelectModule } from '@angular/material';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { CardViewUpdateService, CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

import { CreateProcessAttachmentComponent } from './src/components/create-process-attachment.component';
import { ProcessAttachmentListComponent } from './src/components/process-attachment-list.component';
import { ProcessAuditDirective } from './src/components/process-audit.directive';
import { ProcessCommentsComponent } from './src/components/process-comments.component';
import { ProcessFiltersComponent } from './src/components/process-filters.component';
import { ProcessInstanceDetailsComponent } from './src/components/process-instance-details.component';
import { ProcessInstanceHeaderComponent } from './src/components/process-instance-header.component';
import { ProcessInstanceTasksComponent } from './src/components/process-instance-tasks.component';
import { ProcessInstanceVariablesComponent } from './src/components/process-instance-variables.component';
import { ProcessInstanceListComponent } from './src/components/processlist.component';
import { StartProcessInstanceComponent } from './src/components/start-process.component';
export {ProcessAttachmentListComponent} from './src/components/process-attachment-list.component';
export {ProcessCommentsComponent} from './src/components/process-comments.component';
export {ProcessFiltersComponent} from './src/components/process-filters.component';
export {ProcessInstanceDetailsComponent} from './src/components/process-instance-details.component';
export {ProcessAuditDirective} from './src/components/process-audit.directive';
export {ProcessInstanceHeaderComponent} from './src/components/process-instance-header.component';
export {ProcessInstanceTasksComponent} from './src/components/process-instance-tasks.component';
export {ProcessInstanceVariablesComponent} from './src/components/process-instance-variables.component';
export {ProcessInstanceListComponent} from './src/components/processlist.component';
export {StartProcessInstanceComponent} from './src/components/start-process.component';

import { ProcessUploadService } from './src/services/process-upload.service';
import { ProcessService } from './src/services/process.service';
export { ProcessService } from './src/services/process.service';
export { ProcessUploadService } from './src/services/process-upload.service';

// models
export * from './src/models/filter-process.model';
export * from './src/models/process-definition.model';
export * from './src/models/process-instance.model';
export * from './src/models/process-instance-filter.model';
export * from './src/models/process-instance-variable.model';

// Old derprecate export
import {CreateProcessAttachmentComponent as ActivitiCreateProcessAttachmentComponent } from './src/components/create-process-attachment.component';
import {ProcessAttachmentListComponent as ActivitiProcessAttachmentListComponent } from './src/components/process-attachment-list.component';
import {ProcessCommentsComponent as ActivitiProcessComments } from './src/components/process-comments.component';
import {ProcessFiltersComponent as ActivitiProcessFilters } from './src/components/process-filters.component';
import {ProcessInstanceDetailsComponent as ActivitiProcessInstanceDetails } from './src/components/process-instance-details.component';
import {ProcessInstanceHeaderComponent as ActivitiProcessInstanceHeader } from './src/components/process-instance-header.component';
import {ProcessInstanceTasksComponent as ActivitiProcessInstanceTasks } from './src/components/process-instance-tasks.component';
import {ProcessInstanceVariablesComponent as ActivitiProcessInstanceVariables } from './src/components/process-instance-variables.component';
import {ProcessInstanceListComponent as ActivitiProcessInstanceListComponent } from './src/components/processlist.component';
import {StartProcessInstanceComponent as ActivitiStartProcessInstance } from './src/components/start-process.component';
import {ProcessService as ActivitiProcessService } from './src/services/process.service';
export {CreateProcessAttachmentComponent as ActivitiCreateProcessAttachmentComponent } from './src/components/create-process-attachment.component';
export {ProcessAttachmentListComponent as ActivitiProcessAttachmentListComponent} from './src/components/process-attachment-list.component';
export {ProcessCommentsComponent as ActivitiProcessComments } from './src/components/process-comments.component';
export {ProcessFiltersComponent as ActivitiProcessFilters} from './src/components/process-filters.component';
export {ProcessInstanceDetailsComponent as ActivitiProcessInstanceDetails} from './src/components/process-instance-details.component';
export {ProcessInstanceHeaderComponent as ActivitiProcessInstanceHeader} from './src/components/process-instance-header.component';
export {ProcessInstanceTasksComponent as ActivitiProcessInstanceTasks} from './src/components/process-instance-tasks.component';
export {ProcessInstanceVariablesComponent as ActivitiProcessInstanceVariables} from './src/components/process-instance-variables.component';
export {ProcessInstanceListComponent as ActivitiProcessInstanceListComponent} from './src/components/processlist.component';
export {StartProcessInstanceComponent as ActivitiStartProcessInstance} from './src/components/start-process.component';
export {ProcessService as ActivitiProcessService} from './src/services/process.service';

export const ACTIVITI_PROCESSLIST_DIRECTIVES: [any] = [
    ProcessInstanceListComponent,
    ProcessFiltersComponent,
    ProcessInstanceDetailsComponent,
    ProcessAuditDirective,
    ProcessInstanceHeaderComponent,
    ProcessInstanceTasksComponent,
    ProcessInstanceVariablesComponent,
    ProcessCommentsComponent,
    StartProcessInstanceComponent,
    ProcessAttachmentListComponent,
    CreateProcessAttachmentComponent,

    // Old Deprecated export
    ActivitiProcessInstanceListComponent,
    ActivitiProcessFilters,
    ActivitiProcessInstanceHeader,
    ActivitiProcessInstanceTasks,
    ActivitiProcessInstanceVariables,
    ActivitiProcessComments,
    ActivitiProcessInstanceDetails,
    ActivitiStartProcessInstance,
    ActivitiProcessAttachmentListComponent,
    ActivitiCreateProcessAttachmentComponent
];

export const ACTIVITI_PROCESSLIST_PROVIDERS: [any] = [
    ProcessService,
    ProcessUploadService,
    CardViewUpdateService,

    // Old Deprecated import
    ActivitiProcessService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        ActivitiFormModule,
        ActivitiTaskListModule,
        MdProgressSpinnerModule,
        MdButtonModule,
        MdCardModule,
        MdInputModule,
        MdSelectModule
    ],
    declarations: [
        ...ACTIVITI_PROCESSLIST_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_PROCESSLIST_PROVIDERS,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-activiti-processlist',
                source: 'assets/ng2-activiti-processlist'
            }
        }
    ],
    exports: [
        ...ACTIVITI_PROCESSLIST_DIRECTIVES
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
