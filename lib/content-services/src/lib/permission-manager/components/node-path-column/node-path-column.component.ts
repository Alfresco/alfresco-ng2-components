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

import { Node } from '@alfresco/js-api';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'adf-node-path-column',
    template: `
        <span class="adf-user-name-column adf-datatable-cell-value"  title="{{ displayText$ | async }}">
            {{ displayText$ | async }}
        </span>
    `,
    host: { class: 'adf-node-path-column adf-datatable-content-cell' }
})
export class NodePathColumnComponent implements OnInit {
    @Input()
    node: Node;

    displayText$ = new BehaviorSubject<string>('');

    ngOnInit() {
        this.updateValue();
    }

    protected updateValue() {
        this.displayText$.next(this.node.path.name);
    }
}
