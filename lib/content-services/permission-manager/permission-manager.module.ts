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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { AddPermissionComponent } from './components/add-permission/add-permission.component';
import { AddPermissionDialogComponent } from './components/add-permission/add-permission-dialog.component';
import { DataTableModule, DataColumnModule } from '@alfresco/adf-core';
import { InheritPermissionDirective } from './components/inherited-button.directive';
import { NodePermissionService } from './services/node-permission.service';
import { NoPermissionTemplateComponent } from './components/permission-list/no-permission.component';
import { SearchModule } from '..';
import { AddNodePermissionDialogService } from './components/add-permission/add-permission.service';
import { AddPermissionPanelComponent } from './components/add-permission/add-permission-panel.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule,
        DataTableModule,
        DataColumnModule,
        SearchModule
    ],
    declarations: [
        PermissionListComponent,
        NoPermissionTemplateComponent,
        InheritPermissionDirective,
        AddPermissionComponent,
        AddPermissionDialogComponent,
        AddPermissionPanelComponent
    ],
    providers: [
        NodePermissionService,
        AddNodePermissionDialogService
    ],
    entryComponents: [ AddPermissionComponent, AddPermissionDialogComponent, AddPermissionPanelComponent ],
    exports: [
        PermissionListComponent,
        NoPermissionTemplateComponent,
        InheritPermissionDirective,
        AddPermissionComponent,
        AddPermissionDialogComponent,
        AddPermissionPanelComponent
    ]
})
export class PermissionManagerModule {}
