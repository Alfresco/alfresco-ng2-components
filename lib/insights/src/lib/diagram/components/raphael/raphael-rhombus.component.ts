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
import { Point } from './models/point';
import { RaphaelBase } from './raphael-base';
import { RaphaelService } from './raphael.service';

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({selector: 'adf-raphael-rhombus, raphael-rhombus'})
export class RaphaelRhombusDirective extends RaphaelBase implements OnInit {
    @Input()
    center: Point;

    @Input()
    width: number;

    @Input()
    height: number;

    @Input()
    fillColors: any;

    @Input()
    stroke: any;

    @Input()
    strokeWidth: any;

    @Input()
    fillOpacity: any;

    @Input()
    elementId: string;

    @Output()
    error = new EventEmitter();

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {
        const opts = {
            'stroke-width': this.strokeWidth,
            fill: this.fillColors,
            stroke: this.stroke,
            'fill-opacity': this.fillOpacity
        };
        const elementDraw = this.draw(this.center, this.width, this.height, opts);
        elementDraw.node.id = this.elementId;
    }

    draw(center: Point, width: number, height: number, opts?: any) {
        return this.paper.path('M' + center.x + ' ' + (center.y + (height / 2)) +
            'L' + (center.x + (width / 2)) + ' ' + (center.y + height) +
            'L' + (center.x + width) + ' ' + (center.y + (height / 2)) +
            'L' + (center.x + (width / 2)) + ' ' + center.y + 'z'
        ).attr(opts);
    }
}
