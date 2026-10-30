/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    OnInit,
    output,
    Renderer2,
    signal,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { PathElement } from '@alfresco/js-api';
import { MatButton } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataRow, DragDropStateService } from '@alfresco/adf-core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatListItem, MatListItemIcon, MatListItemLine, MatListItemMeta, MatListItemTitle, MatNavList } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkScrollable } from '@angular/cdk/scrolling';

interface PathElementWithState {
    node: PathElement;
    current: boolean;
    libraryContainer: boolean;
    description: string;
}

@Component({
    selector: 'adf-compact-breadcrumb',
    templateUrl: './compact-breadcrumb.component.html',
    styleUrls: ['./compact-breadcrumb.component.scss'],
    host: {
        '(document:keydown.escape)': 'closeMenu()'
    },
    imports: [
        MatButton,
        TranslatePipe,
        CdkDropList,
        CdkDropListGroup,
        CdkDrag,
        CdkTrapFocus,
        MatIcon,
        MatNavList,
        MatListItem,
        MatListItemIcon,
        MatListItemTitle,
        MatListItemLine,
        MatListItemMeta,
        NgOptimizedImage,
        CdkScrollable
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompactBreadcrumbComponent implements OnInit, AfterViewInit {
    protected readonly dragDropStateService = inject(DragDropStateService);

    private readonly renderer = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translateService = inject(TranslateService);

    /** The nodes to display in the breadcrumb. */
    readonly nodes = input.required<PathElementWithState[], PathElement[]>({
        transform: (nodes) => {
            let indexOffset = 0;
            return nodes.map((node, index) => {
                const current = index === nodes.length - 1;
                const libraryContainer = nodes[index + 1]?.nodeType === 'st:site';
                if (libraryContainer) {
                    indexOffset = 1;
                }
                return {
                    node,
                    current,
                    libraryContainer,
                    description: this.getLevelDescription(nodes, index, current, libraryContainer, indexOffset)
                };
            });
        }
    });
    /** If true, the breadcrumb menu will be displayed in full width. */
    readonly fullWidth = input(false);

    /** Emitted when dragged item is dropped onto the breadcrumb. Emits drag and drop event. */
    readonly dropped = output<CdkDragDrop<PathElement, PathElement, DataRow>>();
    /** Emitted when a breadcrumb item is clicked and navigation is triggered. Emits the PathElement of the clicked item. */
    readonly navigate = output<PathElement>();

    private readonly menuTrigger = viewChild.required<ElementRef<HTMLButtonElement>, ElementRef<HTMLButtonElement>>('menuTrigger', {
        read: ElementRef
    });
    private readonly menu = viewChild.required<ElementRef<HTMLButtonElement>, ElementRef<HTMLDivElement>>('menu', { read: ElementRef });
    private readonly backdrop = viewChild.required<ElementRef<HTMLButtonElement>, ElementRef<HTMLDivElement>>('backdrop', { read: ElementRef });
    private readonly trapFocus = viewChild.required(CdkTrapFocus);

    protected readonly menuOpen = signal(false);
    protected readonly hoveredItem = signal<PathElementWithState>(undefined);
    protected readonly parentsCounter = computed(() => this.nodes().filter((node) => !node.current && !node.libraryContainer).length);
    protected readonly suppressHoverOpen = signal(false);

    private removeOutsideClickListener: () => void;
    private openMenuTimer: NodeJS.Timeout;
    private closeMenuTimer: NodeJS.Timeout;

    constructor() {
        effect(() => {
            if (!this.dragDropStateService.dragging()) {
                untracked(() => this.closeMenu());
            }
        });
    }

    ngOnInit(): void {
        this.destroyRef.onDestroy(() => {
            this.removeOutsideClickListener?.();
            this.stopOpeningMenu();
            this.stopClosingMenu();
            this.menu().nativeElement.remove();
            this.backdrop().nativeElement.remove();
        });
    }

    ngAfterViewInit(): void {
        this.renderer.appendChild(document.body, this.backdrop().nativeElement);
        this.renderer.appendChild(document.body, this.menu().nativeElement);
        this.updateMenuPosition();
    }

    toggleMenu(event: MouseEvent): void {
        if (!this.dragDropStateService.keyboardDraggingData()) {
            this.menuOpen() ? this.closeMenu() : this.openMenu();
            this.menu().nativeElement.classList.toggle('adf-compact-breadcrumb-menu-open', this.menuOpen());
            event.stopPropagation();
        }
    }

    onTriggerMouseEnter(): void {
        if (this.suppressHoverOpen() || this.dragDropStateService.keyboardDraggingData()) {
            return;
        }
        this.openMenuTimer = setTimeout(() => {
            if (this.dragDropStateService.dragging()) {
                this.openMenu();
                this.closeOnMenuLeave(2000, true);
            }
        }, 500);
    }

    onDrop(event: CdkDragDrop<PathElement, PathElement, DataRow>): void {
        if (this.isRouteEnabled(this.hoveredItem()) && event.isPointerOverContainer) {
            this.dropped.emit(event);
        }
    }

    onRouteSelection(nodeWithState: PathElementWithState, event: Event): void {
        if (event instanceof MouseEvent) {
            event.preventDefault();
        }
        if (this.isRouteEnabled(nodeWithState) && !this.dragDropStateService.dragging()) {
            this.navigate.emit(nodeWithState.node);
            this.closeMenu();
        }
    }

    setNodeHoverState(nodeWithState: PathElementWithState): void {
        this.hoveredItem.set(nodeWithState);
        if (this.isRouteEnabled(this.hoveredItem()) || !nodeWithState) {
            this.dragDropStateService.hoveredDropName.set(nodeWithState?.node?.name);
        }
    }

    closeOnMenuLeave(delay = 600, suppressHoverOpen = false): void {
        this.closeMenuTimer = setTimeout(() => {
            this.closeMenu();
            if (suppressHoverOpen) {
                this.suppressHoverOpen.set(true);
            }
        }, delay);
    }

    stopClosingMenu(): void {
        clearTimeout(this.closeMenuTimer);
    }

    onKeyboardNodeDrop(node: PathElement): void {
        if (this.dragDropStateService.dragging()) {
            this.dropped.emit({
                item: {
                    data: {
                        id: this.dragDropStateService.keyboardDraggingData()
                    }
                },
                container: {
                    data: node
                }
            } as CdkDragDrop<PathElement, PathElement, DataRow>);
            this.dragDropStateService.dragging.set(false);
        }
    }

    isRouteEnabled(route: PathElementWithState): boolean {
        return route && !route.current && !route.libraryContainer;
    }

    closeMenu(): void {
        if (this.menuOpen()) {
            this.menuTrigger().nativeElement.focus();
        }
        this.menuOpen.set(false);
        this.removeOutsideClickListener?.();
        this.removeOutsideClickListener = null;
    }

    private stopOpeningMenu(): void {
        clearTimeout(this.openMenuTimer);
    }

    private getLevelDescription(nodes: PathElement[], nodeIndex: number, current: boolean, libraryContainer: boolean, indexOffset = 0): string {
        if (current) {
            return this.translateService.instant('BREADCRUMB.COMPACT_MENU.CURRENT_LEVEL');
        } else if (libraryContainer) {
            return this.translateService.instant('BREADCRUMB.COMPACT_MENU.LIBRARY_CONTAINER_LEVEL');
        }
        const name = nodes[nodeIndex - 1]?.name;
        const library = nodes[nodeIndex]?.nodeType === 'st:site';
        const translationKey = library ? 'BREADCRUMB.COMPACT_MENU.FIRST_LEVEL_LIBRARY' : 'BREADCRUMB.COMPACT_MENU.FIRST_LEVEL';
        return name && !library
            ? this.translateService.instant('BREADCRUMB.COMPACT_MENU.NOT_FIRST_LEVEL', {
                  level: nodeIndex + 1 - indexOffset,
                  ancestorName: this.translateService.instant(name)
              })
            : this.translateService.instant(translationKey);
    }

    private openMenu(): void {
        this.updateMenuPosition();
        this.menuOpen.set(true);
        this.listenForOutsideClicks();
        void this.trapFocus().focusTrap.focusFirstTabbableElementWhenReady();
    }

    private listenForOutsideClicks(): void {
        this.removeOutsideClickListener?.();
        const handleOutsideClick = (event: MouseEvent): void => {
            const target = event.target as HTMLElement;
            if (!this.menuTrigger().nativeElement.contains(target) && !this.menu().nativeElement.contains(target)) {
                event.stopPropagation();
                event.preventDefault();
                this.closeMenu();
            }
        };
        document.addEventListener('click', handleOutsideClick, true);
        this.removeOutsideClickListener = () => document.removeEventListener('click', handleOutsideClick, true);
    }

    private updateMenuPosition(): void {
        const triggerRect = this.menuTrigger().nativeElement.getBoundingClientRect();
        const menuElement = this.menu().nativeElement;
        menuElement.style.top = `${triggerRect.bottom}px`;
        menuElement.style.left = this.fullWidth() ? '0' : `${triggerRect.left}px`;
    }
}
