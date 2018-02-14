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

import { Component, ContentChild, TemplateRef, HostListener, OnInit, AfterViewInit, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { PdfViewerService } from '../services/pdf-viewer.service';

@Component({
    selector: 'adf-pdf-thumbnails',
    templateUrl: './pdfViewer-thumbnails.component.html',
    styleUrls: ['./pdfViewer-thumbnails.component.scss'],
    host: { 'class': 'pdf-thumbnails' },
    encapsulation: ViewEncapsulation.None
})
export class PdfThumbListComponent implements OnInit, AfterViewInit, OnDestroy {
    virtualHeight: number = 0;
    translateY: number = 0;
    renderItems = [];

    private items = [];
    private itemHeight: number = 140;

    @ContentChild(TemplateRef)
    template: any;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.calculateItems();
    }

    constructor(
        private pdfViewerService: PdfViewerService,
        private element: ElementRef) {
            this.calculateItems = this.calculateItems.bind(this);
            this.onPageChange = this.onPageChange.bind(this);

    }

    ngOnInit() {
        this.element.nativeElement.addEventListener('scroll', this.calculateItems, true);
        this.pdfViewerService.getViewer().eventBus.on('pagechange', this.onPageChange);

        this.items = this.getPages();
        this.calculateItems();
    }

    ngAfterViewInit() {
        setTimeout(() => this.scrollInto(this.pdfViewerService.getViewer().currentPageNumber), 0);
    }

    ngOnDestroy() {
        this.element.nativeElement.removeEventListener('scroll', this.calculateItems, true);
        this.pdfViewerService.getViewer().eventBus.off('pagechange', this.onPageChange);
    }

    trackByFn(index: number, item: any): number {
        return item.id;
    }

    isSelected(pageNum: number) {
        return this.pdfViewerService.getViewer().currentPageNumber === pageNum;
    }

    goTo(pageNum: number) {
        this.pdfViewerService.setPage(pageNum);
    }

    scrollInto(item: any) {
        if (this.items.length) {
            const index: number = this.items.findIndex((element) => element.id === item);

            if (index < 0 || index >= this.items.length) {
                return;
            }

            this.element.nativeElement.scrollTop = Math.floor(index  - 1 ) * this.itemHeight;

            this.calculateItems();
        }
    }

    getPages() {
        const viewer = this.pdfViewerService.getViewer();

        return viewer._pages.map((page) => ({
            id: page.id,
            getPage: () => viewer.pdfDocument.getPage(page.id)
        }));
    }

    private calculateItems() {
        const { element, viewPort, itemsInView } = this.getContainerSetup();

        const indexByScrollTop = element.scrollTop / viewPort * this.items.length / itemsInView;

        const start = Math.floor(indexByScrollTop);

        const end = Math.ceil(indexByScrollTop) + (itemsInView);

        this.translateY = this.itemHeight * Math.ceil(start);
        this.virtualHeight = this.itemHeight * this.items.length  - this.translateY;
        this.renderItems = this.items.slice(start, end);
    }

    private getContainerSetup() {
        const element = this.element.nativeElement;
        const elementRec = element.getBoundingClientRect();
        const itemsInView = Math.ceil(elementRec.height / this.itemHeight);
        const viewPort = (this.itemHeight * this.items.length) / itemsInView;

        return {
            element,
            viewPort,
            itemsInView
        };
    }

    private onPageChange(event) {
        const index = this.renderItems.findIndex((element) => element.id === event.pageNumber);

        if (index < 0) {
            this.scrollInto(event.pageNumber);
        }
    }
}
