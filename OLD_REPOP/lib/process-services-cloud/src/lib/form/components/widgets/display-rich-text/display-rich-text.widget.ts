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

import { Component, inject, InjectionToken, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormService } from '@alfresco/adf-core';
import { DomSanitizer } from '@angular/platform-browser';
import { RichTextParserService } from '../../../services/rich-text-parser.service';

export const RICH_TEXT_PARSER_TOKEN = new InjectionToken<RichTextParserService>('RichTextParserService', {
    factory: () => new RichTextParserService()
});

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
    parsedHTML: string | Error;

    private readonly richTextParserService = inject(RICH_TEXT_PARSER_TOKEN);
    private readonly sanitizer = inject(DomSanitizer);

    constructor(formService: FormService) {
        super(formService);
    }

    ngOnInit(): void {
        this.parsedHTML = this.richTextParserService.parse(this.field.value);

        if (this.parsedHTML instanceof Error) {
            throw this.parsedHTML;
        } else {
            this.sanitizeHtmlContent();
        }
    }

    private sanitizeHtmlContent(): void {
        this.parsedHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.parsedHTML);
    }
}
