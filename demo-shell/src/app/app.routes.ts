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

import { Routes } from '@angular/router';
import { AuthGuard, AuthGuardEcm, ErrorContentComponent, AuthGuardBpm, AuthGuardSsoRoleService } from '@alfresco/adf-core';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { FilesComponent } from './components/files/files.component';
import { FormComponent } from './components/form/form.component';
import { DemoPermissionComponent } from './components/permissions/demo-permissions.component';
import { AppComponent } from './app.component';
import { AppsCloudDemoComponent } from './components/cloud/apps-cloud-demo.component';
import { CloudLayoutComponent } from './components/cloud/cloud-layout.component';
import { TasksCloudDemoComponent } from './components/cloud/tasks-cloud-demo.component';
import { ProcessesCloudDemoComponent } from './components/cloud/processes-cloud-demo.component';
import { StartTaskCloudDemoComponent } from './components/cloud/start-task-cloud-demo.component';
import { StartProcessCloudDemoComponent } from './components/cloud/start-process-cloud-demo.component';
import { TaskDetailsCloudDemoComponent } from './components/cloud/task-details-cloud-demo.component';
import { CloudViewerComponent } from './components/cloud/cloud-viewer.component';
import { ProcessDetailsCloudDemoComponent } from './components/cloud/process-details-cloud-demo.component';
import { FormCloudDemoComponent } from './components/app-layout/cloud/form-demo/cloud-form-demo.component';
import { DemoErrorComponent } from './components/error/demo-error.component';
import { ProcessCloudLayoutComponent } from './components/cloud/process-cloud-layout.component';
import { SearchFilterChipsComponent } from './components/search/search-filter-chips.component';

export const appRoutes: Routes = [
    { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.AppLoginModule) },
    { path: 'logout', component: LogoutComponent },
    {
        path: 'settings',
        loadChildren: () => import('./components/settings/settings.module').then(m => m.AppSettingsModule)
    },
    {
        path: 'files/:nodeId/view',
        component: AppComponent,
        canActivate: [AuthGuardEcm],
        canActivateChild: [AuthGuardEcm],
        outlet: 'overlay',
        loadChildren: () => import('./components/file-view/file-view.module').then(m => m.FileViewModule)
    },
    {
        path: 'files/:nodeId/:versionId/view',
        component: AppComponent,
        canActivate: [AuthGuardEcm],
        canActivateChild: [AuthGuardEcm],
        outlet: 'overlay',
        loadChildren: () => import('./components/file-view/file-view.module').then(m => m.FileViewModule)
    },
    {
        path: 'preview/blob',
        component: AppComponent,
        outlet: 'overlay',
        pathMatch: 'full',
        loadChildren: () => import('./components/file-view/file-view.module').then(m => m.FileViewModule)
    },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: `/home`,
                pathMatch: 'full'
            },
            {
                path: 'card-view',
                loadChildren: () => import('./components/card-view/card-view.module').then(m => m.AppCardViewModule)
            },
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'cloud',
                canActivate: [AuthGuardSsoRoleService],
                data: { roles: ['ACTIVITI_ADMIN', 'ACTIVITI_USER'], redirectUrl: '/error/403' },
                children: [
                    {
                        path: '',
                        data: { roles: ['ACTIVITI_USER'], redirectUrl: '/error/403' },
                        component: AppsCloudDemoComponent
                    },
                    {
                        path: ':appName',
                        canActivate: [AuthGuardSsoRoleService],
                        data: { clientRoles: ['appName'], roles: ['ACTIVITI_USER'], redirectUrl: '/error/403' },
                        component: ProcessCloudLayoutComponent,
                        children: [
                            {
                                path: '',
                                component: CloudLayoutComponent,
                                children: [
                                    {
                                        path: 'tasks',
                                        component: TasksCloudDemoComponent
                                    },
                                    {
                                        path: 'processes',
                                        component: ProcessesCloudDemoComponent
                                    }
                                ]
                            },
                            {
                                path: 'start-task',
                                component: StartTaskCloudDemoComponent
                            },
                            {
                                path: 'start-process',
                                component: StartProcessCloudDemoComponent
                            },
                            {
                                path: 'task-details/:taskId',
                                component: TaskDetailsCloudDemoComponent
                            },
                            {
                                path: 'task-details/:taskId/files/:nodeId/view',
                                component: CloudViewerComponent
                            },
                            {
                                path: 'process-details/:processInstanceId',
                                component: ProcessDetailsCloudDemoComponent
                            }

                        ]
                    }
                ]
            },
            {
                path: 'settings-layout',
                loadChildren: () => import('./components/settings/settings.module').then(m => m.AppSettingsModule)
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
                path: 'files/:id/display/:mode',
                component: FilesComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'search',
                component: SearchResultComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'search-filter-chips',
                component: SearchFilterChipsComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'activiti',
                component: AppsViewComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps',
                component: AppsViewComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/tasks',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/tasks/:filterId',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/processes',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/processes/:filterId',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/diagram/:processDefinitionId',
                component: ShowDiagramComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'activiti/apps/:appId/report',
                component: ProcessServiceComponent,
                canActivate: [AuthGuardBpm]
            },
            // TODO: check if needed
            {
                path: 'activiti/appId/:appId',
                component: ProcessServiceComponent,
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
                /* cspell:disable-next-line */
                path: 'activiti/tasksnode/:id',
                component: FormNodeViewerComponent,
                canActivate: [AuthGuardBpm]
            },
            {
                path: 'permissions/:id',
                component: DemoPermissionComponent,
                canActivate: [AuthGuardEcm]
            },
            { path: 'form-cloud', component: FormCloudDemoComponent },
            { path: 'form', component: FormComponent },
            {
                path: 'task-list',
                canActivate: [AuthGuardBpm],
                loadChildren: () => import('./components/task-list-demo/task-list.module').then(m => m.AppTaskListModule)
            },
            {
                path: 'process-list',
                canActivate: [AuthGuardBpm],
                loadChildren: () => import('./components/process-list-demo/process-list.module').then(m => m.AppProcessListModule)
            },
            {
                path: 'error/no-authorization',
                component: ErrorContentComponent
            }
        ]
    },
    {
        path: 'error',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/error/404',
                pathMatch: 'full'
            },
            {
                path: ':id',
                component: DemoErrorComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'error/404'
    }
];
