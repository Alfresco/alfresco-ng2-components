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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppConfigService, TRANSLATION_PROVIDER, DebugAppConfigService, CoreModule, CoreAutomationService } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/search/search-bar.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { SearchExtendedComponent } from './components/search/search-extended.component';
import { LogComponent } from './components/log/log.component';
import { FormComponent } from './components/form/form.component';
import { FormListComponent } from './components/form/form-list.component';
import { FormLoadingComponent } from './components/form/form-loading.component';
import { OverlayViewerComponent } from './components/overlay-viewer/overlay-viewer.component';

import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { FilesComponent } from './components/files/files.component';
import { VersionManagerDialogAdapterComponent } from './components/files/version-manager-dialog-adapter.component';
import { MetadataDialogAdapterComponent } from './components/files/metadata-dialog-adapter.component';

import { ThemePickerModule } from './components/theme-picker/theme-picker';

import { routing } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskAttachmentsComponent } from './components/process-service/task-attachments.component';
import { ProcessAttachmentsComponent } from './components/process-service/process-attachments.component';
import { SharedLinkViewComponent } from './components/shared-link-view/shared-link-view.component';
import { DemoPermissionComponent } from './components/permissions/demo-permissions.component';
import { PreviewService } from './services/preview.service';
import { ReportIssueComponent } from './components/report-issue/report-issue.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ContentModule } from '@alfresco/adf-content-services';
import { InsightsModule } from '@alfresco/adf-insights';
import { ProcessModule } from '@alfresco/adf-process-services';
import { AuthBearerInterceptor } from './services';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { AppExtensionsModule } from './app-extension.module';
import { TreeViewSampleComponent } from './components/tree-view/tree-view-sample.component';
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
import { TemplateDemoComponent } from './components/template-list/template-demo.component';
import { PeopleGroupCloudDemoComponent } from './components/cloud/people-groups-cloud-demo.component';
import { CloudSettingsComponent } from './components/cloud/cloud-settings.component';
import { NestedMenuPositionDirective } from './components/cloud/directives/nested-menu-position.directive';
import { ConfirmDialogExampleComponent } from './components/confirm-dialog/confirm-dialog-example.component';
import { FormCloudDemoComponent } from './components/app-layout/cloud/form-demo/cloud-form-demo.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        routing,
        FormsModule,
        HttpClientModule,
        MaterialModule,
        AppExtensionsModule,
        FlexLayoutModule,
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        InsightsModule.forRoot(),
        ProcessModule.forRoot(),
        ProcessServicesCloudModule,
        ExtensionsModule.forRoot(),
        ThemePickerModule,
        ChartsModule,
        MonacoEditorModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        LogoutComponent,
        AppLayoutComponent,
        HomeComponent,
        SearchBarComponent,
        SearchResultComponent,
        SearchExtendedComponent,
        LogComponent,
        ProcessServiceComponent,
        ShowDiagramComponent,
        FormViewerComponent,
        FormNodeViewerComponent,
        AppsViewComponent,
        FilesComponent,
        FormComponent,
        FormListComponent,
        VersionManagerDialogAdapterComponent,
        MetadataDialogAdapterComponent,
        TaskAttachmentsComponent,
        ProcessAttachmentsComponent,
        OverlayViewerComponent,
        SharedLinkViewComponent,
        FormLoadingComponent,
        DemoPermissionComponent,
        FormLoadingComponent,
        ReportIssueComponent,
        TreeViewSampleComponent,
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
        TemplateDemoComponent,
        PeopleGroupCloudDemoComponent,
        CloudSettingsComponent,
        NestedMenuPositionDirective,
        ConfirmDialogExampleComponent,
        FormCloudDemoComponent,
        ConfirmDialogExampleComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS, useClass:
            AuthBearerInterceptor, multi: true
        },
        { provide: AppConfigService, useClass: DebugAppConfigService }, // not use this service in production
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'lazy-loading',
                source: 'resources/lazy-loading'
            }
        },
        PreviewService,
        CoreAutomationService
    ],
    entryComponents: [
        VersionManagerDialogAdapterComponent,
        MetadataDialogAdapterComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(automationService: CoreAutomationService) {
        automationService.setup();
    }
}
