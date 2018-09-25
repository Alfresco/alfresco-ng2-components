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

import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentNodeSelectorModule } from '@alfresco/adf-content-services';

import { AttachFileWidgetComponent } from './attach-file-widget.component';
import { AttachFolderWidgetComponent } from './attach-folder-widget.component';
import { AttachFileWidgetDialogComponent } from './attach-file-widget-dialog.component';

@NgModule({
    imports: [
        CoreModule.forChild(),
        ContentNodeSelectorModule,
        MaterialModule
    ],
    entryComponents: [
        AttachFileWidgetComponent,
        AttachFolderWidgetComponent,
        AttachFileWidgetDialogComponent
    ],
    declarations: [
        AttachFileWidgetComponent,
        AttachFolderWidgetComponent,
        AttachFileWidgetDialogComponent
    ],
    exports: [
        AttachFileWidgetComponent,
        AttachFolderWidgetComponent,
        AttachFileWidgetDialogComponent
    ]
})
export class ContentWidgetModule {}
