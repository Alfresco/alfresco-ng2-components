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

import { CoreModule, AppConfigService } from 'ng2-alfresco-core';
import { SearchModule } from 'ng2-alfresco-search';
import { LoginModule } from 'ng2-alfresco-login';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { UploadModule } from 'ng2-alfresco-upload';
import { TagModule } from 'ng2-alfresco-tag';
import { SocialModule } from 'ng2-alfresco-social';
import { WebScriptModule } from 'ng2-alfresco-webscript';
import { ViewerModule } from 'ng2-alfresco-viewer';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { ActivitiProcessListModule } from 'ng2-activiti-processlist';
import { UserInfoComponentModule } from 'ng2-alfresco-userinfo';
import { AnalyticsModule } from 'ng2-activiti-analytics';
import { DiagramsModule } from 'ng2-activiti-diagrams';

import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { CustomEditorsModule } from './components/activiti/custom-editor/custom-editor.component';
import { Editor3DModule } from 'ng2-3d-editor';
import { ChartsModule } from 'ng2-charts';
import { CreateFolderDialog } from './dialogs/create-folder.dialog';
import { DebugAppConfigService } from './services/debug-app-config.service';

import {
    HomeComponent,
    DataTableDemoComponent,
    SearchComponent,
    SearchBarComponent,
    LoginDemoComponent,
    ActivitiDemoComponent,
    ActivitiShowDiagramComponent,
    ActivitiAppsView,
    FormViewer,
    WebscriptComponent,
    TagComponent,
    SocialComponent,
    AboutComponent,
    FilesComponent,
    FormNodeViewer,
    SettingsComponent,
    FormDemoComponent
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
        ChartsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        DataTableDemoComponent,
        SearchComponent,
        SearchBarComponent,
        LoginDemoComponent,
        ActivitiDemoComponent,
        ActivitiShowDiagramComponent,
        ActivitiAppsView,
        FormViewer,
        WebscriptComponent,
        TagComponent,
        SocialComponent,
        AboutComponent,
        FilesComponent,
        FormNodeViewer,
        CreateFolderDialog,
        SettingsComponent,
        FormDemoComponent
    ],
    providers: [
        { provide: AppConfigService, useClass: DebugAppConfigService }
    ],
    bootstrap: [ AppComponent ],
    entryComponents: [
        CreateFolderDialog
    ]
})
export class AppModule { }
