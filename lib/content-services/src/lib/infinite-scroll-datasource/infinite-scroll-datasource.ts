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

import { ContentPagingQuery } from '@alfresco/js-api';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

export abstract class InfiniteScrollDatasource<T> extends DataSource<T> {
    protected readonly dataStream = new BehaviorSubject<T[]>([]);
    private isLoading$ = new Subject<boolean>();
    private subscription = new Subscription();
    private batchesFetched = 0;
    private _itemsCount = 0;
    private _firstItem: T;

    /* Determines size of each batch to be fetched */
    batchSize = 100;

    /* Observable with initial and on reset loading state */
    isLoading = this.isLoading$.asObservable();

    get itemsCount(): number {
        return this._itemsCount;
    }

    get firstItem(): T {
        return this._firstItem;
    }

    abstract getNextBatch(pagingOptions: ContentPagingQuery): Observable<T[]>;

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        this.reset();
        this.subscription.add(
            collectionViewer.viewChange.subscribe((range) => {
                if (this.batchesFetched * this.batchSize <= range.end) {
                    forkJoin([
                        this.dataStream.asObservable().pipe(take(1)),
                        this.getNextBatch({ skipCount: this.batchSize * this.batchesFetched, maxItems: this.batchSize }).pipe(
                            take(1),
                            tap((nextBatch) => (this._itemsCount += nextBatch.length))
                        )
                    ]).subscribe((batchesArray) => this.dataStream.next([...batchesArray[0], ...batchesArray[1]]));
                    this.batchesFetched += 1;
                }
            })
        );
        return this.dataStream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    reset(): void {
        this.isLoading$.next(true);
        this.dataStream.next([]);
        this.getNextBatch({ skipCount: 0, maxItems: this.batchSize })
            .pipe(take(1))
            .subscribe((firstBatch) => {
                this._itemsCount = firstBatch.length;
                this._firstItem = firstBatch[0];
                this.dataStream.next(firstBatch);
                this.isLoading$.next(false);
            });
        this.batchesFetched = 1;
    }
}
