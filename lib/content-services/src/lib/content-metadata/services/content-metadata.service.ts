/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable, inject } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { BasicPropertiesService } from './basic-properties.service';
import { Observable, of, iif, Subject } from 'rxjs';
import { PropertyGroupTranslatorService } from './property-groups-translator.service';
import { AppConfigService, CardViewItem } from '@alfresco/adf-core';
import { CardViewGroup, OrganisedPropertyGroup, PresetConfig } from '../interfaces/content-metadata.interfaces';
import { ContentMetadataConfigFactory } from './config/content-metadata-config.factory';
import { PropertyDescriptorsService } from './property-descriptors.service';
import { map, switchMap } from 'rxjs/operators';
import { ContentTypePropertiesService } from './content-type-property.service';
import { LayoutOrientedConfigLayoutBlock } from '../interfaces/layout-oriented-config.interface';
import { Property } from '../interfaces/property.interface';

interface LayoutBlockWithReadOnly extends LayoutOrientedConfigLayoutBlock {
    readOnlyProperties?: string | string[];
}

const CONTENT_METADATA_CONFIG_KEY = 'content-metadata';
const BASIC_PROPERTY_KEY_PREFIX = 'properties.';

@Injectable({
    providedIn: 'root'
})
export class ContentMetadataService {
    private readonly basicPropertiesService = inject(BasicPropertiesService);
    private readonly contentMetadataConfigFactory = inject(ContentMetadataConfigFactory);
    private readonly propertyGroupTranslatorService = inject(PropertyGroupTranslatorService);
    private readonly propertyDescriptorsService = inject(PropertyDescriptorsService);
    private readonly contentTypePropertyService = inject(ContentTypePropertiesService);
    private readonly appConfig = inject(AppConfigService);

    error = new Subject<{ statusCode: number; message: string }>();

    getBasicProperties(node: Node, preset: string | PresetConfig = 'default'): Observable<CardViewItem[]> {
        const properties = this.basicPropertiesService.getProperties(node);
        const readOnlyProperties = this.getReadOnlyPropertyNames(preset);

        if (readOnlyProperties.length) {
            properties.forEach((property) => {
                const propertyName = this.getBasicPropertyName(property.key);
                if (propertyName && readOnlyProperties.includes(propertyName)) {
                    property.editable = false;
                }
            });
        }

        return of(properties);
    }

    private getBasicPropertyName(key: string): string | undefined {
        return key?.startsWith(BASIC_PROPERTY_KEY_PREFIX) ? key.slice(BASIC_PROPERTY_KEY_PREFIX.length) : undefined;
    }

    private getReadOnlyPropertyNames(preset: string | PresetConfig): string[] {
        const presetConfig = typeof preset === 'string' ? this.appConfig.config[CONTENT_METADATA_CONFIG_KEY]?.presets?.[preset] : preset;

        if (Array.isArray(presetConfig)) {
            return presetConfig.reduce((readOnly, block) => readOnly.concat(this.getLayoutBlockReadOnlyNames(block)), [] as string[]);
        }

        if (presetConfig != null && typeof presetConfig === 'object') {
            return this.normaliseToArray(presetConfig.readOnlyProperties);
        }

        return [];
    }

    private getLayoutBlockReadOnlyNames(block: LayoutBlockWithReadOnly): string[] {
        const blockReadOnly = this.normaliseToArray(block?.readOnlyProperties);
        const nonEditableItems = (block?.items || [])
            .filter((item) => item?.editable === false)
            .reduce((names, item) => names.concat(this.normaliseToArray(item.properties)), [] as string[]);

        return blockReadOnly.concat(nonEditableItems);
    }

    private normaliseToArray(value: string | string[] | Property[] | undefined): string[] {
        if (Array.isArray(value)) {
            return value.map((item) => (typeof item === 'string' ? item : item?.name)).filter((name): name is string => typeof name === 'string');
        }
        return typeof value === 'string' ? [value] : [];
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

            const groupNames = node.aspectNames.concat(node.nodeType).filter((groupName) => contentMetadataConfig.isGroupAllowed(groupName));

            if (groupNames.length > 0) {
                groupedProperties = this.propertyDescriptorsService.load(groupNames).pipe(
                    switchMap((groups) =>
                        iif(
                            () => contentMetadataConfig.isIncludeAllEnabled(),
                            of(contentMetadataConfig.appendAllPreset(groups).concat(contentMetadataConfig.reorganiseByConfig(groups))),
                            of(contentMetadataConfig.reorganiseByConfig(groups))
                        )
                    ),
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
        const propertyGroupsTitles = [];
        propertyGroups.map((propertyGroup) => {
            const title = propertyGroup.title;
            const name = propertyGroup.name;
            if (title) {
                if (propertyGroupsTitles.includes(title)) {
                    propertyGroup.title = name ? `${title} (${name})` : title;
                } else {
                    propertyGroup.title = title;
                }
                propertyGroupsTitles.push(title);
            } else {
                propertyGroup.title = name;
                propertyGroupsTitles.push(name);
            }
        });
        return propertyGroups;
    }

    filterEmptyPreset(propertyGroups: OrganisedPropertyGroup[]): OrganisedPropertyGroup[] {
        return propertyGroups.filter((props) => props.properties.length);
    }
}
