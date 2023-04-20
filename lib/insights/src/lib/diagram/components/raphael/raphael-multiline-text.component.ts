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

const TEXT_PADDING = 3;

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({ selector: 'adf-raphael-multiline-text, raphael-multiline-text' })
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
    error = new EventEmitter();

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    ngOnInit() {
        if (this.text === null || this.text === undefined) {
            this.text = '';
        }
        this.draw(this.position, this.text);
    }

    draw(position: Point, text: string) {
        const textPaper = this.paper.text(position.x + TEXT_PADDING, position.y + TEXT_PADDING, text).attr({
            'text-anchor': 'middle',
            'font-family': 'Arial',
            'font-size': '11',
            fill: '#373e48'
        });

        const formattedText = this.formatText(textPaper, text, this.elementWidth);
        textPaper.attr({
            text: formattedText
        });
        textPaper.transform(this.transform);
        return textPaper;
    }

    private formatText(textPaper, text, elementWidth) {
        const pText = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        textPaper.attr({
            text: pText
        });
        const letterWidth = textPaper.getBBox().width / text.length;
        const removedLineBreaks = text.split('\n');
        let actualRowLength = 0;
        const formattedText = [];
        removedLineBreaks.forEach((sentence) => {
            const words = sentence.split(' ');
            words.forEach((word) => {
                const length = word.length;
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
