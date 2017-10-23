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
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ActivitiComponent } from './components/activiti/activiti.component';
import { ActivitiShowDiagramComponent } from './components/activiti/activiti-show-diagram.component';
import { FormViewerComponent } from './components/activiti/form-viewer.component';
import { FormNodeViewerComponent } from './components/activiti/form-node-viewer.component';
import { ActivitiAppsViewComponent } from './components/activiti/apps.view';
import { SearchComponent } from './components/search/search.component';

import { DataTableComponent } from './components/datatable/datatable.component';
import { WebscriptComponent } from './components/webscript/webscript.component';
import { TagComponent } from './components/tag/tag.component';
import { SocialComponent } from './components/social/social.component';
import { FilesComponent } from './components/files/files.component';
import { FormComponent } from './components/form/form.component';

import { UploadButtonComponent } from 'ng2-alfresco-upload';
import { FileViewComponent } from './components/file-view/file-view.component';
import { CustomSourcesComponent } from './components/files/custom-sources.component';
import { FormListComponent } from './components/form/form-list.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'files/:nodeId/view', component: FileViewComponent, canActivate: [ AuthGuardEcm ] },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'home',
                component: HomeComponent
            }
            ,
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
                path: 'dl-custom-sources',
                component: CustomSourcesComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'datatable',
                component: DataTableComponent
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
                component: ActivitiComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/processes',
                component: ActivitiComponent,
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
                component: ActivitiComponent,
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
            { path: 'form', component: FormComponent },
            { path: 'form-list', component: FormListComponent }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
