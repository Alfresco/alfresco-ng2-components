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
import { CardViewSelectItemOption } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MimeTypeProperty } from '../models/mime-type-property.model';
import { MimeTypeService } from '../../mime-type/mime-type.service';
import { MatDialog } from '@angular/material/dialog';
import { MimeTypeDialogComponent, MimeTypeDialogComponentData } from '../../mime-type';

@Injectable({
    providedIn: 'root'
})
export class MimeTypePropertiesService {

    constructor(private mimeTypeService: MimeTypeService, private dialog: MatDialog) {

    }

    public getMimeTypeCardOptions(): Observable<CardViewSelectItemOption<string>[]> {
        return this.mimeTypeService.getMimeTypeOptions().pipe(
            map((mimeTypeProperties: MimeTypeProperty[]) => {
                const mappedProperties = mimeTypeProperties.map((mimeTypeProperty) =>
                    <CardViewSelectItemOption<string>> { key: mimeTypeProperty.mimetype, label: mimeTypeProperty.display });
                return mappedProperties;
            }));
    }

    openMimeTypeDialogConfirm(): Observable<boolean> {
        const select = new Subject<boolean>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: MimeTypeDialogComponentData = {
            title: 'MIME_TYPE.DIALOG.TITLE',
            description: 'MIME_TYPE.DIALOG.DESCRIPTION',
            confirmMessage: 'MIME_TYPE.DIALOG.MESSAGE',
            select: select
        };

        this.openDialog(data, 'adf-mime-type-dialog', '600px');
        return select;
    }

    close() {
        this.dialog.closeAll();
    }

    private openDialog(data: MimeTypeDialogComponentData, panelClass: string, width: string) {
        this.dialog.open(MimeTypeDialogComponent, {
            data,
            panelClass,
            width,
            disableClose: true
        });
    }

}
