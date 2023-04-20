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

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreTestingModule, setupTestBed } from '@alfresco/adf-core';

import { DisplayRichTextWidgetComponent } from './display-rich-text.widget';

describe('DisplayRichTextWidgetComponent', () => {
    let widget: DisplayRichTextWidgetComponent;
    let fixture: ComponentFixture<DisplayRichTextWidgetComponent>;
    let debugEl: DebugElement;

    const cssSelector = {
        parsedHTML: '.adf-display-rich-text-widget-parsed-html'
    };

    const fakeFormField: any = {
        id: 'fake-form-field',
        name: 'fake-label',
        value: {
            time: 1658154611110,
            blocks: [
                {
                    id: '1',
                    type: 'header',
                    data: {
                        text: 'Editor.js',
                        level: 1
                    }
                }
            ],
            version: 1
        },
        required: false,
        readOnly: false,
        overrideId: false,
        colspan: 1,
        placeholder: null,
        minLength: 0,
        maxLength: 0,
        params: {
            existingColspan: 1,
            maxColspan: 1
        }
    };

    setupTestBed({
        imports: [
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DisplayRichTextWidgetComponent);
        widget = fixture.componentInstance;
        debugEl = fixture.debugElement;
        widget.field = fakeFormField;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(widget).toBeTruthy();
    });

    it('should parse editorjs data to html', async () => {
        const expectedHtml = '<h1>Editor.js</h1>';
        fixture.detectChanges();
        await fixture.whenStable();
        const parsedHtmlEl = debugEl.query(By.css(cssSelector.parsedHTML));
        expect(parsedHtmlEl.nativeElement.innerHTML).toEqual(expectedHtml);
    });

});
