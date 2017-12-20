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
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { PropertyDescriptorLoaderService } from './properties-loader.service';
import { AspectWhiteListService } from './aspect-whitelist.service';
import { Observable } from 'rxjs/Observable';
import { Aspect } from '../interfaces/aspect.interface';

@Injectable()
export class PropertyDescriptorsService {

    constructor(private aspectWhiteListService: AspectWhiteListService,
                private aspectPropertiesService: PropertyDescriptorLoaderService) {}

    getAspects(node: MinimalNodeEntryEntity, presetName: string = 'default'): Observable<Aspect[]> {
        this.aspectWhiteListService.choosePreset(presetName);

        return this.loadAspectDescriptors(node.aspectNames)
            .map(this.filterPropertiesByWhitelist.bind(this));
    }

    private loadAspectDescriptors(aspectsAssignedToNode: string[]): Observable<any> {
        const aspectsToLoad = aspectsAssignedToNode
            .filter(nodeAspectName => this.aspectWhiteListService.isAspectAllowed(nodeAspectName));

        return this.aspectPropertiesService.load(aspectsToLoad);
    }

    private filterPropertiesByWhitelist(aspectDescriptors): Aspect[] {
        return aspectDescriptors.map((aspectDescriptor) => {
            return Object.assign({}, aspectDescriptor, {
                properties: this.getFilteredPropertiesArray(aspectDescriptor)
            });
        });
    }

    private getFilteredPropertiesArray(aspectDescriptor): any[] {
        const aspectName = aspectDescriptor.name;

        return Object.keys(aspectDescriptor.properties)
            .map(propertyName => aspectDescriptor.properties[propertyName])
            .filter(property => this.aspectWhiteListService.isPropertyAllowed(aspectName, property.name));
    }
}
