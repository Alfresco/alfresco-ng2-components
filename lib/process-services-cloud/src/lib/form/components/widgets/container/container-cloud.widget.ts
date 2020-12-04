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

import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormFieldModel, FormService, ContainerWidgetComponentModel } from '@alfresco/adf-core';

@Component({
    selector: 'container-widget',
    templateUrl: './container-cloud.widget.html',
    styleUrls: ['./container-cloud.widget.scss'],
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
export class ContainerCloudWidgetComponent extends WidgetComponent implements OnInit, AfterViewInit {

    content: ContainerWidgetComponentModel;

    constructor(public formService: FormService) {
        super(formService);
    }

    onExpanderClicked() {
        if (this.content && this.content.isCollapsible()) {
            this.content.isExpanded = !this.content.isExpanded;
        }
    }

    ngOnInit() {
        if (this.field) {
            this.content = new ContainerWidgetComponentModel(this.field);
        }
    }

    getFields(i: number): FormFieldModel[] {
        return this.content.columns[i].fields;
    }

    getColspan(i: number): number {
        let colspan = 1;
        this.getFields(i)?.forEach(field => colspan = colspan > field.colspan ? colspan : field.colspan);
        return colspan;
    }
}
