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

/* eslint-disable @angular-eslint/no-input-rename */

import { Directive, ElementRef, Renderer2, HostListener, Input, AfterViewInit } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { ContentService } from '../common/services/content.service';
import { AllowableOperationsEnum } from '../common/models/allowable-operations.enum';
import { ContentNodeDialogService } from '../content-node-selector/content-node-dialog.service';

@Directive({
    selector: '[adf-node-lock]'
})
export class NodeLockDirective implements AfterViewInit {

    /** Node to lock/unlock. */
    @Input('adf-node-lock')
    node: Node;

    @HostListener('click', [ '$event' ])
    onClick(event) {
        event.stopPropagation();
        this.contentNodeDialogService.openLockNodeDialog(this.node);
    }

    constructor(
        public element: ElementRef,
        private renderer: Renderer2,
        private contentService: ContentService,
        private contentNodeDialogService: ContentNodeDialogService
    ) {}

    ngAfterViewInit() {
        const hasAllowableOperations = this.contentService.hasAllowableOperations(this.node, AllowableOperationsEnum.LOCK);
        this.renderer.setProperty(this.element.nativeElement, 'disabled', !hasAllowableOperations);
    }
}
