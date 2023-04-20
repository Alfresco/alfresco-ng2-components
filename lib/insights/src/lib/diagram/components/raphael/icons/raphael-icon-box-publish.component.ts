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

/* cSpell:disable */
import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Point } from './../models/point';
import { RaphaelBase } from './../raphael-base';
import { RaphaelService } from './../raphael.service';

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({selector: 'adf-raphael-icon-box-publish, raphael-icon-box-publish'})
export class RaphaelIconBoxPublishDirective extends RaphaelBase implements OnInit {
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
        image.attr({src: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAYAAADxG9hnAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI WXMAAA7DAAAO
        wwHHb6hkAAAAB3RJTUUH3wQXDxwCFNe28AAACsdJREFUWMOVmGmMXtV5x3/POfe+ y2yeGc/mwbMZG9tDMGBTKC5GCU4pbYmSRlmowlIFJWnUprSiy4dI/UA/9EsVifZDmy
        ZIxEpo1Cql UKICqbABG+x4X4M9iz2bxzOefXnfee+95zz9cN9Z7NqVeqSje3XPec/5n/Ns//8rAAd6xvj0lmYA VJWTI9fN2d5BikslrDEYY0ABIX0aUBUUUJS1TZB0HZS
        lUsz8fBHF09neKnFU0t964B5trcoqwA8O fsI3HtmW/u7Hx3p5+oHNqCr7DpzLX3dh1+xC4Z7p2dnGKE7UGmOsNTYFIuXtUlQqsgJkGSdrgBRL 8dLCYlRUUTa1NrYXiqWZ
        jqb6q/vPDHz43S/vXHika0Phr984yUufv5/llfnJ0f473z9/7c+P9E8+ 3zdRCAuJR8SU1zUpBhFWL0BATAqhvIqIlCEIqK65JfDOIHgqpUT3HesW9mxreOWejfUvPfPrm6
        de fu8Sgary2sm+5v84NvT9d85P7Z1zhkwmTyZD+dSAKFI2jyAgqQEMkoJFQR1ZC1W5gMowxAgkzlOI HPMlh3ceFUtCjuPXtap3cuSFL9ybdKrq10RkMfi7Nz42g/P+2YP
        9i3sjm6E6a8snS0+ogBcwIki5 g2AkPXGAsqk+z/YNVWxuyLBxXZ66XIbQQimOmSgkDM9G9IwVODda5OpcEc0YYs3xbs/C73z39VMv Ai8FP/rlqG1vafjLGZenusKn121W
        7jr1TxFE0tsQI/iyibbVBTzZvZ6H22vY1lJDQ0WW27Vrs4uc G5vj/d453jw7yWQxomQqwiODs59T1X1yaHh+17dfPXxswuXAWlTBiCcbQmANiVOiRMBabGgJ8YiB xzqre
        W5nM/e31pALLKjiEXTVZW5oxnjAML2UcGJoin86PMbxy9Osr8n3/enu9q8HxVLcsCBVhLkM m+vgs1tquW9DDY1VGUJrSBLPeCHh+Ng8H12Z4+oiPHlXNd9+cANNFVkExTm
        HUvYVuCmg0+a9AVXW ZSyfvrORtroKXj6YZf/lJekfnzNB7EPfWak8/UgLj29dzzoLYRAgxiCSRoDz8FBHFc/c18CV2ZjN 9TmachY0wavBi8Gs2V3XRMvab6Lg1QHQWV/J
        d/ZspCE3zPTEJHJqaPpJE9j/3Lo+g8Ou5AK95QWv 5gu5jS/oTUBuNc+veU4Xo/5LvUPPB1XJXKmtaQOJBy+G5Xwp3L7pmsXkFmM3g+Y2cwxQH0J3SwVB oF5iNXhA8MwWI
        2bmCzTWVJLPhssZ/fZgbtpJ1jirQpqHuPUcRfHe4zwYZy0JDu89onDw3AB/9f23 OdU/jqriVHH+f3fvFbyCu7FrecyV328eT+c4vDq8ehwCJiRQ9ah68EKMUIqU2FuKCTi
        nGFG8rta7 /09bk+XT5Kg3FUgRvFdUlQA1OA9oeiPOe6JE8R7EeMQYAgSngHN4XWN5gdAYjKRm8gqJdxgVQptG W+I9qecp1gjGGiLn0nKhgvfg1BMYsXgVVD1GhSRRojiB
        QBgan2N4bIal2FNRmWFLWwP1VXmiOCaw lmKUcGHkOlOzi6gIrfXVbG5vpFhIOHplmNb6dWxsqsEliljPxGLCJ5eHufuuNirCEJzHe/B4AqVs V1VUDbFXPCH/fbSPn5c8Y
        9MFlhzks8qm5jy/vauL3Xd3cunqJG8e6uHc0CKzxRIiSktVhvs6a7l3 +0b+4d9PcO+2dp7bu536qiyJwr53z3Csd5pvSciD3R2oJqh6BJMC8d7jUcQrSRnUsb4ZjFvioe2
        t 1FXn6RuZ5YPTE4xMR4xMFjk7MMGBs9fobKzm4a2NJAkcPj/I5fEi50fnaaqv5t2TA7TUZXjqM3fz swOXOHB+nHwIHRvW45wDPIpHRctA1OMUrNG0dMdKpS3ywlceYEdH
        E3nxLMbCW0f6eW1/H+NjPRSi iIe33sFzn+2mqTbE43li9xb+9tX36BldYPeWOhpmS7x+qJ/J2QJHL00zO1/gxT94lLqqLN4nqfNq enADoF5RlEQdcaLMLSh7793KrrZGq
        oMAE+aorgj4zQc6aGsMGC0uEeQse3dtoLU5AyHYTEBbfZ4v fuY+xq8vMF8SvvToVqbmIn52ZJSe0SmeeqybHe1VpJGaRov3HlQxKCu5QhWcV6J4kfaWPCYTgkaI i1CvZM
        XQsq6G+SWhtrKC9ZWWRAOs8+ASrEvYvqGK+WKJycWYXXc1cc+mJuYWCmxsruOJnW3ENkS9 T3ORLqcEg1FNP3hVRIR8JsCZkMtjBeKlmIiQJbEk4lmMPSMTc+Airs8sMDn
        nMV6JsSQIkVF6xhZA IGOFU73XOXFpDGOy9A5e54MLw5jYk6zsCd4L6srZ22uaDb1Tupqr6Wqs4Y0PL3Cy9xoLhRgflZiZ KfLeyUGOX54jlw0Znlzg5ycG6RufphTHRMUS
        V8aK7Hv7LLlcnqxVXnnnIpE37OluoKaqgu/962nO DU0ABvW+nIU9Xj32j1/4sztNmH0mNY1j/boKioWYD341wcELw0wvRPSPFXj98BV+8ovztDXV8IXf 6MAay9tHB+i7O
        svkfMzRnkl++NYZLo4ssq1jHQtFz/GeCb766Cb+5Ev3Uygucax3itN9E+zZ0UJF NkiTo+q0c8mbAWVeqmVfMVb53T2bSIzjv45d46f7L7EQRdRVV7Jz60Z+b3c7TzzYydm
        +KSozliMX J/no7AmMtWxsruTzezr5te1NvPTKIR75VCuf29NFzsJTj22l7+oivzh2hV8NTdF4d2vqqGXaKZcu Dz1uK6reiZYLFoKx6ZVdHJpm4FqBQqLUVgTc1VpDZ2sd
        LooIg4Dx2QIXBme5PlPEWENLXYYdXQ0k GA6dHqSjtZbu9lqS2GMtXJ4ocubSKA99qp3mKluWSaaf0tLzcrF/4PFMde07S7HDeY9XA+IRlMBa UmmTclH1CbEvs3hVjBGsT
        TWPR1Dv8c6hCJkgIFGfyohyBbTWYIwldh4rihXBCv2+VHw+ACFOkrI+ AVUHKB5wSZKWt7U0UFZ5qfdpkVzhHivVVSlG0YosWZayPnGIeIwIxhhCa7CizJWWMKoq10avYa1
        d ob5ry7X+HyzNAQkpZ7m5xC9vrrcYMyiBKNnQEEURx48fwyg6MHBlgFwuR2ADjLHp7SzTK13loemp pdxZUX6p8DJrWOqNXcQgRhBjMNZggpBcGOCimJ6+y766pt7Zjs3d
        s9bIsyC1dzTXpYuLsLyskbL2 Lj9FTDpuZGVsZW5ZKouk7+k/CZKaQiAwQmgt+UAIrGFgZJSPD//y9Lee/vL3gj0P7XRDV6/9zcGD B39obEBXexvWeJwX3HJNuNFJVo0js
        sJPV+XoKpsTkbJUNRj1ZeAGj/JJ/xAffvD+bPuGxn8TkUUB +MdX9mUix99fm5r7eldXV9jR3ka+IpdGg9eyxExt4ctJR8vMWVbASJmHKcYuy1NTHhdEPOphYXGR viuDjA
        4Nz9XlzasvfucPXwCQH+z7Kd949il6e3qCt97d/xdjUzNfyVTUbAyy2bwxqWwymBuqpV/z XMtlRTXVyUawYjDWrgDxeESdxHFpJi4sjqyvrXntxT/65ssAR06dSw/zzz/6
        F7753O8D8NHHR9rO nL+wZ2pqYl0cxyoIoqsm0LK49ehKKLNGp3gE1JRF+9qoU3JBIDVVuZGvffWLZ2oa7rgCcPLMBe7f 0c3/APbD8KaWhlC3AAAAAElFTkSuQmCC`});
    }
}
