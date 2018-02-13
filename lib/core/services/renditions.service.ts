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
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from './alfresco-api.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/combineAll';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeWhile';

/**
 * @deprecated
 * RenditionsService
 * (this service is deprecated in 2.2.0 and will be removed in future revisions)
 */
@Injectable()
export class RenditionsService {

    constructor(private apiService: AlfrescoApiService) {
    }

    /** @deprecated */
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

    /** @deprecated */
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

    /** @deprecated */
    getRenditionUrl(nodeId: string, encoding: string): string {
        return this.apiService.contentApi.getRenditionUrl(nodeId, encoding);
    }

    /** @deprecated */
    getRendition(nodeId: string, encoding: string): Observable<RenditionEntry> {
        return Observable.fromPromise(this.apiService.renditionsApi.getRendition(nodeId, encoding));
    }

    /** @deprecated */
    getRenditionsListByNodeId(nodeId: string): Observable<RenditionPaging> {
        return Observable.fromPromise(this.apiService.renditionsApi.getRenditions(nodeId));
    }

    /** @deprecated */
    createRendition(nodeId: string, encoding: string): Observable<{}> {
        return Observable.fromPromise(this.apiService.renditionsApi.createRendition(nodeId, {id: encoding}));
    }

    /** @deprecated */
    convert(nodeId: string, encoding: string, pollingInterval: number = 1000, retries: number = 5) {
        return this.createRendition(nodeId, encoding)
            .concatMap(() => this.pollRendition(nodeId, encoding, pollingInterval, retries));
    }

    /** @deprecated */
    private pollRendition(nodeId: string, encoding: string, interval: number = 1000, retries: number = 5) {
        let attempts = 0;
        return Observable.interval(interval)
            .switchMap(() => this.getRendition(nodeId, encoding))
            .takeWhile((data) => {
                attempts += 1;
                if (attempts > retries) {
                    return false;
                }
                return (data.entry.status.toString() !== 'CREATED');
            });
    }
}
