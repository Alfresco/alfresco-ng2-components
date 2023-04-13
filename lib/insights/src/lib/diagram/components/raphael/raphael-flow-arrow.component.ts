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

import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Polyline } from './polyline';
import { RaphaelBase } from './raphael-base';
import { RaphaelService } from './raphael.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let Raphael: any;

const ARROW_WIDTH = 4;
const SEQUENCE_FLOW_STROKE = 1.5;

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({selector: 'adf-raphael-flow-arrow, raphael-flow-arrow'})
export class RaphaelFlowArrowDirective extends RaphaelBase implements OnInit {
    @Input()
    paper: any;

    @Input()
    flow: any;

    @Output()
    error = new EventEmitter();

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {
        this.draw(this.flow);
    }

    draw(flow: any) {
        const line = this.drawLine(flow);
        this.drawArrow(line);
    }

    drawLine(flow: any) {
        const polyline = new Polyline(flow.id, flow.waypoints, SEQUENCE_FLOW_STROKE, this.paper);
        polyline.element = this.paper.path(polyline.path);
        polyline.element.attr({'stroke-width': SEQUENCE_FLOW_STROKE});
        polyline.element.attr({stroke: '#585858'});

        polyline.element.node.id = this.flow.id;

        const lastLineIndex = polyline.getLinesCount() - 1;
        const line = polyline.getLine(lastLineIndex);
        return line;
    }

    drawArrow(line: any) {
        const doubleArrowWidth = 2 * ARROW_WIDTH;
        const width = ARROW_WIDTH / 2 + .5;
        const arrowHead: any = this.paper.path('M0 0L-' + width + '-' + doubleArrowWidth + 'L' + width + ' -' + doubleArrowWidth + 'z');

        arrowHead.transform('t' + line.x2 + ',' + line.y2);
        const angle = Raphael.deg(line.angle - Math.PI / 2);
        arrowHead.transform('...r' + angle + ' 0 0');

        arrowHead.attr('fill', '#585858');

        arrowHead.attr('stroke-width', SEQUENCE_FLOW_STROKE);
        arrowHead.attr('stroke', '#585858');
    }
}
