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

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { IconModule } from '../../../icon/icon.module';
import { TabModel } from '../widgets/core/tab.model';

@Component({
    selector: 'adf-form-side-nav',
    templateUrl: './form-side-nav.component.html',
    styleUrl: './form-side-nav.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [MatSidenavModule, MatListModule, MatButtonModule, MatTooltipModule, IconModule, TranslatePipe, NgTemplateOutlet]
})
export class FormSideNavComponent implements OnChanges {
    private readonly breakpointObserver = inject(BreakpointObserver);

    @Input()
    nodes: TabModel[] = [];

    @Input()
    activeNodeId: string;

    @Input()
    showAddSection = false;

    @Output()
    sectionSelected = new EventEmitter<TabModel>();

    @Output()
    addSectionClicked = new EventEmitter<void>();

    protected readonly isSmallScreen = toSignal(
        this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(({ matches }) => matches)),
        { initialValue: false }
    );

    protected expandedNodeIds = new Set<string>();
    protected drawerOpened = true;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.activeNodeId) {
            this.expandAncestorsOf(this.activeNodeId);
        }
    }

    get totalSections(): number {
        return this.countLeafNodes(this.nodes);
    }

    get completedSections(): number {
        return this.countLeafNodes(this.nodes, (node) => node.isComplete());
    }

    isExpanded(node: TabModel): boolean {
        return this.expandedNodeIds.has(node.id);
    }

    toggleExpanded(node: TabModel): void {
        if (this.expandedNodeIds.has(node.id)) {
            this.expandedNodeIds.delete(node.id);
        } else {
            this.expandedNodeIds.add(node.id);
        }
    }

    isActive(node: TabModel): boolean {
        return node.id === this.activeNodeId;
    }

    selectSection(node: TabModel): void {
        this.sectionSelected.emit(node);

        if (this.isSmallScreen()) {
            this.drawerOpened = false;
        }
    }

    handleNodeClick(node: TabModel): void {
        if (node.hasChildren() && !node.hasTabbedChildren()) {
            this.toggleExpanded(node);

            if (!node.hasContent()) {
                return;
            }
        }

        this.selectSection(node);
    }

    toggleDrawer(): void {
        this.drawerOpened = !this.drawerOpened;
    }

    private expandAncestorsOf(nodeId: string, nodes: TabModel[] = this.nodes): boolean {
        for (const node of nodes) {
            if (node.id === nodeId) {
                return true;
            }

            if (this.expandAncestorsOf(nodeId, node.children)) {
                this.expandedNodeIds.add(node.id);
                return true;
            }
        }

        return false;
    }

    private countLeafNodes(nodes: TabModel[], predicate: (node: TabModel) => boolean = () => true): number {
        return nodes.reduce((count, node) => {
            if (!node.isVisible) {
                return count;
            }

            if (node.hasChildren() && !node.hasTabbedChildren()) {
                return count + this.countLeafNodes(node.children, predicate);
            }

            return predicate(node) ? count + 1 : count;
        }, 0);
    }
}
