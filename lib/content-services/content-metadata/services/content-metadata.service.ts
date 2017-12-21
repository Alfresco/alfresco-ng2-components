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
import { PropertyDescriptorsService } from './property-descriptors.service';
import { BasicPropertiesService } from './basic-properties.service';
import { CardViewItemProperties, CardViewItem, CardViewTextItemModel, CardViewDateItemModel, LogService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { AspectProperty, CardViewAspect } from '../interfaces/content-metadata.interfaces';

const D_TEXT = 'd:text';
const D_MLTEXT = 'd:mltext';
const D_DATE = 'd:date';
// const D_DATETIME = 'd:datetime';
// const D_INT = 'd:int';
// const D_LONG = 'd:long';
// const D_FLOAT = 'd:float';
// const D_DOUBLE = 'd:double';
// const D_BOOLEAN = 'd:boolean';
const RECOGNISED_ECM_TYPES = [ D_TEXT, D_MLTEXT, D_DATE/*, D_DATETIME, D_INT, D_LONG, D_FLOAT, D_DOUBLE, D_BOOLEAN*/ ];

@Injectable()
export class ContentMetadataService {

    constructor(private basicPropertiesService: BasicPropertiesService,
                private propertyDescriptorsService: PropertyDescriptorsService,
                private logService: LogService) {}

    getBasicProperties(node: MinimalNodeEntryEntity): Observable<CardViewItem[]> {
        return Observable.of(this.basicPropertiesService.getBasicProperties(node));
    }

    getAspectProperties(node: MinimalNodeEntryEntity): Observable<CardViewAspect[]> {
        return this.propertyDescriptorsService.getAspects(node)
            .map(aspects => aspects.map(aspect => Object.assign({}, aspect, { properties: this.translateProperties(aspect.properties, node.properties) })));
    }

    private translateProperties(aspectProperties: AspectProperty[], nodeProperties: any): CardViewItem[] {
        return aspectProperties.map((aspectProperty) => this.translateProperty(aspectProperty, nodeProperties[aspectProperty.name]));
    }

    private translateProperty(aspectProperty: AspectProperty, nodeProperty: any): CardViewItem {
        this.checkECMTypeValidity(aspectProperty.dataType);

        let propertyDefinition: CardViewItemProperties = {
            label: aspectProperty.title,
            value: nodeProperty,
            key: this.getAspectPropertyKey(aspectProperty.name),
            default: aspectProperty.defaultValue,
            editable: true
        };
        let property;

        switch (aspectProperty.dataType) {

            case D_MLTEXT:
                property = new CardViewTextItemModel(Object.assign(propertyDefinition, {
                    multiline: true
                }));
                break;

            case D_DATE:
                property = new CardViewDateItemModel(propertyDefinition);
                break;

            case D_TEXT:
            default:
                property = new CardViewTextItemModel(Object.assign(propertyDefinition, {
                    multiline: false
                }));
        }

        return property;
    }

    private checkECMTypeValidity(ecmPropertyType) {
        if (RECOGNISED_ECM_TYPES.indexOf(ecmPropertyType) === -1) {
            this.logService.error(`Unknown type for mapping: ${ecmPropertyType}`);
        }
    }

    private getAspectPropertyKey(propertyName) {
        return `properties.${propertyName}`;
    }
}
