/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { trigger } from '@angular/animations';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { contextMenuAnimation } from './animations';
import { CONTEXT_MENU_DATA } from './context-menu.tokens';
import { AfterViewInit, Component, HostListener, Inject, Optional, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';

@Component({
    selector: 'adf-context-menu',
    templateUrl: './context-menu-list.component.html',
    styleUrls: ['./context-menu-list.component.scss'],
    host: {
        role: 'menu',
        class: 'adf-context-menu'
    },
    encapsulation: ViewEncapsulation.None,
    imports: [MatIconModule, MatMenuModule, NgForOf, NgIf, TranslatePipe],
    animations: [trigger('panelAnimation', contextMenuAnimation)]
})
export class ContextMenuListComponent implements AfterViewInit {
    private keyManager: FocusKeyManager<MatMenuItem>;
    @ViewChildren(MatMenuItem) items: QueryList<MatMenuItem>;
    links: any[];

    @HostListener('document:keydown.Escape', ['$event'])
    handleKeydownEscape(event: KeyboardEvent) {
        if (event) {
            this.contextMenuOverlayRef.close();
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeydownEvent(event: KeyboardEvent) {
        if (event) {
            const keyCode = event.keyCode;
            if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
                this.keyManager.onKeydown(event);
            }
        }
    }

    constructor(
        @Inject(ContextMenuOverlayRef) private contextMenuOverlayRef: ContextMenuOverlayRef,
        @Optional() @Inject(CONTEXT_MENU_DATA) private data: any
    ) {
        this.links = this.data;
    }

    onMenuItemClick(event: Event, menuItem: any) {
        if (menuItem?.model?.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }

        menuItem.subject.next(menuItem);
        this.contextMenuOverlayRef.close();
    }

    ngAfterViewInit() {
        this.keyManager = new FocusKeyManager<MatMenuItem>(this.items);
        this.keyManager.setFirstItemActive();
    }
}
