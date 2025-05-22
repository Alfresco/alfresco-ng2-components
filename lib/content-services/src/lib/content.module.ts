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

import { NgModule, ModuleWithProviders, inject, provideAppInitializer } from '@angular/core';
import { provideTranslations } from '@alfresco/adf-core';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { CONTENT_TAG_DIRECTIVES } from './tag/tag.module';
import { DOCUMENT_LIST_DIRECTIVES } from './document-list/document-list.module';
import { CONTENT_SEARCH_DIRECTIVES } from './search/search.module';
import { BREADCRUMB_DIRECTIVES } from './breadcrumb/breadcrumb.module';
import { CONTENT_VERSION_DIRECTIVES } from './version-manager/version-manager.module';
import { CONTENT_NODE_SELECTOR_DIRECTIVES } from './content-node-selector/content-node-selector.module';
import { CONTENT_NODE_SHARE_DIRECTIVES } from './content-node-share/content-node-share.module';
import { CONTENT_DIRECTIVES } from './directives/content-directive.module';
import { CONTENT_DIALOG_DIRECTIVES } from './dialogs/dialog.module';
import { CONTENT_METADATA_DIRECTIVES } from './content-metadata/content-metadata.module';
import { CONTENT_PERMISSION_MANAGER_DIRECTIVES } from './permission-manager/permission-manager.module';
import { ASPECT_LIST_DIRECTIVES } from './aspect-list/aspect-list.module';
import { versionCompatibilityFactory } from './version-compatibility/version-compatibility-factory';
import { VersionCompatibilityService } from './version-compatibility/version-compatibility.service';
import { CONTENT_PIPES } from './pipes/content-pipe.module';
import { contentAuthLoaderFactory } from './auth-loader/content-auth-loader-factory';
import { ContentAuthLoaderService } from './auth-loader/content-auth-loader.service';
import { CategoriesManagementComponent } from './category';
import { TreeComponent } from './tree';
import { NewVersionUploaderDialogComponent } from './new-version-uploader';
import { VersionCompatibilityDirective } from './version-compatibility';
import { CONTENT_UPLOAD_DIRECTIVES } from './upload';
import { TreeViewComponent } from './tree-view';
import { NodeCommentsComponent } from './node-comments';
import { AlfrescoViewerComponent } from './viewer';
import { ContentTypeDialogComponent } from './content-type';
import { MaterialModule } from './material.module';
import { AlfrescoIconComponent } from './alfresco-icon/alfresco-icon.component';
import { AlfrescoApiService } from './services/alfresco-api.service';
import { AlfrescoApiNoAuthService } from './api-factories/alfresco-api-no-auth.service';
import { AlfrescoApiLoaderService, createAlfrescoApiInstance } from './api-factories/alfresco-api-v2-loader.service';

@NgModule({
    imports: [
        MaterialModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        ...CONTENT_PIPES,
        ...CONTENT_TAG_DIRECTIVES,
        ...CONTENT_DIALOG_DIRECTIVES,
        ...CONTENT_SEARCH_DIRECTIVES,
        ...DOCUMENT_LIST_DIRECTIVES,
        ...CONTENT_UPLOAD_DIRECTIVES,
        ...BREADCRUMB_DIRECTIVES,
        ...CONTENT_NODE_SELECTOR_DIRECTIVES,
        ...CONTENT_NODE_SHARE_DIRECTIVES,
        ...CONTENT_METADATA_DIRECTIVES,
        ...CONTENT_DIRECTIVES,
        ...CONTENT_PERMISSION_MANAGER_DIRECTIVES,
        ...CONTENT_VERSION_DIRECTIVES,
        TreeViewComponent,
        ContentTypeDialogComponent,
        ...ASPECT_LIST_DIRECTIVES,
        VersionCompatibilityDirective,
        NodeCommentsComponent,
        TreeComponent,
        AlfrescoViewerComponent,
        CategoriesManagementComponent,
        NewVersionUploaderDialogComponent,
        AlfrescoIconComponent
    ],
    providers: [provideTranslations('adf-content-services', 'assets/adf-content-services')],
    exports: [
        MaterialModule,
        ...CONTENT_PIPES,
        ...CONTENT_TAG_DIRECTIVES,
        ...DOCUMENT_LIST_DIRECTIVES,
        ...CONTENT_UPLOAD_DIRECTIVES,
        ...CONTENT_SEARCH_DIRECTIVES,
        ...BREADCRUMB_DIRECTIVES,
        ...CONTENT_NODE_SELECTOR_DIRECTIVES,
        ...CONTENT_NODE_SHARE_DIRECTIVES,
        ...CONTENT_METADATA_DIRECTIVES,
        ...CONTENT_DIALOG_DIRECTIVES,
        ...CONTENT_DIRECTIVES,
        ...CONTENT_PERMISSION_MANAGER_DIRECTIVES,
        ...CONTENT_VERSION_DIRECTIVES,
        TreeViewComponent,
        ...ASPECT_LIST_DIRECTIVES,
        ContentTypeDialogComponent,
        VersionCompatibilityDirective,
        NodeCommentsComponent,
        TreeComponent,
        AlfrescoViewerComponent,
        CategoriesManagementComponent,
        NewVersionUploaderDialogComponent,
        AlfrescoIconComponent
    ]
})
export class ContentModule {
    static forRoot(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule,
            providers: [
                provideTranslations('adf-content-services', 'assets/adf-content-services'),
                ContentAuthLoaderService,
                { provide: AlfrescoApiService, useClass: AlfrescoApiNoAuthService },
                provideAppInitializer((): any => {
                    const initializerFn = versionCompatibilityFactory(inject(VersionCompatibilityService));
                    return initializerFn();
                }),
                provideAppInitializer(() => {
                    const initializerFn = contentAuthLoaderFactory(inject(ContentAuthLoaderService));
                    return initializerFn();
                }),
                provideAppInitializer(() => {
                    const initializerFn = createAlfrescoApiInstance(inject(AlfrescoApiLoaderService));
                    return initializerFn();
                })
            ]
        };
    }

    /**
     * @deprecated use `ContentModule` instead
     * @returns ModuleWithProviders<ContentModule>
     */
    static forChild(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule
        };
    }
}
