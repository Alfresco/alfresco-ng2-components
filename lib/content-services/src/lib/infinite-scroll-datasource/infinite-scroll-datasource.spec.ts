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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { from, Observable } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { InfiniteScrollDatasource } from './infinite-scroll-datasource';

class TestData {
    testId: number;
    testDescription: string;

    constructor(input?: Partial<TestData>) {
        if (input) {
            Object.assign(this, input);
        }
    }
}

class TestDataSource extends InfiniteScrollDatasource<TestData> {
    testDataBatch1: TestData[] = [
        {
            testId: 1,
            testDescription: 'test1'
        },
        {
            testId: 2,
            testDescription: 'test2'
        },
        {
            testId: 3,
            testDescription: 'test3'
        },
        {
            testId: 4,
            testDescription: 'test4'
        }
    ];
    testDataBatch2: TestData[] = [
        {
            testId: 5,
            testDescription: 'test5'
        },
        {
            testId: 6,
            testDescription: 'test6'
        }
    ];

    getNextBatch(pagingOptions: ContentPagingQuery): Observable<TestData[]> {
        if (pagingOptions.skipCount === 4) {
            return from([this.testDataBatch2]);
        } else if (pagingOptions.skipCount === 0) {
            return from([this.testDataBatch1]);
        } else {
            return from([]);
        }
    }
}

@Component({
    template: ` <cdk-virtual-scroll-viewport appendOnly itemSize="300" style="height: 500px; width: 100%;">
        <div *cdkVirtualFor="let item of testDatasource" class="test-item" style="display: block; height: 100%; width: 100%;">
            {{ item.testDescription }}
        </div>
    </cdk-virtual-scroll-viewport>`,
    standalone: false
})
class TestComponent implements OnInit {
    testDatasource = new TestDataSource();

    ngOnInit() {
        this.testDatasource.batchSize = 4;
    }
}

describe('InfiniteScrollDatasource', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    const getRenderedItems = (): HTMLDivElement[] => fixture.debugElement.queryAll(By.css('.test-item')).map((element) => element.nativeElement);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, ScrollingModule],
            declarations: [TestComponent]
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });

    it('should connect to the datasource and fetch first batch of items on init', async () => {
        spyOn(component.testDatasource, 'connect').and.callThrough();
        spyOn(component.testDatasource, 'getNextBatch').and.callThrough();
        fixture.autoDetectChanges();
        await fixture.whenStable();
        await fixture.whenRenderingDone();

        expect(component.testDatasource.connect).toHaveBeenCalled();
        expect(component.testDatasource.itemsCount).toBe(4);
        expect(component.testDatasource.getNextBatch).toHaveBeenCalledWith({ skipCount: 0, maxItems: 4 });
        const renderedItems = getRenderedItems();
        // only 3 elements fit the viewport
        expect(renderedItems.length).toBe(3);
        expect(renderedItems[0].innerText).toBe('test1');
        expect(renderedItems[2].innerText).toBe('test3');
    });
    // Disabling this test as it's flaky (fails 3 out of 4 on CI)
    //eslint-disable-next-line
    xit('should load next batch when user scrolls towards the end of the list', fakeAsync(() => {
        fixture.autoDetectChanges();
        const stable = fixture.whenStable();
        const renderingDone = fixture.whenRenderingDone();
        Promise.all([stable, renderingDone]).then(() => {
            spyOn(component.testDatasource, 'getNextBatch').and.callThrough();
            const viewport = fixture.debugElement.query(By.css('cdk-virtual-scroll-viewport')).nativeElement;
            viewport.scrollTop = 400;
            tick(100);

            const renderedItems = getRenderedItems();
            expect(component.testDatasource.getNextBatch).toHaveBeenCalledWith({ skipCount: 4, maxItems: 4 });
            expect(component.testDatasource.itemsCount).toBe(6);
            expect(renderedItems[3].innerText).toBe('test4');
        });
    }));

    it('should reset the datastream and fetch first batch on reset', fakeAsync(() => {
        fixture.autoDetectChanges();
        const stable = fixture.whenStable();
        const renderingDone = fixture.whenRenderingDone();
        Promise.all([stable, renderingDone]).then(() => {
            spyOn(component.testDatasource, 'getNextBatch').and.callThrough();
            component.testDatasource.reset();
            tick(100);

            const renderedItems = getRenderedItems();
            expect(component.testDatasource.getNextBatch).toHaveBeenCalledWith({ skipCount: 0, maxItems: 4 });
            expect(renderedItems.length).toBe(3);
            expect(renderedItems[2].innerText).toBe('test3');
        });
    }));
});
