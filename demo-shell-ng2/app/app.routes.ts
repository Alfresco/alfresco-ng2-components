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

import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
    FilesComponent,
    DataTableDemoComponent,
    SearchComponent,
    LoginDemoComponent,
    ActivitiDemoComponent,
    ActivitiAppsView,
    WebscriptComponent,
    TagComponent,
    AboutComponent,
    FormViewer,
    FormNodeViewer,
    SettingComponent
} from './components/index';

import { UploadButtonComponent } from 'ng2-alfresco-upload';

export const appRoutes: Routes = [
    { path: 'home', component: FilesComponent },
    { path: 'files', component: FilesComponent },
    { path: 'datatable', component: DataTableDemoComponent },
    { path: '', component: LoginDemoComponent },
    { path: 'uploader', component: UploadButtonComponent },
    { path: 'login', component: LoginDemoComponent },
    { path: 'search', component: SearchComponent },

    { path: 'activiti', component: ActivitiAppsView },
    { path: 'activiti/apps', component: ActivitiAppsView },
    { path: 'activiti/apps/:appId/tasks', component: ActivitiDemoComponent },

    { path: 'activiti/appId/:appId', component: ActivitiDemoComponent },
    { path: 'activiti/tasks/:id', component: FormViewer },
    { path: 'activiti/tasksnode/:id', component: FormNodeViewer },
    { path: 'webscript', component: WebscriptComponent },
    { path: 'tag', component: TagComponent },
    { path: 'about', component: AboutComponent },
    { path: 'settings', component: SettingComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
