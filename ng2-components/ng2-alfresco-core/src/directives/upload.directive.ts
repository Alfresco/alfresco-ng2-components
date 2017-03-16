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

import { Directive, Input, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[adf-upload]'
})
export class UploadDirective {

    @Input('adf-upload')
    enabled: boolean = true;

    @Input('adf-upload-data')
    data: any;

    @Input()
    debug: boolean = false;

    @HostBinding('class.adf-upload__dragging')
    isDragging: boolean;

    constructor(private el: ElementRef) {
    }

    @HostListener('dragenter')
    onDragEnter() {
        if (this.enabled) {
            this.isDragging = true;
        }
    }

    @HostListener('dragover', ['$event'])
    onDragOver(event: Event) {
        if (this.enabled) {
            if (event) {
                event.preventDefault();
            }
            this.isDragging = true;
        }
    }

    @HostListener('dragleave')
    onDragLeave() {
        if (this.enabled) {
            this.isDragging = false;
        }
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        if (this.enabled) {
            event.preventDefault();
            event.stopPropagation();

            this.isDragging = false;

            let files = this.getFilesDropped(event.dataTransfer);
            if (files.length > 0) {
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
    }

    /**
     * Extract files from the DataTransfer object used to hold the data that is being dragged during a drag and drop operation.
     * @param dataTransfer DataTransfer object
     */
    protected getFilesDropped(dataTransfer: DataTransfer): File[] {
        let result: File[] = [];

        if (dataTransfer) {
            let items: DataTransferItemList = dataTransfer.items;

            if (items && items.length > 0) {
                for (let i = 0; i < items.length; i++) {
                    let item: DataTransferItem = items[i];
                    if (item.type) {
                        let file = item.getAsFile();
                        if (file) {
                            result.push(file);
                        }
                    }
                }
            }
        }

        return result;
    }
}
