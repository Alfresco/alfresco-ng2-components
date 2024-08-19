/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, OnInit } from '@angular/core';
import { DiagramElement } from '../diagram-element';
import { DiagramTooltipComponent } from '../tooltip/diagram-tooltip.component';
import { DiagramContainerIconEventTaskComponent } from '../icons/diagram-container-icon-event.component';
import { RaphaelCircleDirective } from '../raphael/raphael-circle.component';

@Component({
    selector: 'diagram-event',
    standalone: true,
    imports: [DiagramTooltipComponent, DiagramContainerIconEventTaskComponent, RaphaelCircleDirective],
    templateUrl: './diagram-event.component.html'
})
export class DiagramEventComponent extends DiagramElement implements OnInit {
    @Input()
    options: any = { stroke: '', fillColors: '', fillOpacity: '', strokeWidth: '', radius: '' };

    @Input()
    iconFillColor: any;

    center: any = { /* empty */ };

    ngOnInit() {
        this.center.x = this.data.x + this.data.width / 2;
        this.center.y = this.data.y + this.data.height / 2;
    }
}
