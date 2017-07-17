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

import { Component, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdSelect } from '@angular/material';
import { PathElementEntity } from 'alfresco-js-api';
import { BreadcrumbComponent } from './breadcrumb.component';

@Component({
    selector: 'adf-dropdown-breadcrumb',
    templateUrl: './dropdown-breadcrumb.component.html',
    styleUrls: ['./dropdown-breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adf-dropdown-breadcrumb'
    }
})
export class DropdownBreadcrumbComponent extends BreadcrumbComponent implements OnChanges {
    @ViewChild(MdSelect) selectbox: MdSelect;

    currentNode: PathElementEntity;
    previousNodes: PathElementEntity[];

    ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this.recalculateNodes();
    }

    /**
     * Calculate the current and previous nodes from the route array
     */
    private recalculateNodes(): void {
        this.currentNode = this.route[this.route.length - 1];
        this.previousNodes = this.route.slice(0, this.route.length - 1).reverse();
    }

    /**
     * Opens the selectbox overlay
     */
    open(): void {
        if (this.selectbox) {
            this.selectbox.open();
        }
    }

    /**
     * Return if route has more than one element (means: we are not in the root directory)
     */
    hasPreviousNodes(): boolean {
        return this.previousNodes.length > 0;
    }
}
