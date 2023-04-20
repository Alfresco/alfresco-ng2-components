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

import { EventEmitter, Injectable } from '@angular/core';
import { Minimatch } from 'minimatch';
import { Subject } from 'rxjs';
import {
    FileUploadCompleteEvent,
    FileUploadDeleteEvent,
    FileUploadErrorEvent,
    FileUploadEvent
} from '../events/file.event';
import { FileModel, FileUploadProgress, FileUploadStatus } from '../models/file.model';
import { AppConfigService, AlfrescoApiService } from '@alfresco/adf-core';
import { filter } from 'rxjs/operators';
import { DiscoveryApiService } from '../../common/services/discovery-api.service';
import { NodesApi, UploadApi, VersionsApi } from '@alfresco/js-api';

const MIN_CANCELLABLE_FILE_SIZE = 1000000;
const MAX_CANCELLABLE_FILE_PERCENTAGE = 50;

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    queue: FileModel[] = [];
    queueChanged: Subject<FileModel[]> = new Subject<FileModel[]>();
    fileUpload: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadStarting: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadCancelled: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadProgress: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadAborted: Subject<FileUploadEvent> = new Subject<FileUploadEvent>();
    fileUploadError: Subject<FileUploadErrorEvent> = new Subject<FileUploadErrorEvent>();
    fileUploadComplete: Subject<FileUploadCompleteEvent> = new Subject<FileUploadCompleteEvent>();
    fileUploadDeleted: Subject<FileUploadDeleteEvent> = new Subject<FileUploadDeleteEvent>();
    fileDeleted: Subject<string> = new Subject<string>();

    private cache: { [key: string]: any } = {};
    private totalComplete: number = 0;
    private totalAborted: number = 0;
    private totalError: number = 0;
    private excludedFileList: string[] = [];
    private excludedFoldersList: string[] = [];
    private matchingOptions: any = null;
    private folderMatchingOptions: any = null;
    private abortedFile: string;
    private isThumbnailGenerationEnabled: boolean;

    private _uploadApi: UploadApi;
    get uploadApi(): UploadApi {
        this._uploadApi = this._uploadApi ?? new UploadApi(this.apiService.getInstance());
        return this._uploadApi;
    }

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    private _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    constructor(
        protected apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private discoveryApiService: DiscoveryApiService) {

        this.discoveryApiService.ecmProductInfo$.pipe(filter(info => !!info))
            .subscribe(({status}) => {
                this.isThumbnailGenerationEnabled = status.isThumbnailGenerationEnabled;
            });
    }

    clearCache() {
        this.cache = {};
    }

    /**
     * Returns the number of concurrent threads for uploading.
     *
     * @returns Number of concurrent threads (default 1)
     */
    getThreadsCount(): number {
        return this.appConfigService.get<number>('upload.threads', 1);
    }

    /**
     * Checks whether the service still has files uploading or awaiting upload.
     *
     * @returns True if files in the queue are still uploading, false otherwise
     */
    isUploading(): boolean {
        const finishedFileStates = [FileUploadStatus.Complete, FileUploadStatus.Cancelled, FileUploadStatus.Aborted, FileUploadStatus.Error, FileUploadStatus.Deleted];
        return this.queue.reduce((stillUploading: boolean, currentFile: FileModel) => stillUploading || finishedFileStates.indexOf(currentFile.status) === -1, false);
    }

    /**
     * Gets the file Queue
     *
     * @returns Array of files that form the queue
     */
    getQueue(): FileModel[] {
        return this.queue;
    }

    /**
     * Adds files to the uploading queue to be uploaded
     *
     * @param files One or more separate parameters or an array of files to queue
     * @returns Array of files that were not blocked from upload by the ignore list
     */
    addToQueue(...files: FileModel[]): FileModel[] {
        const allowedFiles = files.filter((currentFile) =>
            this.filterElement(currentFile)
        );
        this.queue = this.queue.concat(allowedFiles);
        this.queueChanged.next(this.queue);
        return allowedFiles;
    }

    /**
     * Finds all the files in the queue that are not yet uploaded and uploads them into the directory folder.
     *
     * @param successEmitter Emitter to invoke on file success status change
     * @param errorEmitter Emitter to invoke on file error status change
     */
    uploadFilesInTheQueue(successEmitter?: EventEmitter<any>, errorEmitter?: EventEmitter<any>): void {
        const files = this.getFilesToUpload();

        if (files && files.length > 0) {
            for (const file of files) {
                this.onUploadStarting(file);

                const promise = this.beginUpload(file, successEmitter, errorEmitter);
                this.cache[file.name] = promise;

                const next = () => {
                    setTimeout(() => this.uploadFilesInTheQueue(successEmitter, errorEmitter), 100);
                };

                promise.next = next;

                promise.then(
                    () => next(),
                    () => next()
                );
            }
        }
    }

    /**
     * Cancels uploading of files.
     * If the file is smaller than 1 MB the file will be uploaded and then the node deleted
     * to prevent having files that were aborted but still uploaded.
     *
     * @param files One or more separate parameters or an array of files specifying uploads to cancel
     */
    cancelUpload(...files: FileModel[]) {
        files.forEach((file) => {
            const promise = this.cache[file.name];
            if (promise) {
                if (this.isSaveToAbortFile(file)) {
                    promise.abort();
                } else {
                    this.abortedFile = file.name;
                }
                delete this.cache[file.name];
                promise.next();
            } else {
                const performAction = this.getAction(file);

                if (performAction) {
                    performAction();
                }
            }
        });
    }

    /** Clears the upload queue */
    clearQueue() {
        this.queue = [];
        this.totalComplete = 0;
        this.totalAborted = 0;
        this.totalError = 0;
    }

    /**
     * Gets an upload promise for a file.
     *
     * @param file The target file
     * @returns Promise that is resolved if the upload is successful or error otherwise
     */
    getUploadPromise(file: FileModel): any {
        const opts: any = {
            include: ['allowableOperations']
        };

        if (this.isThumbnailGenerationEnabled) {
            opts.renditions = 'doclib';
        }

        if (file.options && file.options.versioningEnabled !== undefined) {
            opts.versioningEnabled = file.options.versioningEnabled;
        }

        if (file.options.newVersion === true) {
            opts.overwrite = true;
            opts.majorVersion = file.options.majorVersion;
            opts.comment = file.options.comment;
            opts.name = file.name;
        } else {
            opts.autoRename = true;
        }

        if (file.options.nodeType) {
            opts.nodeType = file.options.nodeType;
        }

        if (file.id) {
            return this.nodesApi.updateNodeContent(file.id, file.file as any, opts);
        } else {
            const nodeBody = {...file.options};
            delete nodeBody['versioningEnabled'];

            return this.uploadApi.uploadFile(
                file.file,
                file.options.path,
                file.options.parentId,
                nodeBody,
                opts
            );
        }
    }

    private getFilesToUpload(): FileModel[] {
        const cached = Object.keys(this.cache);
        const threadsCount = this.getThreadsCount();

        if (cached.length >= threadsCount) {
            return [];
        }

        const files = this.queue
            .filter(toUpload => !cached.includes(toUpload.name) && toUpload.status === FileUploadStatus.Pending)
            .slice(0, threadsCount);

        return files;
    }

    private beginUpload(file: FileModel, successEmitter?: EventEmitter<any>, errorEmitter?: EventEmitter<any>): any {
        const promise = this.getUploadPromise(file);
        promise
            .on('progress', (progress: FileUploadProgress) => {
                this.onUploadProgress(file, progress);
            })
            .on('abort', () => {
                this.onUploadAborted(file);
                if (successEmitter) {
                    successEmitter.emit({value: 'File aborted'});
                }
            })
            .on('error', (err) => {
                this.onUploadError(file, err);
                if (errorEmitter) {
                    errorEmitter.emit({value: 'Error file uploaded'});
                }
            })
            .on('success', (data) => {
                if (this.abortedFile === file.name) {
                    this.onUploadAborted(file);
                    if (file.id === undefined) {
                        this.deleteAbortedNode(data.entry.id);
                    } else {
                        this.deleteAbortedNodeVersion(data.entry.id, data.entry.properties['cm:versionLabel']);
                    }
                    if (successEmitter) {
                        successEmitter.emit({value: 'File deleted'});
                    }
                } else {
                    this.onUploadComplete(file, data);
                    if (successEmitter) {
                        successEmitter.emit({value: data});
                    }
                }
            })
            .catch(() => {
            });

        return promise;
    }

    private onUploadStarting(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Starting;
            const event = new FileUploadEvent(file, FileUploadStatus.Starting);
            this.fileUpload.next(event);
            this.fileUploadStarting.next(event);
        }
    }

    private onUploadProgress(
        file: FileModel,
        progress: FileUploadProgress
    ): void {
        if (file) {
            file.progress = progress;
            file.status = FileUploadStatus.Progress;

            const event = new FileUploadEvent(file, FileUploadStatus.Progress);
            this.fileUpload.next(event);
            this.fileUploadProgress.next(event);
        }
    }

    private onUploadError(file: FileModel, error: any): void {
        if (file) {
            file.errorCode = (error || {}).status;
            file.status = FileUploadStatus.Error;
            this.totalError++;

            const promise = this.cache[file.name];
            if (promise) {
                delete this.cache[file.name];
            }

            const event = new FileUploadErrorEvent(
                file,
                error,
                this.totalError
            );
            this.fileUpload.next(event);
            this.fileUploadError.next(event);
        }
    }

    private onUploadComplete(file: FileModel, data: any): void {
        if (file) {
            file.status = FileUploadStatus.Complete;
            file.data = data;
            this.totalComplete++;
            const promise = this.cache[file.name];
            if (promise) {
                delete this.cache[file.name];
            }

            const event = new FileUploadCompleteEvent(
                file,
                this.totalComplete,
                data,
                this.totalAborted
            );
            this.fileUpload.next(event);
            this.fileUploadComplete.next(event);
        }
    }

    private onUploadAborted(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Aborted;
            this.totalAborted++;

            const event = new FileUploadEvent(file, FileUploadStatus.Aborted);
            this.fileUpload.next(event);
            this.fileUploadAborted.next(event);
        }
    }

    private onUploadCancelled(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Cancelled;

            const event = new FileUploadEvent(file, FileUploadStatus.Cancelled);
            this.fileUpload.next(event);
            this.fileUploadCancelled.next(event);
        }
    }

    private onUploadDeleted(file: FileModel): void {
        if (file) {
            file.status = FileUploadStatus.Deleted;
            this.totalComplete--;

            const event = new FileUploadDeleteEvent(file, this.totalComplete);
            this.fileUpload.next(event);
            this.fileUploadDeleted.next(event);
        }
    }

    private getAction(file: FileModel) {
        const actions = {
            [FileUploadStatus.Pending]: () => this.onUploadCancelled(file),
            [FileUploadStatus.Deleted]: () => this.onUploadDeleted(file),
            [FileUploadStatus.Error]: () => this.onUploadError(file, null)
        };

        return actions[file.status];
    }

    private deleteAbortedNode(nodeId: string) {
        this.nodesApi.deleteNode(nodeId, {permanent: true})
            .then(() => (this.abortedFile = undefined));
    }

    private deleteAbortedNodeVersion(nodeId: string, versionId: string) {
        this.versionsApi.deleteVersion(nodeId, versionId)
            .then(() => (this.abortedFile = undefined));
    }

    private isSaveToAbortFile(file: FileModel): boolean {
        return (
            file.size > MIN_CANCELLABLE_FILE_SIZE &&
            file.progress.percent < MAX_CANCELLABLE_FILE_PERCENTAGE
        );
    }

    private filterElement(file: FileModel) {
        this.excludedFileList = this.appConfigService.get<string[]>('files.excluded');
        this.excludedFoldersList = this.appConfigService.get<string[]>('folders.excluded');
        let isAllowed = true;

        if (this.excludedFileList) {
            this.matchingOptions = this.appConfigService.get('files.match-options');
            isAllowed = this.isFileNameAllowed(file);
        }

        if (isAllowed && this.excludedFoldersList) {
            this.folderMatchingOptions = this.appConfigService.get('folders.match-options');
            isAllowed = this.isParentFolderAllowed(file);
        }
        return isAllowed;
    }

    private isParentFolderAllowed(file: FileModel): boolean {
        let isAllowed: boolean = true;
        const currentFile: any = file.file;
        const fileRelativePath = currentFile.webkitRelativePath ? currentFile.webkitRelativePath : file.options.path;
        if (currentFile && fileRelativePath) {
            isAllowed =
                this.excludedFoldersList.filter((folderToExclude) => fileRelativePath
                    .split('/')
                    .some((pathElement) => {
                        const minimatch = new Minimatch(folderToExclude, this.folderMatchingOptions);
                        return minimatch.match(pathElement);
                    })).length === 0;
        }
        return isAllowed;
    }

    private isFileNameAllowed(file: FileModel): boolean {
        return (
            this.excludedFileList.filter((pattern) => {
                const minimatch = new Minimatch(pattern, this.matchingOptions);
                return minimatch.match(file.name);
            }).length === 0
        );
    }
}
