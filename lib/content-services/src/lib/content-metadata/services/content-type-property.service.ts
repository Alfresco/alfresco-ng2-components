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
import { Observable, of, Subject, zip } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ContentTypeDialogComponent } from '../../content-type/content-type-dialog.component';
import { ContentTypeDialogComponentData } from '../../content-type/content-type-metadata.interface';
import { ContentTypeService } from '../../content-type/content-type.service';
import { TypeEntry } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class ContentTypePropertiesService {

    constructor(private contentTypeService: ContentTypeService, private dialog: MatDialog) {
    }

    getContentTypeCardItem(nodeType: string): Observable<CardViewItem[]> {
        return this.contentTypeService.getContentTypeByPrefix(nodeType).
            pipe(
                map((contentType) => {
                    const contentTypesOptions$ = this.getContentTypesAsSelectOption(contentType);
                    const contentTypeCard =  this.buildContentTypeSelectCardModel(contentType.entry.id, contentTypesOptions$);
                    return [contentTypeCard];
                }));
    }

    private buildContentTypeSelectCardModel(currentValue: string, options$: Observable<CardViewSelectItemOption<string>[]>): CardViewSelectItemModel<string> {
        const contentTypeCard = new CardViewSelectItemModel({
            label: 'CORE.METADATA.BASIC.CONTENT_TYPE',
            value: currentValue,
            key: 'nodeType',
            editable: true,
            options$: options$
        });

        return contentTypeCard;
    }

    private getContentTypesAsSelectOption(currentType: TypeEntry): Observable<CardViewSelectItemOption<string>[]> {
        const childrenTypes$ = this.contentTypeService.getContentTypeChildren(currentType.entry.id);
        return zip(childrenTypes$, of(currentType)).pipe(
            distinctUntilChanged(),
            map(([contentTypesEntries, currentContentType]) => {
                const updatedTypes = this.appendCurrentType(currentContentType, contentTypesEntries);
                return updatedTypes.map((contentType) => <CardViewSelectItemOption<string>> { key: contentType.entry.id, label: contentType.entry.title ?? contentType.entry.id});
            }));
    }

    private appendCurrentType(currentType: TypeEntry, contentTypesEntries: TypeEntry[]): TypeEntry[] {
        const resultTypes = contentTypesEntries;
        if (contentTypesEntries.indexOf(currentType) === -1) {
            resultTypes.push(currentType);
        }
        return resultTypes;
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
