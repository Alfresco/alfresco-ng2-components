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

@Directive({selector: 'raphael-rect'})
export class RaphaelRectDirective extends RaphaelBase implements OnInit {
    @Input()
    paper: any;

    @Input()
    leftCorner: Point;

    @Input()
    width: number;

    @Input()
    height: number;

    @Input()
    radius: number = 0;

    @Input()
    strokeWith: number;

    @Output()
    onError = new EventEmitter();

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {
        console.log(this.elementRef);
        let opts = {'stroke-width': this.strokeWith};
        this.draw(this.leftCorner, this.width, this.height, this.radius, opts);
    }

    public draw(leftCorner: Point, width: number, height: number, radius: number, opts: any) {
        return this.paper.rect(leftCorner.x, leftCorner.y, width, height, radius).attr(opts);
    }
}
