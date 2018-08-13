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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Pagination } from 'alfresco-js-api';
import { InfinitePaginationComponent } from './infinite-pagination.component';
import { PaginatedComponent } from './paginated-component.interface';
import { BehaviorSubject } from 'rxjs';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('InfinitePaginationComponent', () => {

    let fixture: ComponentFixture<InfinitePaginationComponent>;
    let component: InfinitePaginationComponent;
    let pagination: Pagination;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InfinitePaginationComponent);
        component = fixture.componentInstance;

        pagination = {
            skipCount: 0,
            hasMoreItems: false
        };
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Standalone', () => {

        it('should show the loading spinner if loading', () => {
            pagination.hasMoreItems = true;
            component.pagination = pagination;
            component.isLoading = true;
            fixture.detectChanges();

            let loadingSpinner = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-spinner"]'));
            expect(loadingSpinner).not.toBeNull();
        });

        it('should NOT show the loading spinner if NOT loading', () => {
            pagination.hasMoreItems = true;
            component.pagination = pagination;
            component.isLoading = false;
            fixture.detectChanges();

            let loadingSpinner = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-spinner"]'));
            expect(loadingSpinner).toBeNull();
        });

        it('should show the load more button if NOT loading and has more items', () => {
            pagination.hasMoreItems = true;
            component.pagination = pagination;
            component.isLoading = false;
            fixture.detectChanges();

            let loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
            expect(loadMoreButton).not.toBeNull();
        });

        it('should NOT show anything if pagination has NO more items', () => {
            pagination.hasMoreItems = false;
            component.pagination = pagination;
            fixture.detectChanges();

            let loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
            expect(loadMoreButton).toBeNull();
            let loadingSpinner = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-spinner"]'));
            expect(loadingSpinner).toBeNull();
        });

        it('should trigger the loadMore event with the proper pagination object', (done) => {
            pagination.hasMoreItems = true;
            pagination.skipCount = 5;
            component.pagination = pagination;
            component.isLoading = false;
            component.pageSize = 5;
            fixture.detectChanges();

            component.loadMore.subscribe((newPagination: Pagination) => {
                expect(newPagination.skipCount).toBe(0);
                done();
            });

            let loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
            loadMoreButton.triggerEventHandler('click', {});
        });
    });

    describe('Target', () => {

        let testTarget: PaginatedComponent;

        beforeEach(() => {

            pagination = { maxItems: 444, skipCount: 0, totalItems: 888, hasMoreItems: true };
            testTarget = {
                pagination: new BehaviorSubject<Pagination>(pagination),
                supportedPageSizes: [],
                updatePagination() {}
            };

            spyOn(testTarget, 'updatePagination');
        });

        it('should subscribe to target\'s pagination observable to update pagination and pagesize correctly', () => {
            component.target = testTarget;
            fixture.detectChanges();

            expect(component.pagination).toBe(pagination);
            expect(component.pageSize).toBe(25);
        });

        it('should call the target\'s updatePagination on invoking the onLoadMore', () => {
            component.target = testTarget;
            fixture.detectChanges();

            component.onLoadMore();

            expect(testTarget.updatePagination).toHaveBeenCalledWith({ maxItems: 469, skipCount: 0, totalItems: 888, hasMoreItems: true, merge: true });
        });

        it('should unsubscribe from the target\'s pagination on onDestroy', () => {
            component.target = testTarget;
            fixture.detectChanges();
            fixture.destroy();

            const emitNewPaginationEvent = () => {
                let newPagination = { maxItems: 1, skipCount: 0, totalItems: 2, hasMoreItems: true };
                testTarget.pagination.next(newPagination);
            };

            expect(emitNewPaginationEvent).not.toThrow();
        });
    });
});
