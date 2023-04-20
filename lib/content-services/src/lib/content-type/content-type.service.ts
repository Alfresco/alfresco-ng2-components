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

import { TypeEntry, TypePaging, TypesApi } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class ContentTypeService {

    private _typesApi: TypesApi;
    get typesApi(): TypesApi {
        this._typesApi = this._typesApi ?? new TypesApi(this.alfrescoApiService.getInstance());
        return this._typesApi;
    }

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    getContentTypeByPrefix(prefixedType: string): Observable<TypeEntry> {
        return from(this.typesApi.getType(prefixedType));
    }

    getContentTypeChildren(nodeType: string): Observable<TypeEntry[]> {
        const where = `(parentId in ('${nodeType}') and not namespaceUri matches('http://www.alfresco.*'))`;
        const opts: any = {
            where,
            include: ['properties']
        };
        return from(this.typesApi.listTypes(opts)).pipe(
            map((result: TypePaging) => result.list.entries)
        );
    }
}
