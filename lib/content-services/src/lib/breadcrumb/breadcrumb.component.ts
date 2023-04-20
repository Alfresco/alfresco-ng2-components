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

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Node, PathElementEntity } from '@alfresco/js-api';
import { DocumentListComponent } from '../document-list/components/document-list.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-breadcrumb' }
})
export class BreadcrumbComponent implements OnInit, OnChanges, OnDestroy {

    /** Active node, builds UI based on folderNode.path.elements collection. */
    @Input()
    folderNode: Node = null;

    /** (optional) Name of the root element of the breadcrumb. You can use
     * this property to rename "Company Home" to "Personal Files" for
     * example. You can use an i18n resource key for the property value.
     */
    @Input()
    root: string = null;

    /** (optional) The id of the root element. You can use this property
     * to set a custom element the breadcrumb should start with.
     */
    @Input()
    rootId: string = null;

    /** (optional) Document List component to operate with. The list will
     * update when the breadcrumb is clicked.
     */
    @Input()
    target: DocumentListComponent;

    /** Transformation to be performed on the chosen/folder node before building
     * the breadcrumb UI. Can be useful when custom formatting is needed for the
     * breadcrumb. You can change the path elements from the node that are used to
     * build the breadcrumb using this function.
     */
    @Input()
    transform: (node) => any;

    @ViewChild('dropdown')
    dropdown: MatSelect;

    /** Maximum number of nodes to display before wrapping them with a dropdown element.  */
    @Input()
    maxItems: number;

    previousNodes: PathElementEntity[];
    lastNodes: PathElementEntity[];

    route: PathElementEntity[] = [];

    private onDestroy$ = new Subject<boolean>();

    get hasRoot(): boolean {
        return !!this.root;
    }

    /** If true, prevents the user from navigating away from the active node. */
    @Input()
    readOnly: boolean = false;

    /** Emitted when the user clicks on a breadcrumb. */
    @Output()
    navigate = new EventEmitter<PathElementEntity>();

    ngOnInit() {
        this.transform = this.transform ? this.transform : null;

        if (this.target) {
            this.target.$folderNode
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((folderNode: Node) => {
                    this.folderNode = folderNode;
                    this.recalculateNodes();
                });
        }
    }

    ngOnChanges(): void {
        this.recalculateNodes();
    }

    protected recalculateNodes(): void {
        const node: Node = this.transform ? this.transform(this.folderNode) : this.folderNode;

        this.route = this.parseRoute(node);

        if (this.maxItems && this.route.length > this.maxItems) {
            this.lastNodes = this.route.slice(this.route.length - this.maxItems);
            this.previousNodes = this.route.slice(0, this.route.length - this.maxItems);
            this.previousNodes.reverse();
        } else {
            this.lastNodes = this.route;
            this.previousNodes = null;
        }
    }

    open(): void {
        if (this.dropdown) {
            this.dropdown.open();
            this.dropdown.focus();
        }
    }

    hasPreviousNodes(): boolean {
        return !!this.previousNodes;
    }

    parseRoute(node: Node): PathElementEntity[] {
        if (node && node.path) {
            const route = (node.path.elements || []).slice();

            route.push({
                id: node.id,
                name: node.name,
                node
            } as PathElementEntity);

            const rootPos = this.getElementPosition(route, this.rootId);
            if (rootPos > 0) {
                route.splice(0, rootPos);
            }

            if (rootPos === -1 && this.rootId) {
                route[0].id = this.rootId;
            }

            if (this.root) {
                route[0].name = this.root;
            }

            return route;
        }

        return [];
    }

    private getElementPosition(route: PathElementEntity[], nodeId: string): number {
        let position: number = -1;

        if (route && route.length > 0 && nodeId) {
            position = route.findIndex((el) => el.id === nodeId);
        }

        return position;
    }

    breadcrumbItemIsAnchor(lastItem): boolean {
        return !this.readOnly && !lastItem;
    }

    onRoutePathClick(route: PathElementEntity, event?: Event): void {
        if (event && event.type === 'click') {
            event.preventDefault();
        }

        this.onRouteClick(route);
    }

    onRouteClick(route: PathElementEntity) {
        if (route && !this.readOnly) {
            this.navigate.emit(route);

            if (this.target) {
                this.target.navigateTo(route.id);
            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
