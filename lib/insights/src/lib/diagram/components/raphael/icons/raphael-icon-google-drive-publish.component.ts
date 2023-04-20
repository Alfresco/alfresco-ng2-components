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
@Directive({selector: 'adf-raphael-icon-google-drive-publish, raphael-icon-google-drive-publish'})
export class RaphaelIconGoogleDrivePublishDirective extends RaphaelBase implements OnInit {
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
        const image = this.paper.image();

        image.attr({x: position.x});
        image.attr({y: position.y});
        image.attr({id: 'image3398'});
        image.attr({preserveAspectRatio: 'none'});
        image.attr({height: '16'});
        image.attr({width: '17'});
        image.attr({src: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBA
        JqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIHSURBVDiNpVI7a1RREP7mzLl3d+9mScxaiBLFwohxQcXCwjwao/gqFAQhRGOphQgmgs9oGxaV
        gFhpYPUPGMFCCzEqCgETg0uK4CuFoLhZyWNf994zFrqy9xJWwQ+mOB8z33wzZ4D/BIWJppG+plstc+mjK9yttbzALHExcoDaRxdqeRUWcFkGBz7G1s152CCQ7dUAqNOLuZf
        qOmi439MmhifF86e6uLj4MFXoCuVXWPkp2vZkZlkHYvRNAJYwtz79oXdMLfFMSMD2Dd9YdoSGTO9hQLoBQBESQvLpUNaZD1sGsN8d390dFBjpiwooHVBW6tvXCr2H4EFo6L
        wR97pkj9h/BByWfgDrA4lRTWDvHIPOAihVaWO8txCkygu50wBAsbsnWpT2pwHEA/sgXC30Zq4BwJfHHRdY0R4nxp5mbFGEJIB5l2SjVtoMhYsBfC5EikPVh7Z4uFyqnKq43
        hoQFrXCIydCjZbWlyl+79gzCDprq1dPnnyhS8nNZDmvRVmbAIDhKyL5/e2kjKi4pbwxLQZniDAOgAHAybW90aXmncp2xoSsvdVDMWBAAi69sqsvqsLxzARB7vxaMHvJDwcT
        ZCVeClnhIwqC5Pb08Kp3CgBUxT4PINc4u+u54uY8FLfXLQa+sx0dRNV2eXSi6OzryK2c7Wkl0msB5OuG0JVsOvnqL03+DT8BxkC5RkIpSlIAAAAASUVORK5CYII=`});
    }
}
