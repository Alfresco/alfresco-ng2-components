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
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { filter, first, skipWhile, takeUntil } from 'rxjs/operators';
import { Track } from '../models/viewer.model';
import { ViewUtilService } from '../services/view-util.service';
import { DownloadPromptDialogComponent } from './download-prompt-dialog/download-prompt-dialog.component';
import { AppConfigService } from '../../app-config';
import { DownloadPromptActions } from '../models/download-prompt.actions';

const DEFAULT_NON_PREVIEW_CONFIG = {
    enableDownloadPrompt: false,
    enableDownloadPromptReminder: false,
    downloadPromptDelay: 50,
    downloadPromptReminderDelay: 30
};

@Component({
    selector: 'adf-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    host: {class: 'adf-viewer'},
    encapsulation: ViewEncapsulation.None,
    providers: [ViewUtilService]
})
export class ViewerComponent<T> implements OnDestroy, OnInit, OnChanges {

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

    /** Override Content filename. */
    @Input()
    fileName: string;

    /** Hide or show the viewer */
    @Input()
    showViewer = true;

    /** Allows `back` navigation */
    @Input()
    allowGoBack = true;

    /** Toggles the 'Full Screen' feature. */
    @Input()
    allowFullScreen = true;

    /** Hide or show the toolbar */
    @Input()
    showToolbar = true;

    /** If `true` then show the Viewer as a full page over the current content.
     * Otherwise fit inside the parent div.
     */
    @Input()
    overlayMode = false;

    /** Toggles before/next navigation. You can use the arrow buttons to navigate
     * between documents in the collection.
     */
    @Input()
    allowNavigate = false;

    /** Toggles the "before" ("<") button. Requires `allowNavigate` to be enabled. */
    @Input()
    canNavigateBefore = true;

    /** Toggles the next (">") button. Requires `allowNavigate` to be enabled. */
    @Input()
    canNavigateNext = true;

    /** Allow the left the sidebar. */
    @Input()
    allowLeftSidebar = false;

    /** Allow the right sidebar. */
    @Input()
    allowRightSidebar = false;

    /** Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`. */
    @Input()
    showRightSidebar = false;

    /** Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`. */
    @Input()
    showLeftSidebar = false;

    /** The template for the right sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarRightTemplate: TemplateRef<any> = null;

    /** The template for the left sidebar. The template context contains the loaded node data. */
    @Input()
    sidebarLeftTemplate: TemplateRef<any> = null;

    /** Enable when where is possible the editing functionalities  */
    @Input()
    readOnly = true;

    /** media subtitles for the media player*/
    @Input()
    tracks: Track[] = [];

    /** Overload mimeType*/
    @Input()
    mimeType: string;

    /**
     * Context object available for binding by the local sidebarRightTemplate with let declarations.
     */
    @Input()
    sidebarRightTemplateContext: T = null;

    /**
     * Context object available for binding by the local sidebarLeftTemplate with let declarations.
     */
    @Input()
    sidebarLeftTemplateContext: T = null;

    /**
     * Enable dialog box to allow user to download the previewed file, in case the preview is not responding for a set period of time.
     * */
    enableDownloadPrompt: boolean = false;

    /**
     * Enable reminder dialogs to prompt user to download the file, in case the preview is not responding for a set period of time.
     * */
    enableDownloadPromptReminder: boolean = false;

    /**
     * Initial time in seconds to wait before giving the first prompt to user to download the file
     * */
    downloadPromptDelay: number = 50;

    /**
     * Time in seconds to wait before giving the second and consequent reminders to the user to download the file.
     * */
    downloadPromptReminderDelay: number = 15;

    /**
     * Emitted when user clicks on download button on download prompt dialog.
     * */
    @Output()
    downloadFile: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when user clicks 'Navigate Before' ("<") button. */
    @Output()
    navigateBefore = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when user clicks 'Navigate Next' (">") button. */
    @Output()
    navigateNext = new EventEmitter<MouseEvent | KeyboardEvent>();

    /** Emitted when the viewer close */
    @Output()
    showViewerChange = new EventEmitter<boolean>();

    /** Emitted when the img is submitted in the img viewer. */
    @Output()
    submitFile = new EventEmitter<Blob>();

    private onDestroy$ = new Subject<boolean>();

    private closeViewer = true;
    private keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');
    private isDialogVisible: boolean = false;
    public downloadPromptTimer: number;
    public downloadPromptReminderTimer: number;

    constructor(private el: ElementRef,
                public dialog: MatDialog,
                private viewUtilsService: ViewUtilService,
                private appConfigService: AppConfigService
               ) {
    }

    ngOnChanges(changes: SimpleChanges){
        const { blobFile, urlFile } = changes;

        if(blobFile?.currentValue){
            this.mimeType = blobFile.currentValue.type;
        }

        if(urlFile?.currentValue){
            this.fileName = this.fileName ? this.fileName : this.viewUtilsService.getFilenameFromUrl(urlFile.currentValue);
        }

    }

    ngOnInit(): void {
        this.closeOverlayManager();
        this.configureAndInitDownloadPrompt();
    }

    private closeOverlayManager() {
        this.dialog.afterOpened.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.closeViewer = false);

        this.dialog.afterAllClosed.pipe(
            skipWhile(() => !this.overlayMode),
            takeUntil(this.onDestroy$)
        ).subscribe(() => this.closeViewer = true);

        this.keyDown$.pipe(
            skipWhile(() => !this.overlayMode),
            filter((e: KeyboardEvent) => e.keyCode === 27),
            takeUntil(this.onDestroy$)
        ).subscribe((event: KeyboardEvent) => {
            event.preventDefault();

            if (this.closeViewer) {
                this.onClose();
            }
        });
    }

    onNavigateBeforeClick(event: MouseEvent | KeyboardEvent) {
        this.navigateBefore.next(event);
    }

    onNavigateNextClick(event: MouseEvent | KeyboardEvent) {
        this.navigateNext.next(event);
    }

    /**
     * close the viewer
     */
    onClose() {
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    }

    toggleRightSidebar() {
        this.showRightSidebar = !this.showRightSidebar;
    }

    toggleLeftSidebar() {
        this.showLeftSidebar = !this.showLeftSidebar;
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event && event.defaultPrevented) {
            return;
        }

        const key = event.keyCode;

        // Left arrow
        if (key === 37 && this.canNavigateBefore) {
            event.preventDefault();
            this.onNavigateBeforeClick(event);
        }

        // Right arrow
        if (key === 39 && this.canNavigateNext) {
            event.preventDefault();
            this.onNavigateNextClick(event);
        }

        // Ctrl+F
        if (key === 70 && event.ctrlKey) {
            event.preventDefault();
            this.enterFullScreen();
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

    onSubmitFile(newImageBlob: Blob) {
        this.submitFile.emit(newImageBlob);
    }

    ngOnDestroy() {
        this.clearDownloadPromptTimeouts();
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    private configureAndInitDownloadPrompt() {
        this.configureDownloadPromptProperties();
        if (this.enableDownloadPrompt) {
            this.initDownloadPrompt();
        }
    }

    private configureDownloadPromptProperties() {
        const nonResponsivePreviewConfig = this.appConfigService.get('viewer', DEFAULT_NON_PREVIEW_CONFIG);

        this.enableDownloadPrompt = nonResponsivePreviewConfig.enableDownloadPrompt;
        this.enableDownloadPromptReminder = nonResponsivePreviewConfig.enableDownloadPromptReminder;
        this.downloadPromptDelay = nonResponsivePreviewConfig.downloadPromptDelay;
        this.downloadPromptReminderDelay = nonResponsivePreviewConfig.downloadPromptReminderDelay;
    }

    private initDownloadPrompt() {
        this.downloadPromptTimer = window.setTimeout(() => {
            this.showOrClearDownloadPrompt();
        }, this.downloadPromptDelay * 1000);
    }

    private showOrClearDownloadPrompt() {
        if (!this.urlFile) {
            this.showDownloadPrompt();
        } else {
            this.clearDownloadPromptTimeouts();
        }
    }

    public clearDownloadPromptTimeouts() {
        if (this.downloadPromptTimer) {
            clearTimeout(this.downloadPromptTimer);
        }
        if (this.downloadPromptReminderTimer) {
            clearTimeout(this.downloadPromptReminderTimer);
        }
    }

    private showDownloadPrompt() {
        if (!this.isDialogVisible) {
            this.isDialogVisible = true;
            this.dialog.open(DownloadPromptDialogComponent, { disableClose: true }).afterClosed().pipe(first()).subscribe((result: DownloadPromptActions) => {
                this.isDialogVisible = false;
                if (result === DownloadPromptActions.DOWNLOAD) {
                    this.downloadFile.emit();
                    this.onClose();
                } else if (result === DownloadPromptActions.WAIT) {
                    if (this.enableDownloadPromptReminder) {
                        this.clearDownloadPromptTimeouts();
                        this.downloadPromptReminderTimer = window.setTimeout(() => {
                            this.showOrClearDownloadPrompt();
                        }, this.downloadPromptReminderDelay * 1000);
                    }
                }
            });
        }
    }
}
