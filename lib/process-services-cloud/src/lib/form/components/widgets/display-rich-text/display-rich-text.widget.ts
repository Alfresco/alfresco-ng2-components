/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormService } from '@alfresco/adf-core';
import edjsHTML from 'editorjs-html';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'display-rich-text',
    templateUrl: './display-rich-text.widget.html',
    styleUrls: ['./display-rich-text.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class DisplayRichTextWidgetComponent extends WidgetComponent implements OnInit {
    parsedHTML: any;

    private static readonly CUSTOM_PARSER = {
        header: (block: any): string => {
            const paragraphAlign = block.data.alignment || block.data.align || block.tunes?.anyTuneName?.alignment;
            if (typeof paragraphAlign !== 'undefined' && ['left', 'right', 'center'].includes(paragraphAlign)) {
                return `<h${block.data.level} class="ce-tune-alignment--${paragraphAlign}">${block.data.text}</h${block.data.level}>`;
            } else {
                return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
            }
        },
        paragraph: (block: any): string => {
            const paragraphAlign = block.data.alignment || block.data.align || block.tunes?.anyTuneName?.alignment;

            if (typeof paragraphAlign !== 'undefined' && ['left', 'right', 'center', 'justify'].includes(paragraphAlign)) {
                return `<p class="ce-tune-alignment--${paragraphAlign}">${block.data.text}</p>`;
            } else {
                return `<p>${block.data.text}</p>`;
            }
        }
    };

    constructor(public formService: FormService, private readonly sanitizer: DomSanitizer) {
        super(formService);
    }

    ngOnInit(): void {
        this.parsedHTML = edjsHTML(DisplayRichTextWidgetComponent.CUSTOM_PARSER, { strict: true }).parse(this.field.value);

        if (!(this.parsedHTML instanceof Error)) {
            this.sanitizeHtmlContent();
        } else {
            throw this.parsedHTML;
        }
    }

    private sanitizeHtmlContent(): void {
        this.parsedHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.parsedHTML);
    }
}
