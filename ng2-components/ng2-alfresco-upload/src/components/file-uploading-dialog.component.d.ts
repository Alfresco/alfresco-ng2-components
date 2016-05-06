/**
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
import { ElementRef } from 'angular2/core';
import { FileModel } from '../models/file.model';
/**
 * <file-uploading-dialog [filesUploadingList]="FileModel[]" ></file-uploading-dialog>
 *
 * This component is a hideable and minimizable wich contains the list of the uploading
 * files contained in the filesUploadingList.
 *
 * @InputParam {FileModel[]} filesUploadingList - list of the uploading files .
 *
 *
 * @returns {FileUploadingDialogComponent} .
 */
export declare class FileUploadingDialogComponent {
    el: ElementRef;
    filesUploadingList: FileModel[];
    private _isDialogActive;
    private _isDialogMinimized;
    constructor(el: ElementRef);
    /**
     * Display and hide the dialog component.
     */
    toggleShowDialog($event: any): void;
    /**
     * Display the dialog if hidden.
     */
    showDialog(): void;
    /**
     * Minimize and expand the dialog component.
     */
    toggleDialogMinimize($event: any): void;
}
