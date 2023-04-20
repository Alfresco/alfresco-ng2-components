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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { HyperlinkWidgetComponent } from './hyperlink.widget';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../../testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('HyperlinkWidgetComponent', () => {

    let widget: HyperlinkWidgetComponent;
    let fixture: ComponentFixture<HyperlinkWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            MatTooltipModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HyperlinkWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should get link text from field display text', () => {
        const text = 'hello world';

        widget.field = new FormFieldModel(new FormModel(), {
            displayText: text
        });
        widget.ngOnInit();

        expect(widget.linkText).toBe(text);
    });

    it('should get link text from field url', () => {
        const url = 'http://<address>';

        widget.field = new FormFieldModel(new FormModel(), {
            displayText: null,
            hyperlinkUrl: url
        });
        widget.ngOnInit();

        expect(widget.linkText).toBe(url);
    });

    it('should require field to get link text', () => {
        widget.field = null;
        widget.ngOnInit();

        expect(widget.linkText).toBeNull();
    });

    it('should not return link text', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            displayText: null,
            hyperlinkUrl: null
        });
        widget.ngOnInit();

        expect(widget.linkText).toBeNull();
    });

    it('should return default url for missing field', () => {
        widget.field = null;
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(HyperlinkWidgetComponent.DEFAULT_HYPERLINK_URL);
    });

    it('should return default url for missing field property', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: null
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(HyperlinkWidgetComponent.DEFAULT_HYPERLINK_URL);
    });

    it('should prepend url with scheme', () => {
        const url = 'www.alfresco.com';
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: url
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(`${HyperlinkWidgetComponent.DEFAULT_HYPERLINK_SCHEME}${url}`);
    });

    it('should not prepend url with scheme', () => {
        const url = 'https://<secure/address>';
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: url
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(url);
    });

    it('should  value property content be use as link if present', () => {
        const url = 'www.alfresco.com';

        widget.field = new FormFieldModel(new FormModel(), {
            value: url
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(`${HyperlinkWidgetComponent.DEFAULT_HYPERLINK_SCHEME}${url}`);
    });

    it('should use value property content over hyperlinkUrl ', () => {
        const url = 'www.alfresco.com';

        widget.field = new FormFieldModel(new FormModel(), {
            value:  url,
            hyperlinkUrl:  'www.alfresco-test.com'
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(`${HyperlinkWidgetComponent.DEFAULT_HYPERLINK_SCHEME}${url}`);
    });

    it('should use value property id displayText is not present ', () => {
        const url = 'www.alfresco.com';

        widget.field = new FormFieldModel(new FormModel(), {
            displayText:  url
        });
        widget.ngOnInit();

        fixture.detectChanges();
        const hyperlinkWidgetLink = element.querySelector('a');
        expect(hyperlinkWidgetLink.innerText).toBe(url);
    });

    it('should be able to set label property', () => {
        const label = 'Label';
        widget.field = new FormFieldModel(new FormModel(), {
            name: label,
            type: FormFieldTypes.HYPERLINK
        });

        fixture.detectChanges();
        const hyperlinkWidgetLabel = element.querySelector('label');
        expect(hyperlinkWidgetLabel.innerText).toBe(label);
    });

    it('should be able to set URL', () => {
        const url = 'https://www.alfresco.com/';
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: url,
            type: FormFieldTypes.HYPERLINK
        });

        fixture.detectChanges();
        const hyperlinkWidgetLink = element.querySelector('a');
        expect(hyperlinkWidgetLink.href).toBe(url);
    });

    it('should be able to set display text', () => {
        const displayText = 'displayText';
        const url = 'https://www.alfresco.com/';
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: url,
            displayText,
            type: FormFieldTypes.HYPERLINK
        });

        fixture.detectChanges();
        const hyperlinkWidgetLink = element.querySelector('a');
        expect(hyperlinkWidgetLink.href).toBe(url);
        expect(hyperlinkWidgetLink.innerText).toBe(displayText);
    });

    it('should display tooltip when tooltip is set', () => {
        const displayText = 'displayText';
        const url = 'https://www.alfresco.com/';
        widget.field = new FormFieldModel(new FormModel(), {
            id: 'hyperlink',
            hyperlinkUrl: url,
            displayText,
            type: FormFieldTypes.HYPERLINK,
            tooltip: 'hyperlink widget'
        });

        fixture.detectChanges();
        const checkbox = fixture.debugElement.nativeElement.querySelector('.adf-hyperlink-widget div');
        const tooltip = checkbox.getAttribute('ng-reflect-message');

        expect(tooltip).toEqual(widget.field.tooltip);
    });
});
