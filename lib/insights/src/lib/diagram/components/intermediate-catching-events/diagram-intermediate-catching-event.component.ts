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

import { Component, OnInit } from '@angular/core';
import { MAIN_STROKE_COLOR } from '../../constants/diagram-colors';
import { DiagramElement } from '../diagram-element';
import { RaphaelCircleDirective } from '../raphael/raphael-circle.component';
import { DiagramContainerIconEventTaskComponent } from '../icons/diagram-container-icon-event.component';
import { DiagramTooltipComponent } from '../tooltip/diagram-tooltip.component';

@Component({
    selector: 'diagram-intermediate-catching-event',
    imports: [RaphaelCircleDirective, DiagramContainerIconEventTaskComponent, DiagramTooltipComponent],
    templateUrl: './diagram-intermediate-catching-event.component.html'
})
export class DiagramIntermediateCatchingEventComponent extends DiagramElement implements OnInit {
    center: any = {};
    options: any = { stroke: '', fillColors: '', fillOpacity: '', strokeWidth: 1 };

    circleRadiusInner: number;
    circleRadiusOuter: number;

    ngOnInit() {
        this.center.x = this.data.x + this.data.width / 2;
        this.center.y = this.data.y + this.data.height / 2;

        this.circleRadiusInner = 12;
        this.circleRadiusOuter = 15;

        this.options.stroke = this.diagramColorService.getBpmnColor(this.data, MAIN_STROKE_COLOR);
        this.options.fillColors = this.diagramColorService.getFillColour(this.data.id);
        this.options.fillOpacity = this.diagramColorService.getFillOpacity();
    }
}
