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

import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Pagination } from 'alfresco-js-api';
import { MaterialModule } from '../material.module';
import { AppConfigService } from '../app-config/app-config.service';
import { LogService } from '../services/log.service';
import { TranslateLoaderService } from '../services/translate-loader.service';
import { TranslationService } from '../services/translation.service';
import { PaginationComponent } from './pagination.component';
import { PaginatedComponent } from './public-api';
import { Subject } from 'rxjs/Subject';

class FakePaginationInput implements Pagination {
    count: number;
    hasMoreItems: boolean;
    totalItems: number = null;
    skipCount: number = null;
    maxItems: number = 25;

    constructor(pagesCount, currentPage, lastPageItems) {
        this.totalItems = ((pagesCount - 1) * this.maxItems) + lastPageItems;
        this.skipCount = (currentPage - 1) * this.maxItems;
    }
}

describe('PaginationComponent', () => {

    let fixture: ComponentFixture<PaginationComponent>;
    let component: PaginationComponent;

    let changePageNumberSpy: jasmine.Spy;
    let changePageSizeSpy: jasmine.Spy;
    let nextPageSpy: jasmine.Spy;
    let prevPageSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                MaterialModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService
                    }
                })
            ],
            declarations: [
                PaginationComponent
            ],
            providers: [
                TranslationService,
                LogService,
                AppConfigService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PaginationComponent);
                component = fixture.componentInstance;

                (<any> component).ngAfterViewInit = jasmine
                    .createSpy('ngAfterViewInit').and
                    .callThrough();

                changePageNumberSpy = spyOn(component.changePageNumber, 'emit');
                changePageSizeSpy = spyOn(component.changePageSize, 'emit');
                nextPageSpy = spyOn(component.nextPage, 'emit');
                prevPageSpy = spyOn(component.prevPage, 'emit');

                fixture.detectChanges();
            });
    }));

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
            component.goNext();

            const { skipCount } = nextPageSpy.calls.mostRecent().args[0];

            expect(skipCount).toBe(75);
        });

        it('goes previous', () => {
            component.goPrevious();

            const { skipCount } = prevPageSpy.calls.mostRecent().args[0];

            expect(skipCount).toBe(25);
        });

        it('changes page size', () => {
            component.onChangePageSize(50);

            const { maxItems } = changePageSizeSpy.calls.mostRecent().args[0];

            expect(maxItems).toBe(50);
        });

        it('changes page number', () => {
            component.onChangePageNumber(5);

            const { skipCount } = changePageNumberSpy.calls.mostRecent().args[0];

            expect(skipCount).toBe(100);
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
                pagination: new Subject<Pagination>()
            };

            component.target = customComponent;
            component.ngOnInit();

            customComponent.pagination.next(pagination);
            expect(component.pagination).toBe(pagination);
        });

        it('should update pagination by subscription', () => {
            const pagination1: Pagination = {};
            const pagination2: Pagination = {};

            const customComponent = <PaginatedComponent> {
                pagination: new Subject<Pagination>()
            };

            component.target = customComponent;
            component.ngOnInit();

            customComponent.pagination.next(pagination1);
            expect(component.pagination).toBe(pagination1);

            customComponent.pagination.next(pagination2);
            expect(component.pagination).toBe(pagination2);
        });

        it('should send pagination event to paginated component', () => {
            const customComponent = <PaginatedComponent> {
                pagination: new Subject<Pagination>(),
                updatePagination() {}
            };
            spyOn(customComponent, 'updatePagination').and.stub();

            component.target = customComponent;
            component.ngOnInit();

            component.goNext();
            expect(customComponent.updatePagination).toHaveBeenCalled();
        });

    });
});
