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

import { Component, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { ContentService, AllowableOperationsEnum } from '@alfresco/adf-core';
import { ContentMetadataComponent } from '../content-metadata/content-metadata.component';
import { NodeAspectService } from '../../../aspect-list/node-aspect.service';
@Component({
    selector: 'adf-content-metadata-card',
    templateUrl: './content-metadata-card.component.html',
    styleUrls: ['./content-metadata-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-content-metadata-card' }
})
export class ContentMetadataCardComponent implements OnChanges {

    @ViewChild('contentmetadata')
    contentMetadataComponent: ContentMetadataComponent;

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

    aspectDialog: boolean = false;

    expanded: boolean;

    constructor(private contentService: ContentService, private nodeAspectService: NodeAspectService) {
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
}
