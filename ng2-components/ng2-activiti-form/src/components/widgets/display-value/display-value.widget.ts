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

import { Component, OnInit } from '@angular/core';
import { WidgetComponent } from './../widget.component';
import { FormFieldTypes } from '../core/form-field-types';
import { FormService } from '../../../services/form.service';
import { FormFieldOption } from './../core/form-field-option';

declare var componentHandler;
declare var moment: any;

@Component({
    moduleId: module.id,
    selector: 'display-value-widget',
    templateUrl: './display-value.widget.html',
    styleUrls: ['./display-value.widget.css']
})
export class DisplayValueWidget extends WidgetComponent implements OnInit {

    DEFAULT_URL: string = '#';
    DEFAULT_URL_SCHEME: string = 'http://';

    value: any;
    fieldType: string;

    constructor(private formService: FormService) {
        super();
    }

    ngOnInit() {
        if (this.field) {
            this.value = this.field.value;

            if (this.field.params) {
                let originalField = this.field.params['field'];
                if (originalField && originalField.type) {
                    this.fieldType = originalField.type;
                    switch (originalField.type) {
                        case FormFieldTypes.BOOLEAN:
                            this.value = this.field.value === 'true' ? true : false;
                            break;
                        case FormFieldTypes.FUNCTIONAL_GROUP:
                            if (this.field.value) {
                                this.value = this.field.value.name;
                            }
                            break;
                        case FormFieldTypes.PEOPLE:
                            let model = this.field.value;
                            if (model) {
                                let displayName = `${model.firstName} ${model.lastName}`;
                                this.value = displayName.trim();
                            }
                            break;
                        case FormFieldTypes.UPLOAD:
                            let files = this.field.value || [];
                            if (files.length > 0) {
                                this.value = decodeURI(files[0].name);
                            }
                            break;
                        case FormFieldTypes.TYPEAHEAD:
                            this.loadRestFieldValue();
                            break;
                        case FormFieldTypes.DROPDOWN:
                            this.loadRestFieldValue();
                            break;
                        case FormFieldTypes.RADIO_BUTTONS:
                            if (this.field.restUrl) {
                                this.loadRestFieldValue();
                            } else {
                                this.loadRadioButtonValue();
                            }
                            break;
                        case FormFieldTypes.DATE:
                            if (this.value) {
                                let d = moment(this.value.split('T')[0]);
                                if (d.isValid()) {
                                    this.value = d.format('D-M-YYYY');
                                }
                            }
                            break;
                        default:
                            this.value = this.field.value;
                            break;
                    }
                }
            }
        }
    }

    loadRadioButtonValue() {
        let options = this.field.options || [];
        let toSelect = options.find(item => item.id === this.field.value);
        if (toSelect) {
            this.value = toSelect.name;
        } else {
            this.value = this.field.value;
        }
    }

    loadRestFieldValue() {
        this.formService
            .getRestFieldValues(this.field.form.taskId, this.field.id)
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = result || [];
                    let toSelect = options.find(item => item.id === this.field.value);
                    if (toSelect) {
                        this.value = toSelect.name;
                    } else {
                        this.value = this.field.value;
                    }
                },
                error => {
                    console.log(error);
                    this.value = this.field.value;
                }
            );
    }

    // TODO: TAKEN FROM hyperlink WIDGET, OPTIMIZE
    get linkUrl(): string {
        let url = this.DEFAULT_URL;

        if (this.field && this.field.hyperlinkUrl) {
            url = this.field.hyperlinkUrl;
            if (!/^https?:\/\//i.test(url)) {
                url = this.DEFAULT_URL_SCHEME + url;
            }
        }

        return url;
    }

    // TODO: TAKEN FROM hyperlink WIDGET, OPTIMIZE
    get linkText(): string {
        if (this.field) {
            return this.field.displayText || this.field.hyperlinkUrl;
        }
        return null;
    }

}
