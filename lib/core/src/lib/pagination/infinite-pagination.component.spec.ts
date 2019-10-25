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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Pagination } from '@alfresco/js-api';
import { InfinitePaginationComponent } from './infinite-pagination.component';
import { PaginatedComponent } from './paginated-component.interface';
import { BehaviorSubject } from 'rxjs';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { Component, ChangeDetectorRef } from '@angular/core';
import { PaginationModel } from '../models/pagination.model';
import { RequestPaginationModel } from '../models/request-pagination.model';

@Component({
    template: ``
})
class TestPaginatedComponent implements PaginatedComponent {

    private _pagination: BehaviorSubject<PaginationModel>;

    get pagination(): BehaviorSubject<PaginationModel> {
        if (!this._pagination) {
            const defaultPagination = <PaginationModel> {
                maxItems: 10,
                skipCount: 0,
                totalItems: 0,
                hasMoreItems: false
            };
            this._pagination = new BehaviorSubject<PaginationModel>(defaultPagination);
        }
        return this._pagination;
    }

    updatePagination(pagination: PaginationModel) {
        this.pagination.next(pagination);
    }
}

describe('InfinitePaginationComponent', () => {

    let fixture: ComponentFixture<InfinitePaginationComponent>;
    let component: InfinitePaginationComponent;
    let pagination: Pagination;
    let changeDetectorRef: ChangeDetectorRef;

    setupTestBed({
        imports: [CoreTestingModule],
        declarations: [
            TestPaginatedComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InfinitePaginationComponent);
        component = fixture.componentInstance;
        changeDetectorRef = fixture.componentRef.injector.get(ChangeDetectorRef);

        component.target = TestBed.createComponent(TestPaginatedComponent).componentInstance;
        pagination = {
            skipCount: 0,
            hasMoreItems: false
        };
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('View', () => {

        it('should show the loading spinner if loading', () => {
            pagination.hasMoreItems = true;
            component.isLoading = true;
            component.target = null;
            changeDetectorRef.detectChanges();

            const loadingSpinner = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-spinner"]'));
            expect(loadingSpinner).not.toBeNull();
        });

        it('should NOT show the loading spinner if NOT loading', () => {
            pagination.hasMoreItems = true;
            component.target.updatePagination(pagination);
            component.isLoading = false;
            changeDetectorRef.detectChanges();

            const loadingSpinner = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-spinner"]'));
            expect(loadingSpinner).toBeNull();
        });

        it('should show the load more button if NOT loading and has more items', () => {
            pagination.hasMoreItems = true;
            component.target.updatePagination(pagination);
            component.isLoading = false;
            changeDetectorRef.detectChanges();

            const loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
            expect(loadMoreButton).not.toBeNull();
        });

        it('should NOT show the load more button if there are no more elements to load', (done) => {
            pagination = { maxItems: 444, skipCount: 25, totalItems: 30, hasMoreItems: false };

            component.target.pagination.next(pagination);

            changeDetectorRef.detectChanges();

            component.onLoadMore();

            fixture.whenStable().then(() => {
                const loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
                expect(loadMoreButton).toBeNull();
                done();
            });
        });

        it('should  show the load more button if there are  more elements to load', (done) => {
            pagination = { maxItems: 444, skipCount: 25, totalItems: 55, hasMoreItems: true };

            component.target.pagination.next(pagination);

            changeDetectorRef.detectChanges();

            fixture.whenStable().then(() => {
                const loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
                expect(loadMoreButton).not.toBeNull();
                done();
            });
        });

        it('should NOT show anything if pagination has NO more items', () => {
            pagination.hasMoreItems = false;
            component.target.updatePagination(pagination);
            changeDetectorRef.detectChanges();

            const loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
            expect(loadMoreButton).toBeNull();
            const loadingSpinner = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-spinner"]'));
            expect(loadingSpinner).toBeNull();
        });

        it('should trigger the loadMore event with skipcount 0 to reload all the elements', (done) => {
            pagination = { maxItems: 444, skipCount: 25, totalItems: 55, hasMoreItems: true };

            component.target.pagination.next(pagination);

            component.isLoading = false;
            component.pageSize = 5;
            changeDetectorRef.detectChanges();

            component.loadMore.subscribe((newPagination: Pagination) => {
                expect(newPagination.skipCount).toBe(0);
                done();
            });

            const loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
            loadMoreButton.triggerEventHandler('click', {});
        });

        it('should trigger the loadMore event with merge false to reload all the elements', (done) => {
            pagination = { maxItems: 444, skipCount: 25, totalItems: 55, hasMoreItems: true };

            component.target.pagination.next(pagination);

            component.isLoading = false;
            component.pageSize = 5;
            changeDetectorRef.detectChanges();

            component.loadMore.subscribe((newPagination: RequestPaginationModel) => {
                expect(newPagination.merge).toBe(false);
                done();
            });

            const loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
            loadMoreButton.triggerEventHandler('click', {});
        });
    });

    describe('Target', () => {

        let spyTarget;

        beforeEach(() => {
            pagination = { maxItems: 444, skipCount: 0, totalItems: 888, hasMoreItems: true };

            spyTarget = spyOn(component.target, 'updatePagination').and.callThrough();
        });

        it('should subscribe to target\'s pagination observable to update pagination and pagesize correctly', () => {
            component.target.updatePagination(pagination);
            fixture.detectChanges();

            expect(component.pagination).toBe(pagination);
            expect(component.pageSize).toBe(25);
        });

        it('should call the target\'s updatePagination on invoking the onLoadMore', () => {
            component.target.updatePagination(pagination);

            fixture.detectChanges();

            component.onLoadMore();

            expect(spyTarget).toHaveBeenCalledWith({
                skipCount: 0,
                maxItems: 50,
                hasMoreItems: false,
                merge: false
            });
        });

        it('should call the target\'s updatePagination on invoking the onLoadMore with a specific pageSize', () => {
            component.pageSize = 7;
            component.target.updatePagination(pagination);
            fixture.detectChanges();

            component.onLoadMore();

            expect(spyTarget).toHaveBeenCalledWith({
                maxItems: 14,
                skipCount: 0,
                hasMoreItems: false,
                merge: false
            });
        });

        it('should unsubscribe from the target\'s pagination on onDestroy', () => {
            fixture.detectChanges();
            fixture.destroy();

            const emitNewPaginationEvent = () => {
                const newPagination = { maxItems: 1, skipCount: 0, totalItems: 2, hasMoreItems: true };
                component.target.pagination.next(newPagination);
            };

            expect(emitNewPaginationEvent).not.toThrow();
        });
    });
});
