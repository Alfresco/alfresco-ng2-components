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
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {
    AppConfigService,
    TRANSLATION_PROVIDER,
    DebugAppConfigService,
    CoreModule,
    CoreAutomationService,
    AuthModule
} from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
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
import { appRoutes } from './app.routes';
import { TaskAttachmentsComponent } from './components/process-service/task-attachments.component';
import { ProcessAttachmentsComponent } from './components/process-service/process-attachments.component';
import { SharedLinkViewComponent } from './components/shared-link-view/shared-link-view.component';
import { DemoPermissionComponent } from './components/permissions/demo-permissions.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ContentModule } from '@alfresco/adf-content-services';
import { InsightsModule } from '@alfresco/adf-insights';
import { ProcessModule } from '@alfresco/adf-process-services';
import { TreeViewSampleComponent } from './components/tree-view/tree-view-sample.component';
import { CloudLayoutComponent } from './components/cloud/cloud-layout.component';
import { AppsCloudDemoComponent } from './components/cloud/apps-cloud-demo.component';
import { TasksCloudDemoComponent } from './components/cloud/tasks-cloud-demo.component';
import { ProcessesCloudDemoComponent } from './components/cloud/processes-cloud-demo.component';
import { TaskDetailsCloudDemoComponent } from './components/cloud/task-details-cloud-demo.component';
import { TaskHeaderCloudDemoComponent } from './components/cloud/task-header-cloud-demo.component';
import { ServiceTaskListCloudDemoComponent } from './components/cloud/service-task-list-cloud-demo.component';
import { CloudViewerComponent } from './components/cloud/cloud-viewer.component';
import { ProcessDetailsCloudDemoComponent } from './components/cloud/process-details-cloud-demo.component';
import { StartTaskCloudDemoComponent } from './components/cloud/start-task-cloud-demo.component';
import { StartProcessCloudDemoComponent } from './components/cloud/start-process-cloud-demo.component';
import { CloudBreadcrumbsComponent } from './components/cloud/cloud-breadcrumb-component';
import { CloudFiltersDemoComponent } from './components/cloud/cloud-filters-demo.component';
import { TemplateDemoComponent } from './components/template-list/template-demo.component';
import { PeopleGroupCloudDemoComponent } from './components/cloud/people-groups-cloud-demo.component';
import { ConfirmDialogExampleComponent } from './components/confirm-dialog/confirm-dialog-example.component';
import { FormCloudDemoComponent } from './components/app-layout/cloud/form-demo/cloud-form-demo.component';
import { environment } from '../environments/environment';
import { AppCloudSharedModule } from './components/cloud/shared/cloud.shared.module';
import { DemoErrorComponent } from './components/error/demo-error.component';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { FilteredSearchComponent } from './components/files/filtered-search.component';
import { RouterModule } from '@angular/router';
import { ProcessCloudLayoutComponent } from './components/cloud/process-cloud-layout.component';
import {
    CustomEditorComponent,
    CustomWidgetComponent
} from './components/cloud/custom-form-components/custom-editor.component';
import { AspectListSampleComponent } from './components/aspect-list-sample/aspect-list-sample.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';
import localeJa from '@angular/common/locales/ja';
import localeNl from '@angular/common/locales/nl';
import localePt from '@angular/common/locales/pt';
import localeNb from '@angular/common/locales/nb';
import localeRu from '@angular/common/locales/ru';
import localeCh from '@angular/common/locales/zh';
import localeAr from '@angular/common/locales/ar';
import localeCs from '@angular/common/locales/cs';
import localePl from '@angular/common/locales/pl';
import localeFi from '@angular/common/locales/fi';
import localeDa from '@angular/common/locales/da';
import localeSv from '@angular/common/locales/sv';
import { setupAppNotifications } from './services/app-notifications-factory';
import { AppNotificationsService } from './services/app-notifications.service';
import { SearchFilterChipsComponent } from './components/search/search-filter-chips.component';
import { UserInfoComponent } from './components/app-layout/user-info/user-info.component';

registerLocaleData(localeFr);
registerLocaleData(localeDe);
registerLocaleData(localeIt);
registerLocaleData(localeEs);
registerLocaleData(localeJa);
registerLocaleData(localeNl);
registerLocaleData(localePt);
registerLocaleData(localeNb);
registerLocaleData(localeRu);
registerLocaleData(localeCh);
registerLocaleData(localeAr);
registerLocaleData(localeCs);
registerLocaleData(localePl);
registerLocaleData(localeFi);
registerLocaleData(localeDa);
registerLocaleData(localeSv);

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
        FlexLayoutModule,
        TranslateModule.forRoot(),
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        InsightsModule.forRoot(),
        ProcessModule.forRoot(),
        ProcessServicesCloudModule.forRoot(),
        ExtensionsModule.forRoot(),
        ThemePickerModule,
        ChartsModule,
        AppCloudSharedModule,
        MonacoEditorModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LogoutComponent,
        AppLayoutComponent,
        UserInfoComponent,
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
        FilteredSearchComponent,
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
        DemoErrorComponent,
        FormLoadingComponent,
        TreeViewSampleComponent,
        AspectListSampleComponent,
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
        TemplateDemoComponent,
        PeopleGroupCloudDemoComponent,
        ConfirmDialogExampleComponent,
        FormCloudDemoComponent,
        ConfirmDialogExampleComponent,
        CustomEditorComponent,
        CustomWidgetComponent,
        ProcessCloudLayoutComponent,
        ServiceTaskListCloudDemoComponent,
        SearchFilterChipsComponent
    ],
    providers: [
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
        AppNotificationsService,
        {
            provide: APP_INITIALIZER,
            useFactory: setupAppNotifications,
            deps: [AppNotificationsService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(automationService: CoreAutomationService) {
        automationService.setup();
    }
}
