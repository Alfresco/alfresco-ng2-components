/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AppConfigService } from '@alfresco/adf-core';
import { from, Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AspectEntry, AspectPaging, AspectsApi, ListAspectsOpts } from '@alfresco/js-api';
import { CustomAspectPaging } from '../interfaces/custom-aspect-paging.interface';

export const StandardAspectsWhere = `(modelId in ('cm:contentmodel', 'emailserver:emailserverModel', 'smf:smartFolder', 'app:applicationmodel' ))`;
export const CustomAspectsWhere = `(not namespaceUri matches('http://www.alfresco.*'))`;

@Injectable({
    providedIn: 'root'
})
export class AspectListService {
    private _aspectsApi: AspectsApi;
    get aspectsApi(): AspectsApi {
        this._aspectsApi = this._aspectsApi ?? new AspectsApi(this.alfrescoApiService.getInstance());
        return this._aspectsApi;
    }

    constructor(private alfrescoApiService: AlfrescoApiService, private appConfigService: AppConfigService) {}

    getAllAspects(standardOpts?: ListAspectsOpts, customOpts?: ListAspectsOpts): Observable<CustomAspectPaging> {
        const visibleAspectList = this.getVisibleAspects();
        const standardAspects$ = this.getAspects(visibleAspectList, standardOpts);
        const customAspects$ = this.getAspects(visibleAspectList, customOpts);
        return zip(standardAspects$, customAspects$).pipe(
            map(([standardAspectPaging, customAspectPaging]) => ({ standardAspectPaging, customAspectPaging }))
        );
    }

    getAspects(whiteList: string[], opts?: ListAspectsOpts): Observable<AspectPaging> {
        return from(this.aspectsApi.listAspects(opts)).pipe(
            map((result) => {
                if (result?.list?.entries) {
                    result.list.entries = this.filterAspectByConfig(whiteList, result.list.entries);
                }
                return result;
            }),
            catchError(() => of({ list: { entries: [] } }))
        );
    }

    private filterAspectByConfig(visibleAspectList: string[], aspectEntries: AspectEntry[]): AspectEntry[] {
        let result = aspectEntries ? aspectEntries : [];
        if (visibleAspectList?.length > 0 && aspectEntries) {
            result = aspectEntries.filter((value) => visibleAspectList.includes(value?.entry?.id));
        }
        return result;
    }

    getVisibleAspects(): string[] {
        let visibleAspectList: string[] = [];
        const aspectVisibleConfig = this.appConfigService.get('aspect-visible');
        if (aspectVisibleConfig) {
            for (const aspectGroup of Object.keys(aspectVisibleConfig)) {
                visibleAspectList = visibleAspectList.concat(aspectVisibleConfig[aspectGroup]);
            }
        }
        return visibleAspectList;
    }
}
