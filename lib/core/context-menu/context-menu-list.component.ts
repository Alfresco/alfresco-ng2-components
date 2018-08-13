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

import {
    Component, ViewEncapsulation, HostListener, AfterViewInit,
    Optional, Inject, QueryList, ViewChildren
} from '@angular/core';
import { trigger } from '@angular/animations';
import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { MatMenuItem } from '@angular/material';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { contextMenuAnimation } from './animations';
import { CONTEXT_MENU_DATA } from './context-menu.tokens';

@Component({
    selector: 'adf-context-menu',
    template: `
    <div mat-menu class="mat-menu-panel" @panelAnimation>
        <div class="mat-menu-content">
            <ng-container *ngFor="let link of links">
                <button *ngIf="link.model?.visible"
                        mat-menu-item
                        [disabled]="link.model?.disabled"
                        (click)="onMenuItemClick($event, link)">
                    <mat-icon *ngIf="link.model?.icon">{{ link.model.icon }}</mat-icon>
                    <span data-automation-id="contextmenu-item-title">{{ (link.title || link.model?.title) | translate }}</span>
                </button>
            </ng-container>
        </div>
    </div>
    `,
    host: {
        role: 'menu',
        class: 'adf-context-menu'
    },
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('panelAnimation', contextMenuAnimation)
    ]
})
export class ContextMenuListComponent implements AfterViewInit {
    private _keyManager: FocusKeyManager<MatMenuItem>;
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
                this._keyManager.onKeydown(event);
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
        if (menuItem && menuItem.model && menuItem.model.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }

        menuItem.subject.next(menuItem);
        this.contextMenuOverlayRef.close();
    }

    ngAfterViewInit() {
        this._keyManager = new FocusKeyManager<MatMenuItem>(this.items);
        this._keyManager.setFirstItemActive();
    }
}
