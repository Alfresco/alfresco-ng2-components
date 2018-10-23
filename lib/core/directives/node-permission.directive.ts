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

/* tslint:disable:no-input-rename  */

import { ChangeDetectorRef, Directive, ElementRef, Host, Inject, Input, OnChanges, Optional, Renderer2,  SimpleChanges } from '@angular/core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { ContentService } from './../services/content.service';
import { EXTENDIBLE_COMPONENT } from './../interface/injection.tokens';

export interface NodePermissionSubject {
    disabled: boolean;
}

@Directive({
    selector: '[adf-node-permission]'
})
export class NodePermissionDirective implements OnChanges {

    /** Node permission to check (create, delete, update, updatePermissions,
     * !create, !delete, !update, !updatePermissions).
     */
    @Input('adf-node-permission')
    permission: string  = null;

    /** Nodes to check permission for. */
    @Input('adf-nodes')
    nodes: MinimalNodeEntity[] = [];

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2,
                private contentService: ContentService,
                private changeDetector: ChangeDetectorRef,

                @Host()
                @Optional()
                @Inject(EXTENDIBLE_COMPONENT) private parentComponent?: NodePermissionSubject) {
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
    updateElement(): boolean {
        let enable = this.hasPermission(this.nodes, this.permission);

        if (enable) {
            this.enable();
        } else {
            this.disable();
        }

        return enable;
    }

    private enable(): void {
        if (this.parentComponent) {
            this.parentComponent.disabled = false;
            this.changeDetector.detectChanges();
        } else {
            this.enableElement();
        }
    }

    private disable(): void {
        if (this.parentComponent) {
            this.parentComponent.disabled = true;
            this.changeDetector.detectChanges();
        } else {
            this.disableElement();
        }
    }

    /**
     * Enables decorated element
     *
     * @memberof NodePermissionDirective
     */
    enableElement(): void {
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
    }

    /**
     * Disables decorated element
     *
     * @memberof NodePermissionDirective
     */
    disableElement(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
    }

    /**
     * Checks whether all nodes have a particular permission
     *
     * @param  nodes Node collection to check
     * @param  permission Permission to check for each node
     * @memberof NodePermissionDirective
     */
    hasPermission(nodes: MinimalNodeEntity[], permission: string): boolean {
        if (nodes && nodes.length > 0) {
            return nodes.every(node => this.contentService.hasPermission(node.entry, permission));
        }

        return false;
    }
}
