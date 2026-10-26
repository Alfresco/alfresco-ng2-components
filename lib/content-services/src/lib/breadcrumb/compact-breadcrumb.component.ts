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
    Component,
    computed,
    DestroyRef, effect,
    ElementRef,
    inject,
    input,
    OnInit,
    output,
    Renderer2,
    signal,
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
        MatIcon,
        MatNavList,
        MatListItem,
        MatListItemIcon,
        MatListItemTitle,
        MatListItemLine,
        MatListItemMeta,
        NgOptimizedImage
    ],
    encapsulation: ViewEncapsulation.None
})
export class CompactBreadcrumbComponent implements OnInit, AfterViewInit {
    protected readonly dragDropStateService = inject(DragDropStateService);
    private readonly renderer = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translateService = inject(TranslateService);

    readonly nodes = input<PathElement[]>([]);

    /** Emitted when dragged item is dropped onto the breadcrumb. Emits drag and drop event. */
    dropped = output<CdkDragDrop<PathElement, PathElement, DataRow>>();
    navigate = output<PathElement>();

    private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>, ElementRef<HTMLButtonElement>>('trigger', { read: ElementRef });
    private readonly menu = viewChild.required<ElementRef<HTMLButtonElement>, ElementRef<HTMLDivElement>>('menu', { read: ElementRef });
    private readonly backdrop = viewChild.required<ElementRef<HTMLButtonElement>, ElementRef<HTMLDivElement>>('backdrop', { read: ElementRef });

    protected readonly menuOpen = signal(false);
    protected readonly levelsDescriptions = computed(() => this.nodes().map((_, index) => this.getLevelDescription(index)));

    private removeOutsideClickListener: () => void;

    protected readonly hoveredItem = signal<PathElement>(undefined);

    private openMenuTimer: NodeJS.Timeout;
    private closeMenuTimer: NodeJS.Timeout;

    constructor() {
        effect(() => {
            if (!this.dragDropStateService.dragging()) {
                this.closeMenu();
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

    toggleMenu(): void {
        this.menuOpen() ? this.closeMenu() : this.openMenu();
        this.menu().nativeElement.classList.toggle('adf-compact-breadcrumb-menu-open', this.menuOpen());
    }

    onTriggerMouseEnter(): void {
        this.openMenuTimer = setTimeout(() => {
            if (this.dragDropStateService.dragging()) {
                this.openMenu();
            }
        }, 500);
    }

    stopOpeningMenu(): void {
        clearTimeout(this.openMenuTimer);
    }

    onDrop(event: CdkDragDrop<PathElement, PathElement, DataRow>): void {
        if (this.isRouteEnabled()) {
            this.dropped.emit(event);
        }
    }

    onRouteClick(node: PathElement, event: MouseEvent): void {
        if (event instanceof MouseEvent) {
            event.preventDefault();
        }
        if (this.isRouteEnabled()) {
            this.navigate.emit(node);
            this.closeMenu();
        }
    }

    setNodeHoverState(node: PathElement): void {
        this.hoveredItem.set(node);
        this.dragDropStateService.hoveredDropName.set(node?.name);
    }

    closeOnMenuLeave(): void {
        this.closeMenuTimer = setTimeout(() => {
            this.closeMenu();
        }, 600);
    }

    stopClosingMenu(): void {
        clearTimeout(this.closeMenuTimer);
    }

    protected closeMenu(): void {
        this.menuOpen.set(false);
        this.removeOutsideClickListener?.();
        this.removeOutsideClickListener = null;
    }

    private getLevelDescription(nodeIndex: number): string {
        if (nodeIndex === this.nodes().length - 1) {
            return this.translateService.instant('BREADCRUMB.COMPACT_MENU.CURRENT_LEVEL');
        }
        const name = this.nodes()[nodeIndex - 1]?.name;
        return name
            ? this.translateService.instant('BREADCRUMB.COMPACT_MENU.NOT_FIRST_LEVEL', {
                  level: nodeIndex + 1,
                  ancestorName: this.translateService.instant(name)
              })
            : this.translateService.instant('BREADCRUMB.COMPACT_MENU.FIRST_LEVEL');
    }

    private openMenu(): void {
        this.updateMenuPosition();
        this.menuOpen.set(true);
        this.listenForOutsideClicks();
    }

    private listenForOutsideClicks(): void {
        this.removeOutsideClickListener?.();
        const handleOutsideClick = (event: MouseEvent): void => {
            const target = event.target as HTMLElement;
            if (!this.trigger().nativeElement.contains(target) && !this.menu().nativeElement.contains(target)) {
                event.stopPropagation();
                event.preventDefault();
                this.closeMenu();
            }
        };
        document.addEventListener('click', handleOutsideClick, true);
        this.removeOutsideClickListener = () => document.removeEventListener('click', handleOutsideClick, true);
    }

    private updateMenuPosition(): void {
        const triggerRect = this.trigger().nativeElement.getBoundingClientRect();
        const menuElement = this.menu().nativeElement;
        menuElement.style.top = `${triggerRect.bottom}px`;
        menuElement.style.left = `${triggerRect.left}px`;
    }

    private isRouteEnabled(): boolean {
        return this.nodes().findIndex((node) => node === this.hoveredItem()) !== this.nodes().length - 1;
    }
}
