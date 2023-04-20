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

import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import {
    TaskFormService
} from '@alfresco/adf-process-services';
import { AlfrescoApiService, LogService } from '@alfresco/adf-core';

@Injectable()
export class FakeTaskFormService extends TaskFormService {

    constructor(apiService: AlfrescoApiService, logService: LogService) {
        super(apiService, logService);
    }

    public getRestFieldValues(
        taskId: string,
        fieldId: string
    ): Observable<any> {
        if (fieldId === 'typeaheadField') {
            return of([
                { id: '1', name: 'Leanne Graham' },
                { id: '2', name: 'Ervin Howell' },
                { id: '3', name: 'Clementine Bauch' },
                { id: '4', name: 'Patricia Lebsack' },
                { id: '5', name: 'Chelsey Dietrich' },
                { id: '6', name: 'Mrs. Dennis Schulist' },
                { id: '7', name: 'Kurtis Weissnat' },
                { id: '8', name: 'Nicholas Runolfsdottir V' },
                { id: '9', name: 'Glenna Reichert' },
                { id: '10', name: 'Clementina DuBuque' }
            ]);
        } else {
            return super.getRestFieldValues(taskId, fieldId);
        }
    }
}
