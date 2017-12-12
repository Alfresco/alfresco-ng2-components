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
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContentMetadataService {

    constructor(private appConfigService: AppConfigService,
                private fileSizePipe: FileSizePipe,
                private aspectPropertiesService: AspectPropertiesService) {}

    getAspects(node: MinimalNodeEntryEntity, preset: string = 'default'): Observable<any> {

        const whiteListedAspects = this.getWhiteListByPreset(preset);

        return this.loadAspects(whiteListedAspects, node.aspectNames)
            .map(this.filterByWhitelist.bind(this, whiteListedAspects));
    }

    private getWhiteListByPreset(preset: string): any[] {
        let whiteListedAspects = this.appConfigService.config['content-metadata'].presets[preset];

        if (!whiteListedAspects) {
            throw new Error(`No content-metadata preset for: ${preset}`);
        }

        return whiteListedAspects;
    }

    private loadAspects(whiteListedAspects: object, nodeAspectNames: string[]): Observable<any> {
        const whiteListedAspectNames = Object.keys(whiteListedAspects);
        const aspectsToLoad = nodeAspectNames.filter(
            (aspectName) => whiteListedAspectNames.indexOf(aspectName) !== -1
        );

        return this.aspectPropertiesService.load(aspectsToLoad);
    }

    private filterByWhitelist(whiteListedAspects: object, aspectDescriptors: object) {
        const whiteListedAspectNames = Object.keys(whiteListedAspects);
        const aspectNames = Object.keys(aspectDescriptors);

        return whiteListedAspectNames
            .filter(whiteListedAspectName => aspectNames.indexOf(whiteListedAspectName) !== -1)
            .reduce((accumulator, aspectName) => {
                const whiteListedPropertyNames = whiteListedAspects[aspectName];

                return whiteListedPropertyNames.reduce((properties, propertyName) => {
                    return Object.assign(properties, {
                        [propertyName]: aspectDescriptors[aspectName].properties[propertyName]
                    });
                }, accumulator);
            }, {});
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
