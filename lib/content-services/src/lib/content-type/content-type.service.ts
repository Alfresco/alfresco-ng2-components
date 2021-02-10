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

import { TypeEntry, TypePaging } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class ContentTypeService {

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    getContentTypeByPrefix(prefixedType: string): Observable<TypeEntry> {
        return from(this.alfrescoApiService.typesApi.getType(prefixedType));
    }

    getContentTypeChildren(nodeType: string): Observable<TypeEntry[]> {
        const opts = {where : `(parentIds in ('${nodeType}'))`};
        return from(this.alfrescoApiService.typesApi.listTypes(opts)).pipe(
            map((result: TypePaging) => result.list.entries)
        );
    }
}
