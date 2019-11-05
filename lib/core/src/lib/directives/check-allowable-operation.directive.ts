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

/* tslint:disable:no-input-rename  */

import { ChangeDetectorRef, Directive, ElementRef, Host, Inject, Input, OnChanges, Optional, Renderer2,  SimpleChanges } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { ContentService } from './../services/content.service';
import { EXTENDIBLE_COMPONENT } from './../interface/injection.tokens';

export interface NodeAllowableOperationSubject {
    disabled: boolean;
}

@Directive({
    selector: '[adf-check-allowable-operation]'
})
export class CheckAllowableOperationDirective implements OnChanges {

    /** Node permission to check (create, delete, update, updatePermissions,
     * !create, !delete, !update, !updatePermissions).
     */
    @Input('adf-check-allowable-operation')
    permission: string  = null;

    /** Nodes to check permission for. */
    @Input('adf-nodes')
    nodes: NodeEntry[] = [];

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2,
                private contentService: ContentService,
                private changeDetector: ChangeDetectorRef,

                @Host()
                @Optional()
                @Inject(EXTENDIBLE_COMPONENT) private parentComponent?: NodeAllowableOperationSubject) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nodes && !changes.nodes.firstChange) {
            this.updateElement();
        }
    }

    /**
     * Updates disabled state for the decorated element
     *
     * @memberof CheckAllowableOperationDirective
     */
    updateElement(): boolean {
        const enable = this.hasAllowableOperations(this.nodes, this.permission);

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
     * @memberof CheckAllowableOperationDirective
     */
    enableElement(): void {
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
    }

    /**
     * Disables decorated element
     *
     * @memberof CheckAllowableOperationDirective
     */
    disableElement(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
    }

    /**
     * Checks whether all nodes have a particular permission
     *
     * @param  nodes Node collection to check
     * @param  permission Permission to check for each node
     * @memberof CheckAllowableOperationDirective
     */
    hasAllowableOperations(nodes: NodeEntry[], permission: string): boolean {
        if (nodes && nodes.length > 0) {
            return nodes.every((node) => this.contentService.hasAllowableOperations(node.entry, permission));
        }

        return false;
    }
}
