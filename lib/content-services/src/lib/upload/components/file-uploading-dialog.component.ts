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

import { UserPreferencesService } from '@alfresco/adf-core';
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    HostBinding,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import { FileUploadingListComponent } from './file-uploading-list.component';
import { Direction } from '@angular/cdk/bidi';
import { delay } from 'rxjs/operators';
import { UploadService } from '../../common/services/upload.service';
import { FileModel, FileUploadStatus } from '../../common/models/file.model';
import { FileUploadCompleteEvent, FileUploadDeleteEvent } from '../../common/events/file.event';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadingListRowComponent } from './file-uploading-list-row.component';
import { A11yModule } from '@angular/cdk/a11y';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-file-uploading-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule, TranslatePipe, MatIconModule, FileUploadingListComponent, FileUploadingListRowComponent, A11yModule],
    templateUrl: './file-uploading-dialog.component.html',
    styleUrls: ['./file-uploading-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {
    /** Dialog direction. Can be 'ltr' or 'rtl. */
    private direction: Direction = 'ltr';

    @ViewChild('uploadList')
    uploadList: FileUploadingListComponent;

    /** Dialog position. Can be 'left' or 'right'. */
    @Input()
    position: string = 'right';

    /** Makes the dialog always visible even when there are no uploads. */
    @Input()
    alwaysVisible: boolean = false;

    /** Emitted when a file in the list has an error. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    @HostBinding('attr.adfUploadDialogRight')
    public get isPositionRight(): boolean {
        return (this.direction === 'ltr' && this.position === 'right') || (this.direction === 'rtl' && this.position === 'left') || null;
    }
    @HostBinding('attr.adfUploadDialogLeft')
    public get isPositionLeft(): boolean {
        return (this.direction === 'ltr' && this.position === 'left') || (this.direction === 'rtl' && this.position === 'right') || null;
    }

    filesUploadingList: FileModel[] = [];
    isDialogActive: boolean = false;
    totalCompleted: number = 0;
    totalErrors: number = 0;
    isDialogMinimized: boolean = false;
    isConfirmation: boolean = false;

    private dialogActive = new Subject<boolean>();

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private uploadService: UploadService,
        private changeDetector: ChangeDetectorRef,
        private userPreferencesService: UserPreferencesService,
        private elementRef: ElementRef
    ) {}

    ngOnInit() {
        this.dialogActive.pipe(delay(100), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            const element: any = this.elementRef.nativeElement.querySelector('#upload-dialog');
            if (element) {
                element.focus();
            }
        });

        this.uploadService.queueChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fileList) => {
            this.filesUploadingList = fileList;

            if (this.filesUploadingList.length && !this.isDialogActive) {
                this.isDialogActive = true;
                this.dialogActive.next(undefined);
            } else {
                this.dialogActive.next(undefined);
            }
        });

        merge(this.uploadService.fileUploadComplete, this.uploadService.fileUploadDeleted)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: FileUploadCompleteEvent | FileUploadDeleteEvent) => {
                this.totalCompleted = event.totalComplete;
                this.changeDetector.detectChanges();
            });

        this.uploadService.fileUploadError.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
            this.totalErrors = event.totalError;
            this.changeDetector.detectChanges();
        });

        this.uploadService.fileUpload.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.changeDetector.detectChanges();
        });

        this.uploadService.fileDeleted.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((objId) => {
            if (this.filesUploadingList) {
                const uploadedFile = this.filesUploadingList.find((file) => (file.data ? file.data.entry.id === objId : false));
                if (uploadedFile) {
                    uploadedFile.status = FileUploadStatus.Cancelled;
                    this.changeDetector.detectChanges();
                }
            }
        });

        this.userPreferencesService
            .select('textOrientation')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((textOrientation: Direction) => {
                this.direction = textOrientation;
            });
    }

    /**
     * Toggle confirmation message.
     */
    toggleConfirmation() {
        this.isConfirmation = !this.isConfirmation;

        if (!this.isConfirmation) {
            this.dialogActive.next(undefined);
        }

        if (this.isDialogMinimized) {
            this.isDialogMinimized = false;
        }
    }

    /**
     * Cancel uploads and hide confirmation
     */
    cancelAllUploads() {
        this.toggleConfirmation();
        this.dialogActive.next(undefined);
        this.uploadList.cancelAllFiles();
    }

    /**
     * Toggle dialog minimized state.
     */
    toggleMinimized(): void {
        this.isDialogMinimized = !this.isDialogMinimized;
        this.changeDetector.detectChanges();
    }

    /**
     * Dismiss dialog
     */
    close(): void {
        this.isConfirmation = false;
        this.totalCompleted = 0;
        this.totalErrors = 0;
        this.filesUploadingList = [];
        this.isDialogActive = false;
        this.isDialogMinimized = false;
        this.uploadService.clearQueue();
        this.changeDetector.detectChanges();
    }

    ngOnDestroy() {
        this.uploadService.clearQueue();
    }

    canShowDialog(): boolean {
        return this.isDialogActive || this.alwaysVisible;
    }

    canShowCancelAll(): boolean {
        return this.filesUploadingList?.length && this.hasUploadInProgress();
    }

    canCloseDialog(): boolean {
        return !this.hasUploadInProgress() && !this.alwaysVisible;
    }

    hasUploadInProgress(): boolean {
        return !this.uploadList?.isUploadCompleted() && !this.uploadList?.isUploadCancelled();
    }
}
