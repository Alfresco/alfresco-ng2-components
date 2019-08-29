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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PdfThumbListComponent } from './pdfViewer-thumbnails.component';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';

declare const pdfjsViewer: any;

describe('PdfThumbListComponent', () => {

    let fixture: ComponentFixture<PdfThumbListComponent>;
    let component: PdfThumbListComponent;

    const page = (id) => {
        return {
            id,
            getPage: Promise.resolve()
        };
    };

    const viewerMock = {
        _currentPageNumber: null,
        set currentPageNumber(pageNum) {
            this._currentPageNumber = pageNum;
            /* cspell:disable-next-line */
            this.eventBus.dispatch('pagechange', { pageNumber: pageNum });
        },
        get currentPageNumber() {
            return this._currentPageNumber;
        },
        pdfDocument: {
            getPage: () => Promise.resolve({
                getViewport: () => ({ height: 421, width: 335 }),
                render: jasmine.createSpy('render').and.returnValue(Promise.resolve())
            })
        },
        _pages: [
            page(1), page(2), page(3), page(4),
            page(5), page(6), page(7), page(8),
            page(9), page(10), page(11), page(12),
            page(13), page(14), page(15), page(16)
        ],
        eventBus: new pdfjsViewer.EventBus()
    };

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(PdfThumbListComponent);
        component = fixture.componentInstance;
        component.pdfViewer = viewerMock;

        // provide scrollable container
        fixture.nativeElement.style.display = 'block';
        fixture.nativeElement.style.height = '700px';
        fixture.nativeElement.style.overflow = 'scroll';
        fixture.debugElement.query(By.css('.adf-pdf-thumbnails__content'))
            .nativeElement.style.height = '2000px';
    }));

    it('should render initial rage of items', () => {
        fixture.nativeElement.scrollTop = 0;
        fixture.detectChanges();

        const renderedIds = component.renderItems.map((item) => item.id);
        const rangeIds = viewerMock._pages.slice(0, 6).map((item) => item.id);

        expect(renderedIds).toEqual(rangeIds);
    });

    it('should render next range on scroll', () => {
        component.currentHeight = 114;
        fixture.nativeElement.scrollTop = 700;
        fixture.detectChanges();

        const renderedIds = component.renderItems.map((item) => item.id);
        const rangeIds = viewerMock._pages.slice(5, 12).map((item) => item.id);

        expect(renderedIds).toEqual(rangeIds);
    });

    it('should render items containing current document page', () => {
        fixture.detectChanges();

        const renderedIds = component.renderItems.map((item) => item.id);

        expect(renderedIds).not.toContain(10);

        component.scrollInto(10);

        const newRenderedIds = component.renderItems.map((item) => item.id);

        expect(newRenderedIds).toContain(10);
    });

    it('should not change items if range contains current document page', () => {
        fixture.nativeElement.scrollTop = 1700;
        fixture.detectChanges();

        const renderedIds = component.renderItems.map((item) => item.id);

        expect(renderedIds).toContain(12);

        /* cspell:disable-next-line */
        viewerMock.eventBus.dispatch('pagechange', { pageNumber: 12 });

        const newRenderedIds = component.renderItems.map((item) => item.id);

        expect(newRenderedIds).toContain(12);
    });

    it('should scroll thumbnail height amount to buffer thumbnail onPageChange event', () => {
        spyOn(component, 'scrollInto');
        fixture.detectChanges();

        expect(component.renderItems[component.renderItems.length - 1].id).toBe(6);
        expect(fixture.debugElement.nativeElement.scrollTop).toBe(0);

        viewerMock.currentPageNumber = 6;

        expect(component.scrollInto).not.toHaveBeenCalled();
        expect(fixture.debugElement.nativeElement.scrollTop).toBe(129);
    });

    it('should return current viewed page as selected', () => {
        fixture.nativeElement.scrollTop = 0;
        fixture.detectChanges();

        viewerMock.currentPageNumber = 2;

        expect(component.isSelected(2)).toBe(true);
    });

    it('should go to selected page', () => {
        fixture.detectChanges();

        component.goTo(12);

        expect(viewerMock.currentPageNumber).toBe(12);
    });
});
