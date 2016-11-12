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

import { PaginationComponent } from '../pagination/pagination.component';
import { PaginationProvider, DataLoadedEventEmitter} from '../pagination/paginationProvider.interface';
import { Injector } from '@angular/core';
import { getTestBed, TestBed} from '@angular/core/testing';

class CustomPaginationProvider implements PaginationProvider {
    skipCount: number = 0;
    dataLoaded: DataLoadedEventEmitter;
    count: number = 200;
    hasMoreItems: boolean = false;
    maxItems: number = 20;
}

describe('PaginationComponent', () => {
    let injector: Injector;
    let paginationComponent: PaginationComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PaginationComponent
            ]
        });
        injector = getTestBed();
        paginationComponent = injector.get(PaginationComponent);
        paginationComponent.provider = new CustomPaginationProvider();
    });

    it('is defined', () => {
        expect(paginationComponent).toBeDefined();
    });

    it('page size', () => {
        expect(paginationComponent.pageSize).toBe(20);
    });

    it('set page size', () => {
        paginationComponent.pageSize = 100;
        expect(paginationComponent.pageSize).toBe(100);
    });

    it('prevPageAvail', () => {
        expect(paginationComponent.prevPageAvail).toBe(false);
    });

    it('nextPageAvail', () => {
        expect(paginationComponent.nextPageAvail).toBe(false);
    });

    it('showNextPage', () => {
        expect(paginationComponent.provider.skipCount).toBe(0);
        paginationComponent.showNextPage();
        expect(paginationComponent.provider.skipCount).toBe(20);
    });

    it('showPrevPage', () => {
        paginationComponent.provider.skipCount = 100;
        paginationComponent.showPrevPage();
        expect(paginationComponent.provider.skipCount).toBe(80);
    });

    it('PaginationProvider', () => {
        expect(paginationComponent.provider instanceof CustomPaginationProvider).toBeTruthy();
    });
});
