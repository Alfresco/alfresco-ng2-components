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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@alfresco/adf-core';
import { MaterialModule } from '../material.module';
import { ProcessCommentsModule } from '../process-comments/process-comments.module';
import { TaskListModule } from '../task-list/task-list.module';
import { PeopleModule } from '../people/people.module';
import { ContentWidgetModule } from '../form/widgets/content-widget/content-widget.module';
import { ProcessAuditDirective } from './components/process-audit.directive';
import { ProcessFiltersComponent } from './components/process-filters.component';
import { ProcessInstanceDetailsComponent } from './components/process-instance-details.component';
import { ProcessInstanceHeaderComponent } from './components/process-instance-header.component';
import { ProcessInstanceTasksComponent } from './components/process-instance-tasks.component';
import { ProcessInstanceListComponent } from './components/process-list.component';
import { StartProcessInstanceComponent } from './components/start-process.component';
import { FormModule } from '../form/form.module';
import { ProcessNamePipe } from '../pipes/process-name.pipe';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        TaskListModule,
        PeopleModule,
        ContentWidgetModule,
        ProcessCommentsModule,
        FormModule
    ],
    declarations: [
        ProcessInstanceListComponent,
        ProcessFiltersComponent,
        ProcessInstanceDetailsComponent,
        ProcessAuditDirective,
        ProcessInstanceHeaderComponent,
        ProcessInstanceTasksComponent,
        StartProcessInstanceComponent
    ],
    exports: [
        ProcessInstanceListComponent,
        ProcessFiltersComponent,
        ProcessInstanceDetailsComponent,
        ProcessAuditDirective,
        ProcessInstanceHeaderComponent,
        ProcessInstanceTasksComponent,
        StartProcessInstanceComponent
    ],
    providers: [
        ProcessNamePipe
    ]
})
export class ProcessListModule {
}
