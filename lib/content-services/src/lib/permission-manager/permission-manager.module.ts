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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { AddPermissionComponent } from './components/add-permission/add-permission.component';
import { AddPermissionDialogComponent } from './components/add-permission/add-permission-dialog.component';
import { CoreModule } from '@alfresco/adf-core';
import { InheritPermissionDirective } from './components/inherited-button.directive';
import { MatChipDirective } from './components/mat-chip.directive';
import { NoPermissionTemplateComponent } from './components/permission-list/no-permission.component';
import { AddPermissionPanelComponent } from './components/add-permission/add-permission-panel.component';
import { SearchModule } from '../search/search.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SearchModule
    ],
    declarations: [
        PermissionListComponent,
        NoPermissionTemplateComponent,
        AddPermissionPanelComponent,
        InheritPermissionDirective,
        MatChipDirective,
        AddPermissionComponent,
        AddPermissionDialogComponent
    ],
    entryComponents: [
        AddPermissionPanelComponent,
        AddPermissionComponent,
        AddPermissionDialogComponent
    ],
    exports: [
        PermissionListComponent,
        NoPermissionTemplateComponent,
        AddPermissionPanelComponent,
        InheritPermissionDirective,
        AddPermissionComponent,
        AddPermissionDialogComponent
    ]
})
export class PermissionManagerModule {}
