/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { DisplayRichTextWidgetComponent, RICH_TEXT_PARSER_TOKEN } from './display-rich-text.widget';
import { RichTextParserService } from '../../../services/rich-text-parser.service';
import { ADF_DISPLAY_TEXT_SETTINGS, FormFieldModel, FormModel, FormService } from '@alfresco/adf-core';
import { of } from 'rxjs';

describe('DisplayRichTextWidgetComponent', () => {
    let widget: DisplayRichTextWidgetComponent;
    let fixture: ComponentFixture<DisplayRichTextWidgetComponent>;
    let debugEl: DebugElement;
    let mockRichTextParserService: jasmine.SpyObj<RichTextParserService>;
    let formService: FormService;

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
                },
                {
                    id: '2',
                    type: 'paragraph',
                    data: {
                        text: 'Display some <font color="#ff1300">formatted</font> <mark class="cdx-marker">text</mark>'
                    },
                    tunes: {
                        anyTuneName: {
                            alignment: 'left'
                        }
                    }
                }
            ],
            version: 1
        }
    };

    const mockUnsafeFormField: any = {
        id: 'fake-unsafe-form-field',
        name: 'fake-label',
        value: {
            time: 1658154611110,
            blocks: [
                {
                    id: '1',
                    type: 'paragraph',
                    data: {
                        text: '<img src="x" onerror="alert(\'XSS\')">'
                    }
                }
            ],
            version: 1
        }
    };

    beforeEach(() => {
        mockRichTextParserService = jasmine.createSpyObj('RichTextParserService', ['parse']);
        mockRichTextParserService.parse.and.returnValue(
            '<h1>Editor.js</h1><p class="ce-tune-alignment--left">Display some <font color="#ff1300">formatted</font> <mark class="cdx-marker">text</mark></p>'
        );

        TestBed.configureTestingModule({
            imports: [DisplayRichTextWidgetComponent],
            providers: [FormService, { provide: RICH_TEXT_PARSER_TOKEN, useValue: mockRichTextParserService }]
        });
        fixture = TestBed.createComponent(DisplayRichTextWidgetComponent);
        widget = fixture.componentInstance;
        debugEl = fixture.debugElement;
        formService = TestBed.inject(FormService);
        widget.field = fakeFormField;
    });

    describe('event tracking', () => {
        let eventSpy: jasmine.Spy;

        beforeEach(() => {
            eventSpy = spyOn(widget, 'event').and.callThrough();
            widget.field = new FormFieldModel(new FormModel(), {});
            fixture.detectChanges();
        });

        it('should call event method only once when widget is clicked', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });
            fixture.debugElement.nativeElement.dispatchEvent(clickEvent);

            expect(eventSpy).toHaveBeenCalledTimes(1);
            expect(eventSpy).toHaveBeenCalledWith(clickEvent);
        });
    });

    it('should call RichTextParserService.parse() method', () => {
        fixture.detectChanges();

        expect(mockRichTextParserService.parse).toHaveBeenCalledWith(fakeFormField.value);
        expect(mockRichTextParserService.parse).toHaveBeenCalled();
    });

    it('should parse editorjs data to html', async () => {
        const expectedHtml =
            '<h1>Editor.js</h1><p class="ce-tune-alignment--left">Display some <font color="#ff1300">formatted</font> <mark class="cdx-marker">text</mark></p>';

        fixture.detectChanges();
        await fixture.whenStable();

        const parsedHtmlEl = debugEl.query(By.css(cssSelector.parsedHTML));
        expect(parsedHtmlEl.nativeElement.innerHTML).toEqual(expectedHtml);
    });

    it('should sanitize unsafe HTML', async () => {
        mockRichTextParserService.parse.and.returnValue('<img src="x" onerror="alert(\'XSS\')">');
        widget.field = mockUnsafeFormField;

        fixture.detectChanges();
        await fixture.whenStable();

        const parsedHtmlEl = debugEl.query(By.css(cssSelector.parsedHTML));
        expect(parsedHtmlEl.nativeElement.innerHTML.includes('img src="x"')).toBe(true);
        expect(parsedHtmlEl.nativeElement.innerHTML.includes('onerror')).toBe(false);
    });

    describe('expression evaluation', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [DisplayRichTextWidgetComponent],
                providers: [
                    FormService,
                    { provide: RICH_TEXT_PARSER_TOKEN, useValue: mockRichTextParserService },
                    {
                        provide: ADF_DISPLAY_TEXT_SETTINGS,
                        useValue: { enableExpressionEvaluation: true }
                    }
                ]
            });

            fixture = TestBed.createComponent(DisplayRichTextWidgetComponent);
            widget = fixture.componentInstance;
            debugEl = fixture.debugElement;
            formService = TestBed.inject(FormService);
            mockRichTextParserService = TestBed.inject(RICH_TEXT_PARSER_TOKEN) as jasmine.SpyObj<RichTextParserService>;
        });

        it('should resolve field expressions in rich text blocks', () => {
            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Hello ${field.name}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('richText1');
            fixture.detectChanges();

            expect(widget.field.value.blocks[0].data.text).toBe('Hello John');
        });

        it('should resolve expressions in multiple blocks', () => {
            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'header',
                                    data: {
                                        text: 'User: ${field.firstName}',
                                        level: 1
                                    }
                                },
                                {
                                    id: '2',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Status: ${variable.status}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    },
                    { id: 'firstName', type: 'text', value: 'Jane' }
                ],
                variables: [{ id: 'status', name: 'status', type: 'string', value: 'Active' }]
            });

            widget.field = form.getFieldById('richText1');
            fixture.detectChanges();

            expect(widget.field.value.blocks[0].data.text).toBe('User: Jane');
            expect(widget.field.value.blocks[1].data.text).toBe('Status: Active');
        });

        it('should update rich text when dependent field value changes', (done) => {
            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Hello ${field.name}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('richText1');
            const nameField = form.getFieldById('name');
            fixture.detectChanges();

            expect(widget.field.value.blocks[0].data.text).toBe('Hello John');

            nameField.value = 'Jane';
            formService.formRulesEvent.next({ type: 'fieldValueChanged', field: nameField } as any);

            setTimeout(() => {
                expect(widget.field.value.blocks[0].data.text).toBe('Hello Jane');
                done();
            }, 350);
        });

        it('should preserve original value structure for re-evaluation', () => {
            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Hello ${field.name}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('richText1');
            fixture.detectChanges();

            const originalValue = JSON.parse(widget['originalFieldValue']);
            expect(originalValue.blocks[0].data.text).toBe('Hello ${field.name}');
        });

        it('should handle missing field references with empty string', () => {
            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Hello ${field.nonExistent}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    }
                ]
            });

            widget.field = form.getFieldById('richText1');
            fixture.detectChanges();

            expect(widget.field.value.blocks[0].data.text).toBe('Hello ');
        });

        it('should not resolve expressions when enableExpressionEvaluation is false', () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [DisplayRichTextWidgetComponent],
                providers: [
                    FormService,
                    { provide: RICH_TEXT_PARSER_TOKEN, useValue: mockRichTextParserService },
                    {
                        provide: ADF_DISPLAY_TEXT_SETTINGS,
                        useValue: { enableExpressionEvaluation: false }
                    }
                ]
            });

            fixture = TestBed.createComponent(DisplayRichTextWidgetComponent);
            widget = fixture.componentInstance;

            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Hello ${field.name}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('richText1');
            fixture.detectChanges();

            expect(widget.field.value.blocks[0].data.text).toBe('Hello ${field.name}');
        });

        it('should re-parse HTML after expressions are evaluated', () => {
            mockRichTextParserService.parse.and.returnValue('<p>Test HTML</p>');

            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Hello ${field.name}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('richText1');
            fixture.detectChanges();

            expect(mockRichTextParserService.parse).toHaveBeenCalled();
            const lastCall = mockRichTextParserService.parse.calls.mostRecent();
            expect(lastCall.args[0].blocks[0].data.text).toBe('Hello John');
        });

        it('should support observable settings', (done) => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [DisplayRichTextWidgetComponent],
                providers: [
                    FormService,
                    { provide: RICH_TEXT_PARSER_TOKEN, useValue: mockRichTextParserService },
                    {
                        provide: ADF_DISPLAY_TEXT_SETTINGS,
                        useValue: of({ enableExpressionEvaluation: true })
                    }
                ]
            });

            fixture = TestBed.createComponent(DisplayRichTextWidgetComponent);
            widget = fixture.componentInstance;

            const form = new FormModel({
                fields: [
                    {
                        id: 'richText1',
                        type: 'display-rich-text',
                        value: {
                            time: 1658154611110,
                            blocks: [
                                {
                                    id: '1',
                                    type: 'paragraph',
                                    data: {
                                        text: 'Hello ${field.name}'
                                    }
                                }
                            ],
                            version: 1
                        }
                    },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('richText1');
            fixture.detectChanges();

            setTimeout(() => {
                expect(widget.field.value.blocks[0].data.text).toBe('Hello John');
                done();
            }, 100);
        });
    });
});
