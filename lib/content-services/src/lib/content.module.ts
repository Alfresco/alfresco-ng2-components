/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, SearchTextModule, provideTranslations } from '@alfresco/adf-core';
import { MaterialModule } from './material.module';
import { TagModule } from './tag/tag.module';
import { DocumentListModule } from './document-list/document-list.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { BREADCRUMB_DIRECTIVES } from './breadcrumb/breadcrumb.module';
import { VersionManagerModule } from './version-manager/version-manager.module';
import { ContentNodeSelectorModule } from './content-node-selector/content-node-selector.module';
import { ContentNodeShareModule } from './content-node-share/content-node-share.module';
import { ContentDirectiveModule } from './directives/content-directive.module';
import { DialogModule } from './dialogs/dialog.module';
import { ContentMetadataModule } from './content-metadata/content-metadata.module';
import { PermissionManagerModule } from './permission-manager/permission-manager.module';
import { TreeViewModule } from './tree-view/tree-view.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { AspectListModule } from './aspect-list/aspect-list.module';
import { VersionCompatibilityModule } from './version-compatibility/version-compatibility.module';
import { versionCompatibilityFactory } from './version-compatibility/version-compatibility-factory';
import { VersionCompatibilityService } from './version-compatibility/version-compatibility.service';
import { CONTENT_PIPES } from './pipes/content-pipe.module';
import { NodeCommentsModule } from './node-comments/node-comments.module';
import { AlfrescoViewerModule } from './viewer/alfresco-viewer.module';
import { contentAuthLoaderFactory } from './auth-loader/content-auth-loader-factory';
import { ContentAuthLoaderService } from './auth-loader/content-auth-loader.service';
import { DropdownSitesComponent } from './content-node-selector/site-dropdown/sites-dropdown.component';
import { CategoriesManagementComponent } from './category';
import { TreeComponent } from './tree';
import { NewVersionUploaderDialogComponent } from './new-version-uploader';

@NgModule({
    imports: [
        ...CONTENT_PIPES,
        CoreModule,
        TagModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        SearchModule,
        DocumentListModule,
        UploadModule,
        MaterialModule,
        DropdownSitesComponent,
        ...BREADCRUMB_DIRECTIVES,
        ContentNodeSelectorModule,
        ContentNodeShareModule,
        ContentMetadataModule,
        ContentDirectiveModule,
        PermissionManagerModule,
        VersionManagerModule,
        TreeViewModule,
        ContentTypeModule,
        AspectListModule,
        VersionCompatibilityModule,
        NodeCommentsModule,
        TreeComponent,
        SearchTextModule,
        AlfrescoViewerModule,
        CategoriesManagementComponent,
        NewVersionUploaderDialogComponent
    ],
    providers: [provideTranslations('adf-content-services', 'assets/adf-content-services')],
    exports: [
        ...CONTENT_PIPES,
        TagModule,
        DocumentListModule,
        UploadModule,
        SearchModule,
        DropdownSitesComponent,
        ...BREADCRUMB_DIRECTIVES,
        ContentNodeSelectorModule,
        ContentNodeShareModule,
        ContentMetadataModule,
        DialogModule,
        ContentDirectiveModule,
        PermissionManagerModule,
        VersionManagerModule,
        TreeViewModule,
        AspectListModule,
        ContentTypeModule,
        VersionCompatibilityModule,
        NodeCommentsModule,
        TreeComponent,
        SearchTextModule,
        AlfrescoViewerModule,
        CategoriesManagementComponent,
        NewVersionUploaderDialogComponent
    ]
})
export class ContentModule {
    static forRoot(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule,
            providers: [
                provideTranslations('adf-content-services', 'assets/adf-content-services'),
                ContentAuthLoaderService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: versionCompatibilityFactory,
                    deps: [VersionCompatibilityService],
                    multi: true
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: contentAuthLoaderFactory,
                    deps: [ContentAuthLoaderService],
                    multi: true
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule
        };
    }
}
