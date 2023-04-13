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

/** Plugin import */
import CodeTool from '@editorjs/code';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import ChangeFontSize from '@quanzo/change-font-size';
import ColorPlugin from 'editorjs-text-color-plugin';

export const editorJsConfig = {
    autofocus: true,
    logLevel: 'ERROR',
    tools: {
        underline: {
            class: Underline,
            shortcut: 'CMD+U'
        },
        header: {
            class: Header,
            inlineToolbar: true
        },
        list: {
            class: List,
            inlineToolbar: true,
            config: {
                defaultStyle: 'unordered'
            }
        },
        Color: {
            class: ColorPlugin,
            config: {
                customPicker: true,
                colorCollections: ['#FF1300', '#ffa500', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#5f9ea0', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF', '#000', '#c0c0c0', '#808080', '#800000'],
                defaultColor: '#FF1300',
                type: 'text'
            }
        },
        Marker: {
            class: Marker,
            shortcut: 'CMD+M'
        },
        'Increase/Decrease font size': {
            class: ChangeFontSize,
            config: {
                cssClass: 'plus20pc'
            }
        },
        inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+M'
        },
        code: CodeTool
    }
};
