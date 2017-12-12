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

import { Injectable } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CardViewDateItemModel, CardViewTextItemModel, FileSizePipe } from '@alfresco/adf-core';
import { AspectPropertiesService } from './aspect-properties.service';
import { AppConfigService } from '@alfresco/adf-core';

@Injectable()
export class ContentMetadataService {

    constructor(private appConfigService: AppConfigService,
                private fileSizePipe: FileSizePipe,
                private aspectPropertiesService: AspectPropertiesService) {}

    getAspects(node: MinimalNodeEntryEntity, preset: string = 'default') {
        this.loadAspects(node, preset);
    }

    private loadAspects(node: MinimalNodeEntryEntity, preset: string) {
        let aspectsWhiteList;

        try {
            aspectsWhiteList = Object.keys(this.appConfigService.config['content-metadata'].presets[preset]);
        } catch (e) {
            throw new Error(`No content-metadata preset for: ${preset}`);
        }

        const aspectsToLoad = node.aspectNames.filter(
            (aspectName) => aspectsWhiteList.indexOf(aspectName) !== -1
        );

        this.aspectPropertiesService.load(aspectsToLoad);
    }

    getBasicProperties(node: MinimalNodeEntryEntity) {
        return [
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.NAME',
                value: node.name,
                key: 'name',
                editable: true
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.TITLE',
                value: node.properties['cm:title'],
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
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.SIZE',
                value: node.content.sizeInBytes,
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
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.MIMETYPE',
                value: node.content.mimeTypeName,
                key: 'content.mimeTypeName',
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.AUTHOR',
                value: node.properties['cm:author'],
                key: 'properties.cm:author',
                editable: true
            }),
            new CardViewTextItemModel({
                label: 'CORE.METADATA.BASIC.DESCRIPTION',
                value: node.properties['cm:description'],
                key: 'properties.cm:description',
                multiline: true,
                editable: true
            })
        ];
    }
}
