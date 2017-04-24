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
    selector: 'diagram-lane',
    templateUrl: './diagram-lane.component.html'
})
export class DiagramLaneComponent {
    @Input()
    lane: any;

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
        this.rectLeftCorner = {x: this.lane.x, y: this.lane.y};
        this.width = this.lane.width;
        this.height = this.lane.height;

        this.textPosition =  {x: this.lane.x + 10, y: this.lane.y + ( this.lane.height / 2 )};
        this.text = this.lane.name;
        this.textTransform = 'r270';
    }
}
