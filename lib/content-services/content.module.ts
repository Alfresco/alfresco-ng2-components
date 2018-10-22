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
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, TRANSLATION_PROVIDER } from '@alfresco/adf-core';

import { MaterialModule } from './material.module';

import { SocialModule } from './social/social.module';
import { TagModule } from './tag/tag.module';
import { WebScriptModule } from './webscript/webscript.module';
import { DocumentListModule } from './document-list/document-list.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { SitesDropdownModule } from './site-dropdown/sites-dropdown.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { VersionManagerModule } from './version-manager/version-manager.module';
import { ContentNodeSelectorModule } from './content-node-selector/content-node-selector.module';
import { ContentNodeShareModule } from './content-node-share/content-node-share.module';
import { ContentDirectiveModule } from './directives/content-directive.module';
import { DialogModule } from './dialogs/dialog.module';
import { FolderDirectiveModule } from './folder-directive/folder-directive.module';
import { ContentMetadataModule } from './content-metadata/content-metadata.module';
import { PermissionManagerModule } from './permission-manager/permission-manager.module';

@NgModule({
    imports: [
        CoreModule.forChild(),
        SocialModule,
        TagModule,
        CommonModule,
        WebScriptModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        SearchModule,
        DocumentListModule,
        UploadModule,
        MaterialModule,
        SitesDropdownModule,
        BreadcrumbModule,
        ContentNodeSelectorModule,
        ContentNodeShareModule,
        ContentMetadataModule,
        FolderDirectiveModule,
        ContentDirectiveModule,
        PermissionManagerModule,
        VersionManagerModule
    ],
    exports: [
        SocialModule,
        TagModule,
        WebScriptModule,
        DocumentListModule,
        UploadModule,
        SearchModule,
        SitesDropdownModule,
        BreadcrumbModule,
        ContentNodeSelectorModule,
        ContentNodeShareModule,
        ContentMetadataModule,
        DialogModule,
        FolderDirectiveModule,
        ContentDirectiveModule,
        PermissionManagerModule,
        VersionManagerModule
    ]
})
export class ContentModuleLazy {}

@NgModule({
    imports: [
        CoreModule.forChild(),
        SocialModule,
        TagModule,
        CommonModule,
        WebScriptModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        SearchModule,
        DocumentListModule,
        UploadModule,
        MaterialModule,
        SitesDropdownModule,
        BreadcrumbModule,
        ContentNodeSelectorModule,
        ContentNodeShareModule,
        ContentMetadataModule,
        FolderDirectiveModule,
        ContentDirectiveModule,
        PermissionManagerModule,
        VersionManagerModule
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'adf-content-services',
                source: 'assets/adf-content-services'
            }
        }
    ],
    exports: [
        SocialModule,
        TagModule,
        WebScriptModule,
        DocumentListModule,
        UploadModule,
        SearchModule,
        SitesDropdownModule,
        BreadcrumbModule,
        ContentNodeSelectorModule,
        ContentNodeShareModule,
        ContentMetadataModule,
        DialogModule,
        FolderDirectiveModule,
        ContentDirectiveModule,
        PermissionManagerModule,
        VersionManagerModule
    ]
})
export class ContentModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ContentModule,
            providers: [
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'adf-content-services',
                        source: 'assets/adf-content-services'
                    }
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: ContentModuleLazy
        };
    }
}
