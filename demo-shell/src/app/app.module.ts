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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService, DebugAppConfigService, CoreModule, CoreAutomationService, AuthModule, provideTranslations } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LogoutComponent } from './components/logout/logout.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SearchBarComponent } from './components/search/search-bar.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { FormComponent } from './components/form/form.component';
import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { FilesComponent } from './components/files/files.component';
import { VersionManagerDialogAdapterComponent } from './components/files/version-manager-dialog-adapter.component';
import { appRoutes } from './app.routes';
import { TaskAttachmentsComponent } from './components/process-service/task-attachments.component';
import { ProcessAttachmentsComponent } from './components/process-service/process-attachments.component';
import { DemoPermissionComponent } from './components/permissions/demo-permissions.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ContentModule } from '@alfresco/adf-content-services';
import { InsightsModule } from '@alfresco/adf-insights';
import { ProcessModule } from '@alfresco/adf-process-services';
import { CloudLayoutComponent } from './components/cloud/cloud-layout.component';
import { AppsCloudDemoComponent } from './components/cloud/apps-cloud-demo.component';
import { TasksCloudDemoComponent } from './components/cloud/tasks-cloud-demo.component';
import { ProcessesCloudDemoComponent } from './components/cloud/processes-cloud-demo.component';
import { TaskDetailsCloudDemoComponent } from './components/cloud/task-details-cloud-demo.component';
import { CloudViewerComponent } from './components/cloud/cloud-viewer.component';
import { ProcessDetailsCloudDemoComponent } from './components/cloud/process-details-cloud-demo.component';
import { StartTaskCloudDemoComponent } from './components/cloud/start-task-cloud-demo.component';
import { StartProcessCloudDemoComponent } from './components/cloud/start-process-cloud-demo.component';
import { CloudBreadcrumbsComponent } from './components/cloud/cloud-breadcrumb-component';
import { CloudFiltersDemoComponent } from './components/cloud/cloud-filters-demo.component';
import { FormCloudDemoComponent } from './components/app-layout/cloud/form-demo/cloud-form-demo.component';
import { environment } from '../environments/environment';
import { AppCloudSharedModule } from './components/cloud/shared/cloud.shared.module';
import { DemoErrorComponent } from './components/error/demo-error.component';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { RouterModule } from '@angular/router';
import { ProcessCloudLayoutComponent } from './components/cloud/process-cloud-layout.component';
import { CustomEditorComponent, CustomWidgetComponent } from './components/cloud/custom-form-components/custom-editor.component';
import { SearchFilterChipsComponent } from './components/search/search-filter-chips.component';
import { UserInfoComponent } from './components/app-layout/user-info/user-info.component';

@NgModule({
    imports: [
        BrowserModule,
        environment.e2e ? NoopAnimationsModule : BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes, { useHash: true, relativeLinkResolution: 'legacy' }),
        ...(environment.oidc ? [AuthModule.forRoot({ useHash: true })] : []),
        FormsModule,
        HttpClientModule,
        MaterialModule,
        TranslateModule.forRoot(),
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        InsightsModule.forRoot(),
        ProcessModule.forRoot(),
        ProcessServicesCloudModule.forRoot(),
        ExtensionsModule.forRoot(),
        NgChartsModule,
        AppCloudSharedModule,
        MonacoEditorModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LogoutComponent,
        AppLayoutComponent,
        UserInfoComponent,
        SearchBarComponent,
        SearchResultComponent,
        ProcessServiceComponent,
        ShowDiagramComponent,
        FormViewerComponent,
        FormNodeViewerComponent,
        AppsViewComponent,
        FilesComponent,
        FormComponent,
        VersionManagerDialogAdapterComponent,
        TaskAttachmentsComponent,
        ProcessAttachmentsComponent,
        DemoPermissionComponent,
        DemoErrorComponent,
        CloudLayoutComponent,
        AppsCloudDemoComponent,
        TasksCloudDemoComponent,
        ProcessesCloudDemoComponent,
        TaskDetailsCloudDemoComponent,
        CloudViewerComponent,
        ProcessDetailsCloudDemoComponent,
        StartTaskCloudDemoComponent,
        StartProcessCloudDemoComponent,
        CloudBreadcrumbsComponent,
        CloudFiltersDemoComponent,
        FormCloudDemoComponent,
        CustomEditorComponent,
        CustomWidgetComponent,
        ProcessCloudLayoutComponent,
        SearchFilterChipsComponent
    ],
    providers: [
        { provide: AppConfigService, useClass: DebugAppConfigService }, // not use this service in production
        provideTranslations('app', 'resources')
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(automationService: CoreAutomationService) {
        automationService.setup();
    }
}
