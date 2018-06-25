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

import { Directive, ElementRef, Renderer2, HostListener, Input, AfterViewInit } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { PermissionsEnum, ContentService } from '@alfresco/adf-core';
import { ContentNodeDialogService } from '../content-node-selector/content-node-dialog.service';

@Directive({
    selector: '[adf-node-lock]'
})
export class NodeLockDirective implements AfterViewInit {

    /** Node to lock/unlock. */
    @Input('adf-node-lock')
    node: MinimalNodeEntryEntity;

    @HostListener('click', [ '$event' ])
    onClick(event) {
        event.preventDefault();
        this.contentNodeDialogService.openLockNodeDialog(this.node);
    }

    constructor(
        public element: ElementRef,
        private renderer: Renderer2,
        private contentService: ContentService,
        private contentNodeDialogService: ContentNodeDialogService
    ) {}

    ngAfterViewInit() {
        const hasPermission = this.contentService.hasPermission(this.node, PermissionsEnum.LOCK);
        this.renderer.setProperty(this.element.nativeElement, 'disabled', !hasPermission);
    }
}
