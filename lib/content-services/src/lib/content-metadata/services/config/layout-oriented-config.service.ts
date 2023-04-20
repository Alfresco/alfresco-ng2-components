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

import {
    ContentMetadataConfig,
    LayoutOrientedConfigItem,
    OrganisedPropertyGroup,
    PropertyGroupContainer,
    Property
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

        const organisedPropertyGroup = layoutBlocks.map((layoutBlock) => {
            const flattenedItems = this.flattenItems(layoutBlock.items);
            const properties = flattenedItems.reduce((props, explodedItem) => {
                const isProperty = typeof explodedItem.property  === 'object';
                const propertyName = isProperty ? explodedItem.property.name : explodedItem.property;
                let  property = getProperty(propertyGroups, explodedItem.groupName, propertyName) || [];
                if (isProperty) {
                    property = this.setPropertyTitle(property, explodedItem.property);
                }
                property = this.setEditableProperty(property, explodedItem);
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
                const propertyGroup = propertyGroups[groupName];
                const properties = propertyGroup.properties;

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

        return propertyGroups.filter((props) => !excludedConfig.includes(props.name));
    }

    public isIncludeAllEnabled() {
        const includeAllProperty = this.config
            .map((config) => config.includeAll)
            .find((includeAll) => includeAll !== undefined);

        return includeAllProperty !== undefined ? includeAllProperty : false;
    }

    private setEditableProperty(propertyGroup: Property | Property[], itemConfig): Property | Property[] {
        if (Array.isArray(propertyGroup)) {
            propertyGroup.map((property) => property.editable = itemConfig.editable !== undefined ? itemConfig.editable : true);
        } else {
            propertyGroup.editable = itemConfig.editable !== undefined ? itemConfig.editable : true;
        }

        return propertyGroup;
    }

    private setPropertyTitle(item: Property | Property[], property: Property): Property | Property[] {
        if (!Array.isArray(item)) {
            return { ...item, ...(item.name === property.name && !!property.title) && { title: property.title } };
        }
        return item;
    }

    private flattenItems(items) {
        return items.reduce((accumulator, item) => {
            const properties = Array.isArray(item.properties) ? item.properties : [item.properties];
            const flattenedProperties = properties.map((property) => ({
                groupName: item.aspect || item.type,
                property,
                editable: item.editable
            }));

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
