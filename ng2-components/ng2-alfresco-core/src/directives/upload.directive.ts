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

import { Directive, Input, HostBinding, HostListener, ElementRef, Renderer, OnInit } from '@angular/core';

@Directive({
    selector: '[adf-upload]'
})
export class UploadDirective implements OnInit {

    @Input('adf-upload')
    enabled: boolean = true;

    @Input('adf-upload-data')
    data: any;

    @Input()
    mode: string[] = ['drop']; // click|drop

    @Input()
    multiple: boolean;

    @Input()
    accept: string;

    @Input()
    directory: boolean;

    @Input()
    debug: boolean = false;

    @HostBinding('class.adf-upload__dragging')
    isDragging: boolean;

    private upload: HTMLInputElement;

    constructor(private el: ElementRef, private renderer: Renderer) {
    }

    ngOnInit() {
        if (this.isClickMode() && this.renderer) {
            this.upload = this.renderer.createElement(this.el.nativeElement.parentNode, 'input') as HTMLInputElement;
            this.upload.type = 'file';
            this.upload.style.display = 'none';
            this.upload.addEventListener('change', e => this.onSelectFiles(e));

            if (this.multiple) {
                this.upload.setAttribute('multiple', '');
            }

            if (this.accept) {
                this.upload.setAttribute('accept', this.accept);
            }

            if (this.directory) {
                this.upload.setAttribute('webkitdirectory', '');
            }
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.isClickMode() && this.upload) {
            event.preventDefault();
            this.upload.click();
        }
    }

    @HostListener('dragenter')
    onDragEnter() {
        if (this.isDropMode()) {
            this.isDragging = true;
        }
    }

    @HostListener('dragover', ['$event'])
    onDragOver(event: Event) {
        if (this.isDropMode()) {
            if (event) {
                event.preventDefault();
            }
            this.isDragging = true;
        }
    }

    @HostListener('dragleave')
    onDragLeave() {
        if (this.isDropMode()) {
            this.isDragging = false;
        }
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        if (this.isDropMode()) {
            event.preventDefault();
            event.stopPropagation();

            this.isDragging = false;

            const files = this.getFilesDropped(event.dataTransfer);
            this.onUploadFiles(files);
        }
    }

    onUploadFiles(files: File[]) {
        if (this.enabled && files.length > 0) {
            let e = new CustomEvent('upload-files', {
                detail: {
                    sender: this,
                    data: this.data,
                    files: files
                },
                bubbles: true
            });

            this.el.nativeElement.dispatchEvent(e);
        }
    }

    protected hasMode(mode: string): boolean {
        return this.enabled && mode && this.mode && this.mode.indexOf(mode) > -1;
    }

    protected isDropMode(): boolean {
        return this.hasMode('drop');
    }

    protected isClickMode(): boolean {
        return this.hasMode('click');
    }

    /**
     * Extract files from the DataTransfer object used to hold the data that is being dragged during a drag and drop operation.
     * @param dataTransfer DataTransfer object
     */
    protected getFilesDropped(dataTransfer: DataTransfer): File[] {
        const result: File[] = [];

        if (dataTransfer) {
            const items: FileList = dataTransfer.files;

            if (items && items.length > 0) {
                for (let i = 0; i < items.length; i++) {
                result.push(items[i]);
                }
            }
        }

        return result;
    }

    /**
     * Extract files from the FileList object used to hold files that user selected by means of File Dialog.
     * @param fileList List of selected files
     */
    protected getFilesSelected(fileList: FileList) {
        let result: File[] = [];
        if (fileList && fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
                result.push(fileList[i]);
            }
        }
        return result;
    }

    /**
     * Invoked when user selects files or folders by means of File Dialog
     * @param e DOM event
     */
    protected onSelectFiles(e: Event) {
        if (this.isClickMode()) {
            const input = (<HTMLInputElement>e.currentTarget);
            const files = this.getFilesSelected(input.files);
            this.onUploadFiles(files);
        }
    }
}
