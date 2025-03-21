/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Node } from './node';
import { NodeChildAssociationEntry } from './nodeChildAssociationEntry';
import { Pagination } from './pagination';

export class NodeChildAssociationPagingList {
    pagination?: Pagination;
    entries?: NodeChildAssociationEntry[];
    source?: Node;

    constructor(input?: Partial<NodeChildAssociationPagingList>) {
        if (input) {
            Object.assign(this, input);
            this.pagination = input.pagination ? new Pagination(input.pagination) : undefined;
            if (input.entries) {
                this.entries = input.entries.map((item) => new NodeChildAssociationEntry(item));
            }
            this.source = input.source ? new Node(input.source) : undefined;
        }
    }
}
