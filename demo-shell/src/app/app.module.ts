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

import {
    AppConfigModule, AppConfigService, CoreAutomationService, CoreModule, DebugAppConfigService, TRANSLATION_PROVIDER
} from '@alfresco/adf-core';
import { AuthModule } from '@alfresco/adf-core/auth';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { FormListComponent } from './components/form/form-list.component';
import { FormLoadingComponent } from './components/form/form-loading.component';
import { FormComponent } from './components/form/form.component';
import { HomeComponent } from './components/home/home.component';
import { LogComponent } from './components/log/log.component';
import { LogoutComponent } from './components/logout/logout.component';
import { OverlayViewerComponent } from './components/overlay-viewer/overlay-viewer.component';
import { SearchBarComponent } from './components/search/search-bar.component';
import { SearchExtendedComponent } from './components/search/search-extended.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { MaterialModule } from './material.module';

import { ContentModule } from '@alfresco/adf-content-services';
import { InsightsModule } from '@alfresco/adf-insights';
import { ProcessModule } from '@alfresco/adf-process-services';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { RouterModule } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { FormCloudDemoComponent } from './components/app-layout/cloud/form-demo/cloud-form-demo.component';
import { AspectListSampleComponent } from './components/aspect-list-sample/aspect-list-sample.component';
import { AppsCloudDemoComponent } from './components/cloud/apps-cloud-demo.component';
import { CloudBreadcrumbsComponent } from './components/cloud/cloud-breadcrumb-component';
import { CloudFiltersDemoComponent } from './components/cloud/cloud-filters-demo.component';
import { CloudLayoutComponent } from './components/cloud/cloud-layout.component';
import { CloudViewerComponent } from './components/cloud/cloud-viewer.component';
import {
    CustomEditorComponent,
    CustomWidgetComponent
} from './components/cloud/custom-form-components/custom-editor.component';
import { PeopleGroupCloudDemoComponent } from './components/cloud/people-groups-cloud-demo.component';
import { ProcessCloudLayoutComponent } from './components/cloud/process-cloud-layout.component';
import { ProcessDetailsCloudDemoComponent } from './components/cloud/process-details-cloud-demo.component';
import { ProcessesCloudDemoComponent } from './components/cloud/processes-cloud-demo.component';
import { ServiceTaskListCloudDemoComponent } from './components/cloud/service-task-list-cloud-demo.component';
import { AppCloudSharedModule } from './components/cloud/shared/cloud.shared.module';
import { StartProcessCloudDemoComponent } from './components/cloud/start-process-cloud-demo.component';
import { StartTaskCloudDemoComponent } from './components/cloud/start-task-cloud-demo.component';
import { TaskDetailsCloudDemoComponent } from './components/cloud/task-details-cloud-demo.component';
import { TaskHeaderCloudDemoComponent } from './components/cloud/task-header-cloud-demo.component';
import { TasksCloudDemoComponent } from './components/cloud/tasks-cloud-demo.component';
import { ConfirmDialogExampleComponent } from './components/confirm-dialog/confirm-dialog-example.component';
import { DemoErrorComponent } from './components/error/demo-error.component';
import { FilesComponent } from './components/files/files.component';
import { FilteredSearchComponent } from './components/files/filtered-search.component';
import { MetadataDialogAdapterComponent } from './components/files/metadata-dialog-adapter.component';
import { VersionManagerDialogAdapterComponent } from './components/files/version-manager-dialog-adapter.component';
import { DemoPermissionComponent } from './components/permissions/demo-permissions.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { ProcessAttachmentsComponent } from './components/process-service/process-attachments.component';
import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { TaskAttachmentsComponent } from './components/process-service/task-attachments.component';
import { SharedLinkViewComponent } from './components/shared-link-view/shared-link-view.component';
import { TemplateDemoComponent } from './components/template-list/template-demo.component';
import { ThemePickerModule } from './components/theme-picker/theme-picker';
import { TreeViewSampleComponent } from './components/tree-view/tree-view-sample.component';

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeCs from '@angular/common/locales/cs';
import localeDa from '@angular/common/locales/da';
import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeFi from '@angular/common/locales/fi';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import localeJa from '@angular/common/locales/ja';
import localeNb from '@angular/common/locales/nb';
import localeNl from '@angular/common/locales/nl';
import localePl from '@angular/common/locales/pl';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import localeSv from '@angular/common/locales/sv';
import localeCh from '@angular/common/locales/zh';
import { SearchFilterChipsComponent } from './components/search/search-filter-chips.component';
import { setupAppNotifications } from './services/app-notifications-factory';
import { AppNotificationsService } from './services/app-notifications.service';

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
        // AuthModule.forRoot({ useHash: true }),
        RouterModule.forRoot(appRoutes, { useHash: true, relativeLinkResolution: 'legacy'}),
        FormsModule,
        HttpClientModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        CoreModule.forRoot({useLegacy: true}),
        ContentModule.forRoot(),
        InsightsModule.forRoot(),
        ProcessModule.forRoot(),
        ProcessServicesCloudModule.forRoot(),
        ExtensionsModule.forRoot(),
        ThemePickerModule,
        ChartsModule,
        AppCloudSharedModule,
        AppConfigModule.forRoot(),
        MonacoEditorModule.forRoot()
    ],
    declarations: [
        AppComponent,
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
