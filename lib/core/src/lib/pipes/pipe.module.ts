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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileSizePipe } from './file-size.pipe';
import { MimeTypeIconPipe } from './mime-type-icon.pipe';
import { NodeNameTooltipPipe } from './node-name-tooltip.pipe';
import { HighlightPipe } from './text-highlight.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { InitialUsernamePipe } from './user-initial.pipe';
import { FullNamePipe } from './full-name.pipe';
import { FormatSpacePipe } from './format-space.pipe';
import { FileTypePipe } from './file-type.pipe';
import { MultiValuePipe } from './multi-value.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';
import { DecimalNumberPipe } from './decimal-number.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FileSizePipe,
        HighlightPipe,
        TimeAgoPipe,
        MimeTypeIconPipe,
        InitialUsernamePipe,
        FullNamePipe,
        NodeNameTooltipPipe,
        FormatSpacePipe,
        FileTypePipe,
        MultiValuePipe,
        LocalizedDatePipe,
        DecimalNumberPipe
    ],
    providers: [
        FileSizePipe,
        HighlightPipe,
        TimeAgoPipe,
        MimeTypeIconPipe,
        InitialUsernamePipe,
        NodeNameTooltipPipe,
        FormatSpacePipe,
        FileTypePipe,
        MultiValuePipe,
        LocalizedDatePipe,
        DecimalNumberPipe
    ],
    exports: [
        FileSizePipe,
        HighlightPipe,
        TimeAgoPipe,
        MimeTypeIconPipe,
        InitialUsernamePipe,
        FullNamePipe,
        NodeNameTooltipPipe,
        FormatSpacePipe,
        FileTypePipe,
        MultiValuePipe,
        LocalizedDatePipe,
        DecimalNumberPipe
    ]
})
export class PipeModule {
}
