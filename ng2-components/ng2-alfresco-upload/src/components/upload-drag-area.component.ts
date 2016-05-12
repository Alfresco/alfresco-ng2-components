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

import { Component, ViewChild, ElementRef, Input } from 'angular2/core';
import { UploadService } from '../services/upload.service';
import { FileModel } from '../models/file.model';
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
import { FileDraggableDirective } from '../directives/file-draggable.directive';

declare let __moduleName: string;

/**
 * <alfresco-upload-drag-area [showDialogUpload]="boolean" ></alfresco-upload-drag-area>
 *
 * This component, provide a drag and drop are to upload files to alfresco.
 *
 * @InputParam {boolean} [true] showDialogUpload - hide/show upload dialog .
 *
 *
 * @returns {UploadDragAreaComponent} .
 */
@Component({
  selector: 'alfresco-upload-drag-area',
  moduleId: __moduleName,
  directives: [FileDraggableDirective, FileUploadingDialogComponent],
  templateUrl: './upload-drag-area.component.html',
  styleUrls: ['./upload-drag-area.component.css']
})
export class UploadDragAreaComponent {

  private _uploaderService: UploadService;

  @ViewChild('fileUploadingDialog')
  fileUploadingDialogComponent: FileUploadingDialogComponent;

  @Input()
  showUploadDialog: boolean = true;

  filesUploadingList: FileModel [] = [];

  @Input()
  uploaddirectory: string = '';

  constructor(public el: ElementRef) {
    console.log('UploadComponent constructor', el);

    this._uploaderService = new UploadService({
      url: 'http://192.168.99.100:8080/alfresco/service/api/upload',
      withCredentials: true,
      authToken: btoa('admin:admin'),
      authTokenPrefix: 'Basic',
      fieldName: 'filedata',
      formFields: {
        siteid: 'swsdp',
        containerid: 'documentLibrary'
      }
    });
  }

  /**
   * Method called when files are dropped in the drag area.
   *
   * @param {File[]} files - files dropped in the drag area.
   */
  onFilesDropped(files: File[]): void {
    if (files.length) {
      this._uploaderService.addToQueue(files);
      this._uploaderService.uploadFilesInTheQueue(this.uploaddirectory);
      this.filesUploadingList = this._uploaderService.getQueue();
      if (this.showUploadDialog) {
        this._showDialog();
      }
    }
  }

  /**
   * Show the upload dialog.
   */
  private _showDialog(): void {
    this.fileUploadingDialogComponent.showDialog();
  }
}
