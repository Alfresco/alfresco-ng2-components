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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var js_api_1 = require("@alfresco/js-api");
var FormDefinitionModel = /** @class */ (function (_super) {
    __extends(FormDefinitionModel, _super);
    function FormDefinitionModel(id, name, lastUpdatedByFullName, lastUpdated, metadata) {
        var _this = _super.call(this) || this;
        _this.reusable = false;
        _this.newVersion = false;
        _this.formImageBase64 = '';
        _this.formRepresentation = {
            id: id,
            name: name,
            description: '',
            version: 1,
            lastUpdatedBy: 1,
            lastUpdatedByFullName: lastUpdatedByFullName,
            lastUpdated: lastUpdated,
            stencilSetId: 0,
            referenceId: null,
            formDefinition: {
                fields: [{
                        name: 'Label',
                        type: 'container',
                        fieldType: 'ContainerRepresentation',
                        numberOfColumns: 2,
                        required: false,
                        readOnly: false,
                        sizeX: 2,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        fields: { '1': _this.metadataToFields(metadata) }
                    }],
                gridsterForm: false,
                javascriptEvents: [],
                metadata: {},
                outcomes: [],
                className: '',
                style: '',
                tabs: [],
                variables: []
            }
        };
        return _this;
    }
    FormDefinitionModel.prototype.metadataToFields = function (metadata) {
        var fields = [];
        if (metadata) {
            metadata.forEach(function (property) {
                if (property) {
                    var field = {
                        type: 'text',
                        id: property.name,
                        name: property.name,
                        required: false,
                        readOnly: false,
                        sizeX: 1,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        colspan: 1,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        },
                        layout: {
                            colspan: 1,
                            row: -1,
                            column: -1
                        }
                    };
                    fields.push(field);
                }
            });
        }
        return fields;
    };
    return FormDefinitionModel;
}(js_api_1.FormSaveRepresentation));
exports.FormDefinitionModel = FormDefinitionModel;
//# sourceMappingURL=form-definition.model.js.map