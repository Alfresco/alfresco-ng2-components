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

@Component({
    moduleId: module.id,
    selector: 'diagram-task',
    templateUrl: './diagram-task.component.html',
    styleUrls: ['./diagram-task.component.css']
})
export class DiagramTaskComponent {

    static CURRENT_COLOR = '#017501';
    static COMPLETED_COLOR = '#2632aa';
    static ACTIVITY_STROKE_COLOR = '#bbbbbb';

    static TASK_STROKE = '1';
    static TASK_HIGHLIGHT_STROKE = '2';

    @Input()
    data: any;

    @Input()
    type: any;

    @Input()
    paper: any;

    options: any = {};

    @Output()
    onError = new EventEmitter();

    stroke: number;

    rect: any;
    radius: number = 4;

    textPosition: any;

    constructor(public elementRef: ElementRef) {}

    ngOnInit() {
        console.log(this.elementRef);

        this.rect = {x: this.data.x, y: this.data.y};

        this.textPosition =  {x: this.data.x + ( this.data.width / 2 ), y: this.data.y + ( this.data.height / 2 )};

        this.options['id'] = this.data.id;
        this.options['stroke'] = this.bpmnGetColor(this.data, DiagramTaskComponent.ACTIVITY_STROKE_COLOR);
        this.options['stroke-width'] = this.bpmnGetStrokeWidth(this.data);
        this.options['fill'] = this.determineCustomFillColor(this.data);
        // rectAttrs['fill-opacity'] = customActivityBackgroundOpacity;

    }

    private bpmnGetColor(data, defaultColor) {
        if (data.current) {
            return DiagramTaskComponent.CURRENT_COLOR;
        } else if (data.completed) {
            return DiagramTaskComponent.COMPLETED_COLOR;
        } else {
            return defaultColor;
        }
    }

    private bpmnGetStrokeWidth(data) {
        if (data.current || data.completed) {
            return DiagramTaskComponent.TASK_STROKE;
        } else {
            return DiagramTaskComponent.TASK_HIGHLIGHT_STROKE;
        }
    }

    private determineCustomFillColor(data) {
        // TODO
        return 'hsb(0.1966666666666667, 1, 1)';
    }
}
