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
import { AuthGuard } from 'ng2-alfresco-core';

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
    { path: 'login', component: LoginDemoComponent },
    {
        path: '',
        component: LoginDemoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        component: FilesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'files',
        component: FilesComponent,
        canActivate: [AuthGuard]
    },
    { path: 'datatable', component: DataTableDemoComponent },
    {
        path: 'uploader',
        component: UploadButtonComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'activiti',
        component: ActivitiAppsView,
        canActivate: [AuthGuard]
    },
    {
        path: 'activiti/apps',
        component: ActivitiAppsView,
        canActivate: [AuthGuard]
    },
    {
        path: 'activiti/apps/:appId/tasks',
        component: ActivitiDemoComponent,
        canActivate: [AuthGuard]
    },
    // TODO: check if neeeded
    {
        path: 'activiti/appId/:appId',
        component: ActivitiDemoComponent,
        canActivate: [AuthGuard]
    },
    // TODO: check if needed
    {
        path: 'activiti/tasks/:id',
        component: FormViewer,
        canActivate: [AuthGuard]
    },
    // TODO: check if needed
    {
        path: 'activiti/tasksnode/:id',
        component: FormNodeViewer,
        canActivate: [AuthGuard]
    },
    {
        path: 'webscript',
        component: WebscriptComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'tag',
        component: TagComponent,
        canActivate: [AuthGuard]
    },
    { path: 'about', component: AboutComponent },
    { path: 'settings', component: SettingComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
