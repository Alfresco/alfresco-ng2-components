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

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthGuardBpm, AuthGuardEcm } from 'ng2-alfresco-core';

import {
    AboutComponent,
    ActivitiAppsViewComponent,
    ActivitiDemoComponent,
    ActivitiShowDiagramComponent,
    DataTableDemoComponent,
    FilesComponent,
    FormDemoComponent,
    FormNodeViewerComponent,
    FormViewerComponent,
    HomeComponent,
    LoginDemoComponent,
    SearchComponent,
    SettingsComponent,
    SocialComponent,
    TagComponent,
    WebscriptComponent
} from './components/index';

import { UploadButtonComponent } from 'ng2-alfresco-upload';
import { FormListDemoComponent } from './components/form/form-list-demo.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginDemoComponent },
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'files',
        component: FilesComponent,
        canActivate: [AuthGuardEcm]
    },
    {
        path: 'files/:id',
        component: FilesComponent,
        canActivate: [AuthGuardEcm]
    },
    {
        path: 'datatable',
        component: DataTableDemoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'uploader',
        component: UploadButtonComponent,
        canActivate: [AuthGuardEcm]
    },
    {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuardEcm]
    },
    {
        path: 'activiti',
        component: ActivitiAppsViewComponent,
        canActivate: [AuthGuardBpm]
    },
    {
        path: 'activiti/apps',
        component: ActivitiAppsViewComponent,
        canActivate: [AuthGuardBpm]
    },
    {
        path: 'activiti/apps/:appId/tasks',
        component: ActivitiDemoComponent,
        canActivate: [AuthGuardBpm]
    },
    {
        path: 'activiti/apps/:appId/processes',
        component: ActivitiDemoComponent,
        canActivate: [AuthGuardBpm]
    },
    {
        path: 'activiti/apps/:appId/diagram/:processDefinitionId',
        component: ActivitiShowDiagramComponent,
        canActivate: [AuthGuardBpm]
    },
    // TODO: check if neeeded
    {
        path: 'activiti/appId/:appId',
        component: ActivitiDemoComponent,
        canActivate: [AuthGuardBpm]
    },
    // TODO: check if needed
    {
        path: 'activiti/tasks/:id',
        component: FormViewerComponent,
        canActivate: [AuthGuardBpm]
    },
    // TODO: check if needed
    {
        path: 'activiti/tasksnode/:id',
        component: FormNodeViewerComponent,
        canActivate: [AuthGuardBpm]
    },
    {
        path: 'webscript',
        component: WebscriptComponent,
        canActivate: [AuthGuardEcm]
    },
    {
        path: 'tag',
        component: TagComponent,
        canActivate: [AuthGuardEcm]
    },
    {
        path: 'social',
        component: SocialComponent,
        canActivate: [AuthGuardEcm]
    },
    { path: 'about', component: AboutComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'form', component: FormDemoComponent },
    { path: 'form-list', component: FormListDemoComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
