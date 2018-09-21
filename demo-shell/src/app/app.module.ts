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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppConfigService, TRANSLATION_PROVIDER, DebugAppConfigService, CoreModule } from '@alfresco/adf-core';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/search/search-bar.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { SearchExtendedComponent } from './components/search/search-extended.component';
import { AboutComponent } from './components/about/about.component';
import { LogComponent } from './components/log/log.component';
import { FormComponent } from './components/form/form.component';
import { FormListComponent } from './components/form/form-list.component';
import { FormLoadingComponent } from './components/form/form-loading.component';
import { CustomSourcesComponent } from './components/files/custom-sources.component';
import { OverlayViewerComponent } from './components/overlay-viewer/overlay-viewer.component';

import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { DataTableComponent } from './components/datatable/datatable.component';
import { TrashcanComponent } from './components/trashcan/trashcan.component';
import { FilesComponent } from './components/files/files.component';
import { WebscriptComponent } from './components/webscript/webscript.component';
import { TagComponent } from './components/tag/tag.component';
import { SocialComponent } from './components/social/social.component';
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
import { BreadcrumbDemoComponent } from './components/breadcrumb-demo/breadcrumb-demo.component';
import { TaskListDemoComponent } from './components/task-list-demo/task-list-demo.component';
import { ProcessListDemoComponent } from './components/process-list-demo/process-list-demo.component';
import { ContentNodeSelectorComponent } from './components/content-node-selector/content-node-selector.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ReportIssueComponent } from './components/report-issue/report-issue.component';
import { CardViewComponent } from './components/card-view/card-view.component';
import { HeaderDataComponent } from './components/header-data/header-data.component';
import { ConfigEditorComponent } from './components/config-editor/config-editor.component';
import { HeaderDataService } from './components/header-data/header-data.service';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ContentModule } from '@alfresco/adf-content-services';
import { InsightsModule } from '@alfresco/adf-insights';
import { ProcessModule } from '@alfresco/adf-process-services';
import { AuthBearerInterceptor } from './services';
import { ProcessCloudModule } from '@alfresco/adf-process-services-cloud';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        routing,
        FormsModule,
        HttpClientModule,
        MaterialModule,
        FlexLayoutModule,
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        InsightsModule.forRoot(),
        ProcessModule.forRoot(),
        ThemePickerModule,
        ChartsModule,
        MonacoEditorModule.forRoot(),
        ProcessCloudModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        LogoutComponent,
        SettingsComponent,
        AppLayoutComponent,
        HomeComponent,
        SearchBarComponent,
        SearchResultComponent,
        SearchExtendedComponent,
        AboutComponent,
        LogComponent,
        ProcessServiceComponent,
        ShowDiagramComponent,
        FormViewerComponent,
        FormNodeViewerComponent,
        AppsViewComponent,
        DataTableComponent,
        FilesComponent,
        TrashcanComponent,
        FormComponent,
        FormListComponent,
        WebscriptComponent,
        TagComponent,
        SocialComponent,
        CustomSourcesComponent,
        VersionManagerDialogAdapterComponent,
        MetadataDialogAdapterComponent,
        TaskAttachmentsComponent,
        ProcessAttachmentsComponent,
        OverlayViewerComponent,
        SharedLinkViewComponent,
        FormLoadingComponent,
        DemoPermissionComponent,
        FormLoadingComponent,
        BreadcrumbDemoComponent,
        NotificationsComponent,
        CardViewComponent,
        ContentNodeSelectorComponent,
        ReportIssueComponent,
        TaskListDemoComponent,
        ProcessListDemoComponent,
        HeaderDataComponent,
        ConfigEditorComponent
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
        HeaderDataService
    ],
    entryComponents: [
        VersionManagerDialogAdapterComponent,
        MetadataDialogAdapterComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
