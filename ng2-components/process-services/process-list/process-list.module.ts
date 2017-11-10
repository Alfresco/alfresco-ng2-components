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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../form';
import { MaterialModule } from '../material.module';

import { CardViewModule, CardViewUpdateService, DataColumnModule, DataTableModule, DirectiveModule, PipeModule, TRANSLATION_PROVIDER } from '@adf/core';
import { TaskListModule } from '../task-list';

import { CreateProcessAttachmentComponent } from './components/create-process-attachment.component';
import { ProcessAttachmentListComponent } from './components/process-attachment-list.component';
import { ProcessAuditDirective } from './components/process-audit.directive';
import { ProcessCommentsComponent } from './components/process-comments.component';
import { ProcessFiltersComponent } from './components/process-filters.component';
import { ProcessInstanceDetailsComponent } from './components/process-instance-details.component';
import { ProcessInstanceHeaderComponent } from './components/process-instance-header.component';
import { ProcessInstanceTasksComponent } from './components/process-instance-tasks.component';
import { ProcessInstanceListComponent } from './components/process-list.component';
import { StartProcessInstanceComponent } from './components/start-process.component';

import { ProcessService } from './services/process.service';

@NgModule({
    imports: [
        CommonModule,
        DataTableModule,
        FormModule,
        TaskListModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule,
        CardViewModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        DataColumnModule,
        DirectiveModule
    ],
    declarations: [
        ProcessInstanceListComponent,
        ProcessFiltersComponent,
        ProcessInstanceDetailsComponent,
        ProcessAuditDirective,
        ProcessInstanceHeaderComponent,
        ProcessInstanceTasksComponent,
        ProcessCommentsComponent,
        StartProcessInstanceComponent,
        ProcessAttachmentListComponent,
        CreateProcessAttachmentComponent
    ],
    providers: [
        ProcessService,
        CardViewUpdateService,
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
        ProcessInstanceListComponent,
        ProcessFiltersComponent,
        ProcessInstanceDetailsComponent,
        ProcessAuditDirective,
        ProcessInstanceHeaderComponent,
        ProcessInstanceTasksComponent,
        ProcessCommentsComponent,
        StartProcessInstanceComponent,
        ProcessAttachmentListComponent,
        CreateProcessAttachmentComponent
    ]
})
export class ProcessListModule {}
