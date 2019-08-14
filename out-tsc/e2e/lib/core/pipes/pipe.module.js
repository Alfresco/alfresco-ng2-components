"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var file_size_pipe_1 = require("./file-size.pipe");
var mime_type_icon_pipe_1 = require("./mime-type-icon.pipe");
var node_name_tooltip_pipe_1 = require("./node-name-tooltip.pipe");
var text_highlight_pipe_1 = require("./text-highlight.pipe");
var time_ago_pipe_1 = require("./time-ago.pipe");
var user_initial_pipe_1 = require("./user-initial.pipe");
var full_name_pipe_1 = require("./full-name.pipe");
var format_space_pipe_1 = require("./format-space.pipe");
var file_type_pipe_1 = require("./file-type.pipe");
var multi_value_pipe_1 = require("./multi-value.pipe");
var localized_date_pipe_1 = require("./localized-date.pipe");
var decimal_number_pipe_1 = require("./decimal-number.pipe");
var PipeModule = /** @class */ (function () {
    function PipeModule() {
    }
    PipeModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                file_size_pipe_1.FileSizePipe,
                text_highlight_pipe_1.HighlightPipe,
                time_ago_pipe_1.TimeAgoPipe,
                mime_type_icon_pipe_1.MimeTypeIconPipe,
                user_initial_pipe_1.InitialUsernamePipe,
                full_name_pipe_1.FullNamePipe,
                node_name_tooltip_pipe_1.NodeNameTooltipPipe,
                format_space_pipe_1.FormatSpacePipe,
                file_type_pipe_1.FileTypePipe,
                multi_value_pipe_1.MultiValuePipe,
                localized_date_pipe_1.LocalizedDatePipe,
                decimal_number_pipe_1.DecimalNumberPipe
            ],
            providers: [
                file_size_pipe_1.FileSizePipe,
                text_highlight_pipe_1.HighlightPipe,
                time_ago_pipe_1.TimeAgoPipe,
                mime_type_icon_pipe_1.MimeTypeIconPipe,
                user_initial_pipe_1.InitialUsernamePipe,
                node_name_tooltip_pipe_1.NodeNameTooltipPipe,
                format_space_pipe_1.FormatSpacePipe,
                file_type_pipe_1.FileTypePipe,
                multi_value_pipe_1.MultiValuePipe,
                localized_date_pipe_1.LocalizedDatePipe,
                decimal_number_pipe_1.DecimalNumberPipe
            ],
            exports: [
                file_size_pipe_1.FileSizePipe,
                text_highlight_pipe_1.HighlightPipe,
                time_ago_pipe_1.TimeAgoPipe,
                mime_type_icon_pipe_1.MimeTypeIconPipe,
                user_initial_pipe_1.InitialUsernamePipe,
                full_name_pipe_1.FullNamePipe,
                node_name_tooltip_pipe_1.NodeNameTooltipPipe,
                format_space_pipe_1.FormatSpacePipe,
                file_type_pipe_1.FileTypePipe,
                multi_value_pipe_1.MultiValuePipe,
                localized_date_pipe_1.LocalizedDatePipe,
                decimal_number_pipe_1.DecimalNumberPipe
            ]
        })
    ], PipeModule);
    return PipeModule;
}());
exports.PipeModule = PipeModule;
//# sourceMappingURL=pipe.module.js.map