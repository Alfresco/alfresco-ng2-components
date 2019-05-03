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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from '@alfresco/js-api';
import { PaginationComponent } from './pagination.component';
import { PaginatedComponent } from './paginated-component.interface';
import { BehaviorSubject } from 'rxjs';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

class FakePaginationInput implements Pagination {
    count: number = 25;
    hasMoreItems: boolean;
    totalItems: number = null;
    skipCount: number = null;
    maxItems: number = 25;

    constructor(pagesCount: number, currentPage: number, lastPageItems: number) {
        this.totalItems = ((pagesCount - 1) * this.maxItems) + lastPageItems;
        this.skipCount = (currentPage - 1) * this.maxItems;
    }
}

describe('PaginationComponent', () => {

    let fixture: ComponentFixture<PaginationComponent>;
    let component: PaginationComponent;

    setupTestBed({
        imports: [CoreTestingModule],
        schemas: [ NO_ERRORS_SCHEMA ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should have an "empty" class if no items present', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('adf-pagination__empty')).toBeTruthy();
    });

    describe('Single page', () => {
        beforeEach(() => {
            component.pagination = new FakePaginationInput(1, 1, 10);
        });

        it('has a single page', () => {
            expect(component.pages.length).toBe(1);
        });

        it('has current page 1', () => {
            expect(component.current).toBe(1);
        });

        it('is first and last page', () => {
            expect(component.isFirstPage).toBe(true);
            expect(component.isLastPage).toBe(true);
        });

        it('has range', () => {
            expect(component.range).toEqual([ 1, 10 ]);
        });
    });

    describe('Single full page', () => {
        beforeEach(() => {
            component.pagination = new FakePaginationInput(1, 1, 25);
        });

        it('has a single page', () => {
            expect(component.pages.length).toBe(1);
        });

        it('has range', () => {
            expect(component.range).toEqual([ 1, 25 ]);
        });
    });

    describe('Middle page', () => {

        // This test describes 6 pages being on the third page
        // and last page has 5 items

        beforeEach(() => {
            component.pagination = new FakePaginationInput(6, 3, 5);
        });

        it('has more pages', () => {
            expect(component.pages.length).toBe(6);
        });

        it('has the last page', () => {
            expect(component.lastPage).toBe(6);
        });

        it('is on the 3rd page', () => {
            expect(component.current).toBe(3);
        });

        it('has previous and next page', () => {
            expect(component.previous).toBe(2);
            expect(component.next).toBe(4);
        });

        it('is not first, nor last', () => {
            expect(component.isFirstPage).toBe(false);
            expect(component.isLastPage).toBe(false);
        });

        it('has range', () => {
            expect(component.range).toEqual([ 51, 75 ]);
        });

        it('goes next', () => {
            const nextPageSpy = spyOn(component.nextPage, 'emit');
            expect(component.current).toBe(3);
            component.goNext();

            const { skipCount } = nextPageSpy.calls.mostRecent().args[0];

            expect(skipCount).toBe(75);
            expect(component.current).toBe(4);
        });

        it('goes previous', () => {
            const prevPageSpy = spyOn(component.prevPage, 'emit');
            expect(component.current).toBe(3);
            component.goPrevious();

            const { skipCount } = prevPageSpy.calls.mostRecent().args[0];

            expect(skipCount).toBe(25);
            expect(component.current).toBe(2);
        });

        it('changes page size', () => {
            const changePageSizeSpy = spyOn(component.changePageSize, 'emit');
            expect(component.current).toBe(3);
            component.onChangePageSize(50);

            const { maxItems } = changePageSizeSpy.calls.mostRecent().args[0];

            expect(maxItems).toBe(50);
            expect(component.current).toBe(1);
        });

        it('changes page number', () => {
            const changePageNumberSpy = spyOn(component.changePageNumber, 'emit');
            expect(component.current).toBe(3);
            component.onChangePageNumber(5);

            const { skipCount } = changePageNumberSpy.calls.mostRecent().args[0];

            expect(skipCount).toBe(100);
            expect(component.current).toBe(5);
        });
    });

    describe('First page', () => {

        // This test describes 10 pages being on the first page

        beforeEach(() => {
            component.pagination = new FakePaginationInput(10, 1, 5);
        });

        it('is on the first page', () => {
            expect(component.current).toBe(1);
            expect(component.isFirstPage).toBe(true);
        });

        it('has the same, previous page', () => {
            expect(component.previous).toBe(1);
        });

        it('has next page', () => {
            expect(component.next).toBe(2);
        });

        it('has range', () => {
            expect(component.range).toEqual([ 1, 25 ]);
        });
    });

    describe('Last page', () => {

        // This test describes 10 pages being on the last page

        beforeEach(() => {
            component.pagination = new FakePaginationInput(10, 10, 5);
        });

        it('is on the last page', () => {
            expect(component.current).toBe(10);
            expect(component.isLastPage).toBe(true);
        });

        it('has the same, next page', () => {
            expect(component.next).toBe(10);
        });

        it('has previous page', () => {
            expect(component.previous).toBe(9);
        });

        it('has range', () => {
            expect(component.range).toEqual([ 226, 230 ]);
        });
    });

    describe('Without pagination input', () => {
        it('has defaults', () => {
            component.ngOnInit();

            const {
                current, lastPage, isFirstPage, isLastPage,
                next, previous, range, pages
            } = component;

            expect(lastPage).toBe(1, 'lastPage');
            expect(previous).toBe(1, 'previous');
            expect(current).toBe(1, 'current');
            expect(next).toBe(1, 'next');

            expect(isFirstPage).toBe(true, 'isFirstPage');
            expect(isLastPage).toBe(true, 'isLastPage');

            expect(range).toEqual([ 0, 0 ], 'range');
            expect(pages).toEqual([ 1 ], 'pages');
        });
    });

    describe('with paginated component', () => {

        it('should take pagination from the external component', () => {
            const pagination: Pagination = {};

            const customComponent = <PaginatedComponent> {
                pagination: new BehaviorSubject<Pagination>({})
            };

            component.target = customComponent;
            component.ngOnInit();

            customComponent.pagination.next(pagination);
            expect(component.pagination).toEqual(pagination);
        });

        it('should update pagination by subscription', () => {
            const pagination1: Pagination = {};
            const pagination2: Pagination = {};

            const customComponent = <PaginatedComponent> {
                pagination: new BehaviorSubject<Pagination>({})
            };

            component.target = customComponent;
            component.ngOnInit();

            customComponent.pagination.next(pagination1);
            expect(component.pagination).toEqual(pagination1);

            customComponent.pagination.next(pagination2);
            expect(component.pagination).toEqual(pagination2);
        });

        it('should send pagination event to paginated component', () => {
            const customComponent = <PaginatedComponent> {
                pagination: new BehaviorSubject<Pagination>({}),
                updatePagination() {},
                supportedPageSizes: [],
                rows: []
            };
            spyOn(customComponent, 'updatePagination').and.stub();

            component.target = customComponent;
            component.ngOnInit();

            customComponent.pagination.next(new FakePaginationInput(2, 1, 25));
            expect(component.current).toBe(1);

            component.goNext();
            expect(customComponent.updatePagination).toHaveBeenCalled();
            expect(component.current).toBe(2);
        });

        it('should go to previous page if current page has 0 items', () => {
            const customComponent = <PaginatedComponent> {
                updatePagination() {},
                pagination: new BehaviorSubject<Pagination>({}),
                rows: []
            };

            component.target = customComponent;
            component.ngOnInit();

            customComponent.pagination.next({
                count: 2,
                skipCount: 5,
                maxItems: 5
            });

            expect(component.current).toBe(2);

            customComponent.pagination.next({
                count: 0,
                totalItems: 5,
                maxItems: 5
            });

            expect(component.current).toBe(1);
        });
    });
});
