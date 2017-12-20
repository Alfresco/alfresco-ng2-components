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
import { PropertyDescriptorsService } from './property-descriptors.service';
import { BasicPropertiesService } from './basic-properties.service';
import { CardViewItem } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { CardViewAspect } from '../interfaces/card-view-aspect.interface';

@Injectable()
export class ContentMetadataService {

    constructor(private basicPropertiesService: BasicPropertiesService,
                private propertyDescriptorsService: PropertyDescriptorsService) {}

    getBasicProperties(node: MinimalNodeEntryEntity): Observable<CardViewItem[]> {
        return Observable.of(this.basicPropertiesService.getBasicProperties(node));
    }

    getAspectProperties(node: MinimalNodeEntryEntity): Observable<CardViewAspect[]> {
        return this.propertyDescriptorsService.getAspects(node);
    }
}
