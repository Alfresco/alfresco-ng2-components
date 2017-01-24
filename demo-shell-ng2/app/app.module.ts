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

import { CoreModule } from 'ng2-alfresco-core';
import { SearchModule } from 'ng2-alfresco-search';
import { LoginModule } from 'ng2-alfresco-login';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { UploadModule } from 'ng2-alfresco-upload';
import { TagModule } from 'ng2-alfresco-tag';
import { WebScriptModule } from 'ng2-alfresco-webscript';
import { ViewerModule } from 'ng2-alfresco-viewer';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { ActivitiProcessListModule } from 'ng2-activiti-processlist';
import { UserInfoComponentModule } from 'ng2-alfresco-userinfo';
import { AnalyticsModule } from 'ng2-activiti-analytics';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { CustomEditorsModule } from './components/activiti/custom-editor/custom-editor.component';

import {
    HomeComponent,
    DataTableDemoComponent,
    SearchComponent,
    SearchBarComponent,
    LoginDemoComponent,
    ActivitiDemoComponent,
    ActivitiAppsView,
    FormViewer,
    WebscriptComponent,
    TagComponent,
    AboutComponent,
    FilesComponent,
    FormNodeViewer,
    SettingComponent
} from './components/index';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        CoreModule.forRoot(),
        LoginModule.forRoot(),
        SearchModule.forRoot(),
        DataTableModule.forRoot(),
        DocumentListModule.forRoot(),
        UploadModule.forRoot(),
        TagModule.forRoot(),
        WebScriptModule.forRoot(),
        ViewerModule.forRoot(),
        ActivitiFormModule.forRoot(),
        ActivitiTaskListModule.forRoot(),
        ActivitiProcessListModule.forRoot(),
        UserInfoComponentModule.forRoot(),
        AnalyticsModule.forRoot(),
        CustomEditorsModule,
        MaterialModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        DataTableDemoComponent,
        SearchComponent,
        SearchBarComponent,
        LoginDemoComponent,
        ActivitiDemoComponent,
        ActivitiAppsView,
        FormViewer,
        WebscriptComponent,
        TagComponent,
        AboutComponent,
        FilesComponent,
        FormNodeViewer,
        SettingComponent
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

