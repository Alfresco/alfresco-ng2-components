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

import { Injector, SimpleChange } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { PaginationData } from '../../models/pagination.data';
import { PaginationComponent } from '../pagination/pagination.component';

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
        paginationComponent.pagination = new PaginationData(0, 0, 0, 20, true);
    });

    it('should create Pagination object on init if no object pagination is passed', () => {
        paginationComponent.pagination = null;
        paginationComponent.ngOnInit();
        expect(paginationComponent.pagination).not.toBe(null);
    });

    it('is defined', () => {
        expect(paginationComponent).toBeDefined();
    });

    it('page size', () => {
        expect(paginationComponent.pagination.maxItems).toBe(20);
    });

    it('set page size', () => {
        paginationComponent.pagination.maxItems = 100;
        expect(paginationComponent.pagination.maxItems).toBe(100);
    });

    it('prevPageAvail dafault false', () => {
        expect(paginationComponent.prevPageAvail()).toBe(false);
    });

    it('nextPageAvail default true', () => {
        expect(paginationComponent.nextPageAvail()).toBe(true);
    });

    it('showNextPage', () => {
        expect(paginationComponent.pagination.skipCount).toBe(0);
        paginationComponent.showNextPage();
        expect(paginationComponent.pagination.skipCount).toBe(20);
    });

    it('showPrevPage', () => {
        paginationComponent.pagination.skipCount = 100;
        paginationComponent.showPrevPage();
        expect(paginationComponent.pagination.skipCount).toBe(80);
    });

    it('should update the summary on nextpage click', () => {
        spyOn(paginationComponent, 'updateSummary');

        paginationComponent.showNextPage();

        expect(paginationComponent.updateSummary).toHaveBeenCalled();
    });

    it('should update the summary on prevpage click', () => {
        spyOn(paginationComponent, 'updateSummary');

        paginationComponent.showPrevPage();

        expect(paginationComponent.updateSummary).toHaveBeenCalled();
    });

    it('should update the summary on chage page size click', () => {
        spyOn(paginationComponent, 'updateSummary');

        paginationComponent.setPageSize(100);

        expect(paginationComponent.updateSummary).toHaveBeenCalled();
    });

    it('should update the summary on input pagination parameter change', () => {
        spyOn(paginationComponent, 'updateSummary');

        paginationComponent.ngOnChanges({pagination: new SimpleChange(null, new PaginationData(0, 0, 0, 20, true), true)});

        expect(paginationComponent.updateSummary).toHaveBeenCalled();
    });
});
