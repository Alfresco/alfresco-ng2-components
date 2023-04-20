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
@Directive({selector: 'adf-raphael-plus, raphael-plus'})
export class RaphaelPlusDirective extends RaphaelBase implements OnInit {
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
        this.draw(this.center, opts);
    }

    draw(center: Point, opts?: any) {
        const path = this.paper.path('M 6.75,16 L 25.75,16 M 16,6.75 L 16,25.75').attr(opts);
        return path.transform('T' + (center.x + 4) + ',' + (center.y + 4));
    }
}
