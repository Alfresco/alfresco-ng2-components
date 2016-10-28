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

@Directive({selector: 'raphael-text'})
export class RaphaelTextDirective extends RaphaelBase implements OnInit {
    @Input()
    paper: any;

    @Input()
    position: Point;

    @Input()
    transform: string;

    @Input()
    text: string;

    @Output()
    onError = new EventEmitter();

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {
        console.log(this.elementRef);
        if (this.text === null || this.text === undefined) {
            this.text = '';
        }
        this.draw(this.position, this.text);
    }

    public draw(position: Point, text: string) {
        let textPaper = this.paper.text(position.x, position.y, text).attr({
            'text-anchor' : 'middle',
            'font-family' : 'Arial',
            'font-size' : '11',
            'fill' : '#373e48'
        });

        textPaper.transform(this.transform);
        return textPaper;
    }
}
