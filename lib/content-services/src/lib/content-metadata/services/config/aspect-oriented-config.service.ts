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

import { ContentMetadataConfig, OrganisedPropertyGroup, PropertyGroupContainer } from '../../interfaces/content-metadata.interfaces';
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
        const aspects = this.config,
            aspectNames = Object.keys(aspects);

        return aspectNames
            .reduce((groupAccumulator, aspectName) => {
                const newGroup = this.getOrganisedPropertyGroup(propertyGroups, aspectName);
                return groupAccumulator.concat(newGroup);
            }, [])
            .filter((organisedPropertyGroup) => organisedPropertyGroup.properties.length > 0);
    }

    public appendAllPreset(propertyGroups: PropertyGroupContainer): OrganisedPropertyGroup[] {
        const groups =  Object.keys(propertyGroups)
            .map((groupName) => {
                const propertyGroup = propertyGroups[groupName],
                    properties = propertyGroup.properties;

                return Object.assign({}, propertyGroup, {
                    properties: Object.keys(properties).map((propertyName) => properties[propertyName])
                });
            });

        return groups;
    }

    public filterExcludedPreset(propertyGroups: OrganisedPropertyGroup[]): OrganisedPropertyGroup[] {
        if (this.config.exclude) {
            return propertyGroups.filter((preset) => {
                return !this.config.exclude.includes(preset.name);
            });
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
                properties = (<string[]> aspectProperties)
                    .map((propertyName) => getProperty(propertyGroups, aspectName, propertyName))
                    .filter((props) => props !== undefined);
            }

            newGroup = [{ title: group.title, properties }];
        }

        return newGroup;
    }
}
