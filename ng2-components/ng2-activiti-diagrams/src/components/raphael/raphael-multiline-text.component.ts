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
import { LogService } from 'ng2-alfresco-core';
import { Point } from './models/point';
import { RaphaelBase } from './raphael-base';
import { RaphaelService } from './raphael.service';

@Directive({ selector: 'raphael-multiline-text' })
export class RaphaelMultilineTextDirective extends RaphaelBase implements OnInit {
    @Input()
    paper: any;

    @Input()
    position: Point;

    @Input()
    transform: string;

    @Input()
    text: string;

    @Input()
    elementWidth: number;

    @Output()
    onError = new EventEmitter();

    TEXT_PADDING = 3;

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService,
                private logService: LogService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {
        this.logService.log(this.elementRef);
        if (this.text === null || this.text === undefined) {
            this.text = '';
        }
        this.draw(this.position, this.text);
    }

    draw(position: Point, text: string) {
        let textPaper = this.paper.text(position.x + this.TEXT_PADDING, position.y + this.TEXT_PADDING, text).attr({
            'text-anchor': 'middle',
            'font-family': 'Arial',
            'font-size': '11',
            'fill': '#373e48'
        });

        let formattedText = this.formatText(textPaper, text, this.elementWidth);
        textPaper.attr({
            'text': formattedText
        });
        textPaper.transform(this.transform);
        return textPaper;
    }

    private formatText(textPaper, text, elementWidth) {
        let letterWidth = textPaper.getBBox().width / text.length;
        let removedLineBreaks = text.split('\n');
        let actualRowLength = 0, formattedText = [];
        removedLineBreaks.forEach(senteces => {
            let words = senteces.split(' ');
            words.forEach(word => {
                let length = word.length;
                if (actualRowLength + (length * letterWidth) > elementWidth) {
                    formattedText.push('\n');
                    actualRowLength = 0;
                }
                actualRowLength += length * letterWidth;
                formattedText.push(word + ' ');
            });
            formattedText.push('\n');
            actualRowLength = 0;
        });
        return formattedText.join('');
    }
}
