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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdDatepickerModule, MdIconModule, MdInputModule, MdNativeDateModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Pagination } from 'alfresco-js-api';
import { InfinitePaginationComponent } from './infinite-pagination.component';

describe('InfinitePaginationComponent', () => {

    let fixture: ComponentFixture<InfinitePaginationComponent>;
    let component: InfinitePaginationComponent;
    let pagination: Pagination;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MdDatepickerModule,
                MdIconModule,
                MdInputModule,
                MdNativeDateModule
            ],
            declarations: [
                InfinitePaginationComponent
            ]
        }).compileComponents();
    }));

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
        TestBed.resetTestingModule();
    });

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
            expect(newPagination.skipCount).toBe(10);
            done();
        });

        let loadMoreButton = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
        loadMoreButton.triggerEventHandler('click', {});
    });

});
