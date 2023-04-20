/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    AfterViewInit, ElementRef, OnDestroy, ViewEncapsulation, EventEmitter, Output, Inject, ViewChildren, QueryList
} from '@angular/core';
import { ESCAPE, UP_ARROW, DOWN_ARROW, TAB } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { PdfThumbComponent } from './pdf-viewer-thumb.component';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'adf-pdf-thumbnails',
    templateUrl: './pdf-viewer-thumbnails.component.html',
    styleUrls: ['./pdf-viewer-thumbnails.component.scss'],
    host: { class: 'adf-pdf-thumbnails' },
    encapsulation: ViewEncapsulation.None
})
export class PdfThumbListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() pdfViewer: any;

    @Output()
    close = new EventEmitter<void>();

    virtualHeight: number = 0;
    translateY: number = 0;
    renderItems = [];
    width: number = 91;
    currentHeight: number = 0;

    private items = [];
    private margin: number = 15;
    private itemHeight: number = 114 + this.margin;
    private previouslyFocusedElement: HTMLElement | null = null;
    private keyManager: FocusKeyManager<PdfThumbComponent>;

    @ContentChild(TemplateRef)
    template: any;

    @ViewChildren(PdfThumbComponent)
    thumbsList: QueryList<PdfThumbComponent>;

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const keyCode = event.keyCode;

        if (keyCode === UP_ARROW && this.canSelectPreviousItem()) {
            this.pdfViewer.currentPageNumber -= 1;
        }

        if (keyCode === DOWN_ARROW && this.canSelectNextItem()) {
            this.pdfViewer.currentPageNumber += 1;
        }

        if (keyCode ===  TAB) {
            if (this.canSelectNextItem()) {
                this.pdfViewer.currentPageNumber += 1;
            } else {
                this.close.emit();
            }
        }

        if (keyCode === ESCAPE) {
            this.close.emit();
        }

        this.keyManager.setFocusOrigin('keyboard');
        event.preventDefault();
    }

    @HostListener('window:resize')
    onResize() {
        this.calculateItems();
    }

    constructor(private element: ElementRef, @Inject(DOCUMENT) private document: any) {
        this.calculateItems = this.calculateItems.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    ngOnInit() {
        /* cspell:disable-next-line */
        this.pdfViewer.eventBus.on('pagechanging', this.onPageChange);
        this.element.nativeElement.addEventListener('scroll', this.calculateItems, true);

        this.setHeight(this.pdfViewer.currentPageNumber);
        this.items = this.getPages();
        this.calculateItems();

        this.previouslyFocusedElement = this.document.activeElement as HTMLElement;
    }

    ngAfterViewInit() {
        this.keyManager = new FocusKeyManager(this.thumbsList);

        this.thumbsList.changes
            .pipe(delay(0))
            .subscribe(() => this.keyManager.setActiveItem(this.getPageIndex(this.pdfViewer.currentPageNumber)));

        setTimeout(() => {
            this.scrollInto(this.pdfViewer.currentPageNumber);
            this.keyManager.setActiveItem(this.getPageIndex(this.pdfViewer.currentPageNumber));
        }, 0);
    }

    ngOnDestroy() {
        this.element.nativeElement.removeEventListener('scroll', this.calculateItems, true);
        /* cspell:disable-next-line */
        this.pdfViewer.eventBus.on('pagechanging', this.onPageChange);

        if (this.previouslyFocusedElement) {
            this.previouslyFocusedElement.focus();
            this.previouslyFocusedElement = null;
        }
    }

    trackByFn(_: number, item: any): number {
        return item.id;
    }

    isSelected(pageNumber: number) {
        return this.pdfViewer.currentPageNumber === pageNumber;
    }

    goTo(pageNumber: number) {
        this.pdfViewer.currentPageNumber = pageNumber;
    }

    scrollInto(pageNumber: number) {
        if (this.items.length) {
            const index: number = this.items.findIndex((element) => element.id === pageNumber);

            if (index < 0 || index >= this.items.length) {
                return;
            }

            this.element.nativeElement.scrollTop = index * this.itemHeight;

            this.calculateItems();
        }
    }

    getPages() {
        // eslint-disable-next-line no-underscore-dangle
        return this.pdfViewer._pages.map((page) => ({
            id: page.id,
            getWidth: () => this.width,
            getHeight: () => this.currentHeight,
            getPage: () => this.pdfViewer.pdfDocument.getPage(page.id)
        }));
    }

    private setHeight(id): number {
        const height = this.pdfViewer.pdfDocument.getPage(id).then((page) => this.calculateHeight(page));
        return height;
    }

    private calculateHeight(page) {
        const viewport = page.getViewport({ scale: 1 });
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
        this.virtualHeight = this.itemHeight * this.items.length - this.translateY;
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

        this.keyManager.setActiveItem(this.getPageIndex(event.pageNumber));
    }

    private getPageIndex(pageNumber: number): number {
        const thumbsListArray = this.thumbsList.toArray();
        return thumbsListArray.findIndex(el => el.page.id === pageNumber);
    }

    private canSelectNextItem(): boolean {
        return this.pdfViewer.currentPageNumber !== this.pdfViewer.pagesCount;
    }

    private canSelectPreviousItem(): boolean {
        return this.pdfViewer.currentPageNumber !== 1;
    }
}
