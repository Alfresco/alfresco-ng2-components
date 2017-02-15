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

import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DiagramColorService } from '../../services/diagram-color.service';

@Component({
    selector: 'diagram-pool',
    templateUrl: './diagram-pool.component.html'
})
export class DiagramPoolComponent {
    @Input()
    pool: any;

    @Output()
    onError = new EventEmitter();

    rectLeftCorner: any;
    width: any;
    height: any;

    textPosition: any;
    text: string;
    textTransform: string;
    options: any = {stroke: '#000000', fillColors: 'none', fillOpacity: '', strokeWidth: '1', radius: 0};

    constructor(public elementRef: ElementRef,
                private diagramColorService: DiagramColorService) {}

    ngOnInit() {
        this.rectLeftCorner = {x: this.pool.x, y: this.pool.y};
        this.width = this.pool.width;
        this.height = this.pool.height;

        this.textPosition =  {x: this.pool.x + 14, y: this.pool.y + ( this.pool.height / 2 )};
        this.text = this.pool.name;
        this.textTransform = 'r270';
    }
}
