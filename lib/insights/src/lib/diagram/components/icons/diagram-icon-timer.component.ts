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
import { DiagramElement } from '../diagram-element';
import { RaphaelCircleDirective } from '../raphael/raphael-circle.component';
import { RaphaelIconTimerDirective } from '../raphael/icons/raphael-icon-timer.component';
import { DiagramTooltipComponent } from '../tooltip/diagram-tooltip.component';

@Component({
    selector: 'diagram-icon-timer',
    imports: [RaphaelCircleDirective, RaphaelIconTimerDirective, DiagramTooltipComponent],
    templateUrl: './diagram-icon-timer.component.html'
})
export class DiagramIconTimerComponent extends DiagramElement implements OnInit {
    center: any = {};
    position: any;

    circleRadius: number;

    circleOptions: any = { stroke: '', fillColors: '', fillOpacity: '', strokeWidth: '' };
    timerOptions: any = { stroke: '', fillColors: '', fillOpacity: '', strokeWidth: '' };

    ngOnInit() {
        this.center.x = this.data.x + this.data.width / 2;
        this.center.y = this.data.y + this.data.height / 2;
        this.circleRadius = 10;
        this.position = { x: this.data.x + 5, y: this.data.y + 5 };

        this.circleOptions.stroke = 'black';
        this.circleOptions.fillColors = 'none';
        this.timerOptions.stroke = 'none';
        this.timerOptions.fillColors = '#585858';
    }
}
