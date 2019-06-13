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

/* tslint:disable:component-selector */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormService,
  LogService,
  ThumbnailService,
  ProcessContentService
} from '@alfresco/adf-core';
import { RelatedContentRepresentation } from '@alfresco/js-api';
import { ContentCloudNodeSelectorService } from '../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../services/process-cloud-content.service';
import { UploadCloudWidgetComponent } from '../upload-cloud.widget';

@Component({
  selector: 'adf-cloud-attach-file-cloud-widget',
  templateUrl: './attach-file-cloud-widget.component.html',
  styleUrls: ['./attach-file-cloud-widget.component.scss'],
  host: {
    '(click)': 'event($event)',
    '(blur)': 'event($event)',
    '(change)': 'event($event)',
    '(focus)': 'event($event)',
    '(focusin)': 'event($event)',
    '(focusout)': 'event($event)',
    '(input)': 'event($event)',
    '(invalid)': 'event($event)',
    '(select)': 'event($event)'
  },
  encapsulation: ViewEncapsulation.None
})
export class AttachFileCloudWidgetComponent extends UploadCloudWidgetComponent implements OnInit {

  static ACS_SERVICE = 'alfresco-content';
  private tempFilesList = [];

  constructor(
    public formService: FormService,
    public logger: LogService,
    public processContentService: ProcessContentService,
    public thumbnails: ThumbnailService,
    public processCloudContentService: ProcessCloudContentService,
    public contentNodeSelectorService: ContentCloudNodeSelectorService) {
    super(formService, thumbnails, processCloudContentService, logger);
  }

  ngOnInit() {
    if (this.field &&
      this.field.value &&
      this.field.value.length > 0) {
      this.tempFilesList = [...this.field.value];
      this.hasFile = true;
    }
    this.getMultipleFileParam();
  }

  isFileSourceConfigured(): boolean {
    return !!this.field.params && !!this.field.params.fileSource;
  }

  isMultipleSourceUpload(): boolean {
    return !this.field.readOnly && this.isFileSourceConfigured() && !this.isOnlyLocalSourceSelected();
  }

  isOnlyLocalSourceSelected(): boolean {
    return this.field.params &&
      this.field.params.fileSource &&
      this.field.params.fileSource.serviceId === 'local-file';
  }

  isSimpleUploadButton(): boolean {
    return this.isUploadButtonVisible() &&
      !this.isFileSourceConfigured() ||
      this.isOnlyLocalSourceSelected();
  }

  isUploadButtonVisible(): boolean {
    return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
  }

  isTemporaryFile(file): boolean {
    return this.tempFilesList.findIndex((elem) => elem.name === file.name) >= 0;
  }

  onAttachFileChanged(event: any) {
    this.tempFilesList.push(...Array.from(event.target.files));
    this.onFileChanged(event);
  }

  onRemoveAttachFile(file: File | RelatedContentRepresentation) {
    if (this.isTemporaryFile(file)) {
      this.removeElementFromTempFilesList(file);
    }
    this.removeFile(file);
  }

  openSelectDialog() {
    this.contentNodeSelectorService.openUploadFileDialog(this.field.form.contentHost).subscribe((selections: any[]) => {
      selections.forEach((node) => node.isExternal = true);
      const result = {
        nodeId: selections[0].id,
        name: selections[0].name,
        content: selections[0].content,
        createdAt: selections[0].createdAt
      };
      this.tempFilesList.push(result);
      this.uploadContentfromACS(this.tempFilesList);
    });
  }

  uploadContentfromACS(filesSaved) {
    this.field.form.values[this.field.id] = filesSaved;
    this.hasFile = true;
  }

  isContentSourceSelected(): boolean {
    return this.field.params &&
      this.field.params.fileSource &&
      this.field.params.fileSource.serviceId === AttachFileCloudWidgetComponent.ACS_SERVICE;
  }

  private removeElementFromTempFilesList(file) {
    const index = this.tempFilesList.indexOf(file);

    if (index !== -1) {
      this.tempFilesList.splice(index, 1);
      this.fixIncompatibilityFromPreviousAndNewForm(this.tempFilesList);
    }

    this.hasFile = this.tempFilesList.length > 0;
    this.resetTempFilesList();

  }

  private resetTempFilesList() {
    if (this.tempFilesList.length === 0) {
      this.tempFilesList = [];
    }
  }
}
