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

    const whenEditorIsReady = async () => {
        fixture.detectChanges();
        await component.editorInstance.isReady;
        await fixture.whenStable();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RichTextEditorComponent]
        });

        fixture = TestBed.createComponent(RichTextEditorComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it('should render rich text editor', async () => {
        await whenEditorIsReady();
        const editor = debugElement.query(By.css(cssSelectors.editorContent));

        expect(editor).toBeTruthy();
    });

    it('should generate dynamic id', async () => {
        await whenEditorIsReady();

        expect(component.dynamicId).toContain('editorjs');
    });

    it('should get editorjs data by calling getEditorContent', async () => {
        await whenEditorIsReady();

        spyOn(component.editorInstance, 'save').and.returnValue(Promise.resolve(mockEditorData) as any);
        const savedEditorData = await component.getEditorContent();

        expect(savedEditorData).toEqual(mockEditorData);
    });

    it('should destroy editor instance on ngOnDestroy', async () => {
        await whenEditorIsReady();

        const destroyEditorSpy = spyOn(component.editorInstance, 'destroy');
        component.ngOnDestroy();

        expect(destroyEditorSpy).toHaveBeenCalledTimes(1);
        expect(destroyEditorSpy).toHaveBeenCalled();
    });

    it('should not destroy editor instance on ngOnDestroy if editor is not ready', async () => {
        await whenEditorIsReady();

        const destroyEditorSpy = spyOn(component.editorInstance, 'destroy');
        component.isReady = false;
        component.ngOnDestroy();

        expect(destroyEditorSpy).not.toHaveBeenCalled();
    });
});
