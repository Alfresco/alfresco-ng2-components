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

import {
    ContentMetadataConfig,
    LayoutOrientedConfigItem,
    OrganisedPropertyGroup,
    PropertyGroupContainer
} from '../../interfaces/content-metadata.interfaces';
import { getProperty } from './property-group-reader';

export class LayoutOrientedConfigService implements ContentMetadataConfig {

    constructor(private config: any) { }

    public isGroupAllowed(groupName: string): boolean {
        if (this.isIncludeAllEnabled()) {
            return true;
        }
        return this.getMatchingGroups(groupName).length > 0;
    }

    public reorganiseByConfig(propertyGroups: PropertyGroupContainer): OrganisedPropertyGroup[] {
        const layoutBlocks = this.config.filter((itemsGroup) => itemsGroup.items);

        let organisedPropertyGroup = layoutBlocks.map((layoutBlock) => {
            const flattenedItems = this.flattenItems(layoutBlock.items),
                properties = flattenedItems.reduce((props, explodedItem) => {
                    const property = getProperty(propertyGroups, explodedItem.groupName, explodedItem.propertyName) || [];
                    return props.concat(property);
                }, []);

            return {
                title: layoutBlock.title,
                properties
            };
        });

        return organisedPropertyGroup;
    }

    public appendAllPreset(propertyGroups: PropertyGroupContainer): OrganisedPropertyGroup[] {
        return Object.keys(propertyGroups)
            .map((groupName) => {
                const propertyGroup = propertyGroups[groupName],
                    properties = propertyGroup.properties;

                return Object.assign({}, propertyGroup, {
                    properties: Object.keys(properties).map((propertyName) => properties[propertyName])
                });
            });
    }

    public filterExcludedPreset(propertyGroups: OrganisedPropertyGroup[]): OrganisedPropertyGroup[] {
        let excludedConfig = this.config
            .map((config) => config.exclude)
            .find((exclude) => exclude !== undefined);

        if (excludedConfig === undefined) {
            excludedConfig = [];
        } else if (typeof excludedConfig === 'string') {
            excludedConfig = [excludedConfig];
        }

        return propertyGroups.filter((props) => {
            return !excludedConfig.includes(props.name);
        });
    }

    public isIncludeAllEnabled() {
        let includeAllProperty = this.config
            .map((config) => config.includeAll)
            .find((includeAll) => includeAll !== undefined);

        return includeAllProperty !== undefined ? includeAllProperty : false;
    }

    private flattenItems(items) {
        return items.reduce((accumulator, item) => {
            const properties = Array.isArray(item.properties) ? item.properties : [item.properties];
            const flattenedProperties = properties.map((propertyName) => {
                return {
                    groupName: item.aspect || item.type,
                    propertyName
                };
            });

            return accumulator.concat(flattenedProperties);
        }, []);
    }

    private getMatchingGroups(groupName: string): LayoutOrientedConfigItem[] {
        return this.config
            .map((layoutBlock) => layoutBlock.items)
            .reduce((accumulator, items) => accumulator.concat(items), [])
            .filter((item) => item.aspect === groupName || item.type === groupName);
    }
}
