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
import { RenditionEntry, RenditionPaging } from '@alfresco/js-api';
import { Observable, from, interval, empty } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { concatMap, switchMap, takeWhile, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RenditionsService {

    constructor(private apiService: AlfrescoApiService) {
    }

    getAvailableRenditionForNode(nodeId: string): Observable<RenditionEntry> {
        return from(this.apiService.renditionsApi.getRenditions(nodeId)).pipe(
            map((availableRenditions: RenditionPaging) => {
                let renditionsAvailable: RenditionEntry[] = availableRenditions.list.entries.filter(
                    (rendition) => (rendition.entry.id === 'pdf' || rendition.entry.id === 'imgpreview'));
                let existingRendition = renditionsAvailable.find((rend) => rend.entry.status === 'CREATED');
                return existingRendition ? existingRendition : renditionsAvailable[0];
            }));
    }

    generateRenditionForNode(nodeId: string): Observable<any> {
        return this.getAvailableRenditionForNode(nodeId).pipe(
            map((rendition: RenditionEntry) => {
                if (rendition.entry.status !== 'CREATED') {
                    return from(this.apiService.renditionsApi.createRendition(nodeId, { id: rendition.entry.id }));
                } else {
                    return empty();
                }
            })
        );
    }

    /** @deprecated */
    isRenditionAvailable(nodeId: string, encoding: string): Observable<boolean> {
        return new Observable((observer) => {
            this.getRendition(nodeId, encoding).subscribe(
                (res) => {
                    let isAvailable = true;
                    if (res.entry.status.toString() === 'NOT_CREATED') {
                        isAvailable = false;
                    }
                    observer.next(isAvailable);
                    observer.complete();
                },
                () => {
                    observer.next(false);
                    observer.complete();
                }
            );
        });
    }

    /** @deprecated */
    isConversionPossible(nodeId: string, encoding: string): Observable<boolean> {
        return new Observable((observer) => {
            this.getRendition(nodeId, encoding).subscribe(
                () => {
                    observer.next(true);
                    observer.complete();
                },
                () => {
                    observer.next(false);
                    observer.complete();
                }
            );
        });
    }

    /** @deprecated */
    getRenditionUrl(nodeId: string, encoding: string): string {
        return this.apiService.contentApi.getRenditionUrl(nodeId, encoding);
    }

    /** @deprecated */
    getRendition(nodeId: string, encoding: string): Observable<RenditionEntry> {
        return from(this.apiService.renditionsApi.getRendition(nodeId, encoding));
    }

    /** @deprecated */
    getRenditionsListByNodeId(nodeId: string): Observable<RenditionPaging> {
        return from(this.apiService.renditionsApi.getRenditions(nodeId));
    }

    /** @deprecated */
    createRendition(nodeId: string, encoding: string): Observable<{}> {
        return from(this.apiService.renditionsApi.createRendition(nodeId, { id: encoding }));
    }

    /** @deprecated */
    convert(nodeId: string, encoding: string, pollingInterval: number = 1000, retries: number = 5) {
        return this.createRendition(nodeId, encoding)
            .pipe(
                concatMap(() => this.pollRendition(nodeId, encoding, pollingInterval, retries))
            );
    }

    /** @deprecated */
    private pollRendition(nodeId: string, encoding: string, intervalSize: number = 1000, retries: number = 5) {
        let attempts = 0;
        return interval(intervalSize)
            .pipe(
                switchMap(() => this.getRendition(nodeId, encoding)),
                takeWhile((renditionEntry: RenditionEntry) => {
                    attempts += 1;
                    if (attempts > retries) {
                        return false;
                    }
                    return (renditionEntry.entry.status.toString() !== 'CREATED');
                })
            );
    }
}
