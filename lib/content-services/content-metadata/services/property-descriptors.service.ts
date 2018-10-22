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
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Observable, defer, forkJoin } from 'rxjs';
import { PropertyGroup, PropertyGroupContainer } from '../interfaces/content-metadata.interfaces';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PropertyDescriptorsService {

    constructor(private alfrescoApiService: AlfrescoApiService) {}

    load(groupNames: string[]): Observable<PropertyGroupContainer> {
        const groupFetchStreams = groupNames
            .map(groupName => groupName.replace(':', '_'))
            .map(groupName => defer( () => this.alfrescoApiService.classesApi.getClass(groupName)) );

        return forkJoin(groupFetchStreams).pipe(
            map(this.convertToObject)
        );
    }

    private convertToObject(propertyGroupsArray: PropertyGroup[]): PropertyGroupContainer {
        return propertyGroupsArray.reduce((propertyGroups, propertyGroup) => {
            return Object.assign({}, propertyGroups, {
                [propertyGroup.name]: propertyGroup
            });
        }, {});
    }
}
