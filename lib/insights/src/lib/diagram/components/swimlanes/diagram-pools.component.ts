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

/* eslint-disable @angular-eslint/component-selector */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { DiagramPoolComponent } from './diagram-pool.component';
import { DiagramLanesComponent } from './diagram-lanes.component';

@Component({
    selector: 'diagram-pools',
    imports: [NgIf, NgForOf, DiagramPoolComponent, DiagramLanesComponent],
    templateUrl: './diagram-pools.component.html'
})
export class DiagramPoolsComponent {
    @Input()
    pools: any[];

    @Output()
    error = new EventEmitter();
}
