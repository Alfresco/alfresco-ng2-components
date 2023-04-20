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

import { Component, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { PathElementEntity, Node } from '@alfresco/js-api';
import { BreadcrumbComponent } from './breadcrumb.component';

@Component({
    selector: 'adf-dropdown-breadcrumb',
    templateUrl: './dropdown-breadcrumb.component.html',
    styleUrls: ['./dropdown-breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-dropdown-breadcrumb' }
})
export class DropdownBreadcrumbComponent extends BreadcrumbComponent implements OnChanges {

    @ViewChild('dropdown')
    dropdown: MatSelect;

    currentNode: PathElementEntity;
    previousNodes: PathElementEntity[];

    /**
     * Calculate the current and previous nodes from the route array
     */
    protected recalculateNodes(): void {
        const node: Node = this.transform ? this.transform(this.folderNode) : this.folderNode;

        this.route = this.parseRoute(node);
        this.currentNode = this.route[this.route.length - 1];
        this.previousNodes = this.route.slice(0, this.route.length - 1).reverse();
    }

    /**
     * Opens the node picker menu
     */
    open(): void {
        if (this.dropdown) {
            this.dropdown.open();
            this.dropdown.focus();
        }
    }

    /**
     * Return if route has more than one element (means: we are not in the root directory)
     */
    hasPreviousNodes(): boolean {
        return this.previousNodes.length > 0;
    }
}
