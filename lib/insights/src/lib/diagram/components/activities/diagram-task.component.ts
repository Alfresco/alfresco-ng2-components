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
import { ACTIVITY_STROKE_COLOR } from '../../constants/diagram-colors';
import { DiagramColorService } from '../../services/diagram-color.service';

@Component({
    selector: 'diagram-task',
    templateUrl: './diagram-task.component.html'
})
export class DiagramTaskComponent implements OnInit {
    @Input()
    data: any;

    @Output()
    error = new EventEmitter();

    rectLeftCorner: any;
    textPosition: any;
    options: any = {stroke: '', fillColors: '', fillOpacity: '', strokeWidth: '', radius: 4};

    constructor(public elementRef: ElementRef,
                private diagramColorService: DiagramColorService) {}

    ngOnInit() {
        this.rectLeftCorner = {x: this.data.x, y: this.data.y};
        this.textPosition =  {x: this.data.x + ( this.data.width / 2 ), y: this.data.y + ( this.data.height / 2 )};

        this.options.fillColors = this.diagramColorService.getFillColour(this.data.id);
        this.options.stroke = this.diagramColorService.getBpmnColor(this.data, ACTIVITY_STROKE_COLOR);
        this.options.strokeWidth = this.diagramColorService.getBpmnStrokeWidth(this.data);
        this.options.fillOpacity = this.diagramColorService.getFillOpacity();
    }
}
