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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var container_widget_1 = require("./container/container.widget");
var tabs_widget_1 = require("./tabs/tabs.widget");
var unknown_widget_1 = require("./unknown/unknown.widget");
var amount_widget_1 = require("./amount/amount.widget");
var checkbox_widget_1 = require("./checkbox/checkbox.widget");
var date_widget_1 = require("./date/date.widget");
var display_text_widget_1 = require("./display-text/display-text.widget");
var document_widget_1 = require("./document/document.widget");
var dropdown_widget_1 = require("./dropdown/dropdown.widget");
var dynamic_table_widget_1 = require("./dynamic-table/dynamic-table.widget");
var boolean_editor_1 = require("./dynamic-table/editors/boolean/boolean.editor");
var date_editor_1 = require("./dynamic-table/editors/date/date.editor");
var datetime_editor_1 = require("./dynamic-table/editors/datetime/datetime.editor");
var dropdown_editor_1 = require("./dynamic-table/editors/dropdown/dropdown.editor");
var row_editor_1 = require("./dynamic-table/editors/row.editor");
var text_editor_1 = require("./dynamic-table/editors/text/text.editor");
var error_component_1 = require("./error/error.component");
var functional_group_widget_1 = require("./functional-group/functional-group.widget");
var hyperlink_widget_1 = require("./hyperlink/hyperlink.widget");
var multiline_text_widget_1 = require("./multiline-text/multiline-text.widget");
var number_widget_1 = require("./number/number.widget");
var people_widget_1 = require("./people/people.widget");
var radio_buttons_widget_1 = require("./radio-buttons/radio-buttons.widget");
var text_mask_component_1 = require("./text/text-mask.component");
var text_widget_1 = require("./text/text.widget");
var typeahead_widget_1 = require("./typeahead/typeahead.widget");
var upload_widget_1 = require("./upload/upload.widget");
var date_time_widget_1 = require("./date-time/date-time.widget");
// core
__export(require("./widget.component"));
__export(require("./core/index"));
// containers
__export(require("./tabs/tabs.widget"));
__export(require("./container/container.widget"));
// primitives
__export(require("./unknown/unknown.widget"));
__export(require("./text/text.widget"));
__export(require("./number/number.widget"));
__export(require("./checkbox/checkbox.widget"));
__export(require("./multiline-text/multiline-text.widget"));
__export(require("./dropdown/dropdown.widget"));
__export(require("./hyperlink/hyperlink.widget"));
__export(require("./radio-buttons/radio-buttons.widget"));
__export(require("./display-text/display-text.widget"));
__export(require("./upload/upload.widget"));
__export(require("./typeahead/typeahead.widget"));
__export(require("./functional-group/functional-group.widget"));
__export(require("./people/people.widget"));
__export(require("./date/date.widget"));
__export(require("./amount/amount.widget"));
__export(require("./dynamic-table/dynamic-table.widget"));
__export(require("./error/error.component"));
__export(require("./document/document.widget"));
__export(require("./date-time/date-time.widget"));
// editors (dynamic table)
__export(require("./dynamic-table/dynamic-table.widget.model"));
__export(require("./dynamic-table/editors/row.editor"));
__export(require("./dynamic-table/editors/date/date.editor"));
__export(require("./dynamic-table/editors/dropdown/dropdown.editor"));
__export(require("./dynamic-table/editors/boolean/boolean.editor"));
__export(require("./dynamic-table/editors/text/text.editor"));
__export(require("./dynamic-table/editors/datetime/datetime.editor"));
__export(require("./text/text-mask.component"));
exports.WIDGET_DIRECTIVES = [
    unknown_widget_1.UnknownWidgetComponent,
    tabs_widget_1.TabsWidgetComponent,
    container_widget_1.ContainerWidgetComponent,
    text_widget_1.TextWidgetComponent,
    number_widget_1.NumberWidgetComponent,
    checkbox_widget_1.CheckboxWidgetComponent,
    multiline_text_widget_1.MultilineTextWidgetComponentComponent,
    dropdown_widget_1.DropdownWidgetComponent,
    hyperlink_widget_1.HyperlinkWidgetComponent,
    radio_buttons_widget_1.RadioButtonsWidgetComponent,
    display_text_widget_1.DisplayTextWidgetComponentComponent,
    upload_widget_1.UploadWidgetComponent,
    typeahead_widget_1.TypeaheadWidgetComponent,
    functional_group_widget_1.FunctionalGroupWidgetComponent,
    people_widget_1.PeopleWidgetComponent,
    date_widget_1.DateWidgetComponent,
    amount_widget_1.AmountWidgetComponent,
    dynamic_table_widget_1.DynamicTableWidgetComponent,
    date_editor_1.DateEditorComponent,
    dropdown_editor_1.DropdownEditorComponent,
    boolean_editor_1.BooleanEditorComponent,
    text_editor_1.TextEditorComponent,
    row_editor_1.RowEditorComponent,
    error_component_1.ErrorWidgetComponent,
    document_widget_1.DocumentWidgetComponent,
    date_time_widget_1.DateTimeWidgetComponent,
    datetime_editor_1.DateTimeEditorComponent
];
exports.MASK_DIRECTIVE = [
    text_mask_component_1.InputMaskDirective
];
//# sourceMappingURL=index.js.map