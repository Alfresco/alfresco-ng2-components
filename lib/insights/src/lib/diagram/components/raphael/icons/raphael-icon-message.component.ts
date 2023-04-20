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
import { Point } from './../models/point';
import { RaphaelBase } from './../raphael-base';
import { RaphaelService } from './../raphael.service';

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({selector: 'adf-raphael-icon-message, raphael-icon-message'})
export class RaphaelIconMessageDirective extends RaphaelBase implements OnInit {
    @Input()
    paper: any;

    @Input()
    position: Point;

    @Input()
    text: string;

    @Output()
    error = new EventEmitter();

    @Input()
    strokeWidth: number;

    @Input()
    fillColors: any;

    @Input()
    stroke: any;

    @Input()
    fillOpacity: any;

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {
        this.draw(this.position);
    }

    draw(position: Point) {
        const path1 = this.paper.path(`M 1 3 L 9 11 L 17 3 L 1 3 z M 1 5 L 1 13 L 5 9 L 1 5 z M 17 5 L 13 9 L 17 13 L 17 5 z M 6 10 L 1 15
        L 17 15 L 12 10 L 9 13 L 6 10 z`).attr({
            opacity: this.fillOpacity,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            fill: this.fillColors
        });
        return path1.transform('T' + position.x + ',' + position.y);
    }
}
