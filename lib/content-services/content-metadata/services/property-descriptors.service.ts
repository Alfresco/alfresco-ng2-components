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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PropertyGroup, Property, ContentMetadataConfig } from '../interfaces/content-metadata.interfaces';
import { PropertyDescriptorLoaderService } from './properties-loader.service';

function convertObjectToArray(object: any): Property[] {
    return Object.keys(object).map(key => object[key]);
}

@Injectable()
export class PropertyDescriptorsService {

    constructor(private propertyDescriptorLoaderService: PropertyDescriptorLoaderService) {}

    loadDescriptors(groupNames: string[], config: ContentMetadataConfig): Observable<PropertyGroup[]> {
        const groupsToLoad = groupNames.filter(groupName => config.isGroupAllowed(groupName));

        return this.propertyDescriptorLoaderService.load(groupsToLoad)
            .map(this.filterPropertiesByWhitelist.bind(this, config));
    }

    private filterPropertiesByWhitelist(config: ContentMetadataConfig, groupDescriptors: PropertyGroup[]): PropertyGroup[] {
        return groupDescriptors
            .map((groupDescriptor) => {
                const filteredPropertiesArray = convertObjectToArray(groupDescriptor.properties)
                    .filter(property => config.isPropertyAllowed(groupDescriptor.name, property.name));

                return Object.assign({}, groupDescriptor, {
                    properties: filteredPropertiesArray
                });
            });
    }
}
