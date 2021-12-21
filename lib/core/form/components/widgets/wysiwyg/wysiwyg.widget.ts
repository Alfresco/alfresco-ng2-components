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

import {
    Component,
    AfterContentInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef
} from '@angular/core';
import { WidgetComponent } from '../widget.component';
import { FormService } from '../../../services/form.service';
import Editor from 'tui-editor';
import Viewer = tuiEditor.Viewer;
import IEditorOptions = tuiEditor.IEditorOptions;

export interface MarkdownData {
    html: string;
    markdown: string;
}

@Component({
    selector: 'wysiwyg-editor',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./wysiwyg.widget.scss'],
    template: '<div #editor class = "adf-tui-editor"></div>',
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    }
})
export class WysiwygWidgetComponent extends WidgetComponent implements AfterContentInit {
    @ViewChild('editor')
    editorElement: ElementRef;

    constructor(public formService: FormService,
                public elementRef: ElementRef) {
        super(formService);
    }

    public ngAfterContentInit() {
        this.createEditor({
            el: this.elementRef.nativeElement.querySelector('.adf-tui-editor')
        });
    }

    createEditor(options: IEditorOptions): Editor | Viewer {
        return Editor.factory({
            el: options.el,
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            height: '300px'
        });
    }

}
