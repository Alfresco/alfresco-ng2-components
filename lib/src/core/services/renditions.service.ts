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
import { RenditionEntry, RenditionPaging } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from './alfresco-api.service';

/**
 * RenditionsService
 *
 * @returns {RenditionsService} .
 */
@Injectable()
export class RenditionsService {

    constructor(private apiService: AlfrescoApiService) {
    }

    isRenditionAvailable(nodeId: string, encoding: string): Observable<boolean> {
        return Observable.create((observer) => {
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

    isConversionPossible(nodeId: string, encoding: string): Observable<boolean> {
        return Observable.create((observer) => {
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

    getRenditionUrl(nodeId: string, encoding: string): string {
        return this.apiService.contentApi.getRenditionUrl(nodeId, 'pdf');
    }

    getRendition(nodeId: string, encoding: string): Observable<RenditionEntry> {
        return Observable.fromPromise(this.apiService.renditionsApi.getRendition(nodeId, encoding));
    }

    getRenditionsListByNodeId(nodeId: string): Observable<RenditionPaging> {
        return Observable.fromPromise(this.apiService.renditionsApi.getRenditions(nodeId));
    }

    createRendition(nodeId: string, encoding: string): Observable<{}> {
        return Observable.fromPromise(this.apiService.renditionsApi.createRendition(nodeId, {id: encoding}));
    }

    convert(nodeId: string, encoding: string, pollingInterval: number = 1000) {
        return this.createRendition(nodeId, encoding)
            .concatMap(() => this.pollRendition(nodeId, encoding, pollingInterval));
    }

    private pollRendition(nodeId: string, encoding: string, interval: number = 1000) {
        return Observable.interval(interval)
            .switchMap(() => this.getRendition(nodeId, encoding))
            .takeWhile((data) => {
                return (data.entry.status.toString() !== 'CREATED');
            });
    }
}
