/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { BasicPropertiesService } from './basic-properties.service';
import { Observable, of, iif, Subject } from 'rxjs';
import { PropertyGroupTranslatorService } from './property-groups-translator.service';
import { CardViewItem } from '@alfresco/adf-core';
import { CardViewGroup, OrganisedPropertyGroup, PresetConfig } from '../interfaces/content-metadata.interfaces';
import { ContentMetadataConfigFactory } from './config/content-metadata-config.factory';
import { PropertyDescriptorsService } from './property-descriptors.service';
import { map, switchMap } from 'rxjs/operators';
import { ContentTypePropertiesService } from './content-type-property.service';
@Injectable({
    providedIn: 'root'
})
export class ContentMetadataService {

    error = new Subject<{ statusCode: number; message: string }>();

    constructor(private basicPropertiesService: BasicPropertiesService,
                private contentMetadataConfigFactory: ContentMetadataConfigFactory,
                private propertyGroupTranslatorService: PropertyGroupTranslatorService,
                private propertyDescriptorsService: PropertyDescriptorsService,
                private contentTypePropertyService: ContentTypePropertiesService) {
    }

    getBasicProperties(node: Node): Observable<CardViewItem[]> {
        return of(this.basicPropertiesService.getProperties(node));
    }

    getContentTypeProperty(node: Node): Observable<CardViewItem[]> {
        return this.contentTypePropertyService.getContentTypeCardItem(node);
    }

    openConfirmDialog(changedProperties): Observable<any> {
        return this.contentTypePropertyService.openContentTypeDialogConfirm(changedProperties.nodeType);
    }

    getGroupedProperties(node: Node, preset: string | PresetConfig = 'default'): Observable<CardViewGroup[]> {
        let groupedProperties = of([]);

        if (node.aspectNames) {
            let contentMetadataConfig;
            if (typeof preset === 'string') {
                contentMetadataConfig = this.contentMetadataConfigFactory.get(preset);
            } else {
                contentMetadataConfig = this.contentMetadataConfigFactory.createConfig(preset);
            }

            const groupNames = node.aspectNames
                .concat(node.nodeType)
                .filter((groupName) => contentMetadataConfig.isGroupAllowed(groupName));

            if (groupNames.length > 0) {
                groupedProperties = this.propertyDescriptorsService.load(groupNames).pipe(
                    switchMap((groups) =>
                        iif(
                            () => contentMetadataConfig.isIncludeAllEnabled(),
                            of(contentMetadataConfig.appendAllPreset(groups).concat(contentMetadataConfig.reorganiseByConfig(groups))),
                            of(contentMetadataConfig.reorganiseByConfig(groups))
                        )),
                    map((groups) => contentMetadataConfig.filterExcludedPreset(groups)),
                    map((groups) => this.filterEmptyPreset(groups)),
                    map((groups) => this.setTitleToNameIfNotSet(groups)),
                    map((groups) => this.propertyGroupTranslatorService.translateToCardViewGroups(groups, node.properties, node.definition))
                );
            }
        }

        return groupedProperties;
    }

    setTitleToNameIfNotSet(propertyGroups: OrganisedPropertyGroup[]): OrganisedPropertyGroup[] {
        propertyGroups.map((propertyGroup) => {
            propertyGroup.title = propertyGroup.title || propertyGroup.name;
        });
        return propertyGroups;
    }

    filterEmptyPreset(propertyGroups: OrganisedPropertyGroup[]): OrganisedPropertyGroup[]  {
        return propertyGroups.filter((props) => props.properties.length);
    }
}
