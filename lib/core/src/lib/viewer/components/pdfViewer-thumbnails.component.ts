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

import {
    Component, Input, ContentChild, TemplateRef, HostListener, OnInit,
    AfterViewInit, ElementRef, OnDestroy, ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'adf-pdf-thumbnails',
    templateUrl: './pdfViewer-thumbnails.component.html',
    styleUrls: ['./pdfViewer-thumbnails.component.scss'],
    host: { 'class': 'adf-pdf-thumbnails' },
    encapsulation: ViewEncapsulation.None
})
export class PdfThumbListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() pdfViewer: any;

    virtualHeight: number = 0;
    translateY: number = 0;
    renderItems = [];
    width: number = 91;
    currentHeight: number = 0;

    private items = [];
    private margin: number = 15;
    private itemHeight: number = 114 + this.margin;

    @ContentChild(TemplateRef)
    template: any;

    @HostListener('window:resize')
    onResize() {
        this.calculateItems();
    }

    constructor(private element: ElementRef) {
        this.calculateItems = this.calculateItems.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    ngOnInit() {
        /* cspell:disable-next-line */
        this.pdfViewer.eventBus.on('pagechange', this.onPageChange);
        this.element.nativeElement.addEventListener('scroll', this.calculateItems, true);

        this.setHeight(this.pdfViewer.currentPageNumber);
        this.items = this.getPages();
        this.calculateItems();

    }

    ngAfterViewInit() {
        setTimeout(() => this.scrollInto(this.pdfViewer.currentPageNumber), 0);
    }

    ngOnDestroy() {
        this.element.nativeElement.removeEventListener('scroll', this.calculateItems, true);
        /* cspell:disable-next-line */
        this.pdfViewer.eventBus.off('pagechange', this.onPageChange);
    }

    trackByFn(_: number, item: any): number {
        return item.id;
    }

    isSelected(pageNum: number) {
        return this.pdfViewer.currentPageNumber === pageNum;
    }

    goTo(pageNum: number) {
        this.pdfViewer.currentPageNumber = pageNum;
    }

    scrollInto(item: any) {
        if (this.items.length) {
            const index: number = this.items.findIndex((element) => element.id === item);

            if (index < 0 || index >= this.items.length) {
                return;
            }

            this.element.nativeElement.scrollTop = index * this.itemHeight;

            this.calculateItems();
        }
    }

    getPages() {
        return this.pdfViewer._pages.map((page) => ({
            id: page.id,
            getWidth: () => { return this.width; },
            getHeight: () => { return this.currentHeight; },
            getPage: () => this.pdfViewer.pdfDocument.getPage(page.id)
        }));
    }

    private setHeight(id): number {
        const height = this.pdfViewer.pdfDocument.getPage(id).then((page) => this.calculateHeight(page));
        return height;
    }

    private calculateHeight(page) {
        const viewport = page.getViewport(1);
        const pageRatio = viewport.width / viewport.height;
        const height = Math.floor(this.width / pageRatio);

        this.currentHeight = height;
        this.itemHeight = height + this.margin;
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

        if (index >= this.renderItems.length - 1) {
            this.element.nativeElement.scrollTop += this.itemHeight;
        }
    }
}
