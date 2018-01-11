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
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';

@Injectable()
export class PropertyDescriptorLoaderService {

    constructor(private alfrescoApiService: AlfrescoApiService) {}

    load(aspects: string[]): Observable<any> {
        const aspectFetchStreams = aspects
            .map(aspectName => aspectName.replace(':', '_'))
            .map(aspectName => defer( () => this.alfrescoApiService.classesApi.getClass(aspectName)) );

        return forkJoin(aspectFetchStreams);
    }
}
