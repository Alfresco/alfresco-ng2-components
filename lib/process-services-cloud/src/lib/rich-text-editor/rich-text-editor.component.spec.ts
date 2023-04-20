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

import { RichTextEditorComponent } from './rich-text-editor.component';

describe('RichTextEditorComponent', () => {
    let component: RichTextEditorComponent;
    let fixture: ComponentFixture<RichTextEditorComponent>;
    let debugElement: DebugElement;

    const cssSelectors = {
        editorContent: '.codex-editor',
        editorJsElement: '.editorjs'
    };

    const mockEditorData = {
        time: 1658154611110,
        blocks: [
            {
                id: '1',
                type: 'header',
                data: {
                    text: 'Editor.js',
                    level: 2
                }
            }
        ],
        version: 1
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RichTextEditorComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RichTextEditorComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render rich text editor', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const editor = debugElement.query(By.css(cssSelectors.editorContent));
        expect(editor).toBeTruthy();
    });

    it('should generate dynamic id', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.dynamicId).toContain('editorjs');
    });

    it('should get editorjs data by calling getEditorContent', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        spyOn(component.editorInstance, 'save').and.returnValue(Promise.resolve(mockEditorData) as any);
        const savedEditorData = await component.getEditorContent();
        expect(savedEditorData).toEqual(mockEditorData);
    });

    it('should destroy editor instance on ngOnDestroy', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const destroyEditorSpy = spyOn(component.editorInstance, 'destroy');
        component.ngOnDestroy();
        expect(destroyEditorSpy).toHaveBeenCalledTimes(1);
        expect(destroyEditorSpy).toHaveBeenCalled();
    });

    it('should not destroy editor instance on ngOnDestroy if editor is not ready', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const destroyEditorSpy = spyOn(component.editorInstance, 'destroy');
        component.isReady = false;
        component.ngOnDestroy();
        expect(destroyEditorSpy).not.toHaveBeenCalled();
    });

    it('should add readonly class if readOnly is set to true', async () => {
        component.readOnly = true;
        fixture.detectChanges();
        await fixture.whenStable();
        const editorEl = debugElement.query(By.css(cssSelectors.editorJsElement));
        expect(editorEl.nativeElement.classList).toContain('readonly');
    });

    it('should not add readonly class if readOnly is set to false', async () => {
        component.readOnly = false;
        fixture.detectChanges();
        await fixture.whenStable();
        const editorEl = debugElement.query(By.css(cssSelectors.editorJsElement));
        expect(editorEl.nativeElement.classList).not.toContain('readonly');
    });

});
