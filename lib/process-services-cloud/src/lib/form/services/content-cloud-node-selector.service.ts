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

import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';
import { ContentNodeSelectorComponent, ContentNodeSelectorComponentData } from '@alfresco/adf-content-services';
import { Node } from '@alfresco/js-api';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentCloudNodeSelectorService {

  constructor(
    private apiService: AlfrescoApiService,
    private dialog: MatDialog) {
  }

  openUploadFileDialog(contentHost: string): Observable<Node[]> {
    const changedConfig = this.apiService.lastConfig;
    changedConfig.provider = 'ALL';
    changedConfig.hostEcm = contentHost.replace('/alfresco', '');
    this.apiService.getInstance().setConfig(changedConfig);
    const select = new Subject<Node[]>();
    select.subscribe({
      complete: this.close.bind(this)
    });
    const data = <ContentNodeSelectorComponentData> {
      title: 'Select a file',
      actionName: 'Choose',
      currentFolderId: '-my-',
      select,
      isSelectionValid: this.isNodeFile.bind(this)
    };

    this.openContentNodeDialog(data, 'adf-content-node-selector-dialog', '630px');
    return select;
  }

  private openContentNodeDialog(data: ContentNodeSelectorComponentData, currentPanelClass: string, chosenWidth: string) {
    this.dialog.open(ContentNodeSelectorComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
  }

  close() {
    this.dialog.closeAll();
  }

  private isNodeFile(entry: Node): boolean {
    return entry && entry.isFile;
  }
}
