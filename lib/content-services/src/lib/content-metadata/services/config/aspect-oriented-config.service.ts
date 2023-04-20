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

import { ContentMetadataConfig, OrganisedPropertyGroup, PropertyGroupContainer, Property } from '../../interfaces/content-metadata.interfaces';
import { getGroup, getProperty } from './property-group-reader';

export class AspectOrientedConfigService implements ContentMetadataConfig {

    constructor(private config: any) { }

    public isGroupAllowed(groupName: string): boolean {
        if (this.isIncludeAllEnabled()) {
            return true;
        }
        const groupNames = Object.keys(this.config);
        return groupNames.indexOf(groupName) !== -1;
    }

    public reorganiseByConfig(propertyGroups: PropertyGroupContainer): OrganisedPropertyGroup[] {
        const aspects = this.config;
        const aspectNames = Object.keys(aspects);

        return aspectNames
            .reduce((groupAccumulator, aspectName) => {
                const newGroup = this.getOrganisedPropertyGroup(propertyGroups, aspectName);
                return groupAccumulator.concat(newGroup);
            }, [])
            .filter((organisedPropertyGroup) => organisedPropertyGroup.properties.length > 0);
    }

    public appendAllPreset(propertyGroups: PropertyGroupContainer): OrganisedPropertyGroup[] {
        const groups = Object.keys(propertyGroups)
            .map((groupName) => {
                const propertyGroup = propertyGroups[groupName];
                const properties = propertyGroup.properties;

                if (this.isAspectReadOnly(groupName)) {
                    Object.keys(properties).map((propertyName) => this.setReadOnlyProperty(properties[propertyName]));
                }

                return Object.assign({}, propertyGroup, {
                    properties: Object.keys(properties).map((propertyName) => {
                        if (this.isPropertyReadOnly(propertyName)) {
                            this.setReadOnlyProperty(properties[propertyName]);
                        }
                        return properties[propertyName];
                    })
                });
            });

        return groups;
    }

    private setReadOnlyProperty(property: Property) {
        property.editable = false;
    }

    private isPropertyReadOnly(propertyName: string): boolean {
        const readOnlyAspects = this.config.readOnlyProperties;

        if (Array.isArray(readOnlyAspects)) {
            return readOnlyAspects.includes(propertyName);
        } else {
            return readOnlyAspects === propertyName;
        }
    }

    private isAspectReadOnly(propertyGroupName: string): boolean {
        const readOnlyAspects = this.config.readOnlyAspects;

        if (Array.isArray(readOnlyAspects)) {
            return readOnlyAspects.includes(propertyGroupName);
        } else {
            return readOnlyAspects === propertyGroupName;
        }

    }

    public filterExcludedPreset(propertyGroups: OrganisedPropertyGroup[]): OrganisedPropertyGroup[] {
        if (this.config.exclude) {
            return propertyGroups.filter((preset) => !this.config.exclude.includes(preset.name));
        }
        return propertyGroups;
    }

    public isIncludeAllEnabled() {
        return this.config.includeAll;
    }

    private getOrganisedPropertyGroup(propertyGroups, aspectName) {
        const group = getGroup(propertyGroups, aspectName);
        let newGroup = [];

        if (group) {
            const aspectProperties = this.config[aspectName];
            let properties;

            if (aspectProperties === '*') {
                properties = getProperty(propertyGroups, aspectName, aspectProperties);
            } else {
                properties = aspectProperties
                    .map((propertyName) => getProperty(propertyGroups, aspectName, propertyName))
                    .filter((props) => props !== undefined);
            }

            newGroup = [{ title: group.title, properties }];
        }

        return newGroup;
    }
}
