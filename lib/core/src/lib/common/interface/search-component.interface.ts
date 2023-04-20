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

import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

interface Node {
    id: string;
}

interface NodeEntry {
    entry: Node;
}

interface NodePagingList {
    entries?: NodeEntry[];
}

interface NodePaging {
    list?: NodePagingList;
}

export interface SearchComponentInterface {

    panel: ElementRef;
    showPanel: boolean;
    results: NodePaging;
    isOpen: boolean;
    keyPressedStream: Subject<string>;
    displayWith: ((value: any) => string) | null;

    resetResults(): void;
    hidePanel(): void;
    setVisibility(): void;
}
