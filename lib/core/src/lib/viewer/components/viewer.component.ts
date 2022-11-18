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

//TODO BETTER APPROACH FOR IMG EXTENSION submit
//TODO uncomment readOnly
//TODO TO UNDERSTAND THE LEFT AND RIGHT SIDEBAR
//TODO uncomment media load subtitle
//TODO rename allowGoBack allow close button
//TODO prevent momentanus unkown format
//TODO null propagation
//TODO viewer widget specialization in process service cloud

import {
    Component, ContentChild, EventEmitter, HostListener, ElementRef,
    Input, OnChanges, Output, TemplateRef,
    ViewEncapsulation, OnInit, OnDestroy
} from '@angular/core';
import { BaseEvent } from '../../events';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { fromEvent, Subject } from 'rxjs';
import { ViewUtilService } from '../services/view-util.service';
import { AppExtensionService, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { filter, skipWhile, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'adf-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    host: {class: 'adf-viewer'},
    encapsulation: ViewEncapsulation.None,
    providers: [ViewUtilService]
})
export class ViewerComponent implements OnChanges, OnInit, OnDestroy {

    @ContentChild(ViewerToolbarComponent)
    toolbar: ViewerToolbarComponent;

    @ContentChild(ViewerSidebarComponent)
    sidebar: ViewerSidebarComponent;

    @ContentChild(ViewerOpenWithComponent)
    mnuOpenWith: ViewerOpenWithComponent;

    @ContentChild(ViewerMoreActionsComponent)
    mnuMoreActions: ViewerMoreActionsComponent;

    /** If you want to load an external file that does not come from ACS you
     * can use this URL to specify where to load the file from.
     */
    @Input()
    urlFile = '';

    /** Loads a Blob File */
    @Input()
    blobFile: Blob;

    /** If `true` then show the Viewer as a full page over the current content.
     * Otherwise fit inside the parent div.
     */
    @Input()
    overlayMode = false;

    /** Hide or show the viewer */
    @Input()
    showViewer = true;

    /** Toggles downloading. */
    @Input()
    allowDownload = true;

    /** Toggles printing. */
    @Input()
    allowPrint = false;

    /** Toggles the 'Full Screen' feature. */
    @Input()
    allowFullScreen = true;

    /** Toggles PDF thumbnails. */
    @Input()
    allowThumbnails = true;

    /** The template for the right sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarRightTemplate: TemplateRef<any> = null;

    /** The template for the left sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarLeftTemplate: TemplateRef<any> = null;

    /** The template for the pdf thumbnails. */
    @Input()
    thumbnailsTemplate: TemplateRef<any> = null;

    /** MIME type of the file content (when not determined by the filename extension). */
    @Input()
    mimeType: string;

    /** Override Content filename. */
    @Input()
    fileName: string;

    /** Override Content view type.
     Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`).*/
    @Input()
    viewerType: string = 'unknown';

    /** Allows `back` navigation */
    @Input()
    allowGoBack = true;

    /** Override loading status */
    @Input()
    isLoading = false;

    /** Emitted when user clicks the 'Back' button. */
    @Output()
    goBack = new EventEmitter<BaseEvent<any>>();

    /** Emitted when user clicks the 'Print' button. */
    @Output()
    print = new EventEmitter<BaseEvent<any>>();

    /** Emitted when the viewer is shown or hidden. */
    @Output()
    showViewerChange = new EventEmitter<boolean>();

    /** Emitted when the filename extension changes. */
    @Output()
    extensionChange = new EventEmitter<string>();

    /** Emitted when the img is submitted in the img viewer. */
    @Output()
    submitFile = new EventEmitter<Blob>();

    extensionTemplates: { template: TemplateRef<any>; isVisible: boolean }[] = [];
    urlFileContent: string;
    otherMenu: any;
    extension: string;
    // sidebarRightTemplateContext: { node: Node } = { node: null };
    // sidebarLeftTemplateContext: { node: Node } = { node: null };
    fileTitle: string;

    /**
     * Returns a list of the active Viewer content extensions.
     */
    get viewerExtensions(): ViewerExtensionRef[] {
        return this.extensionService.getViewerExtensions();
    }

    /**
     * Provides a list of file extensions supported by external plugins.
     */
    get externalExtensions(): string[] {
        return this.viewerExtensions.map(ext => ext.fileExtension);
    }

    private _externalViewer: ViewerExtensionRef;
    get externalViewer(): ViewerExtensionRef {
        if (!this._externalViewer) {
            this._externalViewer = this.viewerExtensions.find(ext => ext.fileExtension === '*');
        }

        return this._externalViewer;
    }

    // readOnly = true;

    cacheTypeForContent = '';

    private onDestroy$ = new Subject<boolean>();
    private shouldCloseViewer = true;
    private keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

    constructor(private viewUtilService: ViewUtilService,
                private extensionService: AppExtensionService,
                private el: ElementRef,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.closeOverlayManager();
        this.cacheTypeForContent = '';
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges() {
        if (this.showViewer) {
            this.isLoading = true;

            if (this.blobFile) {
                this.setUpBlobData();
                this.isLoading = false;
            } else if (this.urlFile) {
                this.setUpUrlFile();
                this.isLoading = false;
            }
        }
    }

    private setUpBlobData() {
        this.mimeType = this.blobFile.type;
        this.viewerType = this.viewUtilService.getViewerTypeByMimeType(this.mimeType);

        this.allowDownload = false;
        // TODO: wrap blob into the data url and allow downloading

        this.extensionChange.emit(this.mimeType);
        this.scrollTop();
    }

    private setUpUrlFile() {
        this.fileName = this.fileName ? this.fileName : this.viewUtilService.getFilenameFromUrl(this.urlFile);
        this.extension = this.viewUtilService.getFileExtension(this.fileTitle);
        this.urlFileContent = this.urlFile;
        this.viewerType = this.viewerType === 'unknown' ? this.viewUtilService.getViewerType(this.extension, this.mimeType) : this.viewerType;

        this.extensionChange.emit(this.extension);
        this.scrollTop();
    }


    scrollTop() {
        window.scrollTo(0, 1);
    }

    onBackButtonClick() {
        this.close();
    }


    /**
     * close the viewer
     */
    close() {
        if (this.otherMenu) {
            this.otherMenu.hidden = false;
        }
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }


    /**
     * Keyboard event listener
     *
     * @param  event
     */
    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event && event.defaultPrevented) {
            return;
        }

        const key = event.keyCode;

        // Ctrl+F
        if (key === 70 && event.ctrlKey) {
            event.preventDefault();
            this.enterFullScreen();
        }
    }

    printContent() {
        if (this.allowPrint) {
            this.print.next(new BaseEvent());
        }
    }

    /**
     * Triggers full screen mode with a main content area displayed.
     */
    enterFullScreen(): void {
        if (this.allowFullScreen) {
            const container = this.el.nativeElement.querySelector('.adf-viewer__fullscreen-container');
            if (container) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            }
        }
    }

    checkExtensions(extensionAllowed) {
        if (typeof extensionAllowed === 'string') {
            return this.extension.toLowerCase() === extensionAllowed.toLowerCase();
        } else if (extensionAllowed.length > 0) {
            return extensionAllowed.find((currentExtension) => this.extension.toLowerCase() === currentExtension.toLowerCase());
        }
    }

    onSubmitFile(newImageBlob: Blob) {
        this.submitFile.next(newImageBlob);
    }

    onUnsupportedFile() {
        this.viewerType = 'unknown';
    }

    private closeOverlayManager() {
        this.dialog.afterOpened.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.shouldCloseViewer = false);

        this.dialog.afterAllClosed.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.shouldCloseViewer = true);

        this.keyDown$.pipe(
            skipWhile(() => !this.overlayMode),
            filter((e: KeyboardEvent) => e.keyCode === 27),
            takeUntil(this.onDestroy$)
        ).subscribe((event: KeyboardEvent) => {
            event.preventDefault();

            if (this.shouldCloseViewer) {
                this.close();
            }
        });
    }

}
