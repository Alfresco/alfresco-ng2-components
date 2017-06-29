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

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { WidgetComponent , baseHost } from './../widget.component';
import { FormFieldTypes } from '../core/form-field-types';
import { FormService } from '../../../services/form.service';
import { FormFieldOption } from './../core/form-field-option';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { NumberFieldValidator } from '../core/form-field-validator';

@Component({
    selector: 'display-value-widget',
    templateUrl: './display-value.widget.html',
    styleUrls: ['./display-value.widget.css'],
    host: baseHost
})
export class DisplayValueWidget extends WidgetComponent implements OnInit {

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    value: any;
    fieldType: string;
    id: any;

    // hyperlink
    linkUrl: string;
    linkText: string;

    // dynamic table
    tableEditable = false;

    // upload/attach
    hasFile: boolean = false;
    showDocumentContent: boolean = true;

    constructor(public formService: FormService,
                private visibilityService: WidgetVisibilityService) {
         super(formService);
    }

    ngOnInit() {
        if (this.field) {
            this.value = this.field.value;
            this.visibilityService.refreshEntityVisibility(this.field);
            if (this.field.params) {
                if (this.field.params['showDocumentContent'] !== undefined) {
                    this.showDocumentContent = !!this.field.params['showDocumentContent'];
                }
                if (this.field.params['tableEditable'] !== undefined) {
                    this.tableEditable = !!this.field.params['tableEditable'];
                }

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
                            } else {
                                this.value = null;
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
                                this.id = files[0].id;
                                this.hasFile = true;
                            } else {
                                this.value = null;
                                this.hasFile = false;
                            }
                            break;
                        case FormFieldTypes.DOCUMENT:
                            const file = this.field.value;
                            if (file) {
                                this.value = decodeURI(file.name);
                                this.id = file.id;
                                this.hasFile = true;
                            } else {
                                this.value = null;
                                this.hasFile = false;
                            }
                            break;
                        case FormFieldTypes.TYPEAHEAD:
                            this.loadRestFieldValue();
                            break;
                        case FormFieldTypes.DROPDOWN:
                            if (this.field.restUrl) {
                                this.loadRestFieldValue();
                            } else {
                                this.value = this.field.hasOptions() ? this.field.getOptionName() : this.value;
                            }
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
                                let dateValue;
                                if (NumberFieldValidator.isNumber(this.value)) {
                                    dateValue = moment(this.value);
                                } else {
                                    dateValue = moment(this.value.split('T')[0], 'YYYY-M-D');
                                }
                                if (dateValue && dateValue.isValid()) {
                                    const displayFormat = this.field.dateDisplayFormat || this.field.defaultDateFormat;
                                    this.value = dateValue.format(displayFormat);
                                }
                            }
                            break;
                        case FormFieldTypes.AMOUNT:
                            if (this.value) {
                                let currency = this.field.currency || '$';
                                this.value = `${currency} ${this.field.value}`;
                            }
                            break;
                        case FormFieldTypes.HYPERLINK:
                            this.linkUrl = this.getHyperlinkUrl(this.field);
                            this.linkText = this.getHyperlinkText(this.field);
                            break;
                        default:
                            this.value = this.field.value;
                            break;
                    }
                }
            }
            this.visibilityService.refreshVisibility(this.field.form);
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
        if (this.field.form.taskId) {
            this.getValuesByTaskId();
        } else {
            this.getValuesByProcessDefinitionId();
        }
    }

    getValuesByProcessDefinitionId() {
        this.formService
            .getRestFieldValuesByProcessId(
                this.field.form.processDefinitionId,
                this.field.id
            )
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = result || [];
                    let toSelect = options.find(item => item.id === this.field.value);
                    this.field.options = options;
                    if (toSelect) {
                        this.value = toSelect.name;
                    } else {
                        this.value = this.field.value;
                    }
                    this.visibilityService.refreshVisibility(this.field.form);
                },
                (error) => {
                    this.value = this.field.value;
                }
            );
    }

    getValuesByTaskId() {
        this.formService
            .getRestFieldValues(this.field.form.taskId, this.field.id)
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = result || [];
                    let toSelect = options.find(item => item.id === this.field.value);
                    this.field.options = options;
                    if (toSelect) {
                        this.value = toSelect.name;
                    } else {
                        this.value = this.field.value;
                    }
                    this.visibilityService.refreshVisibility(this.field.form);
                },
                (error) => {
                    this.error.emit(error);
                    this.value = this.field.value;
                }
            );
    }
}
