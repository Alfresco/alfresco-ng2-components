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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule, TRANSLATION_PROVIDER } from '@alfresco/core';

import { MaterialModule } from './material.module';

import { SocialModule } from './social';
import { TagModule } from './tag';
import { WebScriptModule } from './webscript';
import { DocumentListModule } from './document-list';
import { UploadModule } from './upload';
import { SearchModule } from './search';
import { SitesDropdownModule } from './site-dropdown';
import { BreadcrumbModule } from './breadcrumb';
import { VersionManagerModule } from './version-manager';
import { ContentNodeSelectorModule } from './content-node-selector';

@NgModule({
    imports: [
        CoreModule,
        SocialModule,
        TagModule,
        CommonModule,
        WebScriptModule,
        FormsModule,
        ReactiveFormsModule,
        SearchModule,
        BrowserAnimationsModule,
        DocumentListModule,
        UploadModule,
        MaterialModule,
        SitesDropdownModule,
        BreadcrumbModule,
        VersionManagerModule,
        ContentNodeSelectorModule
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: '@adf/content-services',
                source: 'assets/@adf/content-services'
            }
        }
    ],
    exports: [
        CoreModule,
        SocialModule,
        TagModule,
        WebScriptModule,
        DocumentListModule,
        UploadModule,
        SearchModule,
        SitesDropdownModule,
        BreadcrumbModule,
        VersionManagerModule,
        ContentNodeSelectorModule
    ]
})
export class ContentModule {
}
