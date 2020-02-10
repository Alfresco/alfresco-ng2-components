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

import { EventEmitter, Input, OnChanges, Output, SimpleChanges, Directive } from '@angular/core';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class WidgetComponent implements OnChanges {

    /** field. */
    @Input()
    field: any;

    /** fieldChanged. */
    @Output()
    fieldChanged: EventEmitter<any> = new EventEmitter<any>();

    ngOnChanges(changes: SimpleChanges) {
        const field = changes['field'];
        if (field && field.currentValue) {
            this.fieldChanged.emit(field.currentValue.value);
            return;
        }
    }

    hasField() {
        return this.field ? true : false;
    }

    hasValue(): boolean {
        return this.field &&
            this.field.value !== null &&
            this.field.value !== undefined;
    }

    changeValue(field: any) {
        this.fieldChanged.emit(field);
    }

}
