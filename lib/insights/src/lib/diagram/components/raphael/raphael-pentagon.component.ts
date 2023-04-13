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
@Directive({selector: 'adf-raphael-pentagon, raphael-pentagon'})
export class RaphaelPentagonDirective extends RaphaelBase implements OnInit {
    @Input()
    center: Point;

    @Input()
    fillColors: any;

    @Input()
    stroke: any;

    @Input()
    strokeWidth: any;

    @Input()
    fillOpacity: any;

    @Input()
    strokeLinejoin: any;

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
            'fill-opacity': this.fillOpacity,
            'stroke-linejoin': 'bevel'
        };
        this.draw(this.center, opts);
    }

    draw(center: Point, opts?: any) {
        const shape = this.paper.path('M 20.327514,22.344972 L 11.259248,22.344216 L 8.4577203,13.719549' +
            ' L 15.794545,8.389969 L 23.130481,13.720774 L 20.327514,22.344972 z').attr(opts);
        shape.transform('T' + (center.x + 4) + ',' + (center.y + 4));
    }
}
