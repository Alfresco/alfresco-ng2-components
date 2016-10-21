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
import { DiagramColorService } from './services/diagram-color.service';

@Component({
    moduleId: module.id,
    selector: 'diagram-exclusive-gateway',
    templateUrl: './diagram-exclusive-gateway.component.html',
    styleUrls: ['./diagram-exclusive-gateway.component.css']
})
export class DiagramExclusiveGatwayComponent {
    @Input()
    data: any;

    @Output()
    onError = new EventEmitter();

    center: any = {};

    constructor(public elementRef: ElementRef,
                private diagramColorService: DiagramColorService) {}

    ngOnInit() {
        this.center.x = this.data.x;
        this.center.y = this.data.y;

        this.data.stroke = this.diagramColorService.getBpmnColor(this.data, DiagramColorService.MAIN_STROKE_COLOR);
        this.data.fillColors = this.diagramColorService.getFillColour(this.data.id);
        this.data.fillOpacity = this.diagramColorService.getFillOpacity();
        this.data.strokeWidth = 3;
    }
}
