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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { PresetConfig, NodesApiService } from '@alfresco/adf-content-services';
import { Node } from '@alfresco/js-api';

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'adf-properties-viewer-wrapper',
    templateUrl: './properties-viewer-wrapper.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PropertiesViewerWrapperComponent implements OnInit, OnChanges {

    node: Node;
    loading = true;

    @Input()
    nodeId: string;

    /** Toggles whether the edit button should be shown */
    @Input()
    editable;

    /** Toggles whether to display empty values in the card view */
    @Input()
    displayEmpty;

    /** Toggles between expanded (ie, full information) and collapsed
     * (ie, reduced information) in the display
     */
    @Input()
    expanded;

    /** The multi parameter of the underlying material expansion panel, set to true to allow multi accordion to be expanded at the same time */
    @Input()
    multi;

    /** Name or configuration of the metadata preset, which defines aspects and their properties */
    @Input()
    preset: string | PresetConfig;

    /** Toggles whether the metadata properties should be shown */
    @Input()
    displayDefaultProperties;

    /** (optional) shows the given aspect in the expanded  card */
    @Input()
    displayAspect: string = null;

    /** Toggles whether or not to enable copy to clipboard action. */
    @Input()
    copyToClipboardAction;

    /** Toggles whether or not to enable chips for multivalued properties. */
    @Input()
    useChipsForMultiValueProperty;

    @Output()
    nodeContentLoaded: EventEmitter<Node> = new EventEmitter();

    constructor(private nodesApiService: NodesApiService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['nodeId'] && changes['nodeId'].currentValue && !changes['nodeId'].isFirstChange()) {
            this.getNode(changes['nodeId'].currentValue);
        }
    }

    ngOnInit(): void {
        if (this.nodeId) {
            this.getNode(this.nodeId);
        }
    }

    private getNode(nodeId: string) {
        this.loading = true;
        this.nodesApiService.getNode(nodeId).subscribe(retrievedNode => {
            this.node = retrievedNode;
            this.loading = false;
            this.nodeContentLoaded.emit(retrievedNode);
        });
    }
}
