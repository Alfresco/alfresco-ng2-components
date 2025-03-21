/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { AddPermissionComponent } from './components/add-permission/add-permission.component';
import { AddPermissionDialogComponent } from './components/add-permission/add-permission-dialog.component';
import { InheritPermissionDirective } from './components/inherited-button.directive';
import { AddPermissionPanelComponent } from './components/add-permission/add-permission-panel.component';
import { UserNameColumnComponent } from './components/user-name-column/user-name-column.component';
import { UserIconColumnComponent } from './components/user-icon-column/user-icon-column.component';
import { UserRoleColumnComponent } from './components/user-role-column/user-role-column.component';
import { NodePathColumnComponent } from './components/node-path-column/node-path-column.component';
import { PopOverDirective } from './components/pop-over.directive';
import { PermissionContainerComponent } from './components/permission-container/permission-container.component';

export const CONTENT_PERMISSION_MANAGER_DIRECTIVES = [
    AddPermissionPanelComponent,
    AddPermissionComponent,
    AddPermissionDialogComponent,
    NodePathColumnComponent,
    PermissionContainerComponent,
    PermissionListComponent,
    UserNameColumnComponent,
    UserIconColumnComponent,
    UserRoleColumnComponent,
    InheritPermissionDirective,
    PopOverDirective
] as const;

/** @deprecated use `...CONTENT_PERMISSION_MANAGER_DIRECTIVES` or import the standalone components directly */
@NgModule({
    imports: [...CONTENT_PERMISSION_MANAGER_DIRECTIVES],
    exports: [...CONTENT_PERMISSION_MANAGER_DIRECTIVES]
})
export class PermissionManagerModule {}
