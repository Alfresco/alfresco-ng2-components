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
@Directive({selector: 'adf-raphael-icon-business-rule, raphael-icon-business-rule'})
export class RaphaelIconBusinessRuleDirective extends RaphaelBase implements OnInit {
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

    public draw(position: Point) {
        const path1 = this.paper.path(`m 1,2 0,14 16,0 0,-14 z m 1.45458,5.6000386 2.90906,0 0,2.7999224 -2.90906,0 z m 4.36364,0 8.72718,0
         0,2.7999224 -8.72718,0 z m -4.36364,4.1998844 2.90906,0 0,2.800116 -2.90906,0 z m
         4.36364,0 8.72718,0 0,2.800116 -8.72718,0 z`).attr({
            stroke: this.stroke,
            fill: this.fillColors
        });
        return path1.transform('T' + position.x + ',' + position.y);
    }
}
