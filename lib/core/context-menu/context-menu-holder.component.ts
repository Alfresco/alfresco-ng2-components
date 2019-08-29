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

import { OverlayContainer } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Component, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Subscription } from 'rxjs';
import { ContextMenuService } from './context-menu.service';

@Component({
    selector: 'adf-context-menu-holder',
    template: `
        <button mat-button [matMenuTriggerFor]="contextMenu"></button>
        <mat-menu #contextMenu="matMenu" class="context-menu">
            <ng-container *ngFor="let link of links">
                <button *ngIf="link.model?.visible"
                        [attr.data-automation-id]="'context-'+((link.title || link.model?.title) | translate)"
                        mat-menu-item
                        [disabled]="link.model?.disabled"
                        (click)="onMenuItemClick($event, link)">
                    <mat-icon *ngIf="showIcons && link.model?.icon">{{ link.model.icon }}</mat-icon>
                    {{ (link.title || link.model?.title) | translate }}
                </button>
            </ng-container>
        </mat-menu>
    `
})
export class ContextMenuHolderComponent implements OnInit, OnDestroy {
    links = [];

    private mouseLocation: { left: number, top: number } = { left: 0, top: 0 };
    private menuElement = null;
    private subscriptions: Subscription[] = [];
    private contextMenuListenerFn: () => void;

    @Input()
    showIcons: boolean = false;

    @ViewChild(MatMenuTrigger)
    menuTrigger: MatMenuTrigger;

    @HostListener('contextmenu', ['$event'])
    onShowContextMenu(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
    }

    @HostListener('window:resize')
    onResize() {
        if (this.mdMenuElement) {
            this.updatePosition();
        }
    }

    constructor(
        private viewport: ViewportRuler,
        private overlayContainer: OverlayContainer,
        private contextMenuService: ContextMenuService,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.contextMenuService.show.subscribe((mouseEvent) => this.showMenu(mouseEvent.event, mouseEvent.obj)),

            this.menuTrigger.menuOpened.subscribe(() => {
                const container = this.overlayContainer.getContainerElement();
                if (container) {
                    this.contextMenuListenerFn = this.renderer.listen(container, 'contextmenu', (contextmenuEvent: Event) => {
                        contextmenuEvent.preventDefault();
                    });
                }
                this.menuElement = this.getContextMenuElement();
            }),

            this.menuTrigger.menuClosed.subscribe(() => {
                this.menuElement = null;
                if (this.contextMenuListenerFn) {
                    this.contextMenuListenerFn();
                }
            })
        );
    }

    ngOnDestroy() {
        if (this.contextMenuListenerFn) {
            this.contextMenuListenerFn();
        }

        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];

        this.menuElement = null;
    }

    onMenuItemClick(event: Event, menuItem: any): void {
        if (menuItem && menuItem.model && menuItem.model.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        menuItem.subject.next(menuItem);
    }

    showMenu(mouseEvent, links) {
        this.links = links;

        if (mouseEvent) {
            this.mouseLocation = {
                left: mouseEvent.clientX,
                top: mouseEvent.clientY
            };
        }

        this.menuTrigger.openMenu();

        if (this.mdMenuElement) {
            this.updatePosition();
        }
    }

    get mdMenuElement() {
        return this.menuElement;
    }

    private locationCss() {
        return {
            left: this.mouseLocation.left + 'px',
            top: this.mouseLocation.top + 'px'
        };
    }

    private updatePosition() {
        setTimeout(() => {
            if (this.mdMenuElement.parentElement) {
                if (this.mdMenuElement.clientWidth + this.mouseLocation.left > this.viewport.getViewportRect().width) {
                    this.menuTrigger.menu.xPosition = 'before';
                    this.mdMenuElement.parentElement.style.left = this.mouseLocation.left - this.mdMenuElement.clientWidth + 'px';
                } else {
                    this.menuTrigger.menu.xPosition = 'after';
                    this.mdMenuElement.parentElement.style.left = this.locationCss().left;
                }

                if (this.mdMenuElement.clientHeight + this.mouseLocation.top > this.viewport.getViewportRect().height) {
                    this.menuTrigger.menu.yPosition = 'above';
                    this.mdMenuElement.parentElement.style.top = this.mouseLocation.top - this.mdMenuElement.clientHeight + 'px';
                } else {
                    this.menuTrigger.menu.yPosition = 'below';
                    this.mdMenuElement.parentElement.style.top = this.locationCss().top;
                }
            }
        }, 0);
    }

    private getContextMenuElement() {
        return this.overlayContainer.getContainerElement().querySelector('.context-menu');
    }
}
