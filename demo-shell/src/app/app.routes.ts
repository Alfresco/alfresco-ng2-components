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

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AuthGuard,
    AuthGuardEcm,
    ErrorContentComponent,
    AuthGuardBpm,
    AuthGuardSsoRoleService
} from '@alfresco/adf-core';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
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
import { TreeViewSampleComponent } from './components/tree-view/tree-view-sample.component';
import { AppsCloudDemoComponent } from './components/cloud/apps-cloud-demo.component';
import { PeopleGroupCloudDemoComponent } from './components/cloud/people-groups-cloud-demo.component';
import { CloudLayoutComponent } from './components/cloud/cloud-layout.component';
import { TasksCloudDemoComponent } from './components/cloud/tasks-cloud-demo.component';
import { ProcessesCloudDemoComponent } from './components/cloud/processes-cloud-demo.component';
import { StartTaskCloudDemoComponent } from './components/cloud/start-task-cloud-demo.component';
import { StartProcessCloudDemoComponent } from './components/cloud/start-process-cloud-demo.component';
import { TaskDetailsCloudDemoComponent } from './components/cloud/task-details-cloud-demo.component';
import { CloudViewerComponent } from './components/cloud/cloud-viewer.component';
import { ProcessDetailsCloudDemoComponent } from './components/cloud/process-details-cloud-demo.component';
import { TemplateDemoComponent } from './components/template-list/template-demo.component';
import { FormCloudDemoComponent } from './components/app-layout/cloud/form-demo/cloud-form-demo.component';
import { ConfirmDialogExampleComponent } from './components/confirm-dialog/confirm-dialog-example.component';
import { DemoErrorComponent } from './components/error/demo-error.component';
import { TaskHeaderCloudDemoComponent } from './components/cloud/task-header-cloud-demo.component';
import { FilteredSearchComponent } from './components/files/filtered-search.component';
export const appRoutes: Routes = [
    { path: 'login', loadChildren: 'app/components/login/login.module#AppLoginModule' },
    { path: 'logout', component: LogoutComponent },
    {
        path: 'settings',
        loadChildren: 'app/components/settings/settings.module#AppSettingsModule'
    },
    {
        path: 'files/:nodeId/view',
        component: AppComponent,
        canActivate: [AuthGuardEcm],
        canActivateChild: [AuthGuardEcm],
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
                loadChildren: 'app/components/file-view/file-view.module#FileViewModule'
            }
        ]
    },
    { path: 'preview/s/:id', component: SharedLinkViewComponent },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'breadcrumb',
                canActivate: [AuthGuardEcm],
                loadChildren: 'app/components/breadcrumb-demo/breadcrumb-demo.module#AppBreadcrumbModule'
            },
            {
                path: 'notifications',
                children: [
                    {
                        path: '',
                        loadChildren: 'app/components/notifications/notifications.module#AppNotificationsModule'
                    }
                ]
            },
            {
                path: 'config-editor',
                children: [
                    {
                        path: '',
                        loadChildren: 'app/components/config-editor/config-editor.module#AppConfigEditorModule'
                    }
                ]
            },
            {
                path: 'pipes',
                children: [
                    {
                        path: '',
                        loadChildren: 'app/components/pipes/pipes.module#AppPipesModule'
                    }
                ]
            },
            {
                path: 'card-view',
                children: [
                    {
                        path: '',
                        loadChildren: 'app/components/card-view/card-view.module#AppCardViewModule'
                    }
                ]
            },
            {
                path: 'sites',
                children: [
                    {
                        path: '',
                        loadChildren: 'app/components/sites/sites.module#SitesModule'
                    }
                ]
            },
            {
                path: 'header-data',
                children: [
                    {
                        path: '',
                        loadChildren: 'app/components/header-data/header-data.module#AppHeaderDataModule'
                    }
                ]
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
                data: { roles: ['ACTIVITI_USER'], redirectUrl: '/error/403' },
                children: [
                    {
                        path: '',
                        component: AppsCloudDemoComponent
                    },
                    {
                        path: 'people-group-cloud',
                        component: PeopleGroupCloudDemoComponent
                    },
                    {
                        path: 'task-header-cloud',
                        component: TaskHeaderCloudDemoComponent
                    },
                    {
                        path: 'community',
                        loadChildren: 'app/components/cloud/community/community.module#AppCommunityModule'
                    },
                    {
                        path: ':appName',
                        canActivate: [AuthGuardSsoRoleService],
                        data: { clientRoles: ['appName'], roles: ['ACTIVITI_USER'], redirectUrl: '/error/403' },
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
                path: 'node-selector',
                loadChildren: 'app/components/content-node-selector/content-node-selector.module#AppContentNodeSelectorModule'
            },
            {
                path: 'confirm-dialog',
                component: ConfirmDialogExampleComponent
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
                path: 'filtered-search',
                component: FilteredSearchComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'filtered-search/:id',
                component: FilteredSearchComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'filtered-search/:id/display/:mode',
                component: FilteredSearchComponent,
                canActivate: [AuthGuardEcm]
            },
            {
                path: 'extensions/document-list/presets',
                canActivate: [AuthGuardEcm],
                loadChildren: './components/document-list/extension-presets/extension-presets.module#ExtensionPresetsModule'
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
                path: 'datatable/dnd',
                loadChildren: './components/datatable/drag-and-drop/datatable-dnd.module#AppDataTableDndModule'
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
            {
                path: 'icons',
                loadChildren: './components/icons/icons.module#AppIconsModule'
            },
            { path: 'form-cloud', component: FormCloudDemoComponent },
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
                path: 'copy-content',
                loadChildren: 'app/components/datatable/copy-content/datatable.module#AppDataTableCopyModule'
            },
            {
                path: 'template-list',
                component: TemplateDemoComponent
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

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { initialNavigation: true });
