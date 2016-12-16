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

import { Directive, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Point } from './models/point';
import { RaphaelBase } from './raphael-base';
import { RaphaelService } from './raphael.service';

@Directive({selector: 'raphael-plus'})
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
    onError = new EventEmitter();

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {

        let opts = {'stroke-width': this.strokeWidth, 'fill': this.fillColors, 'stroke': this.stroke, 'fill-opacity': this.fillOpacity};
        this.draw(this.center, opts);
    }

    public draw(center: Point, opts?: any) {
        let path = this.paper.path('M 6.75,16 L 25.75,16 M 16,6.75 L 16,25.75').attr(opts);
        return path.transform('T' + (center.x + 4) + ',' + (center.y + 4));
    }
}
