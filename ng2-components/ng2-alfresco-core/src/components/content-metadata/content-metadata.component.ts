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

import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CardViewItem } from '../../interface/card-view-item.interface';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { FileSizePipe } from '../../pipes/file-size.pipe';

@Component({
    selector: 'adf-content-metadata',
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-content-metadata' },
    providers: [ FileSizePipe ]
})
export class ContentMetadataComponent implements OnChanges {

    properties: CardViewItem[] = [];

    @Input()
    node: MinimalNodeEntryEntity;

    constructor(private fileSizePipe: FileSizePipe) {}

    ngOnChanges() {
        this.recalculateProperties();
    }

    private recalculateProperties() {
        this.properties = [
            ...this.calculateBasicProperties()
        ];
    }

    private calculateBasicProperties() {
        const basicProperties = [];

        basicProperties.push(new CardViewTextItemModel({
            label: 'CORE.METADATA.BASIC.NAME',
            value: this.node.name,
            key: 'name'
        }));

        const title = this.node.properties['cm:title'];
        if (title) {
            basicProperties.push(new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.TITLE',
                value: title,
                key: 'properties.cm:title'
            }));
        }

        const description = this.node.properties['cm:description'];
        if (description) {
            basicProperties.push(new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.DESCRIPTION',
                value: description,
                key: 'properties.cm:description'
            }));
        }

        const author = this.node.properties['cm:author'];
        if (author) {
            basicProperties.push(new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.AUTHOR',
                value: author,
                key: 'properties.cm:author'
            }));
        }

        basicProperties.push(new CardViewTextItemModel({
            label: 'CORE.METADATA.BASIC.MIMETYPE',
            value: this.node.content.mimeTypeName,
            key: 'content.mimeTypeName',
            editable: false
        }));

        basicProperties.push(new CardViewTextItemModel({
            label: 'CORE.METADATA.BASIC.SIZE',
            value: this.node.content.sizeInBytes,
            key: 'content.sizeInBytes',
            pipes: [ { pipe: this.fileSizePipe } ],
            editable: false
        }));

        basicProperties.push(new CardViewTextItemModel({
            label: 'CORE.METADATA.BASIC.CREATOR',
            value: this.node.createdByUser.displayName,
            key: 'createdByUser.displayName',
            editable: false
        }));

        basicProperties.push(new CardViewDateItemModel({
            label: 'CORE.METADATA.BASIC.CREATED_DATE',
            value: this.node.createdAt,
            key: 'createdAt',
            editable: false
        }));

        basicProperties.push(new CardViewTextItemModel({
            label: 'CORE.METADATA.BASIC.MODIFIER',
            value: this.node.modifiedByUser.displayName,
            key: 'modifiedByUser.displayName',
            editable: false
        }));

        basicProperties.push(new CardViewDateItemModel({
            label: 'CORE.METADATA.BASIC.MODIFIED_DATE',
            value: this.node.modifiedAt,
            key: 'modifiedAt',
            editable: false
        }));

        return basicProperties;
    }
}
