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

import { Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormFieldModel } from './core/index';

/**
 * Base widget component.
 */
export class WidgetComponent implements AfterViewInit {

    static DEFAULT_HYPERLINK_URL: string = '#';
    static DEFAULT_HYPERLINK_SCHEME: string = 'http://';

    @Input()
    field: FormFieldModel;

    @Output()
    fieldChanged: EventEmitter<FormFieldModel> = new EventEmitter<FormFieldModel>();

    hasField() {
        return this.field ? true : false;
    }

    isRequired(): any {
        if (this.field && this.field.required) {
            return true;
        }
        return null;
    }

    hasValue(): boolean {
        return this.field &&
            this.field.value !== null &&
            this.field.value !== undefined;
    }

    ngAfterViewInit() {
        this.setupMaterialComponents(componentHandler);
        this.fieldChanged.emit(this.field);
    }

    setupMaterialComponents(handler?: any): boolean {
        // workaround for MDL issues with dynamic components
        if (handler) {
            handler.upgradeAllRegistered();
            return true;
        }
        return false;
    }

    checkVisibility(field: FormFieldModel) {
        this.fieldChanged.emit(field);
    }

    protected getHyperlinkUrl(field: FormFieldModel) {
        let url = WidgetComponent.DEFAULT_HYPERLINK_URL;
        if (field && field.hyperlinkUrl) {
            url = field.hyperlinkUrl;
            if (!/^https?:\/\//i.test(url)) {
                url = `${WidgetComponent.DEFAULT_HYPERLINK_SCHEME}${url}`;
            }
        }
        return url;
    }

    protected getHyperlinkText(field: FormFieldModel) {
        if (field) {
            return field.displayText || field.hyperlinkUrl;
        }
        return null;
    }

}
