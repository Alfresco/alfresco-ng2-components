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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService, LogService } from '@alfresco/adf-core';
import { ApiClientsService } from '@alfresco/adf-core/api';
import { from, Observable, of, Subject, zip } from 'rxjs';
import { AspectListDialogComponentData } from './aspect-list-dialog-data.interface';
import { AspectListDialogComponent } from './aspect-list-dialog.component';
import { catchError, map } from 'rxjs/operators';
import { AspectEntry, AspectPaging } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class AspectListService {

    get aspectsApi() {
        return this.apiClientsService.get('ModelClient.aspects');
    }

    constructor(
        private apiClientsService: ApiClientsService,
        private appConfigService: AppConfigService,
        private dialog: MatDialog,
        private logService: LogService
    ) {}

    getAspects(): Observable<AspectEntry[]> {
        const visibleAspectList = this.getVisibleAspects();
        const standardAspects$ = this.getStandardAspects(visibleAspectList);
        const customAspects$ = this.getCustomAspects();
        return zip(standardAspects$, customAspects$).pipe(
            map(([standardAspectList, customAspectList]) => [...standardAspectList, ...customAspectList])
        );
    }

    getStandardAspects(whiteList: string[]): Observable<AspectEntry[]> {
        const where = `(modelId in ('cm:contentmodel', 'emailserver:emailserverModel', 'smf:smartFolder', 'app:applicationmodel' ))`;
        const opts: any = {
            where,
            include: ['properties']
        };
        return from(this.aspectsApi.listAspects(opts))
            .pipe(
                map((result: AspectPaging) => this.filterAspectByConfig(whiteList, result?.list?.entries)),
                catchError((error) => {
                    this.logService.error(error);
                    return of([]);
                })
            );
    }

    getCustomAspects(): Observable<AspectEntry[]> {
        const where = `(not namespaceUri matches('http://www.alfresco.*'))`;
        const opts: any = {
            where,
            include: ['properties']
        };
        return from(this.aspectsApi.listAspects(opts))
            .pipe(
                map((result: AspectPaging) => result?.list?.entries),
                catchError((error) => {
                    this.logService.error(error);
                    return of([]);
                })
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

    openAspectListDialog(nodeId?: string): Observable<string[]> {
        const select = new Subject<string[]>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: AspectListDialogComponentData = {
            title: 'ADF-ASPECT-LIST.DIALOG.TITLE',
            description: 'ADF-ASPECT-LIST.DIALOG.DESCRIPTION',
            overTableMessage: 'ADF-ASPECT-LIST.DIALOG.OVER-TABLE-MESSAGE',
            select,
            nodeId
        };

        this.openDialog(data, 'adf-aspect-list-dialog', '750px');
        return select;
    }

    private openDialog(data: AspectListDialogComponentData, panelClass: string, width: string) {
        this.dialog.open(AspectListDialogComponent, {
            data,
            panelClass,
            width,
            disableClose: true
        });
    }

    close() {
        this.dialog.closeAll();
    }
}
