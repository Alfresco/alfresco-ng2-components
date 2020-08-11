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

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { WidgetComponent, FormService, LogService, FormFieldOption } from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/* tslint:disable:component-selector  */

@Component({
    selector: 'dropdown-cloud-widget',
    templateUrl: './dropdown-cloud.widget.html',
    styleUrls: ['./dropdown-cloud.widget.scss'],
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
export class DropdownCloudWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {

    typeId = 'DropdownCloudWidgetComponent';
    protected onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private formCloudService: FormCloudService,
                private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field && this.field.restUrl) {
            this.getValuesFromRestApi();
        }
    }

    getValuesFromRestApi() {
        if (this.isValidRestType()) {
            this.formCloudService.getDropDownJsonData(this.field.restUrl)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((result: FormFieldOption[]) => {
                    this.field.options = this.mapJsonData(result);
                }, (err) => this.handleError(err));
        }
    }

    mapJsonData(data: any[]): FormFieldOption[] {
        const dataToMap: any[] = this.field.restResponsePath ? data[this.field.restResponsePath] : data;
        const idProperty = this.field.restIdProperty || 'id';
        const restLabelProperty = this.field.restLabelProperty || 'name';

        return dataToMap.map((value: any) => {
            return {
                name: value[restLabelProperty],
                id: value[idProperty]
            };
        });
    }

    compareDropdownValues(opt1: string, opt2: FormFieldOption | string): boolean {
        return opt1 && opt2 && typeof opt2 !== 'string' ? (opt1 === opt2.id || opt1 === opt2.name) : opt1 === opt2;
    }

    getOptionValue(option: FormFieldOption, fieldValue: string): string {
        let optionValue: string = '';
        if (option.id === 'empty' || option.name !== fieldValue) {
            optionValue = option.id;
        } else {
            optionValue = option.name;
        }
        return optionValue;
    }

    isValidRestType(): boolean {
        return this.field.optionType === 'rest' && !!this.field.restUrl;
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
