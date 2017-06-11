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

import { Directive, Input, HostListener, ElementRef, Renderer, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FileUtils, FileInfo } from '../utils/file-utils';

@Directive({
    selector: '[adf-upload]'
})
export class UploadDirective implements OnInit, OnDestroy {

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

    isDragging: boolean = false;

    private cssClassName: string = 'adf-upload__dragging';
    private upload: HTMLInputElement;
    private element: HTMLElement;

    constructor(private el: ElementRef, private renderer: Renderer, private ngZone: NgZone) {
        this.element = el.nativeElement;
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

        if (this.isDropMode()) {
            this.ngZone.runOutsideAngular(() => {
                this.element.addEventListener('dragenter', this.onDragEnter.bind(this));
                this.element.addEventListener('dragover', this.onDragOver.bind(this));
                this.element.addEventListener('dragleave', this.onDragLeave.bind(this));
                this.element.addEventListener('drop', this.onDrop.bind(this));
            });
        }
    }

    ngOnDestroy() {
        this.element.removeEventListener('dragenter', this.onDragEnter);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('dragleave', this.onDragLeave);
        this.element.removeEventListener('drop', this.onDrop);
    }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.isClickMode() && this.upload) {
            event.preventDefault();
            this.upload.click();
        }
    }

    onDragEnter(event: Event) {
        if (this.isDropMode()) {
            this.element.classList.add(this.cssClassName);
            this.isDragging = true;
        }
    }

    onDragOver(event: Event) {
        event.preventDefault();
        if (this.isDropMode()) {
            this.element.classList.add(this.cssClassName);
            this.isDragging = true;
        }
        return false;
    }

    onDragLeave(event) {
        if (this.isDropMode()) {
            this.element.classList.remove(this.cssClassName);
            this.isDragging = false;
        }
    }

    onDrop(event: Event) {
        if (this.isDropMode()) {

            event.stopPropagation();
            event.preventDefault();

            this.element.classList.remove(this.cssClassName);
            this.isDragging = false;

            const dataTranfer = this.getDataTransfer(event);
            if (dataTranfer) {
                this.getFilesDropped(dataTranfer).then(files => {
                    this.onUploadFiles(files);
                });

            }
        }
        return false;
    }

    onUploadFiles(files: FileInfo[]) {
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

    protected getDataTransfer(event: Event | any): DataTransfer {
        if (event && event.dataTransfer) {
            return event.dataTransfer;
        }
        if (event && event.originalEvent && event.originalEvent.dataTransfer) {
            return event.originalEvent.dataTransfer;
        }
        return null;
    }

    /**
     * Extract files from the DataTransfer object used to hold the data that is being dragged during a drag and drop operation.
     * @param dataTransfer DataTransfer object
     */
    protected getFilesDropped(dataTransfer: DataTransfer): Promise<FileInfo[]> {
        return new Promise(resolve => {
            const iterations = [];

            if (dataTransfer) {
                const items = dataTransfer.items;
                if (items) {
                    for (let i = 0; i < items.length; i++) {
                        if (typeof items[i].webkitGetAsEntry !== 'undefined') {
                            let item = items[i].webkitGetAsEntry();
                            if (item) {
                                if (item.isFile) {
                                    iterations.push(Promise.resolve(<FileInfo> {
                                        entry: item,
                                        file: items[i].getAsFile(),
                                        relativeFolder: '/'
                                    }));
                                } else if (item.isDirectory) {
                                    iterations.push(new Promise(resolveFolder => {
                                        FileUtils.flattern(item).then(files => resolveFolder(files));
                                    }));
                                }
                            }
                        } else {
                            iterations.push(Promise.resolve(<FileInfo>{
                                entry: null,
                                file: items[i].getAsFile(),
                                relativeFolder: '/'
                            }));
                        }
                    }
                } else {
                    // safari or FF
                    let files = FileUtils
                        .toFileArray(dataTransfer.files)
                        .map(file => <FileInfo> {
                            entry: null,
                            file: file,
                            relativeFolder: '/'
                        });

                    iterations.push(Promise.resolve(files));
                }
            }

            Promise.all(iterations).then(result => {
                resolve(result.reduce((a, b) => a.concat(b), []));
            });
        });
    }

    /**
     * Invoked when user selects files or folders by means of File Dialog
     * @param e DOM event
     */
    protected onSelectFiles(e: Event) {
        if (this.isClickMode()) {
            const input = (<HTMLInputElement>e.currentTarget);
            const files = FileUtils.toFileArray(input.files);
            this.onUploadFiles(files.map(file => <FileInfo> {
                entry: null,
                file: file,
                relativeFolder: '/'
            }));
        }
    }
}
