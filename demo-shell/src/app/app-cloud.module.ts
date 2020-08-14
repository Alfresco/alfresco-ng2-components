/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@alfresco/adf-core';
import { MaterialModule } from './material.module';
import { InsightsModule } from '@alfresco/adf-insights';
import { CloudLayoutComponent } from './components/cloud/cloud-layout.component';
import { AppsCloudDemoComponent } from './components/cloud/apps-cloud-demo.component';
import { TasksCloudDemoComponent } from './components/cloud/tasks-cloud-demo.component';
import { ProcessesCloudDemoComponent } from './components/cloud/processes-cloud-demo.component';
import { TaskDetailsCloudDemoComponent } from './components/cloud/task-details-cloud-demo.component';
import { TaskHeaderCloudDemoComponent } from './components/cloud/task-header-cloud-demo.component';
import { CloudViewerComponent } from './components/cloud/cloud-viewer.component';
import { ProcessDetailsCloudDemoComponent } from './components/cloud/process-details-cloud-demo.component';
import { StartTaskCloudDemoComponent } from './components/cloud/start-task-cloud-demo.component';
import { StartProcessCloudDemoComponent } from './components/cloud/start-process-cloud-demo.component';
import { CloudBreadcrumbsComponent } from './components/cloud/cloud-breadcrumb-component';
import { CloudFiltersDemoComponent } from './components/cloud/cloud-filters-demo.component';
import { PeopleGroupCloudDemoComponent } from './components/cloud/people-groups-cloud-demo.component';
import { FormCloudDemoComponent } from './components/app-layout/cloud/form-demo/cloud-form-demo.component';
import { AppCloudSharedModule } from './components/cloud/shared/cloud.shared.module';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        CoreModule.forRoot(),
        InsightsModule.forRoot(),
        ProcessServicesCloudModule.forRoot(),
        AppCloudSharedModule,
        MonacoEditorModule.forRoot(),
        RouterModule
    ],
    declarations: [
        CloudLayoutComponent,
        AppsCloudDemoComponent,
        TasksCloudDemoComponent,
        ProcessesCloudDemoComponent,
        TaskDetailsCloudDemoComponent,
        TaskHeaderCloudDemoComponent,
        CloudViewerComponent,
        ProcessDetailsCloudDemoComponent,
        StartTaskCloudDemoComponent,
        StartProcessCloudDemoComponent,
        CloudBreadcrumbsComponent,
        CloudFiltersDemoComponent,
        PeopleGroupCloudDemoComponent,
        FormCloudDemoComponent
    ]
})
export class AppCloud {}
