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
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';

import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { ContentNodeSelectorService } from './content-node-selector.service';
import { SitesDropdownModule } from '../site-dropdown/sites-dropdown.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { PaginationModule, ToolbarModule } from '@alfresco/adf-core';
import { DocumentListModule } from '../document-list/document-list.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        SitesDropdownModule,
        BreadcrumbModule,
        ToolbarModule,
        DocumentListModule,
        PaginationModule
    ],
    exports: [
        ContentNodeSelectorComponent
    ],
    entryComponents: [
        ContentNodeSelectorComponent
    ],
    declarations: [
        ContentNodeSelectorComponent
    ],
    providers: [
        ContentNodeSelectorService
    ]
})
export class ContentNodeSelectorModule {}
