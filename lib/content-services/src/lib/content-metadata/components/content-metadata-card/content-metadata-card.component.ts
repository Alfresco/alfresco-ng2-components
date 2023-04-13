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

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { NodeAspectService } from '../../../aspect-list/services/node-aspect.service';
import { PresetConfig } from '../../interfaces/content-metadata.interfaces';
import { VersionCompatibilityService } from '../../../version-compatibility/version-compatibility.service';
import { ContentService } from '../../../common/services/content.service';
import { AllowableOperationsEnum } from '../../../common/models/allowable-operations.enum';

@Component({
    selector: 'adf-content-metadata-card',
    templateUrl: './content-metadata-card.component.html',
    styleUrls: ['./content-metadata-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-content-metadata-card' }
})
export class ContentMetadataCardComponent implements OnChanges {

    /** (required) The node entity to fetch metadata about */
    @Input()
    node: Node;

    /** (optional) This flag displays/hides empty metadata
     * fields.
     */
    @Input()
    displayEmpty: boolean = false;

    /** (optional) This flag displays desired aspect when open for the first time
     * fields.
     */
    @Input()
    displayAspect: string = null;

    /** (required) Name or configuration of the metadata preset, which defines aspects
     * and their properties.
     */
    @Input()
    preset: string | PresetConfig;

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

    editAspectSupported = false;

    constructor(private contentService: ContentService, private nodeAspectService: NodeAspectService, private versionCompatibilityService: VersionCompatibilityService) {
        this.editAspectSupported = this.versionCompatibilityService.isVersionSupported('7');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.displayAspect && changes.displayAspect.currentValue) {
            this.expanded = true;
        }
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

    hasAllowableOperations() {
        return this.contentService.hasAllowableOperations(this.node, AllowableOperationsEnum.UPDATE);
    }

    openAspectDialog() {
        this.nodeAspectService.updateNodeAspects(this.node.id);
    }

    isEditAspectSupported(): boolean {
        return !this.readOnly && this.hasAllowableOperations() && this.editAspectSupported;
    }
}
