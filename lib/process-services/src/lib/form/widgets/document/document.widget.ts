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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService, WidgetComponent } from '@alfresco/adf-core';

@Component({
    selector: 'adf-form-document-widget',
    templateUrl: './document.widget.html',
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
export class DocumentWidgetComponent extends WidgetComponent implements OnInit {

    fileId: string = null;
    hasFile: boolean = false;

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            const file = this.field.value;

            if (file) {
                this.fileId = file.id;
                this.hasFile = true;
            } else {
                this.fileId = null;
                this.hasFile = false;
            }
        }
    }
}
