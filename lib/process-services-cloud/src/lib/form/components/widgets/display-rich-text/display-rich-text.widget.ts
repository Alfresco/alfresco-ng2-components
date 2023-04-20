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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormService } from '@alfresco/adf-core';
/* cspell:disable-next-line */
import edjsHTML from 'editorjs-html';
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

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit(): void {
        /* cspell:disable-next-line */
        this.parsedHTML = edjsHTML().parseStrict(this.field.value).join('\n');
    }

}
