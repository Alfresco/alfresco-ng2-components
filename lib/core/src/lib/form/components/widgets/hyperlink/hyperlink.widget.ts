/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

 /* tslint:disable:component-selector  */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'hyperlink-widget',
    templateUrl: './hyperlink.widget.html',
    styleUrls: ['./hyperlink.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class HyperlinkWidgetComponent extends WidgetComponent implements OnInit {

    linkUrl: string = WidgetComponent.DEFAULT_HYPERLINK_URL;
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

}
