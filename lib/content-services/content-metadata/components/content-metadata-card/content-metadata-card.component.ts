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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ContentService, PermissionsEnum } from '@alfresco/adf-core';

@Component({
    selector: 'adf-content-metadata-card',
    templateUrl: './content-metadata-card.component.html',
    styleUrls: ['./content-metadata-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-content-metadata-card' }
})
export class ContentMetadataCardComponent {
    /** (required) The node entity to fetch metadata about */
    @Input()
    node: MinimalNodeEntryEntity;

    /** (optional) This flag displays/hides empty metadata
     * fields.
     */
    @Input()
    displayEmpty: boolean = false;

    /** (required) Name of the metadata preset, which defines aspects
     * and their properties.
     */
    @Input()
    preset: string;

    /** (optional) This flag sets the metadata in read only mode
     * preventing changes.
     */
    @Input()
    readOnly = false;

    /** (optional) This flag allows the component to display more
     * than one accordion at a time.
     */
    @Input()
    multi = false;

    private _displayDefaultProperties: boolean = true;

    /** (optional) This flag displays/hides the metadata
     * properties.
     */
    @Input()
    set displayDefaultProperties(value: boolean) {
        this._displayDefaultProperties = value;
        this.onDisplayDefaultPropertiesChange();
    }

    get displayDefaultProperties(): boolean {
        return this._displayDefaultProperties;
    }

    editable: boolean = false;

    expanded: boolean;

    constructor(private contentService: ContentService) {
    }

    onDisplayDefaultPropertiesChange(): void {
        this.expanded = !this._displayDefaultProperties;
    }

    toggleEdit(): void {
        this.editable = !this.editable;
    }

    toggleExpanded(): void {
        this.expanded = !this.expanded;
    }

    hasPermission() {
        return this.contentService.hasPermission(this.node, PermissionsEnum.UPDATE);
    }
}
