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
    DestroyRef,
    ElementRef,
    HostListener,
    inject,
    input,
    OnInit,
    output,
    Renderer2,
    signal,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PathElement } from '@alfresco/js-api';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { DataRow, DragDropStateService } from '@alfresco/adf-core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
    selector: 'adf-compact-breadcrumb',
    templateUrl: './compact-breadcrumb.component.html',
    styleUrls: ['./compact-breadcrumb.component.scss'],
    imports: [MatButton, TranslatePipe, CdkDropList, CdkDropListGroup, CdkDrag],
    encapsulation: ViewEncapsulation.None
})
export class CompactBreadcrumbComponent implements OnInit, AfterViewInit {
    private readonly dragDropStateService = inject(DragDropStateService);
    private readonly renderer = inject(Renderer2);
    private readonly document = inject(DOCUMENT);
    private readonly destroyRef = inject(DestroyRef);

    readonly nodes = input<PathElement[]>([]);

    readonly breadcrumbDropListsChange = output<CdkDropList[]>();

    private readonly trigger = viewChild.required<unknown, ElementRef<HTMLButtonElement>>('trigger', { read: ElementRef });
    private readonly panel = viewChild.required<unknown, ElementRef<HTMLDivElement>>('panel', { read: ElementRef });

    readonly isPanelOpen = signal(false);

    private outsideClickTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private removeOutsideClickListener: (() => void) | null = null;

    /** Emitted when dragged item is dropped onto the breadcrumb. Emits drag and drop event. */
    dropped = output<CdkDragDrop<PathElement, PathElement, DataRow>>();

    protected hoveredItem: PathElement;

    ngOnInit() {
        this.destroyRef.onDestroy(() => {
            if (this.outsideClickTimeoutId !== null) {
                clearTimeout(this.outsideClickTimeoutId);
            }
            this.removeOutsideClickListener?.();
            this.panel().nativeElement.remove();
        });
    }

    ngAfterViewInit(): void {
        this.renderer.appendChild(this.document.body, this.panel().nativeElement);
        this.updatePanelPosition();

        /* eslint-disable */
        console.log(this.breadcrumbDropListsChange);
    }

    /** Keeps the panel aligned with the trigger if the page is resized between drags. */
    @HostListener('window:resize')
    onWindowResize(): void {
        this.updatePanelPosition();
    }

    togglePanel(): void {
        if (this.isPanelOpen()) {
            this.closePanel();
        } else {
            this.openPanel();
        }
        this.panel().nativeElement.classList.toggle('adf-compact-breadcrumb-panel--open', this.isPanelOpen());
    }

    onTriggerMouseEnter(): void {
        if (this.dragDropStateService.dragging()) {
            this.openPanel();
        }
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        this.closePanel();
    }

    onDrop(event: CdkDragDrop<PathElement, PathElement, DataRow>): void {
        this.closePanel();
        console.log(this.hoveredItem);
        console.log(this.nodes().findIndex((node) => node === this.hoveredItem));
        if (this.nodes().findIndex((node) => node === this.hoveredItem) !== this.nodes().length - 1) {
            this.dropped.emit(event);
        }
    }

    private openPanel(): void {
        this.updatePanelPosition();
        this.isPanelOpen.set(true);
        this.outsideClickTimeoutId = setTimeout(() => this.listenForOutsideClicks());
    }

    private closePanel(): void {
        this.isPanelOpen.set(false);
        if (this.outsideClickTimeoutId !== null) {
            clearTimeout(this.outsideClickTimeoutId);
            this.outsideClickTimeoutId = null;
        }
        this.removeOutsideClickListener?.();
        this.removeOutsideClickListener = null;
    }

    private listenForOutsideClicks(): void {
        this.removeOutsideClickListener?.();
        this.removeOutsideClickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
            const target = event.target as Node;
            if (!this.trigger().nativeElement.contains(target) && !this.panel().nativeElement.contains(target)) {
                this.closePanel();
            }
        });
    }

    private updatePanelPosition(): void {
        if (this.dragDropStateService.dragging()) {
            return;
        }

        const triggerRect = this.trigger().nativeElement.getBoundingClientRect();
        const panelElement = this.panel().nativeElement;
        panelElement.style.top = `${triggerRect.bottom}px`;
        panelElement.style.left = `${triggerRect.left}px`;
    }
}
