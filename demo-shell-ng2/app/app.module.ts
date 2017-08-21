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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AnalyticsModule } from 'ng2-activiti-analytics';
import { DiagramsModule } from 'ng2-activiti-diagrams';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiProcessListModule } from 'ng2-activiti-processlist';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { AppConfigService, CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { LoginModule } from 'ng2-alfresco-login';
import { SearchModule } from 'ng2-alfresco-search';
import { SocialModule } from 'ng2-alfresco-social';
import { TagModule } from 'ng2-alfresco-tag';
import { UploadModule } from 'ng2-alfresco-upload';
import { UserInfoComponentModule } from 'ng2-alfresco-userinfo';
import { ViewerModule } from 'ng2-alfresco-viewer';
import { WebScriptModule } from 'ng2-alfresco-webscript';

import { Editor3DModule } from 'ng2-3d-editor';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { CustomEditorsModule } from './components/activiti/custom-editor/custom-editor.component';
import { FormListDemoComponent } from './components/form/form-list-demo.component';
import { ThemePickerModule } from './components/theme-picker/theme-picker';
import { MaterialModule } from './material.module';
import { DebugAppConfigService } from './services/debug-app-config.service';

import { FavoritesComponent } from './components/files/favorites.component';
import { RecentComponent } from './components/files/recent.component';
import { SharedLinksComponent } from './components/files/shared-links.component';
import { SitesComponent } from './components/files/sites.component';
import { TrashcanComponent } from './components/files/trashcan.component';

import {
    AboutComponent,
    ActivitiAppsViewComponent,
    ActivitiDemoComponent,
    ActivitiProcessAttachmentsComponent,
    ActivitiShowDiagramComponent,
    ActivitiTaskAttachmentsComponent,
    ActivitiTasklistPaginatorComponent,
    DataTableDemoComponent,
    FilesComponent,
    FormDemoComponent,
    FormNodeViewerComponent,
    FormViewerComponent,
    HomeComponent,
    LoginDemoComponent,
    SearchBarComponent,
    SearchComponent,
    SettingsComponent,
    SocialComponent,
    TagComponent,
    WebscriptComponent
} from './components/index';

let appConfigFile = 'app.config-dev.json';
if (process.env.ENV === 'production') {
    appConfigFile = 'app.config-prod.json';
}

@NgModule({
    imports: [
        BrowserModule,
        routing,
        CoreModule.forRoot({
            appConfigFile: appConfigFile
        }),
        MaterialModule,
        LoginModule.forRoot(),
        SearchModule.forRoot(),
        DataTableModule.forRoot(),
        DocumentListModule.forRoot(),
        UploadModule.forRoot(),
        TagModule.forRoot(),
        SocialModule.forRoot(),
        WebScriptModule.forRoot(),
        ViewerModule.forRoot(),
        ActivitiFormModule.forRoot(),
        ActivitiTaskListModule.forRoot(),
        ActivitiProcessListModule.forRoot(),
        UserInfoComponentModule.forRoot(),
        AnalyticsModule.forRoot(),
        DiagramsModule.forRoot(),
        CustomEditorsModule,
        Editor3DModule.forRoot(),
        ChartsModule,
        ThemePickerModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        DataTableDemoComponent,
        SearchComponent,
        SearchBarComponent,
        LoginDemoComponent,
        ActivitiDemoComponent,
        ActivitiTaskAttachmentsComponent,
        ActivitiProcessAttachmentsComponent,
        ActivitiTasklistPaginatorComponent,
        ActivitiShowDiagramComponent,
        ActivitiAppsViewComponent,
        FormViewerComponent,
        WebscriptComponent,
        TagComponent,
        SocialComponent,
        AboutComponent,
        FilesComponent,
        FormNodeViewerComponent,
        SettingsComponent,
        FormDemoComponent,
        FormListDemoComponent,
        TrashcanComponent,
        SharedLinksComponent,
        SitesComponent,
        FavoritesComponent,
        RecentComponent
    ],
    providers: [
        { provide: AppConfigService, useClass: DebugAppConfigService },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
