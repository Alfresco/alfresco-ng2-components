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

import { Component, Input, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormFieldModel } from './core/index';
import { FormService } from './../../services/form.service';

declare let componentHandler: any;

export const baseHost = {
    '(click)': 'event($event)',
    '(blur)': 'event($event)',
    '(change)': 'event($event)',
    '(focus)': 'event($event)',
    '(focusin)': 'event($event)',
    '(focusout)': 'event($event)',
    '(input)': 'event($event)',
    '(invalid)': 'event($event)',
    '(select)': 'event($event)'
};

/**
 * Base widget component.
 */
@Component({
    selector: 'base-widget',
    template: '',
    host: baseHost
})
export class WidgetComponent implements AfterViewInit {

    static DEFAULT_HYPERLINK_URL: string = '#';
    static DEFAULT_HYPERLINK_SCHEME: string = 'http://';

    @Input()
    field: FormFieldModel;

    /** @deprecated used only to trigger visibility engine, components should do that internally if needed */
    @Output()
    fieldChanged: EventEmitter<FormFieldModel> = new EventEmitter<FormFieldModel>();

    constructor(public formService?: FormService) {
    }

    hasField() {
        return this.field ? true : false;
    }

    // Note for developers:
    // returns <any> object to be able binding it to the <element reguired="required"> attribute
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

    setupMaterialTextField(elementRef: ElementRef, handler: any, value: string): boolean {
        if (elementRef && handler) {
            let el = elementRef.nativeElement;
            if (el) {
                let container = el.querySelector('.mdl-textfield');
                if (container) {
                    container.MaterialTextfield.change(value);
                    return true;
                }
            }
        }
        return false;
    }

    /** @deprecated used only to trigger visibility engine, components should do that internally if needed */
    checkVisibility(field: FormFieldModel) {
        console.log('WidgetComponent.checkVisibility was used only to trigger visibility engine, components should do that internally if needed');
        this.fieldChanged.emit(field);
    }

    /** @deprecated used only to trigger visibility engine, components should do that internally if needed */
    onFieldChanged(field: FormFieldModel) {
        console.log('WidgetComponent.onFieldChanged was used only to trigger visibility engine, components should do that internally if needed');
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

    protected event(event: Event): void {
        this.formService.formEvents.next(event);
    }
}
