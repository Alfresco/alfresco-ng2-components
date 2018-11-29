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
import { AuthGuard, AuthGuardEcm, ErrorContentComponent, AuthGuardBpm } from '@alfresco/adf-core';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProcessServiceComponent } from './components/process-service/process-service.component';
import { ShowDiagramComponent } from './components/process-service/show-diagram.component';
import { FormViewerComponent } from './components/process-service/form-viewer.component';
import { FormNodeViewerComponent } from './components/process-service/form-node-viewer.component';
import { AppsViewComponent } from './components/process-service/apps-view.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { SearchExtendedComponent } from './components/search/search-extended.component';

import { FilesComponent } from './components/files/files.component';
import { FormComponent } from './components/form/form.component';

import { FormListComponent } from './components/form/form-list.component';
import { OverlayViewerComponent } from './components/overlay-viewer/overlay-viewer.component';
import { SharedLinkViewComponent } from './components/shared-link-view/shared-link-view.component';
import { FormLoadingComponent } from './components/form/form-loading.component';
import { DemoPermissionComponent } from './components/permissions/demo-permissions.component';
import { ReportIssueComponent } from './components/report-issue/report-issue.component';
import { AppComponent } from './app.component';
import { CloudComponent } from './components/cloud/cloud.component';
import { TaskListCloudDemoComponent } from './components/task-list-cloud-demo/task-list-cloud-demo.component';
import { ProcessListCloudExampleComponent } from './components/cloud/process-list-cloud-example.component';
import { TreeViewSampleComponent } from './components/tree-view/tree-view-sample.component';
import { CloudLayoutComponent } from './components/app-layout/cloud/cloud-layout.component';
import { ProcessesCloudDemoComponent } from './components/app-layout/cloud/processes-cloud-demo.component';
import { AppsCloudDemoComponent } from './components/app-layout/cloud/apps-cloud-demo.component';
import { TasksCloudDemoComponent } from './components/app-layout/cloud/tasks-cloud-demo.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    {
        path: 'settings',
        loadChildren: 'app/components/settings/settings.module#AppSettingsModule'
    },
    {
        path: 'files/:nodeId/view',
        component: AppComponent,
        canActivate: [ AuthGuardEcm ],
        canActivateChild: [ AuthGuardEcm ],
        outlet: 'overlay',
        children: [
            {
                path: '',
                loadChildren: 'app/components/file-view/file-view.module#FileViewModule'
            }
        ]
    },
    {
        path: 'preview/blob',
        component: AppComponent,
        outlet: 'overlay',
        pathMatch: 'full',
        children: [
            {
                path: '',
                loadChildren: 'app/components/blob-preview/blob-preview.module#BlobPreviewModule'
            }
        ]
    },
    { path: 'preview/s/:id', component: SharedLinkViewComponent },
    {
        path: 'breadcrumb',
        canActivate: [AuthGuardEcm],
        loadChildren: 'app/components/breadcrumb-demo/breadcrumb-demo.module#AppBreadcrumbModule'
    },
    {
        path: 'notifications',
        component: AppLayoutComponent ,
        children: [
            {
                path: '',
                loadChildren: 'app/components/notifications/notifications.module#AppNotificationsModule'
            }
        ]
    },
    {
        path: 'config-editor',
        component: AppLayoutComponent ,
        children: [
            {
                path: '',
                loadChildren: 'app/components/config-editor/config-editor.module#AppConfigEditorModule'
            }
        ]
    },
    {
        path: 'card-view',
        component: AppLayoutComponent ,
        children: [
            {
                path: '',
                loadChildren: 'app/components/card-view/card-view.module#AppCardViewModule'
            }
        ]
    },
    {
        path: 'header-data',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/components/header-data/header-data.module#AppHeaderDataModule'
            }
        ]
    },
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
            },
            {
                path: 'cloud',
                children: [
                    {
                        path: '',
                        component: CloudComponent,
                        canActivate: [AuthGuard]
                    },
                    {
                        path: ':applicationName/tasks',
                        component: TaskListCloudDemoComponent,
                        canActivate: [AuthGuard]
                    }
                ]
            },
            {
                path: 'cloud-layout',
                children: [
                    {
                        path: '',
                        component: AppsCloudDemoComponent
                    },
                    {
                        path: ':applicationName',
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
                            }
                        ]
                    }
                ]
            },
            {
                path: 'process-list-cloud',
                component: ProcessListCloudExampleComponent
            },
            {
                path: 'node-selector',
                loadChildren: 'app/components/content-node-selector/content-node-selector.module#AppContentNodeSelectorModule'
            },
            {
                path: 'settings-layout',
                loadChildren: 'app/components/settings/settings.module#AppSettingsModule'
            },
            {
                path: 'trashcan',
                canActivate: [AuthGuardEcm],
                loadChildren: 'app/components/trashcan/trashcan.module#AppTrashcanModule'
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
                path: 'dl-custom-sources',
                canActivate: [AuthGuardEcm],
                loadChildren: 'app/components/files/custom-sources.module#AppCustomSourcesModule'

            },
            {
                path: 'datatable',
                loadChildren: 'app/components/datatable/datatable.module#AppDataTableModule'
            },
            {
                path: 'search',
                component: SearchResultComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'extendedSearch',
                component: SearchExtendedComponent,
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
                path: 'webscript',
                canActivate: [AuthGuardEcm],
                loadChildren: 'app/components/webscript/webscript.module#AppWebScriptModule'
            },
            {
                path: 'tag',
                canActivate: [AuthGuardEcm],
                loadChildren: 'app/components/tag/tag.module#AppTagModule'
            },
            {
                path: 'social',
                canActivate: [AuthGuardEcm],
                loadChildren: 'app/components/social/social.module#AppSocialModule'
            },
            {
                path: 'permissions/:id',
                component: DemoPermissionComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'treeview',
                component: TreeViewSampleComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'about',
                loadChildren: 'app/components/about/about.module#AppAboutModule'
            },
            { path: 'form', component: FormComponent },
            { path: 'form-list', component: FormListComponent },
            { path: 'form-loading', component: FormLoadingComponent },
            {
                path: 'overlay-viewer',
                component: OverlayViewerComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'report-issue',
                component: ReportIssueComponent
            },
            {
                path: 'datatable-lazy',
                loadChildren: 'app/components/lazy-loading/lazy-loading.module#LazyLoadingModule'
            },
            {
                path: 'task-list',
                canActivate: [AuthGuardBpm],
                loadChildren: 'app/components/task-list-demo/task-list.module#AppTaskListModule'
            },
            {
                path: 'process-list',
                canActivate: [AuthGuardBpm],
                loadChildren: 'app/components/process-list-demo/process-list.module#AppProcessListModule'
            },
            {
                path: 'error/:id',
                component: ErrorContentComponent
            },
            {
                path: '**',
                redirectTo: 'error/404'
            }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { initialNavigation: true });
