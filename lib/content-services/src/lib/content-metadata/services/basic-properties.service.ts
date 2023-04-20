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

import { Injectable } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { CardViewDateItemModel, CardViewTextItemModel, FileSizePipe } from '@alfresco/adf-core';
@Injectable({
    providedIn: 'root'
})
export class BasicPropertiesService {

    constructor(private fileSizePipe: FileSizePipe) {
    }

    getProperties(node: Node) {
        const sizeInBytes = node.content ? node.content.sizeInBytes : '';
        const mimeTypeName = node.content ? node.content.mimeTypeName : '';
        const author = node.properties ? node.properties['cm:author'] : '';
        const description = node.properties ? node.properties['cm:description'] : '';
        const title = node.properties ? node.properties['cm:title'] : '';

        return [
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.NAME',
                value: node.name,
                key: 'properties.cm:name',
                editable: true
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.TITLE',
                value: title,
                key: 'properties.cm:title',
                editable: true
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.CREATOR',
                value: node.createdByUser.displayName,
                key: 'createdByUser.displayName',
                editable: false
            }),
            new CardViewDateItemModel({
                label: 'CORE.METADATA.BASIC.CREATED_DATE',
                value: node.createdAt,
                key: 'createdAt',
                editable: false,
                format: 'mediumDate'
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.SIZE',
                value: sizeInBytes,
                key: 'content.sizeInBytes',
                pipes: [{ pipe: this.fileSizePipe }],
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.MODIFIER',
                value: node.modifiedByUser.displayName,
                key: 'modifiedByUser.displayName',
                editable: false
            }),
            new CardViewDateItemModel({
                label: 'CORE.METADATA.BASIC.MODIFIED_DATE',
                value: node.modifiedAt,
                key: 'modifiedAt',
                editable: false,
                format: 'mediumDate'
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.MIMETYPE',
                value: mimeTypeName,
                key: 'content.mimeTypeName',
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.AUTHOR',
                value: author,
                key: 'properties.cm:author',
                editable: true
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.DESCRIPTION',
                value: description,
                key: 'properties.cm:description',
                multiline: true,
                editable: true
            })
        ];
    }
}
