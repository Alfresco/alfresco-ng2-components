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

 /* eslint-disable @angular-eslint/component-selector */

import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'diagram-pool',
    templateUrl: './diagram-pool.component.html'
})
export class DiagramPoolComponent implements OnInit {
    @Input()
    pool: any;

    @Output()
    error = new EventEmitter();

    rectLeftCorner: any;
    width: any;
    height: any;

    textPosition: any;
    text: string;
    textTransform: string;
    options: any = {stroke: '#000000', fillColors: 'none', fillOpacity: '', strokeWidth: '1', radius: 0};

    constructor(public elementRef: ElementRef) {}

    ngOnInit() {
        this.rectLeftCorner = {x: this.pool.x, y: this.pool.y};
        this.width = this.pool.width;
        this.height = this.pool.height;

        this.textPosition =  {x: this.pool.x + 14, y: this.pool.y + ( this.pool.height / 2 )};
        this.text = this.pool.name;
        this.textTransform = 'r270';
    }
}
