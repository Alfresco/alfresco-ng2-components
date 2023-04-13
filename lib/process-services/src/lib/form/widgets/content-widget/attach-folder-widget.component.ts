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

/* eslint-disable @angular-eslint/component-selector */

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
    WidgetComponent,
    FormService
} from '@alfresco/adf-core';
import { ContentNodeDialogService, NodesApiService } from '@alfresco/adf-content-services';
import { Node } from '@alfresco/js-api';

@Component({
    selector: 'attach-folder-widget',
    templateUrl: './attach-folder-widget.component.html',
    styleUrls: ['./attach-folder-widget.component.scss'],
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
export class AttachFolderWidgetComponent extends WidgetComponent implements OnInit {

    typeId = 'AttachFolderWidgetComponent';
    hasFolder: boolean = false;
    selectedFolderName: string = '';

    constructor(private contentDialog: ContentNodeDialogService,
                public formService: FormService,
                private nodeService: NodesApiService) {
        super();
    }

    ngOnInit() {
        if (this.field &&
            this.field.value) {
            this.hasFolder = true;
            this.nodeService.getNode(this.field.value).subscribe((node: Node) => {
                this.selectedFolderName = node.name;
            });
        }
    }

    isDefinedSourceFolder(): boolean {
        return !!this.field.params &&
            !!this.field.params.folderSource &&
            !!this.field.params.folderSource.selectedFolder;
    }

    openSelectDialogFromFileSource() {
        const params = this.field.params;
        if (this.isDefinedSourceFolder()) {
            this.contentDialog.openFolderBrowseDialogByFolderId(params.folderSource.selectedFolder.pathId).subscribe(
                (selections: Node[]) => {
                    this.selectedFolderName = selections[0].name;
                    this.field.value = selections[0].id;
                    this.hasFolder = true;
                });
        } else {
            this.contentDialog.openFolderBrowseDialogBySite().subscribe(
                (selections: Node[]) => {
                    this.selectedFolderName = selections[0].name;
                    this.field.value = selections[0].id;
                    this.hasFolder = true;
                });
        }
    }

    removeFolder() {
        this.field.value = null;
        this.selectedFolderName = '';
        this.hasFolder = false;
    }

}
