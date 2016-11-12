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

import { Input, AfterViewInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

/**
 * Base widget component.
 */
export class WidgetComponent implements AfterViewInit, OnChanges {

    @Input()
    field: any;

    @Output()
    fieldChanged: EventEmitter<any> = new EventEmitter<any>();

    ngOnChanges(changes: SimpleChanges) {
        let field = changes['field'];
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

    ngAfterViewInit() {
        this.setupMaterialComponents(componentHandler);
    }

    setupMaterialComponents(handler?: any): boolean {
        // workaround for MDL issues with dynamic components
        if (handler) {
            handler.upgradeAllRegistered();
            return true;
        }
        return false;
    }

}
