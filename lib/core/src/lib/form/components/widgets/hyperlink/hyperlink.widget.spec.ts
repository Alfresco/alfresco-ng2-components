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

import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { WidgetComponent } from './../widget.component';
import { HyperlinkWidgetComponent } from './hyperlink.widget';

describe('HyperlinkWidgetComponent', () => {

    let widget: HyperlinkWidgetComponent;

    beforeEach(() => {
        widget = new HyperlinkWidgetComponent(null);
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

        expect(widget.linkUrl).toBe(WidgetComponent.DEFAULT_HYPERLINK_URL);
    });

    it('should return default url for missing field property', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: null
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(WidgetComponent.DEFAULT_HYPERLINK_URL);
    });

    it('should prepend url with scheme', () => {
        const url = 'www.alfresco.com';
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: url
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(`${WidgetComponent.DEFAULT_HYPERLINK_SCHEME}${url}`);
    });

    it('should not prepend url with scheme', () => {
        const url = 'https://<secure/address>';
        widget.field = new FormFieldModel(new FormModel(), {
            hyperlinkUrl: url
        });
        widget.ngOnInit();

        expect(widget.linkUrl).toBe(url);
    });

});
