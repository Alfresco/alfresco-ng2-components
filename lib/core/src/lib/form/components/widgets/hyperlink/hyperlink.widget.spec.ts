/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreTestingModule, UnitTestingUtils } from '../../../../testing';
import { FormFieldModel, FormFieldTypes, FormModel } from '../core';
import { HyperlinkWidgetComponent } from './hyperlink.widget';

describe('HyperlinkWidgetComponent', () => {
    let widget: HyperlinkWidgetComponent;
    let fixture: ComponentFixture<HyperlinkWidgetComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        fixture = TestBed.createComponent(HyperlinkWidgetComponent);
        widget = fixture.componentInstance;
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
            value: url,
            hyperlinkUrl: 'www.alfresco-test.com'
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(`${HyperlinkWidgetComponent.DEFAULT_HYPERLINK_SCHEME}${url}`);
    });

    it('should use value property id displayText is not present ', () => {
        const url = 'www.alfresco.com';

        widget.field = new FormFieldModel(new FormModel(), {
            displayText: url
        });
        widget.ngOnInit();

        fixture.detectChanges();
        expect(UnitTestingUtils.getInnerTextByCSS(fixture.debugElement, 'a')).toBe(url);
    });

    it('should be able to set label property', () => {
        const label = 'Label';
        widget.field = new FormFieldModel(new FormModel(), {
            name: label,
            type: FormFieldTypes.HYPERLINK
        });

        fixture.detectChanges();
        expect(UnitTestingUtils.getInnerTextByCSS(fixture.debugElement, 'label')).toBe(label);
    });

    it('should be able to set URL', () => {
        const url = 'https://www.alfresco.com/';
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: url,
            type: FormFieldTypes.HYPERLINK
        });

        fixture.detectChanges();
        const hyperlinkWidgetLink = UnitTestingUtils.getByCSS(fixture.debugElement, 'a').nativeElement;
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
        const hyperlinkWidgetLink = UnitTestingUtils.getByCSS(fixture.debugElement, 'a').nativeElement;
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
        const checkbox = UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-hyperlink-widget div').nativeElement;
        const tooltip = checkbox.getAttribute('title');

        expect(tooltip).toEqual(widget.field.tooltip);
    });
});
