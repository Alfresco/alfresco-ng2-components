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

import { NgModule } from '@angular/core';

import { FileSizePipe } from './file-size.pipe';
import { HighlightPipe } from './text-highlight.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { InitialUsernamePipe } from './user-initial.pipe';
import { FullNamePipe } from './full-name.pipe';
import { FormatSpacePipe } from './format-space.pipe';
import { FileTypePipe } from './file-type.pipe';
import { MultiValuePipe } from './multi-value.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';
import { DecimalNumberPipe } from './decimal-number.pipe';
import { MomentDatePipe } from './moment-date.pipe';
import { MomentDateTimePipe } from './moment-datetime.pipe';
import { DateTimePipe } from './date-time.pipe';

export const CORE_PIPES = [
    LocalizedDatePipe,
    TimeAgoPipe,
    FileSizePipe,
    HighlightPipe,
    FullNamePipe,
    FormatSpacePipe,
    FileTypePipe,
    MultiValuePipe,
    DecimalNumberPipe,
    MomentDatePipe,
    MomentDateTimePipe,
    DateTimePipe,
    InitialUsernamePipe
] as const;

/**
 * @deprecated this Module is deprecated and should no longer be used.
 * Consider importing CORE_PIPES or individual pipes directly.
 */
@NgModule({
    imports: [...CORE_PIPES],
    exports: [...CORE_PIPES]
})
export class PipeModule {}
