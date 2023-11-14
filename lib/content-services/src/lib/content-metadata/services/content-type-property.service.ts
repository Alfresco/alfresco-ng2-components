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
import { MatDialog } from '@angular/material/dialog';
import { CardViewItem, CardViewSelectItemModel, CardViewSelectItemOption, CardViewTextItemModel } from '@alfresco/adf-core';
import { Observable, of, Subject, zip } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ContentTypeDialogComponent } from '../../content-type/content-type-dialog.component';
import { ContentTypeDialogComponentData } from '../../content-type/content-type-metadata.interface';
import { ContentTypeService } from '../../content-type/content-type.service';
import { Node, Property, TypeEntry } from '@alfresco/js-api';
import { PropertyGroupTranslatorService } from './property-groups-translator.service';
import { VersionCompatibilityService } from '../../version-compatibility/version-compatibility.service';

@Injectable({
    providedIn: 'root'
})
export class ContentTypePropertiesService {

    constructor(private contentTypeService: ContentTypeService,
                private dialog: MatDialog,
                private versionCompatibilityService: VersionCompatibilityService,
                private propertyGroupTranslatorService: PropertyGroupTranslatorService) {
    }

    getContentTypeCardItem(node: Node): Observable<CardViewItem[]> {
        if (this.versionCompatibilityService.isVersionSupported('7')) {
            return this.contentTypeService.getContentTypeByPrefix(node.nodeType).
                pipe(
                    map((contentType) => {
                        const contentTypesOptions$ = this.getContentTypesAsSelectOption(contentType);
                        const contentTypeCard = this.buildContentTypeSelectCardModel(contentType.entry.id, contentTypesOptions$);
                        const filteredProperties =  this.getContentTypeSpecificProperties(contentType);
                        const propertiesCard = this.buildCardItemsFromPropertyList(filteredProperties, node.properties);
                        return [contentTypeCard, ...propertiesCard];
                    }));
        } else {
            return of([this.buildContentTypeTextCardModel(node.nodeType)]);
        }
    }

    buildCardItemsFromPropertyList(properties: Property[], currentProperties: any): CardViewItem[] {
        return properties.map((property) => {
            const propertyValue = currentProperties ? currentProperties[property.id] : null;
            return this.buildCardItemFromProperty(property, propertyValue);
        });
    }

    private buildCardItemFromProperty(property: Property, propertyValue: any): CardViewItem {
        return this.propertyGroupTranslatorService.translateProperty(property, propertyValue, true);
    }

    private getContentTypeSpecificProperties(contentType: TypeEntry): Property[] {
        return contentType.entry.properties.filter((property) => property.id.startsWith(contentType.entry.model.namespacePrefix));
    }

    private buildContentTypeTextCardModel(currentValue: string): CardViewTextItemModel {
        const contentTypeCard = new CardViewTextItemModel({
            label: 'CORE.METADATA.BASIC.CONTENT_TYPE',
            value: currentValue,
            key: 'nodeType',
            editable: false
        });

        return contentTypeCard;
    }

    private buildContentTypeSelectCardModel(currentValue: string, options$: Observable<CardViewSelectItemOption<string>[]>): CardViewSelectItemModel<string> {
        const contentTypeCard = new CardViewSelectItemModel({
            label: 'CORE.METADATA.BASIC.CONTENT_TYPE',
            value: currentValue,
            key: 'nodeType',
            editable: true,
            options$,
            displayNoneOption: false
        });

        return contentTypeCard;
    }

    private getContentTypesAsSelectOption(currentType: TypeEntry): Observable<CardViewSelectItemOption<string>[]> {
        const childrenTypes$ = this.contentTypeService.getContentTypeChildren(currentType.entry.id);
        return zip(childrenTypes$, of(currentType)).pipe(
            distinctUntilChanged(),
            map(([contentTypesEntries, currentContentType]) => {
                const updatedTypes = this.appendCurrentType(currentContentType, contentTypesEntries);
                return updatedTypes.map((contentType) => ({ key: contentType.entry.id, label: contentType.entry.title ?? contentType.entry.id }));
            }));
    }

    private appendCurrentType(currentType: TypeEntry, contentTypesEntries: TypeEntry[]): TypeEntry[] {
        const resultTypes = [...contentTypesEntries];
        const currentTypePresent = contentTypesEntries.find((type) => type.entry.id === currentType.entry.id);
        if (!currentTypePresent) {
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
            select,
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
