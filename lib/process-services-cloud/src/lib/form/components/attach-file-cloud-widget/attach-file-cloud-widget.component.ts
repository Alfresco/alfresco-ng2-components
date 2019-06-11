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
  ProcessContentService,
  FormEvent,
  UploadWidgetComponent
} from '@alfresco/adf-core';
import { RelatedContentRepresentation } from '@alfresco/js-api';
import { FormCloudService } from '../../services/form-cloud.service';
import { ContentCloudNodeSelectorService } from '../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../services/process-cloud-content.service';

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
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: ProcessContentService, useClass: ProcessCloudContentService}
  ]
})
export class AttachFileCloudWidgetComponent extends UploadWidgetComponent implements OnInit {

  private tempFilesList = [];
  static ACS_SERVICE = 'alfresco-content';

  constructor(public formService: FormService,
              public logger: LogService,
              public thumbnails: ThumbnailService,
              public processCloudContentService: ProcessContentService,
              public formCloudService: FormCloudService,
              public contentNodeSelectorService: ContentCloudNodeSelectorService) {
    super(formService, logger, thumbnails, processCloudContentService);
  }

  ngOnInit() {
    if (this.field &&
      this.field.value &&
      this.field.value.length > 0) {
      this.hasFile = true;
    }
    this.getMultipleFileParam();

    this.formService.taskSaved.subscribe((formSaved: FormEvent) => {
      if (formSaved.form.id === this.field.form.id) {
        this.tempFilesList = [];
      }
    });
  }

  isFileSourceConfigured(): boolean {
    return !!this.field.params && !!this.field.params.fileSource;
  }

  isMultipleSourceUpload(): boolean {
    return !this.field.readOnly && this.isFileSourceConfigured() && !this.isOnlyLocalSourceSelected();
  }

  isAllFileSourceSelected(): boolean {
    return this.field.params &&
      this.field.params.fileSource &&
      this.field.params.fileSource.serviceId === 'all-file-sources';
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
      this.tempFilesList.splice(this.tempFilesList.indexOf((<RelatedContentRepresentation> file).contentBlob), 1);
    }
    this.removeFile(file);
  }

  onAttachFileClicked(file: any) {
    if (file.isExternal) {
      this.logger.info(`The file ${file.name} comes from an external source and cannot be showed at this moment`);
      return;
    }
    if (this.isTemporaryFile(file)) {
      this.formService.formContentClicked.next(file);
    } else {
      this.fileClicked(file);
    }
  }

  uploadFileFromContent() {
    this.contentNodeSelectorService.openUploadFileDialog(this.field.form.contentHost).subscribe((selections: any[]) => {
      selections.forEach((node) => node.isExternal = true);
      // const result = { nodeId: selections[0].id, name: selections[0].name, content: selections[0].content, createdAt: selections[0].createdAt };
      selections.forEach((node) => node.isExternal = true);
      this.tempFilesList.push(...selections);
      this.fixIncompatibilityFromPreviousAndNewForm(this.tempFilesList);
    });
  }

  fixIncompatibilityFromPreviousAndNewForm(filesSaved) {
    this.field.form.values[this.field.id] = filesSaved;
  }

  isContentSourceSelected(): boolean {
    return this.field.params &&
      this.field.params.fileSource &&
      this.field.params.fileSource.serviceId === AttachFileCloudWidgetComponent.ACS_SERVICE;
  }

}
