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
import { MatDialog } from '@angular/material/dialog';
import { CardViewItem, CardViewSelectItemModel, CardViewSelectItemOption } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentTypeDialogComponent } from '../../content-type/content-type-dialog.component';
import { ContentTypeDialogComponentData } from '../../content-type/content-type-metadata.interface';
import { ContentTypeService } from '../../content-type/content-type.service';

@Injectable({
    providedIn: 'root'
})
export class ContentTypePropertiesService {

    private contentTypesOptions$: Observable<CardViewSelectItemOption<string>[]>;

    constructor(private contentTypeService: ContentTypeService, private dialog: MatDialog) {
        this.contentTypesOptions$ = this.getContentTypesAsSelectOption();
    }

    getContentTypeCardItem(nodeType: string): Observable<CardViewItem[]> {
        return this.contentTypeService.getContentTypeByPrefix(nodeType).
            pipe(
                map((contentType) => {
                    return [new CardViewSelectItemModel({
                        label: 'CORE.METADATA.BASIC.CONTENT_TYPE',
                        value: contentType.entry.id,
                        key: 'nodeType',
                        editable: true,
                        options$: this.contentTypesOptions$
                    })];
                }));
    }

    private getContentTypesAsSelectOption(): Observable<CardViewSelectItemOption<string>[]> {
        return this.contentTypeService.getContentTypes().pipe(
            map((contentTypesEntries) => {
                return contentTypesEntries.map((contentType) => <CardViewSelectItemOption<string>> { key: contentType.entry.id, label: contentType.entry.title });
            }));
    }

    openContentTypeDialogConfirm(nodeType): Observable<boolean> {
        const select = new Subject<boolean>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: ContentTypeDialogComponentData = {
            title: 'CORE.METADATA.CONTENT_TYPE.DIALOG.TITLE',
            description: 'CORE.METADATA.CONTENT_TYPE.DIALOG.DESCRIPTION',
            confirmMessage: 'CORE.METADATA.CONTENT_TYPE.DIALOG.CONFIRM',
            select: select,
            nodeType
        };

        this.openDialog(data, 'adf-content-type-dialog', '600px');
        return select;
    }

    close() {
        this.dialog.closeAll();
    }

    private openDialog(data: ContentTypeDialogComponentData, panelClass: string, width: string) {
        this.dialog.open(ContentTypeDialogComponent, {
            data,
            panelClass,
            width,
            disableClose: true
        });
    }
}
