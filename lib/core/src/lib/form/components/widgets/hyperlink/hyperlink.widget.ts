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
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';
import { FormFieldModel } from '../core';

@Component({
    selector: 'hyperlink-widget',
    templateUrl: './hyperlink.widget.html',
    styleUrls: ['./hyperlink.widget.scss'],
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
export class HyperlinkWidgetComponent extends WidgetComponent implements OnInit {

    static DEFAULT_HYPERLINK_URL: string = '#';
    static DEFAULT_HYPERLINK_SCHEME: string = 'http://';

    linkUrl: string = '#';
    linkText: string = null;

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            this.linkUrl = this.getHyperlinkUrl(this.field);
            this.linkText = this.getHyperlinkText(this.field);
        }
    }

    protected getHyperlinkUrl(field: FormFieldModel) {
        let value = field.value || field.hyperlinkUrl;

        if (value && !/^https?:\/\//i.test(value)) {
            value = `${HyperlinkWidgetComponent.DEFAULT_HYPERLINK_SCHEME}${value}`;
        }

        return value || HyperlinkWidgetComponent.DEFAULT_HYPERLINK_URL;
    }

    protected getHyperlinkText(field: FormFieldModel) {
        if (field) {
            return field.displayText || field.hyperlinkUrl || field.value;
        }
        return null;
    }
}
