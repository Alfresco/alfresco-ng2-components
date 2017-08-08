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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { CoreModule } from 'ng2-alfresco-core';

import { PaginationComponent } from './pagination.component';

declare let jasmine: any;

class FakePaginationInput {
    count: string = 'Not applicable / not used';
    hasMoreItems: string = 'Not applicable / not used';
    totalItems: number = null;
    skipCount: number = null;
    maxItems: number = 25;

    constructor(pagesCount, currentPage, lastPageItems) {
        this.totalItems = ((pagesCount - 1) * this.maxItems) + lastPageItems;
        this.skipCount = (currentPage - 1) * this.maxItems;
    }
}

class TestConfig {
    testBed: any = null;

    constructor() {
        this.testBed = TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                MaterialModule
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    }
}

describe('PaginationComponent', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    beforeEach(async(() => {
        const test = new TestConfig();

        test.testBed
            .compileComponents()
            .then(() => {
                const fixture = test.testBed.createComponent(PaginationComponent);
                const component: PaginationComponent = fixture.componentInstance;

                (<any> component).ngAfterViewInit = jasmine
                    .createSpy('ngAfterViewInit').and
                    .callThrough();

                spyOn(component.onChangePageNumber, 'emit');
                spyOn(component.onChangePageSize, 'emit');
                spyOn(component.onNextPage, 'emit');
                spyOn(component.onPrevPage, 'emit');

                this.fixture = fixture;
                this.component = component;

                fixture.detectChanges();
            });
    }));

    describe('Single page', () => {
        beforeEach(() => {
            this.component.pagination = new FakePaginationInput(1, 1, 10);
        });

        it('has a single page', () => {
            expect(this.component.pages.length).toBe(1);
        });

        it('has current page 1', () => {
            expect(this.component.current).toBe(1);
        });

        it('is first and last page', () => {
            expect(this.component.isFirstPage).toBe(true);
            expect(this.component.isLastPage).toBe(true);
        });

        it('has range', () => {
            expect(this.component.range).toEqual([ 1, 10 ]);
        });
    });

    describe('Single full page', () => {
        beforeEach(() => {
            this.component.pagination = new FakePaginationInput(1, 1, 25);
        });

        it('has a single page', () => {
            expect(this.component.pages.length).toBe(1);
        });

        it('has range', () => {
            expect(this.component.range).toEqual([ 1, 25 ]);
        });
    });

    describe('Middle page', () => {

        // This test describes 6 pages being on the third page
        // and last page has 5 items

        beforeEach(() => {
            this.component.pagination = new FakePaginationInput(6, 3, 5);
        });

        it('has more pages', () => {
            expect(this.component.pages.length).toBe(6);
        });

        it('has the last page', () => {
            expect(this.component.lastPage).toBe(6);
        });

        it('is on the 3rd page', () => {
            expect(this.component.current).toBe(3);
        });

        it('has previous and next page', () => {
            expect(this.component.previous).toBe(2);
            expect(this.component.next).toBe(4);
        });

        it('is not first, nor last', () => {
            expect(this.component.isFirstPage).toBe(false);
            expect(this.component.isLastPage).toBe(false);
        });

        it('has range', () => {
            expect(this.component.range).toEqual([ 51, 75 ]);
        });

        it('goes next', () => {
            const { component } = this;

            component.goNext();

            const { emit: { calls } } = component.onNextPage;
            const { skipCount } = calls.mostRecent().args[0];

            expect(skipCount).toBe(75);
        });

        it('goes previous', () => {
            const { component } = this;

            component.goPrevious();

            const { emit: { calls } } = component.onPrevPage;
            const { skipCount } = calls.mostRecent().args[0];

            expect(skipCount).toBe(25);
        });

        it('changes page size', () => {
            const { component } = this;
            component.changePageSize(50);

            const { emit: { calls } } = component.onChangePageSize;
            const { maxItems } = calls.mostRecent().args[0];

            expect(maxItems).toBe(50);
        });

        it('changes page number', () => {
            const { component } = this;

            component.changePageNumber(5);

            const { emit: { calls } } = component.onChangePageNumber;
            const { skipCount } = calls.mostRecent().args[0];

            expect(skipCount).toBe(100);
        });
    });

    describe('First page', () => {

        // This test describes 10 pages being on the first page

        beforeEach(() => {
            this.component.pagination = new FakePaginationInput(10, 1, 5);
        });

        it('is on the first page', () => {
            expect(this.component.current).toBe(1);
            expect(this.component.isFirstPage).toBe(true);
        });

        it('has the same, previous page', () => {
            expect(this.component.previous).toBe(1);
        });

        it('has next page', () => {
            expect(this.component.next).toBe(2);
        });

        it('has range', () => {
            expect(this.component.range).toEqual([ 1, 25 ]);
        });
    });

    describe('Last page', () => {

        // This test describes 10 pages being on the last page

        beforeEach(() => {
            this.component.pagination = new FakePaginationInput(10, 10, 5);
        });

        it('is on the last page', () => {
            expect(this.component.current).toBe(10);
            expect(this.component.isLastPage).toBe(true);
        });

        it('has the same, next page', () => {
            expect(this.component.next).toBe(10);
        });

        it('has previous page', () => {
            expect(this.component.previous).toBe(9);
        });

        it('has range', () => {
            expect(this.component.range).toEqual([ 226, 230 ]);
        });
    });

    describe('Without pagination input', () => {
        it('has defaults', () => {
            const {
                current, lastPage, isFirstPage, isLastPage,
                next, previous, range, pages
            } = this.component;

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
});
