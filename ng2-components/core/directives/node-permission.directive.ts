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

import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { ContentService } from './../services/content.service';

export interface NodePermissionSubject {
    disabled: boolean;
}

@Directive({
    selector: '[adf-node-permission]'
})
export class NodePermissionDirective implements OnChanges {

    @Input('adf-node-permission')
    permission: string = null;

    @Input('adf-nodes')
    nodes: MinimalNodeEntity[] = [];

    constructor(private elementRef: ElementRef,
                private contentService: ContentService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nodes && !changes.nodes.firstChange) {
            this.updateElement();
        }
    }

    /**
     * Updates disabled state for the decorated element
     *
     * @memberof NodePermissionDirective
     */
    updateElement(): void {
        let hasPermission = this.hasPermission(this.nodes, this.permission);
        this.setDisableAttribute(!hasPermission);
    }

    private setDisableAttribute(disable: boolean) {
        this.elementRef.nativeElement.disabled = disable;
    }

    /**
     * Checks whether all nodes have a particular permission
     *
     * @param {MinimalNodeEntity[]} nodes Node collection to check
     * @param {string} permission Permission to check for each node
     * @returns {boolean} True if all nodes have provided permission, otherwise False
     * @memberof NodePermissionDirective
     */
    hasPermission(nodes: MinimalNodeEntity[], permission: string): boolean {
        if (nodes && nodes.length > 0) {
            return nodes.every(node => this.contentService.hasPermission(node.entry, permission));
        }

        return false;
    }

}
