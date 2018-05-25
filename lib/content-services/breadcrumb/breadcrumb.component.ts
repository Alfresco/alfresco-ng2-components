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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelect } from '@angular/material';
import { MinimalNodeEntryEntity, PathElementEntity } from 'alfresco-js-api';
import { DocumentListComponent } from '../document-list';

@Component({
    selector: 'adf-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adf-breadcrumb'
    }
})
export class BreadcrumbComponent implements OnInit, OnChanges {

    /** Active node, builds UI based on folderNode.path.elements collection. */
    @Input()
    folderNode: MinimalNodeEntryEntity = null;

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

    get hasRoot(): boolean {
        return !!this.root;
    }

    /** Emitted when the user clicks on a breadcrumb. */
    @Output()
    navigate = new EventEmitter<PathElementEntity>();

    ngOnInit() {
        this.transform = this.transform ? this.transform : null;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.folderNode) {
            let node: MinimalNodeEntryEntity = null;
            node = this.transform ? this.transform(changes.folderNode.currentValue) : changes.folderNode.currentValue;
            this.route = this.parseRoute(node);
        }

        if (changes.transform) {
            let node = this.transform ? this.transform(this.folderNode) : this.folderNode;
            this.route = this.parseRoute(node);
        }
        this.recalculateNodes();
    }

    protected recalculateNodes(): void {
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
        }
    }

    hasPreviousNodes(): boolean {
        return this.previousNodes ? true : false;
    }

    parseRoute(node: MinimalNodeEntryEntity): PathElementEntity[] {
        if (node && node.path) {
            const route = <PathElementEntity[]> (node.path.elements || []).slice();

            route.push(<PathElementEntity> {
                id: node.id,
                name: node.name
            });

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
        let result: number = -1;

        if (route && route.length > 0 && nodeId) {
            result = route.findIndex(el => el.id === nodeId);
        }

        return result;
    }

    onRoutePathClick(route: PathElementEntity, event?: Event): void {
        if (event) {
            event.preventDefault();
        }

        if (route) {
            this.navigate.emit(route);

            if (this.target) {
                this.target.navigateTo(route.id);
            }
        }
    }
}
