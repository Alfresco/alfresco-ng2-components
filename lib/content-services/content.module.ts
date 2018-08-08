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
import { ContentDirectiveModule } from './directives/content-directive.module';
import { DialogModule } from './dialogs/dialog.module';
import { FolderDirectiveModule } from './folder-directive/folder-directive.module';
import { ContentMetadataModule } from './content-metadata/content-metadata.module';
import { PermissionManagerModule } from './permission-manager/permission-manager.module';
import { RatingService } from './social/services/rating.service';
import { ContentMetadataService } from './content-metadata/services/content-metadata.service';
import { PropertyDescriptorsService } from './content-metadata/services/property-descriptors.service';
import { ContentMetadataConfigFactory } from './content-metadata/services/config/content-metadata-config.factory';
import { BasicPropertiesService } from './content-metadata/services/basic-properties.service';
import { PropertyGroupTranslatorService } from './content-metadata/services/property-groups-translator.service';
import { SearchQueryBuilderService } from './search/search-query-builder.service';
import { SearchFilterService } from './search/components/search-filter/search-filter.service';
import { ContentNodeSelectorService } from './content-node-selector/content-node-selector.service';
import { ContentNodeDialogService } from './content-node-selector/content-node-dialog.service';
import { DocumentListService } from './document-list/services/document-list.service';
import { FolderActionsService } from './document-list/services/folder-actions.service';
import { DocumentActionsService } from './document-list/services/document-actions.service';
import { NodeActionsService } from './document-list/services/node-actions.service';
import { CustomResourcesService } from './document-list/services/custom-resources.service';
import { NodePermissionDialogService } from './permission-manager/services/node-permission-dialog.service';
import { NodePermissionService } from './permission-manager/services/node-permission.service';
import { TagService } from './tag/services/tag.service';

export function providers() {
    return [
        RatingService,
        ContentMetadataService,
        PropertyDescriptorsService,
        ContentMetadataConfigFactory,
        BasicPropertiesService,
        PropertyGroupTranslatorService,
        SearchQueryBuilderService,
        SearchFilterService,
        ContentNodeSelectorService,
        ContentNodeDialogService,
        DocumentListService,
        FolderActionsService,
        DocumentActionsService,
        NodeActionsService,
        CustomResourcesService,
        NodePermissionDialogService,
        NodePermissionService,
        TagService
    ];
}

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
        ContentMetadataModule,
        FolderDirectiveModule,
        ContentDirectiveModule,
        PermissionManagerModule,
        VersionManagerModule
    ],
    providers: [
        ...providers(),
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
                ...providers(),
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
