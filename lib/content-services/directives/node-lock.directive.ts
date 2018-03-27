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

import { Directive, ElementRef, Renderer2, HostListener, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodeActionsService } from "../document-list/services/node-actions.service";
import { ContentService, PermissionsEnum } from "@alfresco/adf-core";

@Directive({
    selector: '[adf-node-lock]'
})
export class NodeLockDirective implements AfterViewInit {

    @Input('adf-node-lock')
    node: MinimalNodeEntryEntity;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @HostListener('click', [ '$event' ])
    onClick(event) {
        event.preventDefault();
        if (this.node) {
            this.nodeActionsService.lockNode(this.node);
        }
    }

    constructor(
        public element: ElementRef,
        private nodeActionsService: NodeActionsService,
        private renderer: Renderer2,
        private contentService?: ContentService
    ) {}

    ngAfterViewInit() {
        const hasPermission = this.contentService.hasPermission(this.node, PermissionsEnum.LOCK);
        this.renderer.setProperty(this.element.nativeElement, 'disabled', !hasPermission);
    }
}
